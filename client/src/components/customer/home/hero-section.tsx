import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/services");
    }
  };

  const quickTags = [
    { label: "Electrical Wiring", query: "Electrical" },
    { label: "Plumbing Repairs", query: "Plumbing" },
    { label: "Carpentry & Furniture", query: "Carpentry" },
    { label: "Hourly Rates", priceType: "hourly" },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/50">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-[-100px] w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Trust Banner Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="size-3.5 text-primary" />
            <span>Empowering Skilled Workers Through Cooperative Ownership</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.15]">
            Reliable Household & Trade Services{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-emerald-500 bg-clip-text text-transparent">
              Without Middleman Markups
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Book verified electricians, plumbers, carpenters, and technicians from certified
            worker cooperatives. Transparent rates, zero predatory commissions, and genuine community accountability.
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2 p-2 rounded-3xl bg-card border border-border/80 shadow-xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-4 size-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="What service do you need today? (e.g. Wiring, Tap Repair, Cleaning)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 sm:h-14 pl-12 pr-4 border-0 bg-transparent text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Search Services</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">Popular:</span>
            {quickTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  if (tag.query) {
                    navigate(`/services?q=${encodeURIComponent(tag.query)}`);
                  } else if (tag.priceType) {
                    navigate(`/services?priceType=${encodeURIComponent(tag.priceType)}`);
                  } else {
                    navigate("/services");
                  }
                }}
                className="px-3 py-1 rounded-xl bg-muted/50 hover:bg-muted text-foreground border border-border/60 hover:border-primary/30 transition cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Quick Trust Highlights & Stats Counter */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-primary font-black text-xl sm:text-2xl">
                <span>100%</span>
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                Vetted Co-op Workers
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-foreground font-black text-xl sm:text-2xl">
                <span>0%</span>
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                Middleman Deductions
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-foreground font-black text-xl sm:text-2xl">
                <Clock className="size-4 text-emerald-500 inline" />
                <span>Standard</span>
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                Hourly & Meter Rates
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-foreground font-black text-xl sm:text-2xl">
                <Star className="size-4 text-amber-500 fill-amber-500 inline" />
                <span>4.9 / 5</span>
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                Community Satisfaction
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
