import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, Navigation, CheckCircle2 } from "lucide-react";
import type { WorkerJob } from "@/features/worker/gigs/types";

interface ActiveMissionHudProps {
  mission: WorkerJob;
  onComplete: (job: WorkerJob) => void;
}

export const ActiveMissionHud: React.FC<ActiveMissionHudProps> = ({
  mission,
  onComplete,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-card to-card p-6 shadow-md ring-1 ring-purple-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-3 bg-purple-500" />
            </span>
            <Badge
              variant="outline"
              className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-xs font-extrabold uppercase tracking-wider"
            >
              ⚡ Active Mission On-Site
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              {mission.bookingNumber}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {mission.service?.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <User className="size-3.5 text-primary" />
              <span>
                Customer: <strong>{mission.customer?.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              <span>
                {mission.address?.street}, {mission.address?.city}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <span>Pay: ₹{mission.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions for Active Mission */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {mission.customer?.phone && (
            <a
              href={`tel:${mission.customer.phone}`}
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-2xl border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition shadow-xs"
              title="Call Customer"
            >
              <Phone className="size-3.5 text-primary" />
              <span>Call Customer</span>
            </a>
          )}

          {mission.address?.street && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${mission.address.street} ${mission.address.city || ""}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-2xl border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition shadow-xs"
            >
              <Navigation className="size-3.5 text-primary" />
              <span>GPS Directions</span>
            </a>
          )}

          <Button
            onClick={() => onComplete(mission)}
            className="h-11 px-6 rounded-2xl text-xs font-bold gap-2 shadow-sm cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="size-4" />
            <span>Finish & Complete Job</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveMissionHud;
