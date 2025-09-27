import { fetchMutation, preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Id } from "../../convex/_generated/dataModel";
import { ConvexUserRaw, normalizeProfile } from "@/types/user";

export const ProfileQuery = async () => {
  try {
    const token = await convexAuthNextjsToken();
    return await preloadQuery(
      api.user.getCurrentUser,
      {},
      { token }
    );
  } catch (error) {
    // Return null profile for unauthenticated users (e.g., on public pages)
    return { _valueJSON: null };
  }
};

export const SubscriptionEntitlementQuery = async () => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  );
  const entitlement = await preloadQuery(
    api.subscription.hasEntitlement,
    { userId: profile?.id as Id<"users"> },
    { token: await convexAuthNextjsToken() }
  );
  return { entitlement, profileName: profile?.name };
};

export const ProjectsQuery = async () => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  );

  if (!profile?.id) {
    return { projects: null, profile: null };
  }

  const projects = await preloadQuery(
    api.projects.getUserProjects,
    { userId: profile.id as Id<"users"> },
    { token: await convexAuthNextjsToken() }
  );

  return { projects, profile };
};

export const ProjectQuery = async (projectId: string) => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  );

  if (!profile?.id || !projectId || projectId === 'null' || projectId === 'undefined') {
    return { project: null, profile };
  }

  const project = await preloadQuery(
    api.projects.getProject,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() }
  );

  return { project, profile };
};

export const ConsumeCreditsQuery = async ({ amount }: { amount?: number }) => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  );

  if (!profile?.id) {
    return { ok: false, balance: 0, profile: null };
  }

  const credits = await fetchMutation(
    api.subscription.consumeCredits,
    {
      reason: "ai:generation",
      userId: profile.id as Id<"users">,
      amount: amount || 1,
    },
    { token: await convexAuthNextjsToken() }
  );

  return { ok: credits.ok, balance: credits.balance, profile };
};

export const CreditsBalanceQuery = async () => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  );

  if (!profile?.id) {
    return { ok: false, balance: 0, profile: null };
  }

  const balance = await preloadQuery(
    api.subscription.getCreditsBalance,
    { userId: profile.id as Id<"users"> },
    { token: await convexAuthNextjsToken() }
  );

  return { ok: true, balance: balance._valueJSON, profile };
};

export const StyleGuideQuery = async (projectId: string) => {
  if (!projectId || projectId === 'null' || projectId === 'undefined') {
    return { styleGuide: null };
  }

  const styleGuide = await preloadQuery(
    api.projects.getProjectStyleGuide,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() }
  );

  return { styleGuide };
};

export const MoodBoardImagesQuery = async (projectId: string) => {
  if (!projectId || projectId === 'null' || projectId === 'undefined') {
    return { images: null };
  }

  const images = await preloadQuery(
    api.moodboard.getMoodBoardImages,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() }
  );

  return { images };
};

export const InspirationImagesQuery = async (projectId: string) => {
  if (!projectId || projectId === 'null' || projectId === 'undefined') {
    return { images: null };
  }

  const images = await preloadQuery(
    api.inspiration.getInspirationImages,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() }
  );

  return { images };
};
