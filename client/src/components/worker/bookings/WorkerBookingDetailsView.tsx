import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Copy,
  Check,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Star,
  Shield,
  HelpCircle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { getStatusBadge } from "./BookingCard";
import { WorkerBookingTimelineStepper } from "./WorkerBookingTimelineStepper";
import { WorkerCustomerInfoCard } from "./WorkerCustomerInfoCard";
import { WorkerEarningsReceiptCard } from "./WorkerEarningsReceiptCard";

export interface WorkerBookingDetailsViewProps {
  job: WorkerJob;
  onStartJob: (jobId: string) => void;
  onCompleteJob: (job: WorkerJob) => void;
  onCancelJob: (job: WorkerJob) => void;
  isUpdating?: boolean;
  className?: string;
}

export const WorkerBookingDetailsView: React.FC<WorkerBookingDetailsViewProps> = ({
  job,
  onStartJob,
  onCompleteJob,
  onCancelJob,
  isUpdating = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const isInProgress = job.status === "IN_PROGRESS";
  const isConfirmed = job.status === "CONFIRMED" || job.status === "ASSIGNED";

  const handleCopyBookingNumber = () => {
    navigator.clipboard.writeText(job.bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let formattedDate = "Immediate Dispatch";
  try {
    if (job.scheduledDate) {
      formattedDate = new Date(job.scheduledDate).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {
    formattedDate = job.scheduledDate;
  }

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto pb-16", className)}>
      {/* 1. Hero Header & Quick Controls */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
                #{job.bookingNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyBookingNumber}
                className="text-muted-foreground hover:text-foreground transition cursor-pointer p-1"
                title="Copy booking number"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
              {getStatusBadge(job.status)}
              <Badge variant="secondary" className="rounded-lg text-xs font-semibold">
                {job.category?.name || "Trade Service"}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {job.service?.name}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isConfirmed && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelJob(job)}
                  className="rounded-xl h-10 px-4 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer border-destructive/30"
                >
                  Cancel Gig
                </Button>

                <Button
                  size="sm"
                  onClick={() => onStartJob(job._id)}
                  disabled={isUpdating}
                  className="rounded-xl h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <PlayCircle className="size-4" />
                  <span>Start Work (On-Site)</span>
                </Button>
              </>
            )}

            {isInProgress && (
              <Button
                size="sm"
                onClick={() => onCompleteJob(job)}
                disabled={isUpdating}
                className="rounded-xl h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="size-4" />
                <span>Complete & Finalize Gig</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dispatch Milestones Stepper */}
      <WorkerBookingTimelineStepper job={job} />

      {/* 3. Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer info, Service details & Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Profile & Navigation Card */}
          <WorkerCustomerInfoCard
            customer={job.customer}
            address={job.address}
          />

          {/* Service Specifications Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-primary" />
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Work Order Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-start gap-3">
                <Clock className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block text-sm">
                    Scheduled Appointment
                  </span>
                  <span className="text-muted-foreground mt-0.5 block">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {job.service?.description && (
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                  <span className="font-semibold text-foreground block text-xs">
                    Scope of Work
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {job.service.description}
                  </p>
                </div>
              )}

              {job.customerNotes && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                    <FileText className="size-3.5" />
                    <span>Customer Instructions & Access Notes</span>
                  </div>
                  <p className="italic text-foreground">
                    "{job.customerNotes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Earnings, Rating & Cooperative Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          {/* Payout & Compensation Breakdown */}
          <WorkerEarningsReceiptCard job={job} />

          {/* Customer Review (if rated) */}
          {job.isRated && job.rating && (
            <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Customer Review & Rating
                </h3>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  <Star className="size-3 fill-amber-500" />
                  {job.rating.rating} / 5
                </span>
              </div>

              {job.rating.review && (
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-xs italic text-foreground leading-relaxed">
                  "{job.rating.review}"
                </div>
              )}

              {job.rating.createdAt && (
                <p className="text-[11px] text-muted-foreground">
                  Reviewed on{" "}
                  {new Date(job.rating.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Cooperative Safety & Guidelines */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Cooperative Fieldwork Guidelines
              </h3>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>Always verify the customer identity upon arriving on-site.</li>
              <li>Wear required safety gear and cooperative badge.</li>
              <li>Press "Start Work" when beginning the task to maintain live dispatch logs.</li>
              <li>Collect customer confirmation before completing the gig.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerBookingDetailsView;
