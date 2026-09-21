import React from "react";
import { Calendar as CalendarIcon, CheckCircle2, Clock } from "lucide-react";

interface DailySummary {
  count: number;
  totalEarnings: number;
  estimatedHours: number;
}

interface DailyWorkloadHudProps {
  summary: DailySummary;
  isToday: boolean;
}

export const DailyWorkloadHud: React.FC<DailyWorkloadHudProps> = ({
  summary,
  isToday,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-4">
        <div className="size-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <CalendarIcon className="size-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-foreground">
            {summary.count}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Bookings for {isToday ? "Today" : "Selected Date"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-4">
        <div className="size-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-foreground">
            ₹{summary.totalEarnings}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Projected Day's Pay
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-4">
        <div className="size-11 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Clock className="size-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-foreground">
            ~{summary.estimatedHours.toFixed(1)} hrs
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Estimated On-Site Work
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyWorkloadHud;
