import React from "react";
import {
  MapPin,
  Clock,
  Check,
  ChevronRight,
  AlertTriangle,
  Zap,
  Phone,
} from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GigCardProps {
  gig: WorkerJob;
  isAccepting: boolean;
  onInspect: (gig: WorkerJob) => void;
  onAccept: (gigId: string) => void;
}

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  isAccepting,
  onInspect,
  onAccept,
}) => {
  const isEmergency = gig.isEmergency;
  const isOnDemand = gig.bookingType === "ON_DEMAND";

  const formatDate = (dateStr?: string) => {
    if (!dateStr || isEmergency || isOnDemand) return "Immediate Dispatch (ASAP)";
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
        "group relative rounded-3xl border bg-card p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between space-y-4",
        isEmergency
          ? "border-rose-500/60 ring-2 ring-rose-500/20 bg-gradient-to-b from-rose-500/10 via-card to-card shadow-rose-500/10 hover:shadow-rose-500/20"
          : isOnDemand
          ? "border-amber-500/50 ring-1 ring-amber-500/20 bg-gradient-to-b from-amber-500/5 to-card hover:shadow-md"
          : "border-border/80 hover:border-primary/40 hover:shadow-md"
      )}
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase"
            >
              {gig.bookingNumber || `#${gig._id.slice(-6)}`}
            </Badge>

            {isEmergency && (
              <Badge
                variant="destructive"
                className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white gap-1 animate-pulse shadow-xs"
              >
                <AlertTriangle className="size-3" />
                <span>🚨 Emergency SOS</span>
              </Badge>
            )}

            {isOnDemand && !isEmergency && (
              <Badge
                variant="outline"
                className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold gap-1"
              >
                <Zap className="size-3" />
                <span>⚡ On-Demand</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {gig.category?.name && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium text-muted-foreground"
              >
                {gig.category.name}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold"
            >
              {gig.priceType === "hourly" ? "Hourly" : "Per Meter"}
            </Badge>
          </div>
        </div>

        {/* Service Title */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {gig.service?.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Clock className={cn("size-3 shrink-0", isEmergency ? "text-rose-500 animate-spin" : "text-primary")} />
            <span
              className={cn(
                "font-semibold",
                isEmergency
                  ? "text-rose-600 dark:text-rose-400 font-bold"
                  : isOnDemand
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
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-950 dark:text-rose-200 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-rose-600 dark:text-rose-400">
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

        {/* Location & Details */}
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1.5">
          <div className="flex items-start gap-2">
            <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
            <span className="truncate">
              {gig.address?.street}
              {gig.address?.city ? `, ${gig.address.city}` : ""}
            </span>
          </div>
          {gig.customerNotes && (
            <p className="italic pl-5.5 text-foreground line-clamp-2">
              "{gig.customerNotes}"
            </p>
          )}
        </div>
      </div>

      {/* Pay Rate & Actions */}
      <div className="pt-3 border-t border-border/50 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              ₹{gig.rate}
            </span>
            <span className="text-xs text-muted-foreground font-semibold ml-1">
              /{gig.priceType === "hourly" ? "hr" : "meter"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Est. ₹{gig.totalAmount}
            </span>
            <p className="text-[10px] text-muted-foreground">Guaranteed Payout</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onInspect(gig)}
            className="rounded-xl h-9 text-xs font-semibold hover:bg-muted cursor-pointer"
          >
            <span>Inspect</span>
            <ChevronRight className="size-3 ml-1" />
          </Button>

          <Button
            size="sm"
            onClick={() => onAccept(gig._id)}
            disabled={isAccepting}
            className={cn(
              "rounded-xl h-9 text-xs font-bold shadow-xs cursor-pointer gap-1.5 text-white transition-all",
              isEmergency
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                : isOnDemand
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Check className="size-3.5" />
            <span>
              {isAccepting
                ? "Claiming..."
                : isEmergency
                ? "Claim Emergency SOS"
                : isOnDemand
                ? "Claim On-Demand"
                : "Accept Gig"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
