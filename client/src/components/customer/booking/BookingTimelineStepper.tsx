import React from "react";
import { Check, Clock, PlayCircle, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerBooking } from "@/features/customer/bookings/types";

export interface BookingTimelineStepperProps {
  booking: CustomerBooking;
  className?: string;
}

interface StepItem {
  id: string;
  label: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isCancelled?: boolean;
}

const formatStepDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
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

export const BookingTimelineStepper: React.FC<BookingTimelineStepperProps> = ({
  booking,
  className,
}) => {
  const isCancelled = booking.status === "CANCELLED" || booking.status === "REJECTED";
  const isCompleted = booking.status === "COMPLETED";
  const isInProgress = booking.status === "IN_PROGRESS";
  const isAssigned = Boolean(booking.worker) || booking.status === "CONFIRMED" || booking.status === "ASSIGNED" || isInProgress || isCompleted;

  const steps: StepItem[] = [
    {
      id: "requested",
      label: "Requested",
      description: "Booking dispatched",
      timestamp: formatStepDate(booking.createdAt),
      isCompleted: true,
      isCurrent: !isAssigned && !isCancelled,
    },
    {
      id: "assigned",
      label: "Worker Assigned",
      description: booking.worker
        ? booking.worker.userId?.name || "Trade Worker"
        : "Awaiting acceptance",
      timestamp: formatStepDate(booking.assignedAt),
      isCompleted: isAssigned && !isCancelled,
      isCurrent: isAssigned && !isInProgress && !isCompleted && !isCancelled,
    },
    {
      id: "started",
      label: "In Progress",
      description: booking.startedAt ? "Work commenced" : "Worker en route",
      timestamp: formatStepDate(booking.startedAt),
      isCompleted: (Boolean(booking.startedAt) || isCompleted) && !isCancelled,
      isCurrent: isInProgress && !isCancelled,
    },
    {
      id: "finished",
      label: isCancelled ? "Cancelled" : "Completed",
      description: isCancelled
        ? booking.cancellationReason || "Request was cancelled"
        : isCompleted
        ? "Job fulfilled & approved"
        : "Final verification",
      timestamp: isCancelled
        ? formatStepDate(booking.cancelledAt)
        : formatStepDate(booking.completedAt),
      isCompleted: isCompleted,
      isCurrent: isCompleted || isCancelled,
      isCancelled: isCancelled,
    },
  ];

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Service Dispatch Timeline
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time status updates from gig request to fulfillment
          </p>
        </div>

        {isInProgress && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            <PlayCircle className="size-3.5 animate-pulse text-purple-500" />
            Live Now
          </span>
        )}
      </div>

      {/* Horizontal timeline on tablet/desktop */}
      <div className="pt-3 hidden sm:block">
        <div className="flex items-start justify-between relative">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center flex-1 z-10">
                  <div
                    className={cn(
                      "size-8 sm:size-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-xs",
                      step.isCancelled
                        ? "bg-rose-500 text-white shadow-rose-500/20"
                        : step.isCompleted
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : step.isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse"
                        : "bg-muted/80 text-muted-foreground border border-border"
                    )}
                  >
                    {step.isCancelled ? (
                      <XCircle className="size-4" />
                    ) : step.isCompleted ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : step.isCurrent ? (
                      <Clock className="size-4 animate-spin" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-0.5">
                    <p
                      className={cn(
                        "text-xs font-bold",
                        step.isCancelled
                          ? "text-rose-500"
                          : step.isCompleted || step.isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-[130px] line-clamp-1">
                      {step.description}
                    </p>
                    {step.timestamp && (
                      <p className="text-[10px] font-mono text-muted-foreground/80">
                        {step.timestamp}
                      </p>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 self-start mt-4 sm:mt-4.5 -mx-4 transition-colors",
                      steps[idx + 1].isCompleted || (step.isCompleted && !isCancelled)
                        ? "bg-emerald-500"
                        : isCancelled
                        ? "bg-border/60"
                        : "bg-border"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Vertical timeline on mobile */}
      <div className="sm:hidden space-y-3 pt-2">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "size-7 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0",
                    step.isCancelled
                      ? "bg-rose-500 text-white"
                      : step.isCompleted
                      ? "bg-emerald-500 text-white"
                      : step.isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.isCancelled ? (
                    <XCircle className="size-3.5" />
                  ) : step.isCompleted ? (
                    <Check className="size-3.5 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 h-7 my-1",
                      steps[idx + 1].isCompleted ? "bg-emerald-500" : "bg-border"
                    )}
                  />
                )}
              </div>

              <div className="pb-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-xs font-bold",
                      step.isCancelled
                        ? "text-rose-500"
                        : step.isCompleted || step.isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {step.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimelineStepper;
