import React from "react";
import { Sparkles, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GigRadarHeaderProps {
  totalAvailable: number;
  isRefetching: boolean;
  onRefresh: () => void;
}

export const GigRadarHeader: React.FC<GigRadarHeaderProps> = ({
  totalAvailable,
  isRefetching,
  onRefresh,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold gap-1.5"
            >
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-primary" />
              </span>
              Live Cooperative Dispatch Radar
            </Badge>

            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold gap-1"
            >
              <ShieldCheck className="size-3 text-emerald-500" />
              Guaranteed Pay Protection
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Available Gigs
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Real-time broadcast of customer requests matching your registered skills and cooperative district. Review rates, service specifications, and accept assignments instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-2xl font-black text-primary">
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
            className="rounded-2xl h-10 px-4 text-xs font-semibold gap-2 border-border/80 hover:bg-muted cursor-pointer"
          >
            <RotateCcw className={`size-3.5 ${isRefetching ? "animate-spin text-primary" : ""}`} />
            <span>{isRefetching ? "Scanning..." : "Refresh"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GigRadarHeader;
