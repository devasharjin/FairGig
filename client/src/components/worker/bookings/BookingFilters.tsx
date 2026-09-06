import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type WorkerFilterTab =
  | "ALL"
  | "IN_PROGRESS"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

interface BookingFiltersProps {
  activeTab: WorkerFilterTab;
  onTabChange: (tab: WorkerFilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TABS: { id: WorkerFilterTab; label: string }[] = [
  { id: "ALL", label: "All Assigned" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "CONFIRMED", label: "Upcoming / Confirmed" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
];

export const BookingFilters: React.FC<BookingFiltersProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap select-none border",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative sm:w-72 shrink-0">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search booking #, customer, area..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9.5 pl-9 text-xs rounded-xl"
        />
      </div>
    </div>
  );
};

export default BookingFilters;
