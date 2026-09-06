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
import type { BookingStatus } from "@/features/customer/bookings/types";

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
        "rounded-3xl border bg-card p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4",
        isInProgress
          ? "border-purple-500/50 ring-1 ring-purple-500/20 shadow-purple-500/5"
          : "border-border/80 hover:border-primary/40"
      )}
    >
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase">
                {job.bookingNumber}
              </span>
              <Badge variant="secondary" className="rounded-md text-[10px] py-0 px-2">
                {job.category?.name || "Service"}
              </Badge>
            </div>

            <Link
              to={`/worker/bookings/${job._id}`}
              className="hover:text-primary transition-colors block"
            >
              <h2 className="text-base sm:text-lg font-bold text-foreground mt-1 hover:text-primary transition-colors">
                {job.service?.name}
              </h2>
            </Link>
          </div>

          <div className="shrink-0">{getStatusBadge(job.status)}</div>
        </div>

        {/* Customer Card */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
              {job.customer?.name?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
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
                className="size-8.5 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition cursor-pointer shadow-xs"
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
                className="size-8.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground flex items-center justify-center transition cursor-pointer"
                title="Google Maps Navigation"
              >
                <Navigation className="size-3.5 text-primary" />
              </a>
            )}
          </div>
        </div>

        {/* Schedule & Address Block */}
        <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Calendar className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Appointment:</span>{" "}
              {formatDate(job.scheduledDate)}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Address:</span>{" "}
              {job.address?.street}
              {job.address?.city ? `, ${job.address.city}` : ""}
            </div>
          </div>

          {job.customerNotes && (
            <div className="flex items-start gap-2 pt-1 border-t border-border/40">
              <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="italic text-foreground line-clamp-2">
                "{job.customerNotes}"
              </div>
            </div>
          )}
        </div>

        {/* Pricing Pill */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-muted/20 border border-border/40 text-xs">
          <span className="text-muted-foreground">
            Rate:{" "}
            <strong className="text-foreground">
              ₹{job.rate}/{job.priceType === "hourly" ? "hr" : "meter"}
            </strong>
          </span>
          <span className="text-muted-foreground">
            Payout:{" "}
            <strong className="text-foreground text-sm font-black">
              ₹{job.totalAmount}
            </strong>
          </span>
        </div>

        {/* Rating received if completed */}
        {job.isRated && job.rating && (
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Customer Review</span>
              <span className="flex items-center gap-1 font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
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
            className="rounded-xl h-9 text-xs cursor-pointer"
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
                className="rounded-xl h-9 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => onStartJob(job._id)}
                disabled={isUpdating}
                className="rounded-xl h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer shadow-xs bg-purple-600 hover:bg-purple-700 text-white"
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
              className="rounded-xl h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
