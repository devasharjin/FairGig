import React from "react";
import {
  Search,
  Calculator,
  Users,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Select Your Trade Service",
      description:
        "Choose certified plumbers, electricians, gardeners, carpenters, or cleaners with standardized guild qualifications.",
      highlight: "Verified Skills",
    },
    {
      number: "02",
      icon: Calculator,
      title: "Transparent Benchmark Rates",
      description:
        "See transparent hourly rates and fixed transport fees upfront with zero surge markups or hidden platform fees.",
      highlight: "No Surge Pricing",
    },
    {
      number: "03",
      icon: Users,
      title: "Democratic Co-op Dispatch",
      description:
        "Your request is routed directly to the nearest local trade cooperative guild. An insured, vetted artisan is assigned.",
      highlight: "Guild Assigned",
    },
    {
      number: "04",
      icon: MapPin,
      title: "Real-Time Tracking & Verification",
      description:
        "Track artisan arrival in real time, view verified cooperative credentials, and coordinate instructions securely.",
      highlight: "Live GPS & Badge",
    },
    {
      number: "05",
      icon: ShieldCheck,
      title: "Standardized & Insured Work",
      description:
        "Service is delivered adhering to state-certified safety protocols and backed by ₹5 Lakh comprehensive insurance protection.",
      highlight: "₹5L Protected",
    },
    {
      number: "06",
      icon: HeartHandshake,
      title: "Zero-Commission Fair Pay",
      description:
        "Confirm work satisfaction and pay seamlessly. 100% of the wage goes directly to the worker-owner, ensuring dignified labor.",
      highlight: "100% Worker Wage",
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Transparent 6-Step Framework</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
            How FairGig Works
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            A complete 6-step cooperative model designed for complete transparency, guaranteed artisan quality, and dignified fair wages.
          </p>
        </div>

        {/* 6 Steps Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/80 hover:border-accent/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Accent top pill */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Icon className="size-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                      {step.highlight}
                    </span>
                    <span className="text-2xl font-extrabold text-muted-foreground/25 font-mono">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">Step {step.number} of 06</span>
                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{
                        width: `${(parseInt(step.number, 10) / 6) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/services">
            <Button
              size="lg"
              className="rounded-xl h-11 px-6 font-semibold gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore All Trade Services</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
