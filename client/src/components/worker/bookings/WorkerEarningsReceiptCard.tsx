import React from "react";
import { Coins, CheckCircle2, ShieldCheck, Wallet, Clock, CreditCard } from "lucide-react";
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
  const unitLabel = job.priceType === "hourly" ? "hr" : "meter";
  const unitPlural = job.priceType === "hourly" ? "hours" : "meters";
  const isPaid = job.paymentStatus === "PAID";

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Worker Payout & Compensation
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
        ) : (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px] font-semibold"
          >
            <Clock className="size-3.5 text-amber-500" />
            Payment Pending
          </Badge>
        )}
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-muted-foreground">Trade Service</span>
          <span className="font-semibold text-foreground text-right">
            {job.service?.name}
          </span>
        </div>

        {/* Customer Payment Status Row */}
        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Customer Invoice Status</span>
          <span
            className={cn(
              "font-bold",
              isPaid
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            )}
          >
            {isPaid ? "✓ Paid in Full" : "Awaiting Customer Checkout"}
          </span>
        </div>

        {job.paymentDetails?.transactionId && (
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Razorpay Transaction ID</span>
            <span className="font-mono text-[11px] text-foreground">
              {job.paymentDetails.transactionId}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Agreed Trade Rate</span>
          <span className="font-semibold text-foreground">
            ₹{job.rate} / {unitLabel}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Authorized Units</span>
          <span className="font-semibold text-foreground">
            {job.units} {unitPlural}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Cooperative Commission Fee</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            0% (Full Worker Earnings)
          </span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-foreground block">
              Total Worker Payout
            </span>
            <span className="text-[11px] text-muted-foreground">
              Direct settlement to bank account / UPI
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            ₹{job.totalAmount}
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
        <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
        <span>
          <strong>Cooperative Protection:</strong> Payout is guaranteed upon task completion and customer signoff without platform middlemen deductions.
        </span>
      </div>
    </div>
  );
};

export default WorkerEarningsReceiptCard;
