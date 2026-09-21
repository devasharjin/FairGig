import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { getStatusBadge } from "./BookingCard";

interface BookingDetailsDialogProps {
  selectedJob: WorkerJob | null;
  onClose: () => void;
  onStartJob: (jobId: string) => void;
  onCompleteJob: (job: WorkerJob) => void;
}

export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  selectedJob,
  onClose,
  onStartJob,
  onCompleteJob,
}) => {
  return (
    <Dialog
      open={Boolean(selectedJob)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-lg rounded-xl p-6 border border-border/80 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
        {selectedJob && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {selectedJob.bookingNumber}
                </span>
                {getStatusBadge(selectedJob.status)}
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {selectedJob.service?.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Cooperative Fieldwork Record
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              {/* Progress Stepper */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                <h4 className="font-semibold text-foreground">Job Status Progression</h4>
                <div className="flex items-center justify-between text-[11px] pt-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Assigned</span>
                  </div>

                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2",
                      selectedJob.startedAt ? "bg-emerald-500" : "bg-border"
                    )}
                  />

                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                        selectedJob.startedAt
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedJob.startedAt ? "✓" : "2"}
                    </div>
                    <span className="text-muted-foreground">Started</span>
                  </div>

                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2",
                      selectedJob.completedAt ? "bg-emerald-500" : "bg-border"
                    )}
                  />

                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                        selectedJob.completedAt
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedJob.completedAt ? "✓" : "3"}
                    </div>
                    <span className="text-muted-foreground">Finished</span>
                  </div>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                <h4 className="font-semibold text-foreground">Customer Contact</h4>
                <p className="text-foreground font-bold">{selectedJob.customer?.name}</p>
                <p className="text-muted-foreground">
                  Phone: {selectedJob.customer?.phone || "N/A"}
                </p>
                <p className="text-muted-foreground">
                  Address: {selectedJob.address?.street}, {selectedJob.address?.city}
                </p>
              </div>

              {/* Instructions */}
              {selectedJob.customerNotes && (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <h4 className="font-semibold text-foreground">Customer Instructions</h4>
                  <p className="italic text-foreground">"{selectedJob.customerNotes}"</p>
                </div>
              )}

              {/* Payment Breakdown */}
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                <h4 className="font-semibold text-foreground">Payment Summary</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Type:</span>
                  <span className="font-medium text-foreground uppercase">
                    {selectedJob.priceType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-medium text-foreground">₹{selectedJob.rate}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/50">
                  <span className="font-bold text-foreground">Total Payout:</span>
                  <span className="font-black text-foreground text-sm">
                    ₹{selectedJob.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-border/80">
              <Link to={`/worker/bookings/${selectedJob._id}`} onClick={onClose}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-10 px-4 text-xs cursor-pointer gap-1.5"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Full Details Page</span>
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-lg h-10 px-4 text-xs cursor-pointer"
                >
                  Close
                </Button>

                {(selectedJob.status === "CONFIRMED" || selectedJob.status === "ASSIGNED") && (
                  <Button
                    onClick={() => onStartJob(selectedJob._id)}
                    className="rounded-lg h-10 px-5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                  >
                    Start Job Now
                  </Button>
                )}

                {selectedJob.status === "IN_PROGRESS" && (
                  <Button
                    onClick={() => onCompleteJob(selectedJob)}
                    className="rounded-lg h-10 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Finish Work
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
