import React from "react";
import { useTranslation } from "react-i18next";
import { Search, X, SlidersHorizontal, Clock, Ruler, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ServicePriceType } from "@/features/customer/services/types";

export const TRADE_FILTER_TAGS = [
  { key: "all", value: "all", icon: "🛠️", fallback: "All Services" },
  { key: "plumber", value: "Plumber", icon: "🚰", fallback: "Plumber" },
  { key: "electrician", value: "Electrician", icon: "⚡", fallback: "Electrician" },
  { key: "gardener", value: "Gardener", icon: "🌱", fallback: "Gardener" },
  { key: "carpenter", value: "Carpenter", icon: "🪚", fallback: "Carpenter" },
  { key: "painter", value: "Painter", icon: "🎨", fallback: "Painter" },
  { key: "house_cleaner", value: "House Cleaner", icon: "🧹", fallback: "House Cleaner" },
  { key: "appliance_tech", value: "Appliance", icon: "🔧", fallback: "Appliance Tech" },
  { key: "mason", value: "Mason", icon: "🧱", fallback: "Mason" },
];

interface ServiceSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPriceType: ServicePriceType | "all";
  onSelectPriceType: (priceType: ServicePriceType | "all") => void;
  selectedTrade: string;
  onSelectTrade: (trade: string) => void;
  totalServicesCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  categories?: any[];
  selectedCategoryId?: string;
  onSelectCategory?: (id: string) => void;
  totalCategoriesCount?: number;
}

export const ServiceSearchFilter: React.FC<ServiceSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedPriceType,
  onSelectPriceType,
  selectedTrade,
  onSelectTrade,
  totalServicesCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Search Bar & Pricing Type Segment */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("services.searchPlaceholder")}
            className="h-11 pl-10 pr-10 rounded-xl bg-card border border-border/80 text-sm shadow-xs focus-visible:ring-accent/30 focus-visible:border-accent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title={t("common.clear")}
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Pricing Type Filter Segment */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/80 shrink-0 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectPriceType("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedPriceType === "all"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>{t("services.allRates")}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPriceType("hourly")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedPriceType === "hourly"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-3.5" />
            <span>{t("services.hourly")}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPriceType("meters")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedPriceType === "meters"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Ruler className="size-3.5" />
            <span>{t("services.metered")}</span>
          </button>
        </div>
      </div>

      {/* Trade Service Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 custom-scrollbar scroll-smooth">
        {TRADE_FILTER_TAGS.map((tag) => {
          const isSelected = selectedTrade === tag.value;
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => onSelectTrade(tag.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground border-border/80 hover:border-accent/50 hover:bg-muted/40"
              }`}
            >
              <span className="text-xs">{tag.icon}</span>
              <span>{t(`services.trades.${tag.key}`, { defaultValue: tag.fallback })}</span>
            </button>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pt-1">
        <span>
          {t("services.showingCount", { count: totalServicesCount })}
        </span>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 text-xs text-primary hover:text-primary/80 gap-1.5 cursor-pointer p-0"
          >
            <RotateCcw className="size-3" />
            <span>{t("services.resetFilters")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceSearchFilter;

