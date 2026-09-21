import { useState } from "react";
import {
  Wrench,
  Layers,
  Briefcase,
  Calendar,
  CircleDot,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  DashboardLayout,
  type PortalBrandingConfig,
  type SidebarGroupConfig,
} from "@/components/common/sidebar";

const workerBranding: PortalBrandingConfig = {
  title: "fairgig",
  subtitle: "Worker Portal",
  badge: "PRO",
  icon: Wrench,
  homePath: "/worker",
  portalTheme: "worker",
};

const workerNavGroups: SidebarGroupConfig[] = [
  {
    heading: "Overview",
    items: [
      {
        title: "Dashboard",
        to: "/worker",
        icon: Layers,
        end: true,
      },
    ],
  },
  {
    heading: "Gig Operations",
    items: [
      {
        title: "Available Gigs",
        to: "/worker/jobs",
        icon: Briefcase,
      },
      {
        title: "My Bookings",
        to: "/worker/bookings",
        icon: CheckCircle2,
      },
      {
        title: "Schedule",
        to: "/worker/schedule",
        icon: Calendar,
      },
    ],
  },
  {
    heading: "Professional",
    items: [
      {
        title: "Welfare & Insurance",
        to: "/worker/welfare",
        icon: ShieldCheck,
      },
      {
        title: "Profile & Skills",
        to: "/worker/profile",
        icon: UserCheck,
      },
    ],
  },
];

export const WorkerLayout = () => {
  const [isOnline, setIsOnline] = useState(true);

  const toggleOnlineStatus = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    toast.success(
      nextStatus
        ? "Status: Online (You can receive new gig requests)"
        : "Status: Offline (Gig requests paused)"
    );
  };

  const headerActions = (
    <button
      type="button"
      onClick={toggleOnlineStatus}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs select-none",
        isOnline
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/15"
          : "bg-muted/50 text-muted-foreground border-border/70 hover:bg-muted"
      )}
      title={isOnline ? "You are online and accepting gigs" : "You are offline"}
    >
      <CircleDot
        className={cn(
          "size-3",
          isOnline ? "text-emerald-500 animate-pulse" : "text-muted-foreground"
        )}
      />
      <span className="hidden sm:inline">
        {isOnline ? "Online" : "Offline"}
      </span>
    </button>
  );

  return (
    <DashboardLayout
      currentPortal="worker"
      branding={workerBranding}
      groups={workerNavGroups}
      headerActions={headerActions}
    />
  );
};

export default WorkerLayout;