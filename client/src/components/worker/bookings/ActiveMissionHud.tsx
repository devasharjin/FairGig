import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, Navigation, CheckCircle2, Clock, Hourglass, Coins, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkerJob } from "@/features/worker/gigs/types";

interface ActiveMissionHudProps {
  mission: WorkerJob;
  onComplete: (job: WorkerJob) => void;
}

export const ActiveMissionHud: React.FC<ActiveMissionHudProps> = ({
  mission,
  onComplete,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Live timer for elapsed duration since mission startedAt
  useEffect(() => {
    if (!mission.startedAt) return;

    const calculateElapsed = () => {
      const start = new Date(mission.startedAt!).getTime();
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - start) / 1000));
      setElapsedSeconds(diffSec);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [mission.startedAt]);

  const formatElapsed = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    if (hours > 0) {
      return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
    return `${pad(minutes)}m ${pad(seconds)}s`;
  };

  const currentMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
  const currentBillableHours = Math.max(1, Math.ceil(currentMinutes / 60));

  const firstHourRate =
    mission.pricing?.firstHourRate ??
    mission.service?.firstHourRate ??
    mission.service?.hourlyPrice ??
    mission.rate ??
    0;

  const additionalHourRate =
    mission.pricing?.additionalHourRate ??
    mission.service?.additionalHourRate ??
    firstHourRate;

  const formattedStartTime = mission.startedAt
    ? new Date(mission.startedAt).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    : "Just now";

  const isEmergency = mission.isEmergency;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 sm:p-6 shadow-md ring-1 space-y-4",
        isEmergency
          ? "border-rose-500/50 bg-gradient-to-r from-rose-500/15 via-card to-card ring-rose-500/20 shadow-rose-500/10"
          : "border-accent/40 bg-gradient-to-r from-accent/10 via-card to-card ring-accent/20"
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex size-3">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  isEmergency ? "bg-rose-400" : "bg-accent"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex rounded-full size-3",
                  isEmergency ? "bg-rose-500" : "bg-accent"
                )}
              />
            </span>

            {isEmergency ? (
              <Badge
                variant="destructive"
                className="bg-rose-600 text-white text-xs font-black uppercase tracking-wider py-0.5 px-2.5 animate-pulse shadow-xs"
              >
                🚨 EMERGENCY SOS CALLOUT MISSION
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-accent/15 text-accent border-accent/30 text-xs font-extrabold uppercase tracking-wider"
              >
                ⚡ Live Fieldwork Active
              </Badge>
            )}

            <span className="text-xs font-mono text-muted-foreground">
              #{mission.bookingNumber}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {mission.service?.name}
          </h2>

          {isEmergency && mission.emergencyDetails && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-300">
              <AlertTriangle className="size-3.5 shrink-0" />
              <span>Reported Hazard: {mission.emergencyDetails.hazardType || "Critical Emergency"}</span>
              {mission.emergencyDetails.immediateContact && (
                <span className="font-normal opacity-90">
                  • On-Site Phone: {mission.emergencyDetails.immediateContact}
                </span>
              )}
            </div>
          )}

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
          </div>
        </div>

        {/* Quick Actions for Active Mission */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {mission.customer?.phone && (
            <a
              href={`tel:${mission.customer.phone}`}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition shadow-xs"
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
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition shadow-xs"
            >
              <Navigation className="size-3.5 text-primary" />
              <span>GPS Directions</span>
            </a>
          )}

          <Button
            onClick={() => onComplete(mission)}
            className="h-10 px-5 rounded-lg text-xs font-bold gap-2 shadow-sm cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="size-4" />
            <span>Finish & Complete Job</span>
          </Button>
        </div>
      </div>

      {/* Live Timer & Applicable Rates HUD Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60 text-xs">
        {/* Work Start Time */}
        <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="size-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Work Started At</span>
            <span className="font-bold text-foreground text-sm">{formattedStartTime}</span>
          </div>
        </div>

        {/* Live Elapsed Duration */}
        <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Hourglass className="size-4 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Live Working Duration</span>
            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {formatElapsed(elapsedSeconds)}
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium">
              Tier: {currentBillableHours} billable hr{currentBillableHours === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Applicable Rates */}
        <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Coins className="size-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Applicable Rates</span>
            <span className="font-bold text-foreground text-xs">
              1st hr: ₹{firstHourRate} • Addl: ₹{additionalHourRate}/hr
            </span>
            <span className="text-[10px] text-muted-foreground block">
              +₹30 flat transport (separate item)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMissionHud;
