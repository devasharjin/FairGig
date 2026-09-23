import React from "react";
import {
  MapPin,
  Clock,
  Check,
  ChevronRight,
  AlertTriangle,
  Zap,
  Crown,
  Star,
  Phone,
  Navigation,
  Car,
} from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { getGigDistanceInfo } from "@/features/worker/gigs/distance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GigCardProps {
  gig: WorkerJob;
  isAccepting: boolean;
  canAccept?: boolean;
  onInspect: (gig: WorkerJob) => void;
  onAccept: (gigId: string) => void;
}

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  isAccepting,
  canAccept = true,
  onInspect,
  onAccept,
}) => {
  const isEmergency = gig.isEmergency;
  const isPremium = gig.bookingType === "PREMIUM" || gig.bookingType === "ON_DEMAND";

  // Distance randomly up to 5 km and ₹5/km transport fee
  const { distanceKm, distanceDisplay, transportFee } = getGigDistanceInfo(gig);
  const payoutTotal = (gig.rate || 0) + transportFee;

  const formatDate = (dateStr?: string) => {
    if (!dateStr || isEmergency || isPremium) return "Immediate Dispatch (ASAP)";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
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

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between space-y-4",
        isEmergency
          ? "border-rose-500/60 ring-1 ring-rose-500/20 bg-card shadow-xs hover:border-rose-500"
          : isPremium
            ? "border-amber-500/50 ring-1 ring-amber-500/20 bg-card hover:border-amber-500"
            : "border-border/80 hover:border-border transition-all"
      )}
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase rounded-md"
            >
              {gig.bookingNumber || `#${gig._id.slice(-6)}`}
            </Badge>

            {/* Distance Badge */}
            <Badge
              variant="outline"
              className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 text-[10px] font-semibold gap-1 rounded-md"
            >
              <Navigation className="size-3" />
              <span>{distanceDisplay} away</span>
            </Badge>

            {isEmergency && (
              <Badge
                variant="destructive"
                className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white gap-1 shadow-xs rounded-md"
              >
                <AlertTriangle className="size-3" />
                <span>🚨 Emergency SOS</span>
              </Badge>
            )}

            {isPremium && !isEmergency && (
              <Badge
                variant="outline"
                className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold gap-1 rounded-md"
              >
                <Crown className="size-3 text-amber-500" />
                <span>⭐ Premium (&gt;4.5★)</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {gig.category?.name && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium text-muted-foreground rounded-md"
              >
                {gig.category.name}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold rounded-md"
            >
              {gig.priceType === "hourly" ? "Hourly" : "Per Meter"}
            </Badge>
          </div>
        </div>

        {/* Service Title */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
            {gig.service?.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Clock className={cn("size-3 shrink-0", isEmergency ? "text-rose-500 animate-spin" : "text-accent")} />
            <span
              className={cn(
                "font-semibold",
                isEmergency
                  ? "text-rose-600 dark:text-rose-400 font-bold"
                  : isPremium
                    ? "text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-foreground"
              )}
            >
              {formatDate(gig.scheduledDate)}
            </span>
          </div>
        </div>

        {/* Emergency Hazard Notice Box */}
        {isEmergency && gig.emergencyDetails && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-950 dark:text-rose-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-3.5" />
              <span>Hazard: {gig.emergencyDetails.hazardType || "Critical Emergency"}</span>
            </div>
            {gig.emergencyDetails.immediateContact && (
              <div className="flex items-center gap-1 text-[11px] opacity-90">
                <Phone className="size-3" />
                <span>Immediate Contact: {gig.emergencyDetails.immediateContact}</span>
              </div>
            )}
          </div>
        )}

        {/* Location & Distance Details */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="size-3.5 text-accent shrink-0 mt-0.5" />
              <span className="truncate">
                {gig.address?.street}
                {gig.address?.city ? `, ${gig.address.city}` : ""}
              </span>
            </div>
            <span className="font-semibold text-sky-600 dark:text-sky-400 shrink-0 text-[11px] bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
              {distanceDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/50 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Car className="size-3 text-sky-500" />
              <span>Transport Fee (₹5/km):</span>
            </div>
            <span className="font-bold text-foreground">₹{transportFee}</span>
          </div>

          {gig.customerNotes && (
            <p className="italic pl-5.5 text-foreground line-clamp-2 pt-1 border-t border-border/40">
              "{gig.customerNotes}"
            </p>
          )}
        </div>
      </div>

      {/* Pay Rate & Actions */}
      <div className="pt-3 border-t border-border/50 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              ₹{gig.rate}
            </span>
            <span className="text-xs text-muted-foreground font-semibold ml-1">
              /{gig.priceType === "hourly" ? "hr" : "meter"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Est. ₹{payoutTotal}
            </span>
            <p className="text-[10px] text-muted-foreground">Rate + ₹{transportFee} Transport</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onInspect(gig)}
            className="rounded-lg h-9 text-xs font-semibold hover:bg-muted cursor-pointer shadow-xs"
          >
            <span>Inspect</span>
            <ChevronRight className="size-3 ml-1" />
          </Button>

          <Button
            size="sm"
            onClick={() => onAccept(gig._id)}
            disabled={isAccepting || canAccept === false}
            className={cn(
              "rounded-lg h-9 text-xs font-semibold shadow-xs cursor-pointer gap-1.5 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              canAccept === false
                ? "bg-muted text-muted-foreground hover:bg-muted"
                : isEmergency
                  ? "bg-rose-600 hover:bg-rose-700"
                  : isPremium
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Check className="size-3.5" />
            <span>
              {isAccepting
                ? "Claiming..."
                : canAccept === false
                  ? "Capacity Full"
                  : isEmergency
                    ? "Claim Emergency SOS"
                    : isPremium
                      ? "Claim Premium Gig"
                      : "Accept Gig"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
