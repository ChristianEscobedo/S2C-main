import React from 'react'
import { Shadows_Into_Light_Two } from 'next/font/google'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BackgroundLines } from '@/components/ui/background-lines'
import Image from 'next/image'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowRightIcon, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import FunnelPreview from '@/components/funnel-preview'
import BetaSpotsTracker from '@/components/beta-spot-tracker'
import Link from 'next/link'

const shadowsIntoLightTwo = Shadows_Into_Light_Two({
  subsets: ['latin'],
  weight: '400',
})
//New Commit
const Page = () => {
  return (
    <section className="flex h-full min-h-screen w-screen  justify-center py-8 sm:py-16 lg:py-32">
      <BackgroundLines className="container flex w-full flex-col ">
        <div className="relative z-20 flex flex-col items-center justify-center space-y-6 lg:space-y-8">
          <Image
            src="/webprodigies-logo.svg"
            alt="Webprodigies Logo"
            width={200}
            height={60}
            className="sm:w-[256px] sm:h-[80px]"
          />
          <div className="text-center space-y-4">
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-8xl font-semibold tracking-tighter">
              S2C Source Code
            </h1>
            <p
              className={cn(
                shadowsIntoLightTwo.className,
                'text-lg sm:text-xl lg:text-2xl text-primary mx-auto max-w-2xl leading-relaxed'
              )}
            >
              SaaS is the future of business, and I&apos;m glad it&apos;s you
              who gets to experience it first - Perrin
            </p>
          </div>
        </div>

        <Alert className="relative z-20 mt-8 lg:mt-12 max-w-4xl w-full mx-auto  border-none bg-transparent">
          <AlertTitle className="flex items-center justify-center gap-3 text-xl lg:text-2xl mb-6 text-center">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="size-5 text-primary" />
            </div>
            Limited Time Founder&apos;s Beta Program
          </AlertTitle>
          <AlertDescription className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 p-6 bg-muted/10 rounded-xl border border-primary/10 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-primary">
                We Know The Struggle
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                You&apos;ve got the code, but now you&apos;re facing the reality
                of maintaining, updating, and scaling it. The endless cycle of
                bug fixes, feature requests, and technical debt that keeps you
                up at night instead of focusing on growing your business.{' '}
                <b className="text-primary">
                  Now, for a limited time, get a dedicated development team to
                  continuously upgrade it for you.
                </b>
              </p>
            </div>

            {/* What's New Section */}

            <div className="space-y-3 p-4 bg-muted/10 rounded-xl border border-primary/10 backdrop-blur-xl">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                What is the Founder&apos;s Beta Program?
              </h4>
              <p className="text-sm text-muted-foreground">
                You are one of the first founders invited to this program.{' '}
                <br />
                <br />
                For the next 30 days, we are dedicating a developer to
                continuously improve the S2C codebase. You get all the benefits
                and have a direct say in the product&apos;s future!
              </p>
            </div>

            {/* Why Free Section */}
            <div className="p-6 bg-muted/10 rounded-xl border border-primary/10 backdrop-blur-xl">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <span className="text-lg">💰</span>
                Why Is This Program In Beta?
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                This is our first time introducing a program like this. We want
                to see if it&apos;s worth the time and effort and to get your
                valuable feedback. We&apos;re testing this to see if we enjoy it
                as much as you do! Some of you might already find this extremely
                valuable since hiring us would normally cost{' '}
                <strong className="text-primary">$200k+/year</strong>
              </p>
            </div>

            {/* Benefits Header */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-primary mb-4">
                What This Program Offers
              </h4>
            </div>
            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-background border border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Check
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-primary text-sm">
                    Monthly Feature Releases
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Stay ahead of competitors
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background border border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Check
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-primary text-sm">
                    Instant Bug Fixes
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    No more sleepless nights worrying about crashes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background border border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Check
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-primary text-sm">
                    Performance Optimizations
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Your app gets faster while you sleep
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background border border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Check
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-primary text-sm">
                    Security Updates
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Enterprise-grade protection without the enterprise price tag
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background border border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Check
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-primary text-sm">
                    Priority Support
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Direct access to our development through community posts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background border border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Check
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-primary text-sm">
                    Feature Voting System
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    A direct say in the S2C roadmap.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg border border-primary/10">
                <h5 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  An Irresistible Offer for Our First Members
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To make this a complete no-brainer for our founding beta
                  members, we&apos;re offering a special, locked-in price of
                  just $47/month, forever.
                  <br />
                  <br />
                  This price is exclusively for you as a beta member. Once the
                  project launches, the price will increase. This is your one
                  and only chance to get in at this lifetime locked-in rate.
                </p>
              </div>

              <div className="p-4 bg-muted/20 rounded-lg border border-primary/10">
                <h5 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                  <span className="text-sm">💡</span>
                  Your First 30 Days are 100% Risk-Free.
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We are so confident you will find this invaluable that we are
                  offering a 30-Day Money-Back Guarantee. Join today, experience
                  a full month of updates, support, and community access. If you
                  believe we did not deliver on our promise, simply let us know
                  within the first 30 days, and we will refund you 100% of your
                  payment. No questions asked.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
        {/* Funnel Preview Component */}
        <FunnelPreview />

        {/* Spots Tracker Component */}
        <BetaSpotsTracker />
        {/* CTA Section */}
        <div className="relative z-20 mt-8 lg:mt-12 w-full max-w-md mx-auto">
          <div className="p-6 ">
            <div className="space-y-4">
              <h3 className="text-center font-semibold text-lg text-primary">
                Ready to Get Started?
              </h3>
              <div className="flex w-full items-center gap-3 p-1 bg-background rounded-full shadow-lg justify-center">
                <Link
                  href={
                    'https://prodigiesuniversity.webprodigies.com/communities/groups/s2c-beta-program/home'
                  }
                  className="h-12 px-6 rounded-full font-semibold bg-primary hover:bg-primary/90"
                >
                  Claim My Spot <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center -space-x-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Avatar
                key={index}
                className="size-10 border-2 border-background shadow-lg"
              >
                <AvatarImage
                  src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 1}.jpg`}
                  alt={`Founder ${index + 1}`}
                />
              </Avatar>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground/90 font-medium">
              +100 founders already joined
            </p>
            <p className="text-xs text-muted-foreground/70">
              Don&apos;t miss out on this opportunity
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/70 max-w-3xl mx-auto text-center mt-10">
          A Note on Our Beta Program: This is a special, experimental program,
          and you are one of our founding members. Our goal is to see if this
          model provides massive value to become a permanent part of the S2C
          ecosystem. If we find that it&apos;s not the best way to serve our
          community, we reserve the right to discontinue the program. Should
          that happen, we will, of course, provide a full refund for your final
          month&apos;s payment. We appreciate you joining us on this journey!
        </p>
      </BackgroundLines>
    </section>
  )
}

export default Page
