import React from "react";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  user: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  worker: {
    category?: any;
    verificationStatus?: string;
    availability?: string;
    location?: {
      city?: string;
      state?: string;
    };
  } | null;
  onOpenEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  worker,
  onOpenEdit,
}) => {
  const verificationStatus = worker?.verificationStatus || "Pending";
  const isApproved = verificationStatus === "Approved";
  const isPending = verificationStatus === "Pending";
  const categoryName =
    typeof worker?.category === "object" && worker?.category?.name
      ? worker.category.name
      : typeof worker?.category === "string"
      ? worker.category
      : null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {categoryName && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
              >
                {categoryName}
              </Badge>
            )}

            <Badge
              variant="outline"
              className={`text-xs font-semibold gap-1.5 ${
                isApproved
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : isPending
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-600 border-rose-500/30"
              }`}
            >
              {isApproved ? (
                <ShieldCheck className="size-3.5 text-emerald-500" />
              ) : isPending ? (
                <Clock className="size-3.5 text-amber-500" />
              ) : (
                <AlertCircle className="size-3.5 text-rose-500" />
              )}
              {isApproved
                ? "Cooperative Verified Specialist"
                : isPending
                ? "Verification In Review"
                : "Verification Action Required"}
            </Badge>

            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold"
            >
              {worker?.availability || "Full-Time"}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {user?.name || "Professional Worker"}
          </h1>

          <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-y-1.5 gap-x-4">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" />
              <span>{user?.email}</span>
            </span>
            {user?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                <span>{user.phone}</span>
              </span>
            )}
            {worker?.location?.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                <span>
                  {worker.location.city}, {worker.location.state}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={onOpenEdit}
            className="rounded-lg h-10 px-5 text-sm font-semibold shadow-xs gap-2 cursor-pointer bg-primary text-primary-foreground"
          >
            <Edit3 className="size-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
