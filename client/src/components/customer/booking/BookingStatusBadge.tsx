import React from "react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/features/customer/bookings/types";

export interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
  showIcon?: boolean;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const { t } = useTranslation();

  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 py-1 px-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium",
            className
          )}
        >
          {showIcon && <Clock className="size-3.5 animate-spin text-amber-500" />}
          <span>{t("bookings.status.awaitingWorker")}</span>
        </Badge>
      );
    case "ASSIGNED":
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 py-1 px-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-medium",
            className
          )}
        >
          {showIcon && <CheckCircle2 className="size-3.5 text-blue-500" />}
          <span>{t("bookings.status.workerAssigned")}</span>
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 py-0.5 px-2 bg-accent/10 text-accent border-accent/30 font-medium rounded-md",
            className
          )}
        >
          {showIcon && <PlayCircle className="size-3 text-accent animate-pulse" />}
          <span>{t("bookings.status.inProgress")}</span>
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium",
            className
          )}
        >
          {showIcon && <ShieldCheck className="size-3.5 text-emerald-500" />}
          <span>{t("bookings.status.completed")}</span>
        </Badge>
      );
    case "CANCELLED":
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 py-1 px-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium",
            className
          )}
        >
          {showIcon && <XCircle className="size-3.5 text-rose-500" />}
          <span>
            {status === "CANCELLED"
              ? t("bookings.status.cancelled")
              : t("bookings.status.rejected")}
          </span>
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={cn("text-muted-foreground", className)}
        >
          {status}
        </Badge>
      );
  }
};

export default BookingStatusBadge;

