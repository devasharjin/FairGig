import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomerBooking } from "@/features/customer/bookings/types";

export interface CancelBookingDialogProps {
  booking: CustomerBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmCancel: (bookingId: string, reason: string) => Promise<void> | void;
  isPending?: boolean;
}

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  booking,
  open,
  onOpenChange,
  onConfirmCancel,
  isPending = false,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  // Reset reason when dialog opens or booking changes
  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open, booking]);

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirmCancel(booking._id, reason.trim() || "Cancelled by customer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {t("bookings.cancelDialogTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("bookings.bookingNumber", { number: booking.bookingNumber })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label
              htmlFor="cancel-reason"
              className="text-xs font-semibold text-foreground"
            >
              {t("bookings.cancelReasonLabel")}
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              placeholder={t("bookings.cancelReasonPlaceholder")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
              {t("bookings.keepBooking")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
              className="h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
            >
              {isPending ? t("bookings.cancelling") : t("bookings.confirmCancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingDialog;

