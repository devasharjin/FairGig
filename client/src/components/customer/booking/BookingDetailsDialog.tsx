import React from "react";
import { Link } from "react-router-dom";
import { Phone, Star, ExternalLink, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerBooking } from "@/features/customer/bookings/types";
import { BookingStatusBadge } from "./BookingStatusBadge";

export interface BookingDetailsDialogProps {
  booking: CustomerBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelBooking?: (booking: CustomerBooking) => void;
  onRateBooking?: (booking: CustomerBooking) => void;
  onPayBooking?: (booking: CustomerBooking) => void;
}

export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  booking,
  open,
  onOpenChange,
  onCancelBooking,
  onRateBooking,
  onPayBooking,
}) => {
  if (!booking) return null;

  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  const isCompleted = booking.status === "COMPLETED";
  const isPaid = booking.paymentStatus === "PAID";
  const needsPayment = isCompleted && !isPaid;
  // Ratings and reviews are unlocked only after booking is completed and paid
  const canRate = isCompleted && isPaid && !booking.isRated;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 border border-border/80 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {booking.bookingNumber}
            </span>
            <BookingStatusBadge status={booking.status} />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {booking.service?.name || "Gig Service"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Trade Category: {booking.category?.name || "Gig Service"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          {/* Visual Progress Stepper */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
            <h4 className="font-semibold text-foreground">Service Dispatch Timeline</h4>
            <div className="flex items-center justify-between text-[11px] pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span className="text-muted-foreground">Requested</span>
              </div>

              <div
                className={cn(
                  "h-0.5 flex-1 mx-2",
                  booking.worker ? "bg-emerald-500" : "bg-border"
                )}
              />

              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                    booking.worker
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {booking.worker ? "✓" : "2"}
                </div>
                <span className="text-muted-foreground">Assigned</span>
              </div>

              <div
                className={cn(
                  "h-0.5 flex-1 mx-2",
                  booking.startedAt ? "bg-emerald-500" : "bg-border"
                )}
              />

              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                    booking.startedAt
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {booking.startedAt ? "✓" : "3"}
                </div>
                <span className="text-muted-foreground">Started</span>
              </div>

              <div
                className={cn(
                  "h-0.5 flex-1 mx-2",
                  booking.status === "COMPLETED" ? "bg-emerald-500" : "bg-border"
                )}
              />

              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                    booking.status === "COMPLETED"
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {booking.status === "COMPLETED" ? "✓" : "4"}
                </div>
                <span className="text-muted-foreground">Finished</span>
              </div>
            </div>
          </div>

          {/* Worker Card */}
          {booking.worker ? (
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Assigned Gig Worker
                </span>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {booking.worker.userId?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.worker.userId?.phone} • {booking.worker.totalJobsCompleted} jobs completed
                </p>
              </div>

              {booking.worker.userId?.phone && (
                <a
                  href={`tel:${booking.worker.userId.phone}`}
                  className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:opacity-90 transition cursor-pointer shadow-xs"
                  title="Call Worker"
                >
                  <Phone className="size-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
              Awaiting worker acceptance. You will receive real-time notification once a certified trade worker accepts your request.
            </div>
          )}

          {/* Service Address */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <h4 className="font-semibold text-foreground">Service Location</h4>
            <p className="text-muted-foreground">
              {booking.address?.street}
              {booking.address?.city ? `, ${booking.address.city}` : ""}
            </p>
          </div>

          {/* Instructions */}
          {booking.customerNotes && (
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <h4 className="font-semibold text-foreground">Special Instructions</h4>
              <p className="italic text-foreground">"{booking.customerNotes}"</p>
            </div>
          )}

          {/* Cost Breakdown & Receipt */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5">
            <h4 className="font-semibold text-foreground">Pricing & Bill</h4>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate:</span>
              <span className="font-medium text-foreground">
                ₹{booking.rate} / {booking.priceType === "hourly" ? "hr" : "meter"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Units ({booking.priceType}):
              </span>
              <span className="font-medium text-foreground">{booking.units}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border/50">
              <span className="font-bold text-foreground">Total Bill:</span>
              <span className="font-extrabold text-foreground text-sm">
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-border/80">
          <Link to={`/bookings/${booking._id}`} onClick={() => onOpenChange(false)}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl h-9 text-xs cursor-pointer gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              <span>Full Details Page</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              Close
            </Button>

            {canCancel && onCancelBooking && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onCancelBooking(booking);
                }}
                className="rounded-xl h-9 px-4 text-xs font-semibold"
              >
                Cancel Booking
              </Button>
            )}

            {needsPayment && onPayBooking && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onPayBooking(booking);
                }}
                className="rounded-xl h-9 px-4 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
              >
                <CreditCard className="size-3.5" />
                <span>Pay ₹{booking.totalAmount}</span>
              </Button>
            )}

            {canRate && onRateBooking && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onRateBooking(booking);
                }}
                className="rounded-xl h-9 px-4 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Star className="size-3.5 fill-white mr-1" />
                Rate Worker
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
