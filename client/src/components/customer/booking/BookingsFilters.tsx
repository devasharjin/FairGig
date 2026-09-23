import React from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type FilterTab = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface BookingsFiltersProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts?: Partial<Record<FilterTab, number>>;
  className?: string;
}

export const BookingsFilters: React.FC<BookingsFiltersProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  counts,
  className,
}) => {
  const { t } = useTranslation();

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "ALL", label: t("bookings.tabAll") },
    { id: "ACTIVE", label: t("bookings.tabActive") },
    { id: "COMPLETED", label: t("bookings.tabCompleted") },
    { id: "CANCELLED", label: t("bookings.tabCancelled") },
  ];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-6",
        className
      )}
    >
      {/* Horizontal Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts?.[tab.id];

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap select-none border flex items-center gap-2",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/70 hover:bg-card text-muted-foreground hover:text-foreground border-border/70"
              )}
            >
              <span>{tab.label}</span>
              {typeof count === "number" && (
                <span
                  className={cn(
                    "text-[11px] font-bold px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative sm:w-72 shrink-0">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={t("bookings.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 pr-8 text-xs rounded-xl"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full cursor-pointer"
            title={t("bookings.clearSearch")}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingsFilters;

