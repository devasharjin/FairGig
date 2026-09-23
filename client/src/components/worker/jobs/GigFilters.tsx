import React from "react";
import { Search, AlertTriangle, Crown, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuickFilterType = "ALL" | "EMERGENCY" | "PREMIUM" | "ON_DEMAND" | "HOURLY" | "METERS" | "TODAY";

interface GigFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: QuickFilterType;
  onFilterChange: (filter: QuickFilterType) => void;
  filteredCount: number;
  emergencyCount?: number;
}

export const GigFilters: React.FC<GigFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filteredCount,
  emergencyCount = 0,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/60 p-2.5 sm:p-3 rounded-2xl border border-border/80 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by trade, service, customer or address..."
          className="pl-9.5 h-10 rounded-xl bg-background text-xs border-border/60 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <Button
          variant={activeFilter === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("ALL")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 cursor-pointer"
        >
          All Gigs ({filteredCount})
        </Button>

        {/* Emergency Filter Tab */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange("EMERGENCY")}
          className={cn(
            "rounded-xl h-9 px-3 text-xs font-bold shrink-0 gap-1.5 cursor-pointer transition-all",
            activeFilter === "EMERGENCY"
              ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-sm"
              : emergencyCount > 0
              ? "border-rose-500/50 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 animate-pulse"
              : "border-border/80 text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertTriangle className="size-3.5" />
          <span>🚨 Emergency {emergencyCount > 0 ? `(${emergencyCount})` : ""}</span>
        </Button>

        {/* Premium Filter Tab */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange("PREMIUM")}
          className={cn(
            "rounded-xl h-9 px-3 text-xs font-semibold shrink-0 gap-1.5 cursor-pointer transition-all",
            activeFilter === "PREMIUM" || (activeFilter as string) === "ON_DEMAND"
              ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
              : "border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
          )}
        >
          <Crown className="size-3.5" />
          <span>⭐ Premium (&gt;4.5★)</span>
        </Button>

        <Button
          variant={activeFilter === "HOURLY" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("HOURLY")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 cursor-pointer"
        >
          Hourly
        </Button>

        <Button
          variant={activeFilter === "METERS" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("METERS")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 cursor-pointer"
        >
          Meters
        </Button>

        <Button
          variant={activeFilter === "TODAY" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("TODAY")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 gap-1.5 cursor-pointer"
        >
          <Clock className="size-3 text-amber-500" />
          <span>Today</span>
        </Button>
      </div>
    </div>
  );
};

export default GigFilters;
