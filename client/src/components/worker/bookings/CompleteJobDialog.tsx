import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
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
  return (
    <Dialog
      open={Boolean(completingJob)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
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

        <div className="space-y-3 py-2 text-xs text-muted-foreground">
          <p>
            Confirm that you have finished all requested fieldwork for{" "}
            <strong>{completingJob?.customer?.name}</strong>.
          </p>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <div className="flex justify-between">
              <span>Total Payout Credited:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                ₹{completingJob?.totalAmount}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-10 px-4 rounded-xl text-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="h-10 px-5 rounded-xl text-xs font-bold cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? "Completing..." : "Confirm & Complete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteJobDialog;
