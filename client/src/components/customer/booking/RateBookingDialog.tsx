import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star, CreditCard } from "lucide-react";
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
import { getLocalizedStarLabel } from "./BookingRatingStars";

export interface RateBookingDialogProps {
  booking: CustomerBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRating: (
    bookingId: string,
    rating: number,
    review: string
  ) => Promise<void> | void;
  onRequestPay?: (booking: CustomerBooking) => void;
  isPending?: boolean;
}

export const RateBookingDialog: React.FC<RateBookingDialogProps> = ({
  booking,
  open,
  onOpenChange,
  onSubmitRating,
  onRequestPay,
  isPending = false,
}) => {
  const { t } = useTranslation();
  const [selectedStars, setSelectedStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedStars(5);
      setHoveredStars(null);
      setReviewText("");
    }
  }, [open, booking]);

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    await onSubmitRating(booking._id, selectedStars, reviewText.trim());
  };

  const activeScore = hoveredStars ?? selectedStars;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="size-5 fill-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {t("bookings.rateDialogTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("bookings.rateDialogSubtitle", {
                  name: booking.worker?.userId?.name || t("bookings.status.workerAssigned"),
                })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {booking.paymentStatus !== "PAID" ? (
          <div className="py-4 space-y-4 text-center">
            <div className="size-14 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <CreditCard className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {t("bookings.payRequiredTitle")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {t("bookings.payRequiredDesc", { amount: booking.totalAmount })}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-10 px-4 text-xs cursor-pointer"
              >
                {t("common.close")}
              </Button>

              {onRequestPay && (
                <Button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onRequestPay(booking);
                  }}
                  className="rounded-xl h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CreditCard className="size-3.5" />
                  <span>{t("bookings.payWithRazorpay", { amount: booking.totalAmount })}</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Interactive Stars Selector */}
            <div className="flex flex-col items-center justify-center py-3 bg-muted/30 rounded-2xl border border-border/50 space-y-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled =
                    hoveredStars !== null
                      ? star <= hoveredStars
                      : star <= selectedStars;

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStars(star)}
                      onMouseLeave={() => setHoveredStars(null)}
                      onClick={() => setSelectedStars(star)}
                      className="p-1 text-amber-400 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "size-7 transition-colors",
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30 fill-transparent"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-foreground">
                {getLocalizedStarLabel(activeScore, t)} ({activeScore} / 5)
              </span>
            </div>

            {/* Review Comment Textarea */}
            <div className="space-y-1.5">
              <label
                htmlFor="review-comment"
                className="text-xs font-semibold text-foreground"
              >
                {t("bookings.writtenReviewLabel")}
              </label>
              <textarea
                id="review-comment"
                rows={3}
                placeholder={t("bookings.writtenReviewPlaceholder")}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-input bg-input/20 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="h-10 px-4 rounded-xl text-xs sm:text-sm cursor-pointer"
              >
                {t("bookings.skipLater")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-sm bg-primary text-primary-foreground"
              >
                {isPending ? t("bookings.submittingRating") : t("bookings.submitRating")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RateBookingDialog;
