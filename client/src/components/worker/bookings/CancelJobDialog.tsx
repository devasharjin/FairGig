import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";

interface CancelJobDialogProps {
  cancellingJob: WorkerJob | null;
  cancelReason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const CancelJobDialog: React.FC<CancelJobDialogProps> = ({
  cancellingJob,
  cancelReason,
  onReasonChange,
  onClose,
  onConfirm,
  isPending,
}) => {
  return (
    <Dialog
      open={Boolean(cancellingJob)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Cancel Job Assignment?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Booking #{cancellingJob?.bookingNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onConfirm} className="space-y-4 pt-2">
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
              placeholder="Describe reason for emergency cancellation..."
              value={cancelReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-input bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-10 px-4 rounded-xl text-xs cursor-pointer"
            >
              Keep Job
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
              className="h-10 px-4 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
            >
              {isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelJobDialog;
