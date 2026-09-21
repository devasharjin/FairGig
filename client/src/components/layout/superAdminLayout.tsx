import {
  ShieldAlert,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Users,
  CircleDot,
  BaggageClaim,
  CreditCard,
  BrainCircuit,
} from "lucide-react";
import {
  DashboardLayout,
  type PortalBrandingConfig,
  type SidebarGroupConfig,
} from "@/components/common/sidebar";

const superAdminBranding: PortalBrandingConfig = {
  title: "fairgig",
  subtitle: "Platform Administration",
  badge: "ADMIN",
  icon: ShieldAlert,
  homePath: "/admin",
  portalTheme: "superadmin",
};

const superAdminNavGroups: SidebarGroupConfig[] = [
  {
    heading: "Overview",
    items: [
      {
        title: "Platform Overview",
        to: "/admin",
        icon: Layers,
        end: true,
      },
      {
        title: "AI Demand & Telemetry",
        to: "/admin/forecasting",
        icon: BrainCircuit,
      },
      {
        title: "Welfare & Insurance",
        to: "/admin/welfare",
        icon: ShieldCheck,
      },
      {
        title: "Payments & Revenue",
        to: "/admin/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    heading: "Governance & Control",
    items: [
      {
        title: "Verifications",
        to: "/admin/verifications",
        icon: CheckCircle2,
      },
      {
        title: "Users & Roles",
        to: "/admin/users",
        icon: Users,
      },
      {
        title: "Services",
        to: "/admin/services",
        icon: BaggageClaim,
      },
    ],
  },
];

export const SuperAdminLayout = () => {
  const headerActions = (
    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:text-emerald-400 select-none">
      <CircleDot className="size-3 text-emerald-500 animate-pulse" />
      <span>Systems Normal</span>
    </div>
  );

  return (
    <DashboardLayout
      currentPortal="superadmin"
      branding={superAdminBranding}
      groups={superAdminNavGroups}
      headerActions={headerActions}
    />
  );
};

export default SuperAdminLayout;