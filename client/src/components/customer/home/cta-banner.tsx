import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground p-8 sm:p-14 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-3xl space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="size-3.5" />
              <span>Experience The Future of Gig Labor</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready for Fair, Transparent & Reliable Trade Services?
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-primary-foreground/85 leading-relaxed max-w-2xl">
              Join thousands of households choosing community-owned cooperative labor. Fair wages
              for technicians, fixed standardized rates for customers.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to="/services">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold shadow-lg gap-2 cursor-pointer transition-transform active:scale-98"
                >
                  <span>Explore Available Services</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <Link to="/register/worker">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-xs gap-2 cursor-pointer"
                >
                  <Wrench className="size-4" />
                  <span>Join as Trade Worker</span>
                </Button>
              </Link>
            </div>

            {/* Reassurance items */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-primary-foreground/80 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                No Surge Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4" />
                ICA Cooperative Standards
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-4" />
                Instant Local Dispatch
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
