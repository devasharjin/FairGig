import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Briefcase, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FilterTab } from "./BookingsFilters";

export interface BookingsEmptyStateProps {
  activeTab: FilterTab;
  hasSearchQuery?: boolean;
  onClearSearch?: () => void;
  className?: string;
}

export const BookingsEmptyState: React.FC<BookingsEmptyStateProps> = ({
  activeTab,
  hasSearchQuery = false,
  onClearSearch,
  className,
}) => {
  const { t } = useTranslation();

  const getMessage = () => {
    if (hasSearchQuery) {
      return t("bookings.noBookingsDesc");
    }

    switch (activeTab) {
      case "ACTIVE":
        return t("bookings.noBookingsDesc");
      case "COMPLETED":
        return t("bookings.noBookingsDesc");
      case "CANCELLED":
        return t("bookings.noBookingsDesc");
      case "ALL":
      default:
        return t("bookings.noBookingsDesc");
    }
  };

  return (
    <div
      className={cn(
        "p-12 text-center rounded-3xl border border-dashed border-border/80 bg-card/30 max-w-lg mx-auto my-12 space-y-4",
        className
      )}
    >
      <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <Briefcase className="size-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">
          {t("bookings.noBookingsTitle")}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{getMessage()}</p>
      </div>

      <div className="flex items-center justify-center gap-2.5 pt-2">
        {hasSearchQuery && onClearSearch ? (
          <Button
            variant="outline"
            onClick={onClearSearch}
            className="rounded-xl h-10 px-4 gap-2 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>{t("bookings.clearSearch")}</span>
          </Button>
        ) : (
          <Link to="/services">
            <Button className="rounded-xl h-10 px-5 gap-2 text-xs font-semibold cursor-pointer shadow-xs">
              <span>{t("home.cta.exploreBtn")}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookingsEmptyState;

