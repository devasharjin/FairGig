import React from "react";
import { Receipt, CheckCircle2, Clock, AlertCircle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerBooking, PaymentStatus } from "@/features/customer/bookings/types";

export interface BookingReceiptCardProps {
  booking: CustomerBooking;
  onPay?: () => void;
  className?: string;
}

export const BookingReceiptCard: React.FC<BookingReceiptCardProps> = ({
  booking,
  onPay,
  className,
}) => {
  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] font-semibold"
          >
            <CheckCircle2 className="size-3 text-emerald-500" />
            Paid & Settled
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 text-[11px] font-semibold"
          >
            <AlertCircle className="size-3 text-rose-500" />
            Payment Failed
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 gap-1 text-[11px] font-semibold"
          >
            Refunded
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px] font-semibold"
          >
            <Clock className="size-3 text-amber-500" />
            Payment Upon Completion
          </Badge>
        );
    }
  };

  const unitLabel = booking.priceType === "hourly" ? "hr" : "meter";
  const unitPlural = booking.priceType === "hourly" ? "hours" : "meters";

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Pricing & Invoice Breakdown
          </h3>
        </div>
        {getPaymentBadge(booking.paymentStatus)}
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-muted-foreground">Trade Service</span>
          <span className="font-semibold text-foreground text-right">
            {booking.service?.name || "Standard Gig Service"}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Standard Rate</span>
          <span className="font-semibold text-foreground">
            ₹{booking.rate} / {unitLabel}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Estimated Work Units</span>
          <span className="font-semibold text-foreground">
            {booking.units} {unitPlural}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Cooperative Platform Safety Fee</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Free (Subsidized)
          </span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-foreground block">
              Total Amount
            </span>
            <span className="text-[11px] text-muted-foreground">
              Inclusive of applicable trade fees
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-primary tracking-tight">
            ₹{booking.totalAmount}
          </span>
        </div>

        {booking.status === "COMPLETED" && booking.paymentStatus !== "PAID" && onPay && (
          <div className="pt-2">
            <Button
              type="button"
              onClick={onPay}
              className="w-full rounded-xl h-10 text-xs font-bold gap-2 cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CreditCard className="size-3.5" />
              <span>Pay ₹{booking.totalAmount} with Razorpay</span>
            </Button>
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
        <strong>Billing Protection:</strong> The final invoice is confirmed upon service completion. If additional work is needed, adjustments are agreed upon through the cooperative platform.
      </div>
    </div>
  );
};

export default BookingReceiptCard;
