import React from "react";
import {
  ShieldCheck,
  Coins,
  Award,
  Users2,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

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
    <section className="py-10 sm:py-14 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-accent text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="size-3 sm:size-3.5" />
            <span>The Cooperative Advantage</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">
            Why Customers & Workers Trust FairGig
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            By shifting governance from corporate platform middlemen to registered worker cooperatives,
            we deliver better service quality at democratic, standardized rates.
          </p>
        </div>

        {/* Benefits Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex flex-col justify-between p-3 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs hover:shadow-md hover:border-accent/60 transition-all duration-200"
              >
                <div className="flex flex-col flex-1">
                  {/* Mobile: Logo and Header in one line | Desktop: Stacked vertically as before */}
                  <div className="flex sm:flex-col items-start gap-2 sm:gap-0 mb-2 sm:mb-0">
                    <div className="flex shrink-0 size-8 sm:size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs mt-0.5 sm:mt-0 sm:mb-3.5">
                      <Icon className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-accent uppercase tracking-wider block mb-0.5 sm:mb-1 truncate">
                        {b.tag}
                      </span>
                      <h3 className="text-xs sm:text-base font-bold text-foreground leading-snug sm:leading-tight sm:mb-1.5">
                        {b.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed flex-1 text-justify">
                    {b.description}
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border/40 flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-foreground/80">
                  <CheckCircle2 className="size-3 sm:size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
