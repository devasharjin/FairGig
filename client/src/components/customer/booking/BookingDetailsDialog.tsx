import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Star, ExternalLink, CreditCard, AlertTriangle, Zap, ShieldAlert, PhoneCall, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const { t } = useTranslation();

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
            {booking.service?.name
              ? t(`services.trades.${booking.service.name.toLowerCase().replace(/\s+/g, "_")}`, { defaultValue: booking.service.name })
              : t("bookings.serviceDefault")}
          </DialogTitle>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {booking.isEmergency && (
              <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-wider py-0.5 px-2 animate-pulse">
                🚨 {t("bookingDialog.emergency")}
              </Badge>
            )}
            {(booking.bookingType === "PREMIUM" || booking.bookingType === "ON_DEMAND") && !booking.isEmergency && (
              <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold py-0.5 px-2">
                ⭐ {t("bookingDialog.premium")}
              </Badge>
            )}
            <DialogDescription className="text-xs text-muted-foreground">
              {t("nav.cooperativePlatform")}: {booking.category?.name || t("bookings.serviceDefault")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          {/* Emergency SOS High Priority Card */}
          {booking.isEmergency && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-rose-950 dark:text-rose-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="size-4 animate-bounce shrink-0" />
                  <span>{t("home.emergency.title")}</span>
                </div>
                <Badge variant="outline" className="bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 text-[10px] font-black">
                  {booking.urgencyLevel || "CRITICAL"}
                </Badge>
              </div>

              {booking.emergencyDetails?.hazardType && (
                <div className="text-xs">
                  <span className="opacity-80">{t("bookingDialog.hazardDesc")}: </span>
                  <strong className="text-foreground">{booking.emergencyDetails.hazardType}</strong>
                </div>
              )}

              {booking.emergencyDetails?.immediateContact && (
                <div className="text-xs flex items-center gap-1.5">
                  <Phone className="size-3 text-rose-500" />
                  <span className="opacity-80">{t("bookingDialog.emergencyContactLabel")}: </span>
                  <strong className="text-foreground">{booking.emergencyDetails.immediateContact}</strong>
                </div>
              )}

              <p className="text-[11px] opacity-90 leading-relaxed pt-1 border-t border-rose-500/20">
                {booking.worker
                  ? `✓ ${t("bookingDetails.workerTitle")} ${t("bookingDetails.workerEnRoute")}.`
                  : t("bookingDetails.unassignedWorker")}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] opacity-80">{t("home.emergency.badge")}</span>
                <a
                  href="tel:1800123456"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <PhoneCall className="size-3" />
                  <span>{t("home.emergency.hotline")}</span>
                </a>
              </div>
            </div>
          )}

          {/* Visual Progress Stepper */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
            <h4 className="font-semibold text-foreground">{t("bookingDetails.timelineTitle")}</h4>
            <div className="flex items-center justify-between text-[11px] pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span className="text-muted-foreground">{t("bookingDetails.requestedStep")}</span>
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
                <span className="text-muted-foreground">{t("bookingDetails.assignedStep")}</span>
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
                <span className="text-muted-foreground">{t("bookingDetails.startedStep")}</span>
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
                <span className="text-muted-foreground">{t("bookingDetails.completedStep")}</span>
              </div>
            </div>
          </div>

          {/* Worker Card */}
          {booking.worker ? (
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {t("bookingDetails.workerTitle")}
                </span>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {booking.worker.userId?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.worker.userId?.phone} • {t("bookingDetails.verifiedWorkerJobs", {
                    count: booking.worker.totalJobsCompleted,
                    defaultValue: `${booking.worker.totalJobsCompleted} jobs completed`,
                  })}
                </p>
              </div>

              {booking.worker.userId?.phone && (
                <a
                  href={`tel:${booking.worker.userId.phone}`}
                  className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:opacity-90 transition cursor-pointer shadow-xs"
                  title={t("bookingDetails.callWorker")}
                >
                  <Phone className="size-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
              {t("bookingDetails.unassignedWorker")}
            </div>
          )}

          {/* Service Address */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <h4 className="font-semibold text-foreground">{t("bookingDialog.deliveryAddress")}</h4>
            <p className="text-muted-foreground">
              {booking.address?.street}
              {booking.address?.city ? `, ${booking.address.city}` : ""}
            </p>
          </div>

          {/* Instructions */}
          {booking.customerNotes && (
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <h4 className="font-semibold text-foreground">{t("bookingDialog.accessNotes")}</h4>
              <p className="italic text-foreground">"{booking.customerNotes}"</p>
            </div>
          )}

          {/* Cost Breakdown & Receipt */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-foreground">{t("bookingDetails.receiptTitle")}</h4>
              <Badge variant="outline" className="text-[10px] py-0 px-2 font-bold">
                {isCompleted ? t("bookingDetails.paidSettled") : t("services.benchmarkRate")}
              </Badge>
            </div>

            {isCompleted && booking.pricing?.actualDurationMinutes !== undefined && (
              <div className="flex justify-between text-muted-foreground">
                <span>Working Duration:</span>
                <span className="font-medium text-foreground">
                  {booking.pricing.actualDurationMinutes} mins ({booking.pricing.billableHours} billable hrs)
                </span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>{t("bookingDetails.firstHourRate")}:</span>
              <span className="font-medium text-foreground">
                ₹{booking.pricing?.firstHourRate ?? booking.rate}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>{t("services.additionalHour")}:</span>
              <span className="font-medium text-foreground">
                ₹{booking.pricing?.additionalHourRate ?? booking.rate} / hr
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>{t("bookingDetails.transportFee")}:</span>
              <span className="font-medium text-foreground">
                ₹{booking.pricing?.transportFee ?? 30}
              </span>
            </div>

            <div className="flex justify-between pt-1 border-t border-border/50 items-baseline">
              <span className="font-bold text-foreground">
                {t("bookingDetails.totalPayable")}:
              </span>
              <span className="font-extrabold text-primary text-base">
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>

          {/* Worker Welfare & Insurance Guarantee Badge */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-foreground block">{t("profile.fairWageTitle")}</span>
                <span className="text-[11px] text-muted-foreground">{t("profile.fairWageDesc")}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0">
              Fair Trade
            </span>
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
              <span>{t("bookings.viewDetails")}</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              {t("common.close")}
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
                {t("bookings.cancelBooking")}
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
                <span>{t("bookings.payNow")} ₹{booking.totalAmount}</span>
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
                {t("bookings.rateWorker")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
