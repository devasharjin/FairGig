import React from "react";
import { Sparkles, PlayCircle, CheckCircle2, Star } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import {
  useWorkerStats,
  useAvailableGigs,
  useWorkerJobs,
  useWorkerProfile,
} from "@/features/worker/gigs/hooks";
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
          value={stats?.activeJobs ?? 0}
          subtitle="Confirmed & In Progress"
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