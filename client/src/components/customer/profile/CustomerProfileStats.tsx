import React from "react";
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
  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
        className
      )}
    >
      <StatItem
        label="Total Orders"
        value={stats?.totalBookings ?? 0}
        subtitle="All-time service requests"
        icon={Briefcase}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <StatItem
        label="Active Bookings"
        value={stats?.activeBookings ?? 0}
        subtitle="In progress & scheduled"
        icon={Clock}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
      />
      <StatItem
        label="Completed"
        value={stats?.completedBookings ?? 0}
        subtitle="Fulfilled satisfactorily"
        icon={CheckCircle2}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
      <StatItem
        label="Saved Addresses"
        value={stats?.totalSavedAddresses ?? 0}
        subtitle="Quick delivery locations"
        icon={MapPin}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
    </div>
  );
};

export default CustomerProfileStats;
