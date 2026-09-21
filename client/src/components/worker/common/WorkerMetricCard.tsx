import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkerMetricCardVariant =
  | "default"
  | "warning"
  | "success"
  | "purple"
  | "info";

export interface WorkerMetricCardProps {
  label?: string;
  title?: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  variant?: WorkerMetricCardVariant;
  iconBgClass?: string;
  iconColorClass?: string;
  className?: string;
}

const variantStyles: Record<
  WorkerMetricCardVariant,
  { bg: string; text: string }
> = {
  default: { bg: "bg-primary/10", text: "text-primary" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-500" },
  success: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
  info: { bg: "bg-blue-500/10", text: "text-blue-500" },
};

export const WorkerMetricCard: React.FC<WorkerMetricCardProps> = ({
  label,
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  iconBgClass,
  iconColorClass,
  className,
}) => {
  const displayLabel = label || title || "";
  const bgClass =
    iconBgClass || variantStyles[variant]?.bg || variantStyles.default.bg;
  const colorClass =
    iconColorClass || variantStyles[variant]?.text || variantStyles.default.text;

  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-1 hover:border-border transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {displayLabel}
        </span>
        <div
          className={cn(
            "size-8 rounded-lg flex items-center justify-center shrink-0",
            bgClass,
            colorClass
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        {value}
      </div>
      <p className="text-[11px] text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default WorkerMetricCard;
