import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Zap } from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";

interface GigDetailsDialogProps {
  selectedGig: WorkerJob | null;
  onClose: () => void;
  onAccept: (gigId: string) => void;
  isAccepting: boolean;
  formatDate: (dateStr?: string) => string;
}

export const GigDetailsDialog: React.FC<GigDetailsDialogProps> = ({
  selectedGig,
  onClose,
  onAccept,
  isAccepting,
  formatDate,
}) => {
  return (
    <Dialog
      open={Boolean(selectedGig)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-lg rounded-3xl p-6 border border-border/80 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
        {selectedGig && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {selectedGig.bookingNumber}
                </span>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]"
                >
                  Open Dispatch
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {selectedGig.service?.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Category: <strong>{selectedGig.category?.name || "Trade"}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              {/* Guaranteed Pay Box */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    Standardized Rate Guarantee
                  </span>
                  <div className="flex items-baseline gap-1 text-emerald-700 dark:text-emerald-400 font-extrabold text-xl mt-0.5">
                    <span>₹{selectedGig.rate}</span>
                    <span className="text-xs font-normal">
                      /{selectedGig.priceType === "hourly" ? "hour" : "meter"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground">Estimated Total</span>
                  <p className="text-base font-bold text-foreground">₹{selectedGig.totalAmount}</p>
                </div>
              </div>

              {/* Location & Time */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Scheduled Time:</span>{" "}
                    {formatDate(selectedGig.scheduledDate)}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Service Address:</span>{" "}
                    {selectedGig.address?.street}
                    {selectedGig.address?.city ? `, ${selectedGig.address.city}` : ""}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {selectedGig.customerNotes && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="font-semibold text-foreground">Customer Notes</span>
                  <p className="italic text-foreground">"{selectedGig.customerNotes}"</p>
                </div>
              )}

              {/* Customer Info Preview */}
              <div className="p-3 rounded-2xl bg-card border border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Customer Name: <strong className="text-foreground">{selectedGig.customer?.name}</strong>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Verified Booking
                </Badge>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl h-10 px-4 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onAccept(selectedGig._id)}
                disabled={isAccepting}
                className="rounded-xl h-10 px-6 text-xs font-bold gap-1.5 cursor-pointer shadow-sm bg-primary text-primary-foreground"
              >
                <Zap className="size-3.5 fill-primary-foreground" />
                <span>{isAccepting ? "Claiming..." : "Accept & Claim Gig"}</span>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
