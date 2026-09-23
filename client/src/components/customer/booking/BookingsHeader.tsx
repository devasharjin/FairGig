import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BookingsHeaderProps {
  totalCount: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export const BookingsHeader: React.FC<BookingsHeaderProps> = ({
  totalCount,
  onRefresh,
  isRefreshing = false,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t("bookings.headerTitle")}
          </h1>
          <Badge
            variant="secondary"
            className="rounded-full text-xs font-semibold"
          >
            {totalCount}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t("bookings.headerDesc")}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-xl h-9 gap-1.5 cursor-pointer text-xs"
        >
          <RotateCcw
            className={cn("size-3.5", isRefreshing && "animate-spin")}
          />
          <span>{t("bookings.refresh")}</span>
        </Button>

        <Link to="/services">
          <Button
            size="sm"
            className="rounded-xl h-9 gap-1.5 cursor-pointer shadow-xs text-xs font-semibold"
          >
            <Sparkles className="size-3.5" />
            <span>{t("bookings.bookAnotherService", { defaultValue: "Book Another Service" })}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BookingsHeader;

