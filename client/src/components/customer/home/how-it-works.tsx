import React from "react";
import { Search, Send, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Browse & Select Service",
      description:
        "Select your required gig service from categorized trade domains. Review transparent hourly or per-meter pricing before booking.",
    },
    {
      number: "02",
      icon: Send,
      title: "Cooperative Dispatch",
      description:
        "Your request is routed directly to the nearest affiliated trade cooperative. A certified technician is promptly assigned to your location.",
    },
    {
      number: "03",
      icon: CheckCircle,
      title: "Quality Work & Fair Pay",
      description:
        "Technician delivers standard-compliant service. Confirm work satisfaction and pay transparently with full cooperative receipt.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            How FairGig Works
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Three simple steps to secure expert trade services with community trust.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-lg transition-all"
              >
                {/* Step Number Watermark */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-3xl font-black text-muted-foreground/30 font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <Link to="/services">
            <Button
              size="lg"
              className="rounded-2xl h-12 px-7 font-bold gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore Services Now</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
