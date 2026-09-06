import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  ChevronRight,
} from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Immediate Dispatch";
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
    <div className="group relative rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase"
          >
            {gig.bookingNumber || `#${gig._id.slice(-6)}`}
          </Badge>

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
            <Clock className="size-3 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {formatDate(gig.scheduledDate)}
            </span>
          </div>
        </div>

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
            className="rounded-xl h-9 text-xs font-semibold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5"
          >
            <Check className="size-3.5" />
            <span>{isAccepting ? "Claiming..." : "Accept Gig"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
