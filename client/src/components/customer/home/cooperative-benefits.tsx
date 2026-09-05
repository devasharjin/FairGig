import React from "react";
import {
  ShieldCheck,
  Coins,
  Award,
  Users2,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CooperativeBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Coins,
      title: "Fair Standardized Pricing",
      description:
        "No dynamic surge multipliers or predatory commissions. You pay honest hourly and per-meter rates agreed upon by trade federations.",
      tag: "Zero Price Gouging",
    },
    {
      icon: ShieldCheck,
      title: "100% Certified Trade Workers",
      description:
        "Technicians are vetted members of registered district cooperatives with documented experience, background checks, and guild endorsements.",
      tag: "Verified Safety",
    },
    {
      icon: Award,
      title: "Cooperative Guarantee",
      description:
        "Jobs are protected by collective dispute resolution. If work does not meet agreed specifications, the cooperative federation ensures swift rectification.",
      tag: "Protection Assured",
    },
    {
      icon: Users2,
      title: "Dignity of Labor & Ownership",
      description:
        "Your payment directly supports trade families and cooperative welfare funds instead of enriching offshore venture capital aggregator platforms.",
      tag: "Social Impact",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-border/50 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="size-3.5" />
            <span>The Cooperative Model</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Why Customers & Workers Choose FairGig
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            By shifting ownership from corporate platform middlemen to registered worker cooperatives,
            we deliver better service quality at fairer rates for everyone.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-5">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                    {b.tag}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Cooperative Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
