import React from "react";
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
          <span>Awaiting Worker</span>
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
          <span>Worker Assigned</span>
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 py-1 px-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-medium",
            className
          )}
        >
          {showIcon && <PlayCircle className="size-3.5 text-purple-500 animate-pulse" />}
          <span>In Progress</span>
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
          <span>Completed</span>
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
          <span>{status === "CANCELLED" ? "Cancelled" : "Rejected"}</span>
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
