import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    { label: t("services.trades.plumber"), query: "Plumber" },
    { label: t("services.trades.electrician"), query: "Electrician" },
    { label: t("services.trades.gardener"), query: "Gardener" },
    { label: t("services.trades.carpenter"), query: "Carpenter" },
    { label: t("services.trades.painter"), query: "Painter" },
    { label: t("services.trades.house_cleaner"), query: "House Cleaner" },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6 max-w-4xl mx-auto">
          {/* Trust Banner Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/25 text-accent text-xs font-semibold shadow-xs">
            <Sparkles className="size-3.5" />
            <span>{t("home.hero.badge")}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.18]">
            {t("home.hero.titlePart1")}{" "}
            <span className="bg-gradient-to-r from-[#17324D] via-[#3F5F7F] via-[#168C83] via-[#10B981] to-[#5EEAD4] bg-clip-text text-transparent">
              {t("home.hero.titleHighlight")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {t("home.hero.subtitle")}
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl bg-card border border-border/90 shadow-md focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={t("home.hero.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 pl-10 pr-3 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </div>
            <Button
              type="submit"
              size="default"
              className="w-full sm:w-auto h-10 px-5 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{t("home.hero.searchButton")}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">{t("home.hero.popular")}</span>
            {quickTags.map((tag) => (
              <button
                key={tag.query}
                type="button"
                onClick={() => {
                  navigate(`/services?trade=${encodeURIComponent(tag.query)}`);
                }}
                className="px-2.5 py-1 rounded-md bg-card hover:bg-muted text-foreground border border-border/80 hover:border-accent/40 transition cursor-pointer text-xs"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Quick Trust Highlights & Stats Counter */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
            <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/70 shadow-xs">
              <div className="flex items-center gap-1 text-primary font-bold text-xl">
                <span>100%</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {t("home.hero.vettedWorkers")}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/70 shadow-xs">
              <div className="flex items-center gap-1 text-primary font-bold text-xl">
                <span>0%</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {t("home.hero.middlemanDeductions")}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/70 shadow-xs">
              <div className="flex items-center gap-1 text-primary font-bold text-xl">
                <Clock className="size-4 text-emerald-600 dark:text-emerald-400 inline" />
                <span>{t("home.hero.standardRates")}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {t("footer.floorWageStandards")}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/70 shadow-xs">
              <div className="flex items-center gap-1 text-primary font-bold text-xl">
                <Star className="size-4 text-amber-500 fill-amber-500 inline" />
                <span>4.9 / 5</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {t("home.hero.customerRating")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
