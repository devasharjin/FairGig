import React from "react";
import {
  Wallet,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Percent,
  Calendar,
  Layers,
  Car,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkerJob } from "@/features/worker/gigs/types";

export interface WorkerEarningsReceiptCardProps {
  job: WorkerJob;
  className?: string;
}

export const WorkerEarningsReceiptCard: React.FC<WorkerEarningsReceiptCardProps> = ({
  job,
  className,
}) => {
  const isPaid = job.paymentStatus === "PAID";
  const isCompleted = job.status === "COMPLETED";

  // Snapshot or fallback rates
  const firstHourRate =
    job.pricing?.firstHourRate ??
    job.service?.firstHourRate ??
    job.service?.hourlyPrice ??
    job.rate ??
    0;

  const additionalHourRate =
    job.pricing?.additionalHourRate ??
    job.service?.additionalHourRate ??
    firstHourRate;

  const transportFee = job.pricing?.transportFee ?? 30;

  const coopPct =
    job.pricing?.cooperativePercentage ??
    job.service?.cooperativeShare ??
    10;

  const insPct =
    job.pricing?.insurancePercentage ??
    job.service?.insuranceShare ??
    5;

  // Finalized or estimated figures
  const actualDurationMinutes = job.pricing?.actualDurationMinutes;
  const billableHours = job.pricing?.billableHours ?? 1;

  // Service amount & distribution
  const serviceAmount =
    job.pricing?.serviceAmount ??
    (isCompleted
      ? job.totalAmount - (job.pricing?.transportFee ?? 0)
      : firstHourRate + Math.max(0, billableHours - 1) * additionalHourRate);

  const coopDeduction =
    job.pricing?.cooperativeShareAmount ??
    Math.round((serviceAmount * coopPct) / 100);

  const insDeduction =
    job.pricing?.insuranceShareAmount ??
    Math.round((serviceAmount * insPct) / 100);

  const workerNetEarnings =
    job.pricing?.workerNetEarnings ??
    (job.pricing?.isFinalized
      ? serviceAmount - coopDeduction - insDeduction
      : job.totalAmount);

  const customerTotal =
    job.pricing?.customerTotalAmount ??
    (job.pricing?.serviceAmount
      ? serviceAmount + transportFee
      : job.totalAmount);

  // Formatting helpers
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const formatDurationDisplay = (totalMins?: number) => {
    if (totalMins === undefined || totalMins === null) return "1 hr (est.)";
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h > 0) return `${h} hr ${m} min (${totalMins}m)`;
    return `${m} min`;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5",
        className
      )}
    >
      {/* 1. Header with Payment & Settlement Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Worker Salary & Payout
          </h3>
        </div>

        {isPaid ? (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] font-semibold"
          >
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            Paid via Razorpay
          </Badge>
        ) : isCompleted ? (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px] font-semibold"
          >
            <Clock className="size-3.5 text-amber-500" />
            Awaiting Customer Checkout
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-accent/10 text-accent border-accent/30 gap-1 text-[11px] font-semibold"
          >
            <Sparkles className="size-3.5 text-accent" />
            In Progress / Active
          </Badge>
        )}
      </div>

      {/* 2. Dispatch / Duration Tracking Block */}
      <div className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-muted-foreground font-medium pb-2 border-b border-border/50">
          <span className="flex items-center gap-1.5 text-foreground font-semibold">
            <Calendar className="size-3.5 text-primary" />
            Dispatch Timestamps
          </span>
          <span className="font-mono text-[11px] text-muted-foreground uppercase">
            #{job.bookingNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-muted-foreground block">Started On-Site:</span>
            <span className="font-semibold text-foreground">
              {formatTime(job.startedAt)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Completed At:</span>
            <span className="font-semibold text-foreground">
              {formatTime(job.completedAt)}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
          <div>
            <span className="text-muted-foreground block text-[11px]">Actual Duration</span>
            <span className="font-bold text-foreground">
              {formatDurationDisplay(actualDurationMinutes)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block text-[11px]">Billable Tier</span>
            <span className="font-black text-primary">
              {billableHours} Hour{billableHours === 1 ? "" : "s"} (Ceiling)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Salary Distribution Line Items */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-border/50">
          <span className="text-muted-foreground">Trade Service</span>
          <span className="font-semibold text-foreground text-right">
            {job.service?.name}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Agreed Rate Schedule</span>
          <span className="font-semibold text-foreground text-right">
            1st hr: ₹{firstHourRate} • Addl: ₹{additionalHourRate}/hr
          </span>
        </div>

        {/* Gross Service Earnings */}
        <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-muted/30 border border-border/50">
          <span className="font-bold text-foreground">Gross Service Amount</span>
          <span className="font-black text-foreground text-sm">
            ₹{serviceAmount}
          </span>
        </div>

        {/* Deductions breakdown */}
        <div className="space-y-1.5 pl-3 border-l-2 border-primary/30 my-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Percent className="size-3 text-primary" />
              Cooperative Admin Share ({coopPct}%)
            </span>
            <span className="font-medium text-destructive">
              -₹{coopDeduction}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3 text-primary" />
              Insurance Protection Share ({insPct}%)
            </span>
            <span className="font-medium text-destructive">
              -₹{insDeduction}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1">
            <span className="flex items-center gap-1.5">
              <Car className="size-3 text-muted-foreground" />
              Transport Fee (Fixed Central)
            </span>
            <span className="font-medium text-foreground">
              ₹{transportFee}{" "}
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                (Isolated from worker deductions)
              </span>
            </span>
          </div>
        </div>

        {/* 4. Worker Net Take-Home Pay (Prominent Box) */}
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-baseline">
          <div>
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              Worker Net Take-Home Pay
            </span>
            <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
              Gross service earnings minus statutory shares
            </span>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            ₹{workerNetEarnings}
          </span>
        </div>

        {/* Customer Total Invoice */}
        <div className="flex justify-between items-center py-2 border-t border-border text-[11px] text-muted-foreground">
          <span>Customer Billed Total (Service + Transport):</span>
          <span className="font-bold text-foreground">
            ₹{customerTotal}
          </span>
        </div>

        {job.paymentDetails?.transactionId && (
          <div className="flex justify-between items-center py-1 text-[11px]">
            <span className="text-muted-foreground">Razorpay Transaction ID</span>
            <span className="font-mono text-foreground">
              {job.paymentDetails.transactionId}
            </span>
          </div>
        )}
      </div>

      {/* 5. Cooperative Protection Card */}
      <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
        <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
        <span>
          <strong>Cooperative Protection Guarantee:</strong> The fixed ₹30 transport fee is never deducted from your earnings. Deductions only apply to the base service amount to fund cooperative management and your insurance coverage.
        </span>
      </div>
    </div>
  );
};

export default WorkerEarningsReceiptCard;
