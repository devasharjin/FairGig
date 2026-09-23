import React from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Clock, CheckCircle2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerProfileStats as StatsType } from "@/features/customer/profile/types";

interface CustomerProfileStatsProps {
  stats?: StatsType;
  className?: string;
}

interface StatItemProps {
  label: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) => (
  <div className="p-4 sm:p-5 rounded-3xl border border-border/80 bg-card shadow-xs space-y-1 hover:border-primary/30 transition-colors">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div
        className={cn(
          "size-8 rounded-xl flex items-center justify-center shrink-0",
          iconBg,
          iconColor
        )}
      >
        <Icon className="size-4" />
      </div>
    </div>
    <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
      {value}
    </div>
    <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
  </div>
);

export const CustomerProfileStats: React.FC<CustomerProfileStatsProps> = ({
  stats,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
        className
      )}
    >
      <StatItem
        label={t("profile.stats.totalOrders")}
        value={stats?.totalBookings ?? 0}
        subtitle={t("profile.stats.totalOrdersDesc", { defaultValue: t("profile.stats.totalOrdersSub") })}
        icon={Briefcase}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <StatItem
        label={t("profile.stats.activeBookings")}
        value={stats?.activeBookings ?? 0}
        subtitle={t("profile.stats.activeBookingsDesc", { defaultValue: t("profile.stats.activeBookingsSub") })}
        icon={Clock}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
      />
      <StatItem
        label={t("profile.stats.completed")}
        value={stats?.completedBookings ?? 0}
        subtitle={t("profile.stats.completedDesc", { defaultValue: t("profile.stats.completedSub") })}
        icon={CheckCircle2}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
      <StatItem
        label={t("profile.stats.savedAddresses")}
        value={stats?.totalSavedAddresses ?? 0}
        subtitle={t("profile.stats.savedAddressesDesc", { defaultValue: t("profile.stats.savedAddressesSub") })}
        icon={MapPin}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
    </div>
  );
};

export default CustomerProfileStats;
