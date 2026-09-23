import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-destructive/30 bg-card p-4 sm:p-5 shadow-sm ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-destructive" />
            </span>
            <Badge
              variant="destructive"
              className="text-[10px] font-bold uppercase tracking-wider"
            >
              {t("home.emergency.badge")}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {t("home.emergency.avgResponse")}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {t("home.emergency.title")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("home.emergency.desc")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <a
            href="tel:1800123456"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition shadow-xs"
            title="Call 24/7 Helpline"
          >
            <PhoneCall className="size-3.5 text-destructive" />
            <span>{t("home.emergency.hotline")}</span>
          </a>

          <Button
            onClick={onTriggerEmergency}
            className="h-10 px-4 gap-2 rounded-md bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 hover:shadow transition-all active:scale-[0.98] cursor-pointer"
          >
            <AlertTriangle className="size-4" />
            <span>{t("home.emergency.sosButton")}</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
