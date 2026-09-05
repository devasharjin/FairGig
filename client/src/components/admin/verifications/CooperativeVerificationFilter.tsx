import React from "react";
import { Search, RotateCw, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/features/admin/verifications/types";

interface CooperativeVerificationFilterProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  onRefresh: () => void;
  isFetching?: boolean;
}

export const CooperativeVerificationFilter: React.FC<CooperativeVerificationFilterProps> = ({
  currentStatus,
  onStatusChange,
  search,
  onSearchChange,
  counts,
  onRefresh,
  isFetching = false,
}) => {
  const tabs: { label: string; value: string; count: number }[] = [
    { label: "All Societies", value: "All", count: counts.total },
    { label: "Pending", value: "Pending", count: counts.pending },
    { label: "Approved", value: "Approved", count: counts.approved },
    { label: "Rejected", value: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/60 p-3 sm:p-4 rounded-2xl border border-border/70 backdrop-blur-sm shadow-xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-md text-[10px] font-bold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground border border-border/60"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search society name, email, phone, applicant..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8.5 pr-8 h-9 rounded-xl text-xs bg-background/80 border-border/80"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 px-3 rounded-xl text-xs border-border/80 hover:bg-muted/50 cursor-pointer"
          title="Refresh cooperatives list"
        >
          <RotateCw
            className={cn("size-3.5 text-muted-foreground", isFetching && "animate-spin text-primary")}
          />
          <span className="hidden sm:inline ml-1.5">Refresh</span>
        </Button>
      </div>
    </div>
  );
};
