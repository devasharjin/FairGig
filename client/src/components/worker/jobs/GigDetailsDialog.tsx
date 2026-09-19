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
import { Calendar, MapPin, Zap, AlertTriangle, Phone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
  if (!selectedGig) return null;

  const isEmergency = selectedGig.isEmergency;
  const isOnDemand = selectedGig.bookingType === "ON_DEMAND";

  return (
    <Dialog
      open={Boolean(selectedGig)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        className={cn(
          "max-w-lg rounded-3xl p-6 border shadow-2xl bg-card max-h-[90vh] overflow-y-auto",
          isEmergency
            ? "border-rose-500/50 ring-2 ring-rose-500/20"
            : "border-border/80"
        )}
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {selectedGig.bookingNumber}
            </span>

            <div className="flex items-center gap-1.5">
              {isEmergency && (
                <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-wider py-0.5 px-2 animate-pulse bg-rose-600">
                  🚨 Priority Emergency SOS
                </Badge>
              )}
              {isOnDemand && !isEmergency && (
                <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold py-0.5 px-2">
                  ⚡ On-Demand Dispatch
                </Badge>
              )}
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 text-[10px]"
              >
                Open Dispatch
              </Badge>
            </div>
          </div>

          <DialogTitle className="text-lg font-bold text-foreground">
            {selectedGig.service?.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Category: <strong>{selectedGig.category?.name || "Trade"}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          {/* Emergency Hazard Banner */}
          {isEmergency && selectedGig.emergencyDetails && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-950 dark:text-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="size-4 animate-bounce shrink-0" />
                  <span>Hazard: {selectedGig.emergencyDetails.hazardType || "Critical Emergency Callout"}</span>
                </div>
                <Badge variant="outline" className="bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 text-[10px] font-black">
                  {selectedGig.urgencyLevel || "CRITICAL"}
                </Badge>
              </div>

              {selectedGig.emergencyDetails.immediateContact && (
                <div className="text-xs flex items-center gap-1.5">
                  <Phone className="size-3 text-rose-500" />
                  <span>Customer Phone: </span>
                  <strong className="text-foreground">{selectedGig.emergencyDetails.immediateContact}</strong>
                </div>
              )}

              {selectedGig.emergencyDetails.notes && (
                <p className="italic text-[11px] opacity-90 leading-relaxed pt-1 border-t border-rose-500/20">
                  "{selectedGig.emergencyDetails.notes}"
                </p>
              )}
            </div>
          )}

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
                <span className="font-semibold text-foreground">Dispatch Timing:</span>{" "}
                <span className={cn(isEmergency ? "text-rose-600 dark:text-rose-400 font-bold" : "")}>
                  {isEmergency || isOnDemand ? "Immediate Dispatch (ASAP)" : formatDate(selectedGig.scheduledDate)}
                </span>
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
            className={cn(
              "rounded-xl h-10 px-6 text-xs font-bold gap-1.5 cursor-pointer shadow-sm text-white",
              isEmergency
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                : isOnDemand
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Check className="size-3.5" />
            <span>
              {isAccepting
                ? "Claiming..."
                : isEmergency
                ? "Claim Emergency SOS Mission"
                : isOnDemand
                ? "Claim On-Demand Dispatch"
                : "Accept Assignment"}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GigDetailsDialog;
