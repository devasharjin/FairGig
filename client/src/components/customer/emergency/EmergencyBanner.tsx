import React from "react";
import { AlertTriangle, Zap, ArrowRight, ShieldAlert, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmergencyBannerProps {
  onTriggerEmergency: () => void;
  className?: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onTriggerEmergency,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-r from-rose-500/15 via-card to-card p-5 sm:p-6 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/20 ${className}`}
    >
      {/* Background glow effects */}
      <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 top-0 size-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-3 bg-rose-500" />
            </span>
            <Badge
              variant="destructive"
              className="text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs"
            >
              🚨 24/7 Cooperative Emergency SOS
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              Average arrival time: ~25-35 mins
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
            Urgent Household Hazard or Breakdown?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Plumbing pipe burst, electrical spark, lockout, or dangerous fault? Dispatched immediately with top-of-queue priority to verified cooperative responders in your sector.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <a
            href="tel:1800123456"
            className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition"
            title="Call 24/7 Helpline"
          >
            <PhoneCall className="size-4 text-rose-500" />
            <span>Co-op Hotline</span>
          </a>

          <Button
            onClick={onTriggerEmergency}
            className="h-11 px-6 rounded-2xl text-xs font-black gap-2 shadow-md bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-rose-600/25 transition-all hover:scale-[1.02]"
          >
            <AlertTriangle className="size-4 animate-bounce" />
            <span>Request Emergency SOS</span>
            <ArrowRight className="size-3.5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
