import React, { useState, useEffect } from "react";
import {
  Flame,
  Zap,
  Clock,
  TrendingUp,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWorkerDemandHotspots } from "@/features/forecasting/api";
import type { WorkerHotspot } from "@/features/forecasting/types";

export const AiDemandHotspotsWidget: React.FC = () => {
  const [hotspots, setHotspots] = useState<WorkerHotspot[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getWorkerDemandHotspots()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setHotspots(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load demand hotspots:", err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-amber-500/5 via-primary/5 to-transparent p-4 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-amber-400/40" />
          <div className="h-4 bg-muted/60 rounded w-48" />
        </div>
      </div>
    );
  }

  if (!hotspots || hotspots.length === 0) return null;

  const topHotspot = hotspots[0];

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.07] via-background to-primary/[0.04] p-4 sm:p-5 shadow-sm transition-all">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shrink-0 ring-4 ring-amber-500/10">
            <Flame className="size-5 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="size-3" /> AI Demand Radar Active
              </span>
              <Badge
                variant="outline"
                className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-semibold"
              >
                Top Surge: {topHotspot.zoneName} ({topHotspot.surgeFactor}x)
              </Badge>
            </div>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              High customer booking frequency in {hotspots.length} nearby macro zones
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer shrink-0 self-end sm:self-auto"
        >
          {isExpanded ? (
            <>
              Hide Hotspot Map <ChevronUp className="size-3.5 ml-1" />
            </>
          ) : (
            <>
              Explore {hotspots.length} Zones <ChevronDown className="size-3.5 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Expanded Hotspots Grid */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-1 md:grid-cols-3 gap-3">
          {hotspots.map((zone, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                zone.activeDemandLevel === "HIGH_SURGE"
                  ? "bg-amber-500/10 border-amber-500/30 shadow-xs"
                  : "bg-card/60 border-border/70"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1 truncate">
                  <MapPin className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate">{zone.zoneName}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                  {zone.surgeFactor}x SURGE
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-primary shrink-0" />
                  <span>Peak: {zone.peakHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3 text-amber-500 shrink-0" />
                  <span className="font-medium text-foreground">{zone.bonusEstimate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3 text-emerald-500 shrink-0" />
                  <span>Top Trade: {zone.topTrade}</span>
                </div>
              </div>

              <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground/90 bg-background/50 rounded-lg p-2 border border-border/40">
                <Info className="size-3 inline mr-1 text-primary/70" />
                {zone.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
