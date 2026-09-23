import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  FileText,
  Phone,
  Navigation,
  Star,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkerJob } from "@/features/worker/gigs/types";
import type { BookingStatus, PaymentStatus } from "@/features/customer/bookings/types";
import { Clock } from "lucide-react";

export const getPaymentStatusBadge = (status?: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold text-xs"
        >
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>Payment: Paid & Settled</span>
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold text-xs"
        >
          <AlertCircle className="size-3.5 text-rose-500" />
          <span>Payment: Failed</span>
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold text-xs"
        >
          <span>Payment: Refunded</span>
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold text-xs"
        >
          <Clock className="size-3.5 text-amber-500" />
          <span>Payment: Pending</span>
        </Badge>
      );
  }
};

export const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold"
        >
          <PlayCircle className="size-3.5 text-purple-500 animate-pulse" />
          <span>On-Site In Progress</span>
        </Badge>
      );
    case "CONFIRMED":
    case "ASSIGNED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold"
        >
          <CheckCircle2 className="size-3.5 text-blue-500" />
          <span>Assigned & Confirmed</span>
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold"
        >
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>Completed</span>
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold"
        >
          <AlertCircle className="size-3.5 text-rose-500" />
          <span>Cancelled</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground font-semibold">
          {status}
        </Badge>
      );
  }
};

interface BookingCardProps {
  job: WorkerJob;
  onSelect?: (job: WorkerJob) => void;
  onStartJob: (jobId: string) => void;
  onCompleteJob: (job: WorkerJob) => void;
  onCancelJob: (job: WorkerJob) => void;
  isUpdating: boolean;
  formatDate: (dateStr?: string) => string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  job,
  onSelect,
  onStartJob,
  onCompleteJob,
  onCancelJob,
  isUpdating,
  formatDate,
}) => {
  const isInProgress = job.status === "IN_PROGRESS";
  const isConfirmed = job.status === "CONFIRMED" || job.status === "ASSIGNED";

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${job.address?.street || ""} ${job.address?.city || ""}`
  )}`;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-xs hover:border-border transition-all flex flex-col justify-between space-y-4",
        isInProgress
          ? "border-accent/40 ring-1 ring-accent/20"
          : "border-border/80 hover:border-border"
      )}
    >
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase">
                {job.bookingNumber}
              </span>
              {job.isEmergency && (
                <Badge variant="destructive" className="rounded-md text-[10px] py-0 px-2 font-bold uppercase bg-rose-600 text-white animate-pulse">
                  🚨 Emergency SOS
                </Badge>
              )}
              {(job.bookingType === "PREMIUM" || job.bookingType === "ON_DEMAND") && !job.isEmergency && (
                <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 rounded-md text-[10px] py-0 px-2 font-semibold">
                  ⭐ Premium Specialist
                </Badge>
              )}
              <Badge variant="secondary" className="rounded-md text-[10px] py-0 px-2 font-medium">
                {job.category?.name || "Service"}
              </Badge>
            </div>

            <Link
              to={`/worker/bookings/${job._id}`}
              className="hover:text-accent transition-colors block"
            >
              <h2 className="text-base sm:text-lg font-bold text-foreground mt-1 hover:text-accent transition-colors">
                {job.service?.name}
              </h2>
            </Link>
          </div>

          <div className="shrink-0">{getStatusBadge(job.status)}</div>
        </div>

        {/* Customer Card */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
              {job.customer?.name?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {job.customer?.name || "Customer"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {job.customer?.phone || "No phone provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {job.customer?.phone && (
              <a
                href={`tel:${job.customer.phone}`}
                className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition cursor-pointer shadow-xs"
                title="Call Customer"
              >
                <Phone className="size-3.5" />
              </a>
            )}

            {job.address?.street && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground flex items-center justify-center transition cursor-pointer shadow-xs"
                title="Google Maps Navigation"
              >
                <Navigation className="size-3.5 text-accent" />
              </a>
            )}
          </div>
        </div>

        {/* Schedule & Address Block */}
        <div className="p-3 rounded-lg bg-card border border-border/60 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Calendar className="size-3.5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Appointment:</span>{" "}
              {formatDate(job.scheduledDate)}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="size-3.5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Address:</span>{" "}
              {job.address?.street}
              {job.address?.city ? `, ${job.address.city}` : ""}
            </div>
          </div>

          {job.customerNotes && (
            <div className="flex items-start gap-2 pt-1 border-t border-border/40">
              <FileText className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="italic text-foreground line-clamp-2">
                "{job.customerNotes}"
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Rate Breakdown */}
        <div className="flex flex-col gap-1.5 px-3 py-2 rounded-lg bg-muted/20 border border-border/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Rates:{" "}
              <strong className="text-foreground">
                1st hr: ₹{job.pricing?.firstHourRate ?? job.service?.firstHourRate ?? job.rate} • Addl: ₹{job.pricing?.additionalHourRate ?? job.service?.additionalHourRate ?? (job.pricing?.firstHourRate ?? job.rate)}/hr
              </strong>
            </span>
            <span className="text-muted-foreground">
              {job.status === "COMPLETED" ? "Net Payout: " : "Est. Payout: "}
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                ₹{job.pricing?.workerNetEarnings ?? job.totalAmount}
              </strong>
            </span>
          </div>
          {isInProgress && job.startedAt && (
            <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[11px] text-accent font-medium">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-accent animate-ping inline-block" />
                Work in progress on-site
              </span>
              <span>
                Started: {new Date(job.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
        </div>

        {/* Rating received if completed */}
        {job.isRated && job.rating && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Customer Review</span>
              <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                <Star className="size-3 fill-amber-500" />
                {job.rating.rating} / 5
              </span>
            </div>
            {job.rating.review && (
              <p className="text-muted-foreground italic line-clamp-2">
                "{job.rating.review}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Action Controls */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/60">
        <Link to={`/worker/bookings/${job._id}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect?.(job)}
            className="rounded-lg h-8 text-xs cursor-pointer shadow-xs"
          >
            View Details
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {isConfirmed && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancelJob(job)}
                className="rounded-lg h-8 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => onStartJob(job._id)}
                disabled={isUpdating}
                className="rounded-lg h-8 px-3.5 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <PlayCircle className="size-3.5" />
                Start Job
              </Button>
            </>
          )}

          {isInProgress && (
            <Button
              size="sm"
              onClick={() => onCompleteJob(job)}
              disabled={isUpdating}
              className="rounded-lg h-8 px-3.5 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="size-3.5" />
              Complete Job
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
