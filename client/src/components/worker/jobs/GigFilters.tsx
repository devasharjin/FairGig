import React from "react";
import { Search, Filter, Clock, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type QuickFilterType = "ALL" | "HOURLY" | "METERS" | "TODAY";

interface GigFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: QuickFilterType;
  onFilterChange: (filter: QuickFilterType) => void;
  filteredCount: number;
}

export const GigFilters: React.FC<GigFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filteredCount,
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
        <Button
          variant={activeFilter === "HOURLY" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("HOURLY")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 cursor-pointer"
        >
          Hourly Rate
        </Button>
        <Button
          variant={activeFilter === "METERS" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("METERS")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 cursor-pointer"
        >
          Meter Based
        </Button>
        <Button
          variant={activeFilter === "TODAY" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("TODAY")}
          className="rounded-xl h-9 px-3 text-xs font-semibold shrink-0 gap-1.5 cursor-pointer"
        >
          <Clock className="size-3 text-amber-500" />
          <span>Today Only</span>
        </Button>
      </div>
    </div>
  );
};

export default GigFilters;
