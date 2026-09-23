import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RotateCcw } from "lucide-react";
import {
  useWorkerJob,
  useUpdateJobStatus,
  useWorkerStats,
} from "@/features/worker/gigs/hooks";
import { Button } from "@/components/ui/button";
import { WorkerBookingDetailsView } from "@/components/worker/bookings/WorkerBookingDetailsView";
import { CompleteJobDialog } from "@/components/worker/bookings/CompleteJobDialog";
import { CancelJobDialog } from "@/components/worker/bookings/CancelJobDialog";

export const WorkerBookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const {
    data: job,
    isLoading,
    isError,
    error,
    refetch,
  } = useWorkerJob(id || "");

  const { data: stats } = useWorkerStats();
  const updateStatusMutation = useUpdateJobStatus();

  const handleStartJob = async (jobId: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: jobId,
        status: "IN_PROGRESS",
      });
      refetch();
    } catch {
      // Handled by toast
    }
  };

  const handleConfirmComplete = async () => {
    if (!job) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: job._id,
        status: "COMPLETED",
      });
      setIsCompleteDialogOpen(false);
      refetch();
    } catch {
      // Handled by toast
    }
  };

  const handleConfirmCancel = async () => {
    if (!job) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: job._id,
        status: "CANCELLED",
        reason: cancelReason.trim() || "Cancelled by worker",
      });
      setIsCancelDialogOpen(false);
      setCancelReason("");
      refetch();
    } catch {
      // Handled by toast
    }
  };

  // Loading skeleton view
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="h-9 w-44 bg-muted/60 rounded-lg animate-pulse" />
        <div className="p-6 rounded-xl border border-border/60 bg-card/40 animate-pulse space-y-4">
          <div className="h-6 bg-muted/60 rounded-lg w-1/4" />
          <div className="h-8 bg-muted/40 rounded-lg w-1/2" />
        </div>
        <div className="p-6 rounded-xl border border-border/60 bg-card/40 animate-pulse h-28" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-72 rounded-xl border border-border/60 bg-card/40 animate-pulse" />
          <div className="lg:col-span-5 h-72 rounded-xl border border-border/60 bg-card/40 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error / Not Found view
  if (isError || !job) {
    return (
      <div className="min-h-screen bg-background/50 py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto text-center space-y-5">
        <div className="size-16 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            Job Details Unavailable
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {(error as any)?.message ||
              "We couldn't locate this gig assignment. It may have been reassigned or you may not have access."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-lg h-10 px-4 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>

          <Link to="/worker/bookings">
            <Button className="rounded-lg h-10 px-5 text-xs font-semibold cursor-pointer shadow-xs">
              <span>Back to My Bookings</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/worker/bookings")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer bg-card/80 hover:bg-card border border-border/70 py-2 px-3.5 rounded-lg shadow-xs"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to My Gigs & Bookings</span>
        </button>

        <div className="text-xs text-muted-foreground hidden sm:block">
          Worker Field Portal • Job #{job.bookingNumber}
        </div>
      </div>

      {/* Main Details View */}
      <WorkerBookingDetailsView
        job={job}
        onStartJob={handleStartJob}
        onCompleteJob={() => setIsCompleteDialogOpen(true)}
        onCancelJob={() => setIsCancelDialogOpen(true)}
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Complete Job Dialog */}
      <CompleteJobDialog
        completingJob={isCompleteDialogOpen ? job : null}
        onClose={() => setIsCompleteDialogOpen(false)}
        onConfirm={handleConfirmComplete}
        isPending={updateStatusMutation.isPending}
      />

      {/* Cancel Job Dialog */}
      <CancelJobDialog
        cancellingJob={isCancelDialogOpen ? job : null}
        cancelReason={cancelReason}
        onReasonChange={setCancelReason}
        onClose={() => {
          setIsCancelDialogOpen(false);
          setCancelReason("");
        }}
        onConfirm={handleConfirmCancel}
        isPending={updateStatusMutation.isPending}
        cancellationsToday={stats?.cancellationsToday}
        cancellationLimit={stats?.cancellationLimit ?? 1}
        canCancelToday={stats?.canCancelToday}
      />
    </div>
  );
};

export default WorkerBookingDetails;
