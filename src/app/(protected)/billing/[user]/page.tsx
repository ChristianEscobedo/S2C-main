import React from "react";
import { SubscribeButton } from "@/components/buttons/checkout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Palette, Download, Code } from "lucide-react";

const Page = async () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-primary/60 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Unlock S2C Premium
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Transform your design workflow with AI-powered tools and unlimited
            creativity
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] shadow-xl saturate-150">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-xs font-medium rounded-full">
                Most Popular
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              Standard Plan
            </CardTitle>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-foreground">$9.99</span>
              <span className="text-muted-foreground text-base">/month</span>
            </div>
            <CardDescription className="text-muted-foreground text-sm mt-2">
              Get 10 credits every month to power your AI-assisted design
              workflow
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Perfect for freelancers and creators who want reliable access to
                code generation, exports, and other premium features without
                over-committing.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                Each credit unlocks one full AI task—whether it&apos;s
                generating UI code from your sketches, exporting polished
                assets, or running advanced processing. Simple, predictable, and
                flexible.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground text-center mb-3">
                What&apos;s Included
              </h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Palette className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      AI-Powered Design Generation
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Transform sketches into production-ready code
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Download className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      Premium Asset Exports
                    </p>
                    <p className="text-muted-foreground text-xs">
                      High-quality exports in multiple formats
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Code className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      Advanced Processing
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Run complex design operations and transformations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      10 Monthly Credits
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Flexible usage for your design needs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm mb-1">
                    Simple Credit System
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Each credit = one AI task. Use them for code generation,
                    asset exports, or any premium feature. Credits refresh
                    monthly, so you always have what you need.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-4 px-6 pb-6">
            <SubscribeButton />
            <p className="text-muted-foreground text-xs text-center">
              Cancel anytime • No setup fees • Instant access
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-muted-foreground text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-400" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-400" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
