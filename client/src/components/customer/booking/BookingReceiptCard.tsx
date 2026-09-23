import React from "react";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Truck,
  User,
  Calendar,
  Hourglass,
  Info,
} from "lucide-react";
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
  const { t, i18n } = useTranslation();
  const isCompleted = booking.status === "COMPLETED";
  const isPaid = booking.paymentStatus === "PAID";
  const pricing = booking.pricing;

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] font-semibold"
          >
            <CheckCircle2 className="size-3 text-emerald-500" />
            {t("bookingDetails.receiptCard.paidSettled")}
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 text-[11px] font-semibold"
          >
            <AlertCircle className="size-3 text-rose-500" />
            {t("bookingDetails.receiptCard.paymentFailed")}
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 gap-1 text-[11px] font-semibold"
          >
            {t("bookingDetails.receiptCard.refunded")}
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px] font-semibold"
          >
            
          </Badge>
        );
    }
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return t("bookingDetails.receiptCard.pending");
    try {
      return new Date(dateStr).toLocaleString(i18n.language || "en-IN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const firstHourRate =
    pricing?.firstHourRate ??
    booking.service?.firstHourRate ??
    booking.service?.hourlyPrice ??
    booking.rate ??
    0;

  const additionalHourRate =
    pricing?.additionalHourRate ??
    booking.service?.additionalHourRate ??
    firstHourRate;

  const transportFee = pricing?.transportFee ?? booking.service?.transportFee ?? 30;

  const billableHours = pricing?.billableHours ?? (isCompleted ? Math.max(1, Math.round(booking.units || 1)) : 1);
  const actualDurationMinutes = pricing?.actualDurationMinutes ?? 0;

  const firstHourCharge = pricing?.firstHourCharge ?? firstHourRate;
  const additionalHoursCharge =
    pricing?.additionalHoursCharge ?? Math.max(0, (billableHours - 1) * additionalHourRate);
  const serviceAmount = pricing?.serviceAmount ?? (firstHourCharge + additionalHoursCharge);

  const serviceName = booking.service?.name
    ? t("services.trades." + booking.service.name.toLowerCase().replace(/\s+/g, "_"), { defaultValue: booking.service.name })
    : t("bookingDetails.receiptCard.standardGigService");

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            {isCompleted ? t("bookingDetails.receiptCard.finalSettledInvoice") : t("bookingDetails.receiptCard.estimatedPricingBreakdown")}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-extrabold uppercase px-2 py-0.5",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isCompleted ? t("bookingDetails.receiptCard.finalInvoice") : t("bookingDetails.receiptCard.estimatedAmount")}
          </Badge>
          {getPaymentBadge(booking.paymentStatus)}
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {/* Service Name */}
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-muted-foreground">{t("bookingDetails.receiptCard.tradeService")}</span>
          <span className="font-semibold text-foreground text-right">
            {serviceName}
          </span>
        </div>

        {/* Worker Details (if assigned) */}
        {booking.worker?.userId?.name && (
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="size-3 text-primary" /> {t("bookingDetails.receiptCard.assignedWorker")}
            </span>
            <span className="font-semibold text-foreground">
              {booking.worker.userId.name}
            </span>
          </div>
        )}

        {/* Timestamps and Duration (for Completed Jobs) */}
        {isCompleted && (
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3 text-primary" /> {t("bookingDetails.receiptCard.workStartTime")}
              </span>
              <span className="font-medium text-foreground">
                {formatTimestamp(booking.startedAt)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="size-3 text-emerald-500" /> {t("bookingDetails.receiptCard.workCompletion")}
              </span>
              <span className="font-medium text-foreground">
                {formatTimestamp(booking.completedAt)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-border/40">
              <span className="text-muted-foreground flex items-center gap-1">
                <Hourglass className="size-3 text-primary" /> {t("bookingDetails.receiptCard.actualWorkingDuration")}
              </span>
              <span className="font-bold text-foreground">
                {actualDurationMinutes} {t("bookingDetails.receiptCard.mins")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("bookingDetails.receiptCard.roundedBillableHours")}</span>
              <span className="font-extrabold text-primary">
                {t("bookingDetails.receiptCard.hoursCeilingRule", { count: billableHours })}
              </span>
            </div>
          </div>
        )}

        {/* Charges Breakdown */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">{t("bookingDetails.receiptCard.firstHourCharge")}</span>
            <span className="font-semibold text-foreground">₹{firstHourCharge}</span>
          </div>

          {billableHours > 1 && (
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">
                {t("bookingDetails.receiptCard.additionalHoursCharge", { hours: billableHours - 1, rate: additionalHourRate })}
              </span>
              <span className="font-semibold text-foreground">₹{additionalHoursCharge}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-1 font-medium">
            <span className="text-foreground">{t("bookingDetails.receiptCard.totalServiceAmount")}</span>
            <span className="text-foreground font-bold">₹{serviceAmount}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Truck className="size-3.5 text-primary" /> {t("bookingDetails.receiptCard.fixedTransportFee")}
            </span>
            <span className="font-semibold text-foreground">₹{transportFee}</span>
          </div>

          <div className="flex justify-between items-center py-1 text-[11px] text-muted-foreground">
            <span>{t("bookingDetails.receiptCard.cooperativeAllocations")}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {t("bookingDetails.receiptCard.includedInService")}
            </span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-foreground block">
              {isCompleted ? t("bookingDetails.receiptCard.finalPayableAmount") : t("bookingDetails.receiptCard.estimatedInitialTotal")}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {isCompleted
                ? t("bookingDetails.receiptCard.finalBilledTotal")
                : t("bookingDetails.receiptCard.initialEstimate")}
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-primary tracking-tight">
            ₹{booking.totalAmount}
          </span>
        </div>

        {/* Razorpay Action Button */}
        {isCompleted && !isPaid && onPay && (
          <div className="pt-2">
            <Button
              type="button"
              onClick={onPay}
              className="w-full rounded-xl h-11 text-xs font-bold gap-2 cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CreditCard className="size-4" />
              <span>{t("bookingDetails.receiptCard.payFinalBill", { amount: booking.totalAmount })}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Info notice */}
      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          {isCompleted ? (
            <span>
              <strong>{t("bookingDetails.receiptCard.finalInvoice")}:</strong> {t("bookingDetails.receiptCard.finalSettledNotice")}
            </span>
          ) : (
            <span>
              <strong>{t("bookingDetails.receiptCard.estimatedAmount")}:</strong> {t("bookingDetails.receiptCard.estimatedNotice")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingReceiptCard;
