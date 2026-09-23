import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, PlayCircle, CheckCircle2, Star, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import {
  useWorkerStats,
  useAvailableGigs,
  useWorkerJobs,
  useWorkerProfile,
} from "@/features/worker/gigs/hooks";
import { Button } from "@/components/ui/button";
import { WorkerMetricCard } from "@/components/worker/common/WorkerMetricCard";
import { WorkerWelcomeBanner } from "@/components/worker/home/WorkerWelcomeBanner";
import { WorkerPriorityMission } from "@/components/worker/home/WorkerPriorityMission";
import { WorkerGuidelinesCard } from "@/components/worker/home/WorkerGuidelinesCard";

export const WorkerHome: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: stats } = useWorkerStats();
  const { data: availableGigs = [] } = useAvailableGigs();
  const { data: myJobs = [] } = useWorkerJobs();
  const { data: profile } = useWorkerProfile();

  const registeredSkills = (profile?.skills || profile?.worker?.skills || []) as any[];
  const registeredSkillIds = registeredSkills
    .map((s) => (typeof s === "object" ? s?._id : s))
    .filter(Boolean)
    .map((id) => id.toString());

  const matchingAvailableGigs = registeredSkillIds.length > 0
    ? availableGigs.filter((gig) => {
        const gigServiceId = (gig.service?._id || gig.service)?.toString();
        return gigServiceId ? registeredSkillIds.includes(gigServiceId) : true;
      })
    : availableGigs;

  const activeJob = myJobs.find(
    (j) =>
      j.status === "CONFIRMED" ||
      j.status === "ASSIGNED" ||
      j.status === "IN_PROGRESS"
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Welcome Banner */}
      <WorkerWelcomeBanner workerName={user?.name?.split(" ")[0] || "Worker"} />

      {/* 1.5 Emergency SOS Callout Banner */}
      {matchingAvailableGigs.some((g) => g.isEmergency) && (
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ring-1 ring-rose-500/20">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="size-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg animate-pulse ring-2 ring-rose-400/40">
              <AlertTriangle className="size-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  🚨 URGENT SOS CALLOUT
                </span>
                <span className="text-xs text-rose-200 font-semibold">
                  {matchingAvailableGigs.filter((g) => g.isEmergency).length} nearby emergency awaiting responder
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Emergency callout: {matchingAvailableGigs.find((g) => g.isEmergency)?.service?.name} (₹{matchingAvailableGigs.find((g) => g.isEmergency)?.rate}/hr)
              </h3>
              <p className="text-xs text-rose-200/80">
                Customer Location: {matchingAvailableGigs.find((g) => g.isEmergency)?.address?.street || "Nearby"} • Immediate priority dispatch
              </p>
            </div>
          </div>

          <Link to="/worker/jobs" className="shrink-0 self-start sm:self-auto">
            <Button
              size="sm"
              className="rounded-xl h-10 px-5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <span>Claim Emergency SOS</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <WorkerMetricCard
          label="Available Gigs"
          value={stats?.availableGigs ?? matchingAvailableGigs.length}
          subtitle="Waiting for pickup"
          icon={Sparkles}
          iconBgClass="bg-amber-500/10"
          iconColorClass="text-amber-500"
        />
        <WorkerMetricCard
          label="Active Work"
          value={`${stats?.activeJobs ?? 0} / ${stats?.weeklyServiceLimit ?? 6}`}
          subtitle={`Weekly quota (${stats?.weeklyServicesRemaining ?? Math.max(0, 6 - (stats?.activeJobs ?? 0))} left)`}
          icon={PlayCircle}
          iconBgClass="bg-blue-500/10"
          iconColorClass="text-blue-500"
        />
        <WorkerMetricCard
          label="Completed Jobs"
          value={stats?.totalJobsCompleted ?? 0}
          subtitle="All-time gigs fulfilled"
          icon={CheckCircle2}
          iconBgClass="bg-emerald-500/10"
          iconColorClass="text-emerald-500"
        />
        <WorkerMetricCard
          label="Rating"
          value={stats?.rating ? `${stats.rating.toFixed(1)} / 5.0` : "5.0 / 5.0"}
          subtitle="Customer satisfaction"
          icon={Star}
          iconBgClass="bg-amber-500/10"
          iconColorClass="text-amber-500"
        />
      </div>

      {/* 3. Priority Mission & Cooperative Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkerPriorityMission
            activeJob={activeJob}
            topAvailableGig={matchingAvailableGigs[0]}
          />
        </div>
        <div>
          <WorkerGuidelinesCard />
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;