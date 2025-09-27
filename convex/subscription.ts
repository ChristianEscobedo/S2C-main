// convex/subscription.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

const ENTITLED = new Set(['active', 'trialing'])
const DEFAULT_GRANT = 10
const DEFAULT_ROLLOVER_LIMIT = 100

export const getSubscriptionForUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
  },
})

export const hasEntitlement = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    // Admin bypass: Give access to the app owner (first user)
    const user = await ctx.db.get(userId);
    if (user?.email === 'test@example.com') {
      return true;
    }

    const now = Date.now()
    for await (const sub of ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))) {
      const status = String(sub.status || '').toLowerCase()
      const periodOk =
        sub.currentPeriodEnd == null || sub.currentPeriodEnd > now
      if (status === 'active' && periodOk) return true
    }
    return false
  },
})

export const getCreditsBalance = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    return sub?.creditsBalance ?? 0
  },
})

export const getByPolarId = query({
  args: { polarSubscriptionId: v.string() },
  handler: async (ctx, { polarSubscriptionId }) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_polarSubscriptionId', (q) =>
        q.eq('polarSubscriptionId', polarSubscriptionId)
      )
      .first()
  },
})

export const getAllForUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()
  },
})

export const upsertFromPolar = mutation({
  args: {
    userId: v.id('users'),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    productId: v.optional(v.string()),
    priceId: v.optional(v.string()),
    planCode: v.optional(v.string()),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    seats: v.optional(v.number()),
    metadata: v.optional(v.any()),
    creditsGrantPerPeriod: v.optional(v.number()),
    creditsRolloverLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log('🔍 [Convex] Starting upsertFromPolar for:', {
      userId: args.userId,
      polarSubscriptionId: args.polarSubscriptionId,
      status: args.status,
    })

    // Check for existing subscription by polar ID (exact match)
    const existingByPolar = await ctx.db
      .query('subscriptions')
      .withIndex('by_polarSubscriptionId', (q) =>
        q.eq('polarSubscriptionId', args.polarSubscriptionId)
      )
      .first()

    console.log(
      '📊 [Convex] Existing by Polar ID:',
      existingByPolar ? `Found (${existingByPolar._id})` : 'None'
    )

    // 🔍 STEP 2: Look for ANY existing subscription by user ID
    // This catches cases where the user has a subscription but with a different Polar ID
    const existingByUser = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first()

    console.log(
      '📊 [Convex] Existing by User ID:',
      existingByUser ? `Found (${existingByUser._id})` : 'None'
    )

    // 📦 STEP 3: Prepare the base subscription data
    // Use a fallback chain for credits configuration: incoming args → existing polar → existing user → defaults
    const base = {
      userId: args.userId,
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
      productId: args.productId,
      priceId: args.priceId,
      planCode: args.planCode,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
      trialEndsAt: args.trialEndsAt,
      cancelAt: args.cancelAt,
      canceledAt: args.canceledAt,
      seats: args.seats,
      metadata: args.metadata,
      // 💰 Credits configuration with intelligent fallbacks
      creditsGrantPerPeriod:
        args.creditsGrantPerPeriod ??
        existingByPolar?.creditsGrantPerPeriod ??
        existingByUser?.creditsGrantPerPeriod ??
        DEFAULT_GRANT,
      creditsRolloverLimit:
        args.creditsRolloverLimit ??
        existingByPolar?.creditsRolloverLimit ??
        existingByUser?.creditsRolloverLimit ??
        DEFAULT_ROLLOVER_LIMIT,
    }

    // 🎯 CASE 1: Found subscription by Polar ID - The "Happy Path"
    if (existingByPolar) {
      // 🛡️ SECURITY CHECK: Verify the subscription belongs to the same user
      // This prevents subscription hijacking if Polar IDs somehow get mixed up
      if (existingByPolar.userId === args.userId) {
        console.log(
          '✏️ [Convex] Updating existing subscription by Polar ID:',
          existingByPolar._id
        )
        // Simple update - everything matches perfectly
        await ctx.db.patch(existingByPolar._id, base)
        return existingByPolar._id
      } else {
        // 🚨 IDENTITY MISMATCH: Polar ID exists but belongs to different user
        // This is a complex scenario - treat it like Case 2 below
        const userExistingSubscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_userId', (q) => q.eq('userId', args.userId))
          .first()

        if (userExistingSubscription) {
          console.log(
            '🔄 [Convex] User has existing subscription, updating with new Polar ID:',
            userExistingSubscription._id
          )

          // 💾 PRESERVE USER DATA: Keep their credits balance and grant history
          // This is crucial - we never want users to lose credits due to ID changes
          const preservedData = {
            creditsBalance: userExistingSubscription.creditsBalance,
            lastGrantCursor: userExistingSubscription.lastGrantCursor,
          }

          await ctx.db.patch(userExistingSubscription._id, {
            ...base,
            ...preservedData,
          })
          return userExistingSubscription._id
        } else {
          // User doesn't have subscription, create new one
          const newId = await ctx.db.insert('subscriptions', {
            ...base,
            creditsBalance: 0,
            lastGrantCursor: undefined,
          })

          console.log('✅ [Convex] Created subscription:', newId)
          return newId
        }
      }
    }

    // 🎯 CASE 2: User has existing subscription but different Polar ID
    // This happens when payment providers change subscription IDs or during migrations
    if (existingByUser) {
      console.log(
        '🔄 [Convex] User has existing subscription with different Polar ID, updating:',
        existingByUser._id
      )

      // 💾 PRESERVE USER DATA: Critical to maintain credits balance and grant history
      // The user's financial state should never be lost due to external ID changes
      const preservedData = {
        creditsBalance: existingByUser.creditsBalance,
        lastGrantCursor: existingByUser.lastGrantCursor,
      }

      // Update the existing subscription with new Polar data but preserve credits
      await ctx.db.patch(existingByUser._id, { ...base, ...preservedData })
      return existingByUser._id
    }

    // 🎯 CASE 3: No existing subscription found - Create new one
    // This is a genuinely new user subscription
    console.log('✅ [Convex] Creating new subscription for user:', args.userId)
    const newId = await ctx.db.insert('subscriptions', {
      ...base,
      creditsBalance: 0,
      lastGrantCursor: undefined,
    })

    return newId
  },
})

export const grantCreditsIfNeeded = mutation({
  args: {
    subscriptionId: v.id('subscriptions'),
    idempotencyKey: v.string(), // `${subId}:${periodEndMs || "first"}`
    amount: v.optional(v.number()), // default to sub.creditsGrantPerPeriod
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { subscriptionId, idempotencyKey, amount, reason }) => {
    // strong idempotency via ledger index
    const dupe = await ctx.db
      .query('credits_ledger')
      .withIndex('by_idempotencyKey', (q) =>
        q.eq('idempotencyKey', idempotencyKey)
      )
      .first()
    if (dupe) return { ok: true, skipped: true, reason: 'duplicate-ledger' }

    const sub = await ctx.db.get(subscriptionId)
    if (!sub) return { ok: false, error: 'subscription-not-found' }

    if (sub.lastGrantCursor === idempotencyKey) {
      return { ok: true, skipped: true, reason: 'cursor-match' }
    }

    if (!ENTITLED.has(sub.status)) {
      return { ok: true, skipped: true, reason: 'not-entitled' }
    }

    const grant = amount ?? sub.creditsGrantPerPeriod ?? DEFAULT_GRANT
    if (grant <= 0) return { ok: true, skipped: true, reason: 'zero-grant' }

    const next = Math.min(
      sub.creditsBalance + grant,
      sub.creditsRolloverLimit ?? DEFAULT_ROLLOVER_LIMIT
    )

    await ctx.db.patch(subscriptionId, {
      creditsBalance: next,
      lastGrantCursor: idempotencyKey,
    })

    await ctx.db.insert('credits_ledger', {
      userId: sub.userId,
      subscriptionId,
      amount: grant,
      type: 'grant',
      reason: reason ?? 'periodic-grant',
      idempotencyKey,
      meta: { prev: sub.creditsBalance, next },
    })

    return { ok: true, granted: grant, balance: next }
  },
})

export const consumeCredits = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    reason: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
  },
  handler: async (ctx, { userId, amount, reason, idempotencyKey }) => {
    if (amount <= 0) return { ok: false, error: 'invalid-amount' }

    if (idempotencyKey) {
      const dupe = await ctx.db
        .query('credits_ledger')
        .withIndex('by_idempotencyKey', (q) =>
          q.eq('idempotencyKey', idempotencyKey)
        )
        .first()
      if (dupe) return { ok: true, idempotent: true }
    }

    const sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    if (!sub) return { ok: false, error: 'no-subscription' }
    if (!ENTITLED.has(sub.status)) return { ok: false, error: 'not-entitled' }
    if (sub.creditsBalance < amount)
      return {
        ok: false,
        error: 'insufficient-credits',
        balance: sub.creditsBalance,
      }

    const next = sub.creditsBalance - amount
    await ctx.db.patch(sub._id, { creditsBalance: next })

    await ctx.db.insert('credits_ledger', {
      userId,
      subscriptionId: sub._id,
      amount: -amount,
      type: 'consume',
      reason: reason ?? 'usage',
      idempotencyKey,
      meta: { prev: sub.creditsBalance, next },
    })

    return { ok: true, balance: next }
  },
})

// Admin function to add credits to any user
export const adminAddCredits = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { userId, amount, reason }) => {
    // Get user to check if they're admin
    const user = await ctx.db.get(userId);
    if (!user || user.email !== 'test@example.com') {
      throw new Error('Admin access required');
    }

    // Get or create subscription for the user
    let sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!sub) {
      // Create a subscription for the admin user
      const subId = await ctx.db.insert('subscriptions', {
        userId,
        polarCustomerId: 'admin',
        polarSubscriptionId: 'admin-sub',
        status: 'active',
        creditsBalance: 0,
        creditsGrantPerPeriod: DEFAULT_GRANT,
        creditsRolloverLimit: DEFAULT_ROLLOVER_LIMIT,
        lastGrantCursor: undefined,
      });
      sub = await ctx.db.get(subId);
    }

    if (!sub) throw new Error('Failed to create subscription');

    const next = sub.creditsBalance + amount;
    await ctx.db.patch(sub._id, { creditsBalance: next });

    // Log the credit addition
    await ctx.db.insert('credits_ledger', {
      userId,
      subscriptionId: sub._id,
      amount,
      type: 'grant',
      reason: reason ?? 'admin-grant',
      idempotencyKey: `admin-${Date.now()}`,
      meta: { prev: sub.creditsBalance, next },
    });

    return { ok: true, balance: next, added: amount };
  },
})
