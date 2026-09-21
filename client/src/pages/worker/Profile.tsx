import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import {
  useWorkerProfile,
  useUpdateWorkerProfile,
  useWorkerStats,
} from "@/features/worker/gigs/hooks";
import { Button } from "@/components/ui/button";
import { WorkerMetricCard } from "@/components/worker/common/WorkerMetricCard";
import { ProfileHeader } from "@/components/worker/profile/ProfileHeader";
import { CooperativeCard } from "@/components/worker/profile/CooperativeCard";
import { TradeSkillsGrid } from "@/components/worker/profile/TradeSkillsGrid";
import { ServiceAreaCard } from "@/components/worker/profile/ServiceAreaCard";
import { CredentialsCard } from "@/components/worker/profile/CredentialsCard";
import {
  EditProfileDialog,
  type EditProfileFormData,
} from "@/components/worker/profile/EditProfileDialog";

export const WorkerProfile: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { data: profileData } = useWorkerProfile();
  const { data: stats } = useWorkerStats();
  const updateProfileMutation = useUpdateWorkerProfile();

  const worker = profileData?.worker || profileData?.profile || null;
  const cooperative = worker?.cooperativeId || profileData?.cooperative || null;
  const skills = (worker?.skills || []) as any[];

  // Edit profile dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: "",
    phone: "",
    experience: "",
    availability: "Full-Time",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      experience: worker?.experience || 0,
      availability: worker?.availability || "Full-Time",
      address: worker?.location?.address || "",
      city: worker?.location?.city || "",
      state: worker?.location?.state || "",
      pincode: worker?.location?.pincode || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleFieldChange = (field: keyof EditProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      {
        name: formData.name,
        phone: formData.phone,
        experience: Number(formData.experience) || 0,
        availability: formData.availability,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      },
      {
        onSuccess: (res: any) => {
          setIsEditDialogOpen(false);
          if (res?.data?.user && user) {
            setUser({ ...user, ...res.data.user });
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <ProfileHeader
        user={user}
        worker={worker}
        onOpenEdit={handleOpenEdit}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <WorkerMetricCard
          label="Overall Rating"
          value={worker?.rating ? `${Number(worker.rating).toFixed(1)} / 5.0` : "5.0 / 5.0"}
          subtitle="Verified reviews"
          icon={Star}
          variant="warning"
        />
        <WorkerMetricCard
          label="Completed Gigs"
          value={stats?.totalJobsCompleted ?? worker?.totalJobsCompleted ?? 0}
          subtitle="Jobs fulfilled"
          icon={CheckCircle2}
          variant="success"
        />
        <WorkerMetricCard
          label="Trade Experience"
          value={`${worker?.experience || 0} yrs`}
          subtitle="Field service history"
          icon={Briefcase}
          variant="info"
        />
        <WorkerMetricCard
          label="Total Earnings"
          value={`₹${stats?.totalEarnings ?? 0}`}
          subtitle="All-time revenue"
          icon={Sparkles}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Cooperative Affiliation & Verified Trade Skills */}
        <div className="lg:col-span-2 space-y-6">
          <CooperativeCard cooperative={cooperative} />
          <TradeSkillsGrid skills={skills} category={worker?.category} />
        </div>

        {/* Right Column: Contact, Location & Document Verification */}
        <div className="space-y-6">
          <ServiceAreaCard location={worker?.location} />
          <CredentialsCard />

          {/* Quick Actions Card */}
          <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              Ready for more work?
            </h3>
            <p className="text-xs text-muted-foreground">
              Check out new incoming gig requests waiting for cooperative worker dispatch.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link to="/worker/jobs" className="w-full">
                <Button className="w-full rounded-lg text-xs font-semibold gap-2 cursor-pointer">
                  <Briefcase className="size-3.5" />
                  Browse Available Gigs
                </Button>
              </Link>
              <Link to="/worker/schedule" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-lg text-xs font-semibold gap-2 cursor-pointer"
                >
                  <Calendar className="size-3.5" />
                  View Daily Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onChange={handleFieldChange}
        onSubmit={handleSaveProfile}
        isPending={updateProfileMutation.isPending}
      />
    </div>
  );
};

export default WorkerProfile;
