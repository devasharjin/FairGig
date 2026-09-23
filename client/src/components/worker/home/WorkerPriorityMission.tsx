import React from "react";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  Sparkles,
  Clock,
  MapPin,
  ArrowRight,
  Navigation,
  Car,
} from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { getGigDistanceInfo } from "@/features/worker/gigs/distance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkerPriorityMissionProps {
  activeJob?: WorkerJob;
  topAvailableGig?: WorkerJob;
}

export const WorkerPriorityMission: React.FC<WorkerPriorityMissionProps> = ({
  activeJob,
  topAvailableGig,
}) => {
  const topGigDistance = topAvailableGig ? getGigDistanceInfo(topAvailableGig) : null;
  const topGigPayoutTotal =
    topAvailableGig && topGigDistance
      ? (topAvailableGig.rate || 0) + topGigDistance.transportFee
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Current Priority
        </h2>
        <Link
          to="/worker/jobs"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All Gigs</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {activeJob ? (
        <div className="rounded-xl border border-blue-500/30 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold gap-1 rounded-md px-2 py-0.5"
              >
                <PlayCircle className="size-3 animate-pulse" />
                Active Fieldwork
              </Badge>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {activeJob.service?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Customer: {activeJob.customer?.name} • {activeJob.customer?.phone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-foreground">
                ₹{activeJob.totalAmount}
              </span>
              <p className="text-[10px] text-muted-foreground">Pay Rate</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-accent shrink-0" />
              <span>
                {activeJob.address?.street}
                {activeJob.address?.city ? `, ${activeJob.address.city}` : ""}
              </span>
            </div>
            {activeJob.customerNotes && (
              <p className="italic pl-5.5 text-foreground">
                "{activeJob.customerNotes}"
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Link to="/worker/bookings">
              <Button size="sm" className="rounded-lg h-9 px-4 text-xs font-semibold shadow-xs cursor-pointer">
                Manage Active Job
              </Button>
            </Link>
          </div>
        </div>
      ) : topAvailableGig ? (
        <div className="rounded-xl border border-amber-500/30 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold gap-1 rounded-md px-2 py-0.5"
                >
                  <Sparkles className="size-3" />
                  Gig Waiting For Pickup
                </Badge>
                {topGigDistance && (
                  <Badge
                    variant="outline"
                    className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 text-[10px] font-semibold gap-1 rounded-md px-2 py-0.5"
                  >
                    <Navigation className="size-3" />
                    <span>{topGigDistance.distanceDisplay} away</span>
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {topAvailableGig.service?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Location: {topAvailableGig.address?.street}
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                ₹{topAvailableGig.rate}
              </span>
              <p className="text-[10px] text-muted-foreground">
                /{topAvailableGig.priceType === "hourly" ? "hr" : "meter"}
              </p>
              {topGigDistance && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Est. ₹{topGigPayoutTotal}
                </p>
              )}
            </div>
          </div>

          {topGigDistance && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="size-3.5 text-accent shrink-0" />
                  <span className="truncate">
                    {topAvailableGig.address?.street}
                    {topAvailableGig.address?.city ? `, ${topAvailableGig.address.city}` : ""}
                  </span>
                </div>
                <span className="font-semibold text-sky-600 dark:text-sky-400 shrink-0 text-[11px] bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                  {topGigDistance.distanceDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/50 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Car className="size-3 text-sky-500" />
                  <span>Transport Fee (₹5/km):</span>
                </div>
                <span className="font-bold text-foreground">₹{topGigDistance.transportFee}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Link to="/worker/jobs">
              <Button
                size="sm"
                className="rounded-lg h-9 px-5 text-xs font-semibold shadow-xs bg-primary text-primary-foreground cursor-pointer"
              >
                Review & Accept Gig
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card p-8 text-center space-y-2">
          <Clock className="size-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-bold text-foreground">All caught up!</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No jobs currently ongoing. Stay online in your portal header to accept incoming dispatch requests.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkerPriorityMission;
