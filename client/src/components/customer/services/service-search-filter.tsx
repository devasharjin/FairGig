import React from "react";
import { Search, X, SlidersHorizontal, Layers, Clock, Ruler, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/features/customer/categories/types";
import type { ServicePriceType } from "@/features/customer/services/types";

interface ServiceSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  selectedPriceType: ServicePriceType | "all";
  onSelectPriceType: (priceType: ServicePriceType | "all") => void;
  categories: Category[];
  totalServicesCount: number;
  totalCategoriesCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ServiceSearchFilter: React.FC<ServiceSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  onSelectCategory,
  selectedPriceType,
  onSelectPriceType,
  categories,
  totalServicesCount,
  totalCategoriesCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Search & Price Metric Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search gig services (e.g. Electrical, plumbing, cleaning)..."
            className="h-11 sm:h-12 pl-10 pr-10 rounded-2xl bg-card border-border/80 text-sm shadow-xs focus-visible:ring-primary/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Pricing Type Filter Segment */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/40 border border-border/70 shrink-0 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectPriceType("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedPriceType === "all"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>All Rates</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPriceType("hourly")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedPriceType === "hourly"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-3.5" />
            <span>Hourly</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPriceType("meters")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedPriceType === "meters"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Ruler className="size-3.5" />
            <span>Metered</span>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scroll / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {/* All Categories Chip */}
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 border ${
            selectedCategoryId === "all" || !selectedCategoryId
              ? "bg-primary text-primary-foreground border-primary shadow-xs"
              : "bg-card text-muted-foreground hover:text-foreground border-border/80 hover:border-primary/40"
          }`}
        >
          <Layers className="size-3.5" />
          <span>All Categories</span>
        </button>

        {/* Individual Category Chips */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => onSelectCategory(cat._id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground border-border/80 hover:border-primary/40"
              }`}
            >
              {cat.icon ? (
                <span
                  className="size-4 flex items-center justify-center text-xs"
                  dangerouslySetInnerHTML={{ __html: cat.icon }}
                />
              ) : (
                <span className="size-2 rounded-full bg-primary/40" />
              )}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicator & Reset */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground font-semibold">{totalServicesCount}</strong> services across{" "}
          <strong className="text-foreground font-semibold">{totalCategoriesCount}</strong> categories
        </span>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 text-xs text-primary hover:text-primary/80 gap-1 cursor-pointer p-0"
          >
            <RotateCcw className="size-3" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>
    </div>
  );
};
