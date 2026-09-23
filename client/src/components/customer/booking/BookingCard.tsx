import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  MapPin,
  Star,
  Phone,
  FileText,
  Clock,
  CreditCard,
  AlertTriangle,
  Zap,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CustomerBooking } from "@/features/customer/bookings/types";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingRatingStars } from "./BookingRatingStars";

export interface BookingCardProps {
  booking: CustomerBooking;
  onViewDetails?: (booking: CustomerBooking) => void;
  onCancel: (booking: CustomerBooking) => void;
  onRate: (booking: CustomerBooking) => void;
  onPay?: (booking: CustomerBooking) => void;
  className?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onCancel,
  onRate,
  onPay,
  className,
}) => {
  const { t } = useTranslation();

  const isPendingOrConfirmed =
    booking.status === "PENDING" ||
    booking.status === "CONFIRMED" ||
    booking.status === "ASSIGNED";

  const isCompleted = booking.status === "COMPLETED";
  const isPaid = booking.paymentStatus === "PAID";
  const needsPayment = isCompleted && !isPaid;
  // Ratings and reviews are unlocked only after the booking is completed and paid
  const canRate = isCompleted && isPaid && !booking.isRated;

  let formattedDate = t("bookings.immediateDispatch");
  try {
    if (booking.scheduledDate) {
      formattedDate = new Date(booking.scheduledDate).toLocaleString("en-US", {
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

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:border-accent/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4",
        className
      )}
    >
      {/* Header: Service Name, Booking Number & Status Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase">
              {booking.bookingNumber}
            </span>
            <Link
              to={`/bookings/${booking._id}`}
              className="hover:text-primary transition-colors block"
            >
              <h2 className="text-base sm:text-lg font-bold text-foreground mt-0.5 hover:text-primary transition-colors">
                {booking.service?.name
                  ? t(`services.trades.${booking.service.name.toLowerCase().replace(/\s+/g, "_")}`, { defaultValue: booking.service.name })
                  : t("bookings.serviceDefault")}
              </h2>
            </Link>
          </div>

          <div className="shrink-0">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        {/* Pricing and Schedule Tag */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          

          {booking.isEmergency && (
            <Badge
              variant="destructive"
              className="rounded-lg text-[10px] font-black uppercase tracking-wider py-0.5 px-2 gap-1 animate-pulse"
            >
              <AlertTriangle className="size-3" />
              <span>🚨 {t("bookingDialog.emergency")}</span>
            </Badge>
          )}

          {(booking.bookingType === "PREMIUM" || booking.bookingType === "ON_DEMAND") && !booking.isEmergency && (
            <Badge
              variant="outline"
              className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 rounded-lg text-[10px] font-bold py-0.5 px-2 gap-1"
            >
              <Crown className="size-3 text-amber-500" />
              <span>⭐ {t("bookingDialog.premium")}</span>
            </Badge>
          )}

          {isCompleted && (
            <Badge
              variant="outline"
              className={cn(
                "rounded-lg text-[11px] font-semibold py-0.5 px-2",
                isPaid
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              )}
            >
              {isPaid ? `✓ ${t("bookingDetails.paidSettled")}` : t("bookingDetails.paymentDue")}
            </Badge>
          )}

          <div className="flex items-baseline gap-1 text-xs text-foreground font-semibold bg-muted/50 px-2.5 py-1 rounded-lg border border-border/50">
            <span>{t("services.benchmarkRate")}:</span>
            <span className="text-primary font-bold">₹{booking.rate}</span>
            <span className="text-muted-foreground font-normal">
              /{booking.priceType === "hourly" ? "hr" : "meter"}
            </span>
            <span className="text-muted-foreground font-normal mx-1">•</span>
            <span>{t("bookingDetails.total", { defaultValue: "Total" })}:</span>
            <span className="text-foreground font-bold">₹{booking.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 space-y-2.5 text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <Calendar className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">{t("bookingDialog.scheduled")}:</span>{" "}
            {formattedDate}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">{t("bookingDialog.deliveryAddress")}:</span>{" "}
            {booking.address?.street || "Address provided at booking"}
            {booking.address?.city ? `, ${booking.address.city}` : ""}
          </div>
        </div>

        {booking.customerNotes && (
          <div className="flex items-start gap-2">
            <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="italic text-muted-foreground line-clamp-2">
              "{booking.customerNotes}"
            </div>
          </div>
        )}
      </div>

      {/* Assigned Worker Card or Dispatch Status */}
      {booking.worker ? (
        <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
              {booking.worker.userId?.name?.charAt(0).toUpperCase() || "W"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  {booking.worker.userId?.name || t("bookings.status.workerAssigned")}
                </p>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded-md">
                  <Star className="size-3 fill-amber-500" />
                  {booking.worker.rating > 0
                    ? booking.worker.rating.toFixed(1)
                    : t("common.new", { defaultValue: "New" })}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("bookingDetails.verifiedWorkerJobs", {
                  count: booking.worker.totalJobsCompleted,
                  defaultValue: `Verified Cooperative Worker • ${booking.worker.totalJobsCompleted} jobs completed`,
                })}
              </p>
            </div>
          </div>

          {booking.worker.userId?.phone && (
            <a
              href={`tel:${booking.worker.userId.phone}`}
              className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:opacity-90 transition cursor-pointer shadow-xs"
              title={`Call worker: ${booking.worker.userId.phone}`}
            >
              <Phone className="size-4" />
            </a>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <Clock className="size-4 text-amber-500 shrink-0" />
          <span>
            {t("bookingDetails.broadcastNotice", {
              defaultValue: "Dispatch broadcasted to available verified workers in your cooperative region.",
            })}
          </span>
        </div>
      )}

      {/* Rating Display if already rated */}
      {booking.isRated && booking.rating && (
        <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{t("bookingDetails.yourFeedback", { defaultValue: "Your Feedback" })}</span>
            <BookingRatingStars rating={booking.rating.rating} />
          </div>
          {booking.rating.review && (
            <p className="text-xs text-muted-foreground italic">
              "{booking.rating.review}"
            </p>
          )}
        </div>
      )}

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/50">
        <Link to={`/bookings/${booking._id}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(booking)}
            className="rounded-xl h-9 px-3 text-xs cursor-pointer"
          >
            {t("bookings.viewDetails")}
          </Button>
        </Link>

        {isPendingOrConfirmed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(booking)}
            className="rounded-xl h-9 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            {t("bookings.cancelBooking")}
          </Button>
        )}

        {needsPayment && onPay && (
          <Button
            size="sm"
            onClick={() => onPay(booking)}
            className="rounded-xl h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CreditCard className="size-3.5" />
            <span>{t("bookings.payNow")} ₹{booking.totalAmount}</span>
          </Button>
        )}

        {canRate && (
          <Button
            size="sm"
            onClick={() => onRate(booking)}
            className="rounded-xl h-9 px-4 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Star className="size-3.5 fill-white" />
            {t("bookings.rateWorker")}
          </Button>
        )}

        <Link to="/services">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-9 px-4 text-xs cursor-pointer"
          >
            {t("bookings.bookAgain", { defaultValue: "Book Again" })}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
