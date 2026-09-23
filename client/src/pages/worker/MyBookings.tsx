import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  PlayCircle,
  CheckCircle2,
  Coins,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  useWorkerJobs,
  useWorkerStats,
  useUpdateJobStatus,
} from "@/features/worker/gigs/hooks";
import type { WorkerJob } from "@/features/worker/gigs/types";
import type { BookingStatus } from "@/features/customer/bookings/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkerMetricCard } from "@/components/worker/common/WorkerMetricCard";
import { ActiveMissionHud } from "@/components/worker/bookings/ActiveMissionHud";
import { BookingCard } from "@/components/worker/bookings/BookingCard";
import {
  BookingFilters,
  type WorkerFilterTab,
} from "@/components/worker/bookings/BookingFilters";
import { BookingDetailsDialog } from "@/components/worker/bookings/BookingDetailsDialog";
import { CompleteJobDialog } from "@/components/worker/bookings/CompleteJobDialog";
import { CancelJobDialog } from "@/components/worker/bookings/CancelJobDialog";

export const WorkerMyBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkerFilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [selectedJob, setSelectedJob] = useState<WorkerJob | null>(null);
  const [completingJob, setCompletingJob] = useState<WorkerJob | null>(null);
  const [cancellingJob, setCancellingJob] = useState<WorkerJob | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data: myJobs = [], isLoading, refetch, isRefetching } = useWorkerJobs();
  const { data: stats } = useWorkerStats();
  const updateStatusMutation = useUpdateJobStatus();

  // Determine if there is an active ongoing mission in progress
  const activeMission = myJobs.find((j) => j.status === "IN_PROGRESS");

  // Filter and search logic
  const filteredJobs = myJobs.filter((job) => {
    // Tab filter
    if (activeTab === "IN_PROGRESS" && job.status !== "IN_PROGRESS") return false;
    if (activeTab === "CONFIRMED" && job.status !== "CONFIRMED" && job.status !== "ASSIGNED")
      return false;
    if (activeTab === "COMPLETED" && job.status !== "COMPLETED") return false;
    if (activeTab === "CANCELLED" && job.status !== "CANCELLED") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = job.bookingNumber?.toLowerCase().includes(q);
      const matchService = job.service?.name?.toLowerCase().includes(q);
      const matchCustomer = job.customer?.name?.toLowerCase().includes(q);
      const matchAddress = job.address?.street?.toLowerCase().includes(q);
      return matchNumber || matchService || matchCustomer || matchAddress;
    }

    return true;
  });

  const handleStartJob = async (jobId: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: jobId,
        status: "IN_PROGRESS",
      });
      if (selectedJob?._id === jobId) {
        setSelectedJob((prev) =>
          prev ? { ...prev, status: "IN_PROGRESS" as BookingStatus } : null
        );
      }
    } catch {
      // Handled by toast
    }
  };

  const handleConfirmComplete = async () => {
    if (!completingJob) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: completingJob._id,
        status: "COMPLETED",
      });
      setCompletingJob(null);
      if (selectedJob?._id === completingJob._id) {
        setSelectedJob(null);
      }
    } catch {
      // Handled by toast
    }
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingJob) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: cancellingJob._id,
        status: "CANCELLED",
        reason: cancelReason.trim() || "Cancelled by worker",
      });
      setCancellingJob(null);
      setCancelReason("");
      if (selectedJob?._id === cancellingJob._id) {
        setSelectedJob(null);
      }
    } catch {
      // Handled by toast
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              My Assigned Bookings
            </h1>
            <Badge variant="secondary" className="rounded-md text-xs font-semibold px-2 py-0.5">
              {myJobs.length}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your field operations console. View scheduled appointments, contact customers, and track completed jobs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-lg h-9 gap-1.5 cursor-pointer text-xs font-semibold shadow-xs"
          >
            <RotateCcw className={cn("size-3.5", isRefetching && "animate-spin text-accent")} />
            <span>{isRefetching ? "Refreshing..." : "Refresh"}</span>
          </Button>

          <Link to="/worker/jobs">
            <Button
              size="sm"
              className="rounded-lg h-9 px-4 gap-2 text-xs font-semibold cursor-pointer shadow-xs bg-primary text-primary-foreground"
            >
              <Sparkles className="size-3.5" />
              <span>Available Gigs ({stats?.availableGigs ?? 0})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ACTIVE MISSION HUD (Highlighted if work is actively In-Progress) */}
      {activeMission && (
        <ActiveMissionHud
          mission={activeMission}
          onComplete={(job) => setCompletingJob(job)}
        />
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <WorkerMetricCard
          title="Assigned Jobs"
          value={myJobs.length}
          subtitle="Total claims"
          icon={Briefcase}
        />
        <WorkerMetricCard
          title="In Progress"
          value={myJobs.filter((j) => j.status === "IN_PROGRESS").length}
          subtitle="Currently on-site"
          icon={PlayCircle}
          variant="purple"
        />
        <WorkerMetricCard
          title="Completed"
          value={myJobs.filter((j) => j.status === "COMPLETED").length}
          subtitle="Fulfilled work"
          icon={CheckCircle2}
          variant="success"
        />
        <WorkerMetricCard
          title="Accumulated Earnings"
          value={`₹${stats?.totalEarnings ?? 0}`}
          subtitle="Direct cooperative payouts"
          icon={Coins}
        />
      </div>

      {/* Filter Tabs & Search Box */}
      <BookingFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border/60 bg-card/40 animate-pulse space-y-3"
            >
              <div className="h-6 bg-muted/60 rounded-lg w-1/3" />
              <div className="h-10 bg-muted/40 rounded-lg w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredJobs.length === 0 && (
        <div className="p-10 sm:p-12 text-center rounded-xl border border-dashed border-border/80 bg-card max-w-md mx-auto my-10 space-y-4 shadow-xs">
          <div className="size-12 rounded-lg bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <Briefcase className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No bookings found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "No assigned jobs match your search keywords."
                : "You have no bookings matching this status filter."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2">
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-lg h-8 text-xs cursor-pointer shadow-xs"
              >
                Clear Search
              </Button>
            )}
            <Link to="/worker/jobs">
              <Button
                size="sm"
                className="rounded-lg h-8 px-4 text-xs font-semibold gap-1.5 shadow-xs bg-primary text-primary-foreground"
              >
                <Sparkles className="size-3.5" />
                Browse Available Gigs
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Bookings Grid */}
      {!isLoading && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <BookingCard
              key={job._id}
              job={job}
              onSelect={(j) => setSelectedJob(j)}
              onStartJob={handleStartJob}
              onCompleteJob={(j) => setCompletingJob(j)}
              onCancelJob={(j) => {
                setCancellingJob(j);
                setCancelReason("");
              }}
              isUpdating={updateStatusMutation.isPending}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Booking Details Dialog */}
      <BookingDetailsDialog
        selectedJob={selectedJob}
        onClose={() => setSelectedJob(null)}
        onStartJob={handleStartJob}
        onCompleteJob={(j) => setCompletingJob(j)}
      />

      {/* Complete Job Dialog */}
      <CompleteJobDialog
        completingJob={completingJob}
        onClose={() => setCompletingJob(null)}
        onConfirm={handleConfirmComplete}
        isPending={updateStatusMutation.isPending}
      />

      {/* Cancel Job Dialog */}
      <CancelJobDialog
        cancellingJob={cancellingJob}
        cancelReason={cancelReason}
        onReasonChange={setCancelReason}
        onClose={() => setCancellingJob(null)}
        onConfirm={handleConfirmCancel}
        isPending={updateStatusMutation.isPending}
        cancellationsToday={stats?.cancellationsToday}
        cancellationLimit={stats?.cancellationLimit ?? 1}
        canCancelToday={stats?.canCancelToday}
      />
    </div>
  );
};

export default WorkerMyBookings;
