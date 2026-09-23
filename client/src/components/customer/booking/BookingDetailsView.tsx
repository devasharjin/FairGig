import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  MapPin,
  FileText,
  Copy,
  Check,
  Star,
  Sparkles,
  ExternalLink,
  Shield,
  HelpCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CustomerBooking } from "@/features/customer/bookings/types";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingRatingStars } from "./BookingRatingStars";
import { BookingTimelineStepper } from "./BookingTimelineStepper";
import { BookingWorkerCard } from "./BookingWorkerCard";
import { BookingReceiptCard } from "./BookingReceiptCard";

export interface BookingDetailsViewProps {
  booking: CustomerBooking;
  onCancel?: () => void;
  onRate?: () => void;
  onPay?: () => void;
  className?: string;
}

export const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({
  booking,
  onCancel,
  onRate,
  onPay,
  className,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const canCancel =
    booking.status === "PENDING" ||
    booking.status === "CONFIRMED" ||
    booking.status === "ASSIGNED";

  const isCompleted = booking.status === "COMPLETED";
  const isPaid = booking.paymentStatus === "PAID";
  const needsPayment = isCompleted && !isPaid;
  // Ratings and reviews are unlocked only after booking is completed and payment is settled
  const canRate = isCompleted && isPaid && !booking.isRated;

  const handleCopyBookingNumber = () => {
    navigator.clipboard.writeText(booking.bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const localizedTradeName = booking.service?.name
    ? t(`services.trades.${booking.service.name.toLowerCase().replace(/\s+/g, "_")}`, {
        defaultValue: booking.service.name,
      })
    : t("bookingDetails.gigServiceRequest");

  let formattedDate = t("bookingDetails.immediateDispatch");
  try {
    if (booking.scheduledDate) {
      formattedDate = new Date(booking.scheduledDate).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {
    formattedDate = booking.scheduledDate;
  }

  const mapAddress = encodeURIComponent(
    [
      booking.address?.street,
      booking.address?.city,
      booking.address?.state,
      booking.address?.pincode,
    ]
      .filter(Boolean)
      .join(", ")
  );

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto pb-16", className)}>
      {/* 1. Header & Quick Actions */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
                #{booking.bookingNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyBookingNumber}
                className="text-muted-foreground hover:text-foreground transition cursor-pointer p-1"
                title={t("bookingDetails.copyTooltip")}
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
              <BookingStatusBadge status={booking.status} />
              <Badge variant="secondary" className="rounded-lg text-xs font-semibold">
                {booking.category?.name || t("bookingDetails.tradeService")}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {localizedTradeName}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {canCancel && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="rounded-xl h-10 px-4 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer border-destructive/30"
              >
                {t("bookingDetails.cancelBooking")}
              </Button>
            )}

            {needsPayment && onPay && (
              <Button
                size="sm"
                onClick={onPay}
                className="rounded-xl h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CreditCard className="size-4" />
                <span>{t("bookingDetails.payWithRazorpay", { amount: booking.totalAmount })}</span>
              </Button>
            )}

            {canRate && onRate && (
              <Button
                size="sm"
                onClick={onRate}
                className="rounded-xl h-10 px-4 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Star className="size-4 fill-white" />
                <span>{t("bookingDetails.rateAndReviewWorker")}</span>
              </Button>
            )}

            <Link to="/services">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-10 px-4 text-xs font-semibold cursor-pointer gap-1.5"
              >
                <Sparkles className="size-3.5" />
                <span>{t("bookingDetails.bookAnotherService")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dispatch Timeline Stepper */}
      <BookingTimelineStepper booking={booking} />

      {/* 3. Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Worker, Service Specs & Location */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assigned Worker Card */}
          <BookingWorkerCard
            worker={booking.worker}
            status={booking.status}
          />

          {/* Service Specifications Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {t("bookingDetails.serviceDetailsSchedule")}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-start gap-3">
                <Clock className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block text-sm">
                    {t("bookingDetails.scheduledAppointment")}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {booking.service?.description && (
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                  <span className="font-semibold text-foreground block text-xs">
                    {t("bookingDetails.aboutTheService")}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {booking.service.description}
                  </p>
                </div>
              )}

              {booking.customerNotes && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                    <FileText className="size-3.5" />
                    <span>{t("bookingDetails.customerInstructions")}</span>
                  </div>
                  <p className="italic text-foreground">
                    "{booking.customerNotes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Service Location Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  {t("bookingDetails.serviceAddress")}
                </h3>
              </div>

              {mapAddress && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  <span>{t("bookingDetails.openInMaps")}</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1 text-xs">
              <p className="font-bold text-foreground text-sm">
                {booking.address?.street || t("bookingDetails.addressProvidedAtBooking")}
              </p>
              <p className="text-muted-foreground">
                {[
                  booking.address?.city,
                  booking.address?.state,
                  booking.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {booking.address?.landmark && (
                <p className="text-xs text-muted-foreground pt-1">
                  <strong>{t("bookingDetails.landmark")}</strong> {booking.address.landmark}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice, Rating & Support */}
        <div className="lg:col-span-5 space-y-6">
          {/* Invoice / Pricing Breakdown */}
          <BookingReceiptCard booking={booking} onPay={onPay} />

          {/* Payment CTA Card (if completed but unpaid) */}
          {needsPayment && onPay && (
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CreditCard className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold">{t("bookingDetails.serviceCompletedPaymentDue")}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("bookingDetails.paymentDueNotice", { amount: booking.totalAmount })}
              </p>
              <Button
                size="sm"
                onClick={onPay}
                className="w-full rounded-xl h-10 text-xs font-bold gap-2 cursor-pointer shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CreditCard className="size-3.5" />
                <span>{t("bookingDetails.payWithRazorpayBtn", { amount: booking.totalAmount })}</span>
              </Button>
            </div>
          )}

          {/* Customer Rating Card (if rated) */}
          {booking.isRated && booking.rating && (
            <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  {t("bookingDetails.workerRatingFeedback")}
                </h3>
                <BookingRatingStars rating={booking.rating.rating} size="md" />
              </div>

              {booking.rating.review && (
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-xs italic text-foreground leading-relaxed">
                  "{booking.rating.review}"
                </div>
              )}

              {booking.rating.createdAt && (
                <p className="text-[11px] text-muted-foreground">
                  {t("bookingDetails.submittedOn", {
                    date: new Date(booking.rating.createdAt).toLocaleDateString(),
                  })}
                </p>
              )}
            </div>
          )}

          {/* Rate CTA Card (if completed but not rated) */}
          {canRate && onRate && (
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Star className="size-4 fill-amber-500" />
                <h3 className="text-sm font-bold">{t("bookingDetails.rateExperience")}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("bookingDetails.rateExperienceDesc")}
              </p>
              <Button
                size="sm"
                onClick={onRate}
                className="w-full rounded-xl h-10 text-xs font-semibold gap-2 cursor-pointer shadow-xs bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Star className="size-3.5 fill-white" />
                <span>{t("bookingDetails.submitRatingBtn")}</span>
              </Button>
            </div>
          )}

          {/* Help & Cooperative Mediation */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                {t("bookingDetails.needHelp")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("bookingDetails.needHelpDesc")}
            </p>
            <div className="pt-1 flex items-center justify-between text-xs font-semibold text-primary">
              <div className="flex items-center gap-1.5">
                <Shield className="size-3.5" />
                <span>{t("bookingDetails.satisfactionGuarantee")}</span>
              </div>
              <Link to="/contact" className="hover:underline">
                {t("bookingDetails.contactSupport")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;
