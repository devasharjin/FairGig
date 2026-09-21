import React from "react";
import { Sparkles, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GigRadarHeaderProps {
  totalAvailable: number;
  isRefetching: boolean;
  onRefresh: () => void;
  categoryName?: string;
}

export const GigRadarHeader: React.FC<GigRadarHeaderProps> = ({
  totalAvailable,
  isRefetching,
  onRefresh,
  categoryName,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-accent/10 text-accent border-accent/20 text-[11px] font-semibold gap-1.5 rounded-md px-2.5 py-0.5"
            >
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-accent" />
              </span>
              Live Cooperative Dispatch Radar
            </Badge>

            {categoryName && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold gap-1 rounded-md px-2.5 py-0.5"
              >
                🎯 {categoryName} (Exclusive Trade Matching)
              </Badge>
            )}

            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-semibold gap-1 rounded-md px-2.5 py-0.5"
            >
              <ShieldCheck className="size-3 text-emerald-500" />
              Guaranteed Pay Protection
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Available Gigs
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Real-time broadcast of customer requests matching your registered trade category and cooperative district. You will receive jobs exclusively from your selected category.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-2xl font-bold text-primary">
              {totalAvailable}
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Live Opportunities
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefetching}
            className="rounded-lg h-9 px-3.5 text-xs font-semibold gap-2 border-border/80 hover:bg-muted cursor-pointer shadow-xs"
          >
            <RotateCcw className={`size-3.5 ${isRefetching ? "animate-spin text-accent" : ""}`} />
            <span>{isRefetching ? "Scanning..." : "Refresh"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GigRadarHeader;
