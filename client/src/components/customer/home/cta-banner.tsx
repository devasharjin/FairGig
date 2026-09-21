import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-xl bg-[#17324D] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
      <div className="relative z-10 max-w-3xl space-y-5">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
          <Sparkles className="size-3.5 text-[#5EEAD4]" />
          Cooperative Gig Network
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.2] text-white">
          Ready for Fair, Transparent & Reliable Trade Services?
        </h2>

        {/* Description */}
        <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
          Discover community-owned cooperative services with fair wages
          for skilled workers and transparent, standardized pricing for
          every household.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/services" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto h-10 px-5 rounded-md gap-2 bg-[#168C83] text-white font-medium hover:bg-[#13796F] transition-colors cursor-pointer"
            >
              Explore Services
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Link to="/register/worker" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-10 px-5 rounded-md gap-2 border-white/25 bg-transparent text-white font-medium hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Wrench className="size-4" />
              Join as a Worker
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3 text-xs font-medium text-slate-300">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#5EEAD4]" />
            No Surge Pricing
          </span>

          <span className="flex items-center gap-2">
            <Building2 className="size-4 text-[#5EEAD4]" />
            Cooperative Principles
          </span>

          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#5EEAD4]" />
            Local Worker Network
          </span>
        </div>

      </div>

      {/* Subtle Decorative Gradient */}
      <div className="absolute -right-24 -top-32 size-96 rounded-full bg-[#168C83]/10 blur-3xl pointer-events-none" />
    </div>
  </div>
</section>
  );
};
