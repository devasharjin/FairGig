import React from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WorkerJob } from "@/features/worker/gigs/types";

// Helper: Format hour and minute
function formatTime(dateStr: string): string {
  if (!dateStr) return "--:--";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface ScheduleJobCardProps {
  job: WorkerJob;
}

export const ScheduleJobCard: React.FC<ScheduleJobCardProps> = ({ job }) => {
  const isCompleted = job.status === "COMPLETED";
  const isInProgress = job.status === "IN_PROGRESS";
  const isCancelled = job.status === "CANCELLED";
  const mapsQuery = encodeURIComponent(
    `${job.address?.street || ""}, ${job.address?.city || ""}, ${job.address?.state || ""}`
  );

  return (
    <div
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all shadow-xs ${
        isInProgress
          ? "border-blue-500/40 bg-blue-500/5 dark:bg-blue-500/10 shadow-blue-500/5"
          : isCompleted
          ? "border-border/60 bg-card/60 opacity-90"
          : isCancelled
          ? "border-rose-500/20 bg-rose-500/5 opacity-70"
          : "border-border/80 bg-card hover:border-primary/40 hover:shadow-md"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left Column: Time & Job Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-md">
              <Clock className="size-3.5 text-primary" />
              {formatTime(job.scheduledDate)}
            </span>

            {isInProgress && (
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold gap-1"
              >
                <PlayCircle className="size-3 animate-pulse" />
                In Progress
              </Badge>
            )}

            {isCompleted && (
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold gap-1"
              >
                <CheckCircle2 className="size-3" />
                Completed
              </Badge>
            )}

            {job.status === "CONFIRMED" && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 text-[10px] font-semibold"
              >
                Confirmed
              </Badge>
            )}

            {isCancelled && (
              <Badge
                variant="outline"
                className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-[10px] font-semibold"
              >
                Cancelled
              </Badge>
            )}

            {job.category?.name && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium text-muted-foreground"
              >
                {job.category.name}
              </Badge>
            )}
          </div>

          <h3 className="text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {job.service?.name}
          </h3>

          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-y-1 gap-x-3">
            <span className="font-medium text-foreground">
              {job.customer?.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span className="truncate max-w-xs sm:max-w-md">
                {job.address?.street}
                {job.address?.city ? `, ${job.address.city}` : ""}
              </span>
            </span>
          </div>

          {job.customerNotes && (
            <p className="text-[11px] text-muted-foreground/90 italic bg-muted/40 px-2.5 py-1.5 rounded-md border border-border/40 mt-1 max-w-xl">
              "{job.customerNotes}"
            </p>
          )}
        </div>

        {/* Right Column: Earnings & Quick Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
          <div className="sm:text-right">
            <div className="text-lg font-extrabold text-foreground">
              ₹{job.totalAmount}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {job.priceType === "hourly"
                ? `₹${job.rate}/hr • ${job.units || 1} hrs`
                : `₹${job.rate}/m • ${job.units || 1} m`}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {job.customer?.phone && (
              <a
                href={`tel:${job.customer.phone}`}
                title={`Call ${job.customer.name}`}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer border border-border/70"
              >
                <Phone className="size-3.5 text-primary" />
              </a>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noreferrer"
              title="Get Directions"
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer border border-border/70"
            >
              <Navigation className="size-3.5 text-blue-500" />
            </a>

            <Link to="/worker/bookings">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2.5 text-xs font-semibold rounded-lg gap-1"
              >
                <span>Manage</span>
                <ExternalLink className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleJobCard;
