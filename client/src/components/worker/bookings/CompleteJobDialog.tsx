import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Calculator, ShieldCheck } from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";

interface CompleteJobDialogProps {
  completingJob: WorkerJob | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const CompleteJobDialog: React.FC<CompleteJobDialogProps> = ({
  completingJob,
  onClose,
  onConfirm,
  isPending,
}) => {
  const startedAt = completingJob?.startedAt
    ? new Date(completingJob.startedAt)
    : null;

  const approximateMinutes = startedAt
    ? Math.max(1, Math.ceil((Date.now() - startedAt.getTime()) / 60000))
    : 60;

  const billableHours = Math.max(1, Math.ceil(approximateMinutes / 60));

  const firstHourRate =
    completingJob?.pricing?.firstHourRate ??
    completingJob?.service?.firstHourRate ??
    completingJob?.rate ??
    0;

  const additionalHourRate =
    completingJob?.pricing?.additionalHourRate ??
    completingJob?.service?.additionalHourRate ??
    firstHourRate;

  return (
    <Dialog
      open={Boolean(completingJob)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-md rounded-xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Confirm Service Completion
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Booking #{completingJob?.bookingNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-2 text-xs text-muted-foreground">
          <p className="leading-relaxed">
            Confirm that you have completed all fieldwork for{" "}
            <strong className="text-foreground">
              {completingJob?.customer?.name || "Customer"}
            </strong>{" "}
            for service <strong>{completingJob?.service?.name}</strong>.
          </p>

          {/* Automatic Billing Notice */}
          <div className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
              <Calculator className="size-3.5 text-primary" />
              <span>Automatic Timestamp & Duration Calculation</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/40">
              <div>
                <span className="text-muted-foreground block">Started At:</span>
                <span className="font-semibold text-foreground">
                  {startedAt
                    ? startedAt.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Not recorded"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Current Elapsed:</span>
                <span className="font-semibold text-foreground">
                  ~{approximateMinutes} mins ({billableHours} billable hr
                  {billableHours === 1 ? "" : "s"})
                </span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
              <span>Applicable Rates: </span>
              <strong className="text-foreground">
                1st hr: ₹{firstHourRate} • Addl: ₹{additionalHourRate}/hr
              </strong>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <p>
              Submitting records the exact server completion timestamp. Billable hours, cooperative share, insurance share, and your net earnings are calculated automatically and finalized.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-10 px-4 rounded-lg text-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="h-10 px-5 rounded-lg text-xs font-bold cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? "Finalizing..." : "Confirm & Complete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteJobDialog;
