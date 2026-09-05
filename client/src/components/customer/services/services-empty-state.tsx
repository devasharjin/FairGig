import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesEmptyStateProps {
  searchQuery: string;
  hasFilters: boolean;
  onResetFilters: () => void;
}

export const ServicesEmptyState: React.FC<ServicesEmptyStateProps> = ({
  searchQuery,
  hasFilters,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-border/80 bg-muted/20 my-6">
      <div className="flex size-14 sm:size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4 shadow-xs">
        <SearchX className="size-7 sm:size-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-foreground">
        No matching services found
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md">
        {searchQuery
          ? `We couldn't find any services matching "${searchQuery}". Try adjusting your keywords or category filters.`
          : "There are no active gig services matching your selected filters."}
      </p>

      {hasFilters && (
        <Button
          onClick={onResetFilters}
          className="mt-5 rounded-2xl gap-2 font-semibold cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Clear all filters</span>
        </Button>
      )}
    </div>
  );
};
