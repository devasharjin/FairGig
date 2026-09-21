import React from "react";
import { Clock, ShieldCheck, Star } from "lucide-react";

export const WorkerGuidelinesCard: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-base sm:text-lg font-bold text-foreground">
        Cooperative Standards
      </h2>

      <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3.5 text-xs shadow-xs">
        <div className="flex items-start gap-3">
          <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="size-3.5" />
          </div>
          <div>
            <strong className="text-foreground block font-semibold">
              Punctual Arrival
            </strong>
            <span className="text-muted-foreground">
              Arrive at the customer address promptly at the scheduled time. Call in advance if traffic delays occur.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="size-3.5" />
          </div>
          <div>
            <strong className="text-foreground block font-semibold">
              Standardized Pricing
            </strong>
            <span className="text-muted-foreground">
              All rates are fixed by your cooperative federation. Never charge extra fees or off-platform surcharges.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="size-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Star className="size-3.5 text-amber-500" />
          </div>
          <div>
            <strong className="text-foreground block font-semibold">
              Quality & Rating
            </strong>
            <span className="text-muted-foreground">
              High ratings unlock cooperative bonus pools and prioritize you for new high-value gig dispatch requests.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerGuidelinesCard;
