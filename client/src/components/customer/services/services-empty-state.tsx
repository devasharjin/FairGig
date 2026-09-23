import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-border/80 bg-muted/20 my-6">
      <div className="flex size-14 sm:size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4 shadow-xs">
        <SearchX className="size-7 sm:size-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-foreground">
        {t("services.emptyTitle")}
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md">
        {searchQuery
          ? t("services.matchingTitle", { query: searchQuery }) + ". " + t("services.emptyDesc")
          : t("services.emptyDesc")}
      </p>

      {hasFilters && (
        <Button
          onClick={onResetFilters}
          className="mt-5 rounded-2xl gap-2 font-semibold cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>{t("services.clearFiltersBtn")}</span>
        </Button>
      )}
    </div>
  );
};

