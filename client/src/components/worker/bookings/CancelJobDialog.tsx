import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, ShieldAlert, Info } from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";

interface CancelJobDialogProps {
  cancellingJob: WorkerJob | null;
  cancelReason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
  isPending: boolean;
  cancellationsToday?: number;
  cancellationLimit?: number;
  canCancelToday?: boolean;
}

export const CancelJobDialog: React.FC<CancelJobDialogProps> = ({
  cancellingJob,
  cancelReason,
  onReasonChange,
  onClose,
  onConfirm,
  isPending,
  cancellationsToday = 0,
  cancellationLimit = 1,
  canCancelToday,
}) => {
  const isLimitReached =
    canCancelToday === false || cancellationsToday >= cancellationLimit;

  return (
    <Dialog
      open={Boolean(cancellingJob)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-md rounded-xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                isLimitReached
                  ? "bg-destructive/15 text-destructive"
                  : "bg-amber-500/15 text-amber-500"
              }`}
            >
              {isLimitReached ? (
                <ShieldAlert className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {isLimitReached ? "Cancellation Limit Reached" : "Cancel Job Assignment?"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Booking #{cancellingJob?.bookingNumber} &bull; Service:{" "}
                <span className="font-semibold text-foreground">
                  {cancellingJob?.service?.name || "Job"}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Policy & Quota Banner */}
        {isLimitReached ? (
          <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/5 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-destructive">
                  Daily Limit: 1 cancellation per day (Exhausted)
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  To protect cooperative service reliability and customer trust, workers
                  can only cancel <strong>1 job per day</strong>. You have already cancelled{" "}
                  <strong>{cancellationsToday} job</strong> today.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-destructive/20 text-[11px] text-foreground font-medium flex items-center gap-1.5">
              <Info className="size-3.5 text-muted-foreground shrink-0" />
              <span>Need help? Contact cooperative dispatch or customer support.</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-start gap-2.5">
            <Info className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Cooperative Cancellation Policy (1 per day)
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Workers are limited to <strong>1 cancellation per calendar day</strong>.
                Cancelling this job will use your full allowance for today (
                {cancellationsToday} of {cancellationLimit} used).
              </p>
            </div>
          </div>
        )}

        <form onSubmit={onConfirm} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label
              htmlFor="w-cancel-reason"
              className="text-xs font-semibold text-foreground"
            >
              Reason for cancellation
            </label>
            <textarea
              id="w-cancel-reason"
              rows={3}
              disabled={isLimitReached || isPending}
              placeholder={
                isLimitReached
                  ? "Cancellation is disabled because daily limit has been reached."
                  : "State reason for emergency cancellation..."
              }
              value={cancelReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-10 px-4 rounded-lg text-xs cursor-pointer"
            >
              {isLimitReached ? "Close" : "Keep Job"}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || isLimitReached}
              className="h-10 px-4 rounded-lg text-xs font-bold cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Cancelling..."
                : isLimitReached
                ? "Daily Limit Reached (1/1)"
                : "Confirm Cancellation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelJobDialog;
