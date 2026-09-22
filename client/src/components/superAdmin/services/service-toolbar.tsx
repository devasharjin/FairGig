import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Clock,
  Plus,
  Ruler,
  Search,
  X,
} from "lucide-react";

interface ServiceToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  priceType: string;
  onPriceTypeChange: (priceType: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenNewService: () => void;
  totalServices: number;
  // Backwards compatibility props
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  selectedCategory?: string;
  onCategoryChange?: (id: string) => void;
  onOpenNewCategory?: () => void;
  totalCategories?: number;
  categories?: any[];
}

export const ServiceToolbar: React.FC<ServiceToolbarProps> = ({
  search,
  onSearchChange,
  priceType,
  onPriceTypeChange,
  statusFilter,
  onStatusFilterChange,
  onOpenNewService,
  totalServices,
}) => {
  const hasActiveFilters =
    search.trim() !== "" ||
    priceType !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    onSearchChange("");
    onPriceTypeChange("all");
    onStatusFilterChange("all");
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Title & Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-bold text-foreground shadow-xs">
            <Briefcase className="size-3.5 text-primary" />
            <span>Active Direct Trade Services ({totalServices})</span>
          </div>
        </div>

        {/* Create Service Action Button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenNewService}
            className="rounded-xl h-9 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Trade Service</span>
          </Button>
        </div>
      </div>

      {/* Filter Row: Search & Status Selectors */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search trade services (e.g. Plumber, Electrician, Gardener)..."
            className="h-9 pl-9 pr-8 text-xs rounded-xl bg-input/20 border-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Pricing Type Filter & Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Price Type Filter */}
          <div className="inline-flex p-1 rounded-xl bg-muted/40 border border-border">
            <button
              type="button"
              onClick={() => onPriceTypeChange("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                priceType === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => onPriceTypeChange("hourly")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                priceType === "hourly"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="size-3" />
              <span>Hourly</span>
            </button>
            <button
              type="button"
              onClick={() => onPriceTypeChange("meters")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                priceType === "meters"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ruler className="size-3" />
              <span>Metered</span>
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-9 px-3 rounded-xl border border-input bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="all" className="bg-popover text-foreground">All Status</option>
            <option value="active" className="bg-popover text-foreground">Active Only</option>
            <option value="inactive" className="bg-popover text-foreground">Inactive Only</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-xl"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceToolbar;
