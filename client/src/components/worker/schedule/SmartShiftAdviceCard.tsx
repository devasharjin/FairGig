import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWorkerSmartShifts } from "@/features/forecasting/api";
import type { SmartShiftAdvice } from "@/features/forecasting/types";

export const SmartShiftAdviceCard: React.FC = () => {
  const [advice, setAdvice] = useState<SmartShiftAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getWorkerSmartShifts()
      .then((data) => {
        if (mounted && data?.recommendedShift) {
          setAdvice(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load smart shifts:", err);
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
      <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 animate-pulse">
        <div className="h-5 bg-muted/60 rounded w-1/3 mb-2" />
        <div className="h-4 bg-muted/40 rounded w-1/2" />
      </div>
    );
  }

  if (!advice || !advice.recommendedShift) return null;

  const { recommendedShift, activeSurgeBounties } = advice;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-primary/5 via-card to-card p-5 sm:p-6 shadow-xs">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20">
              <Sparkles className="size-3.5" /> AI Optimal Shift Advisor
            </span>
            <Badge
              variant="outline"
              className="bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold gap-1 rounded-md"
            >
              <Award className="size-3" /> {recommendedShift.priorityStatus.replace(/_/g, " ")}
            </Badge>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Peak Slot Recommended: {recommendedShift.day} • {recommendedShift.timeSlot}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {recommendedShift.reason}
            </p>
          </div>

          {/* Metric Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/80 text-xs font-semibold text-foreground shadow-xs">
              <TrendingUp className="size-3.5 text-emerald-500" />
              <span>{recommendedShift.estimatedEarningsBoost}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/80 text-xs font-semibold text-foreground shadow-xs">
              <Clock className="size-3.5 text-primary" />
              <span>{recommendedShift.expectedGigMultiplier}x Booking Volume</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/80 text-xs font-semibold text-foreground shadow-xs">
              <ShieldCheck className="size-3.5 text-accent" />
              <span>Fair Rotation Priority Active</span>
            </div>
          </div>

          {/* Active Bounties if any */}
          {activeSurgeBounties && activeSurgeBounties.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
              <Gift className="size-4 text-amber-500 shrink-0" />
              <span>
                <strong>{activeSurgeBounties[0].title}:</strong> {activeSurgeBounties[0].bonus} ({activeSurgeBounties[0].zone})
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 flex sm:flex-col items-center gap-2 self-stretch sm:self-auto justify-end">
          <Link to="/worker/jobs" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto rounded-lg h-10 px-5 gap-2 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="size-4" />
              <span>Explore Available Gigs</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
