import {
  Building2,
  Layers,
  Users,
  Briefcase,
  UserCheck,
  Wallet,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  DashboardLayout,
  type PortalBrandingConfig,
  type SidebarGroupConfig,
} from "@/components/common/sidebar";

const cooperativeBranding: PortalBrandingConfig = {
  title: "fairgig",
  subtitle: "Cooperative Portal",
  badge: "SOCIETY",
  icon: Building2,
  homePath: "/cooperative",
  portalTheme: "cooperative",
};

const cooperativeNavGroups: SidebarGroupConfig[] = [
  {
    heading: "Overview",
    items: [
      {
        title: "Dashboard",
        to: "/cooperative",
        icon: Layers,
        end: true,
      },
      {
        title: "AI Demand & Allocation",
        to: "/cooperative/forecasting",
        icon: TrendingUp,
      },
      {
        title: "Welfare & Insurance",
        to: "/cooperative/welfare",
        icon: ShieldCheck,
      },
      {
        title: "Payments & Payouts",
        to: "/cooperative/payments",
        icon: Wallet,
      },
    ],
  },
  {
    heading: "Society Operations",
    items: [
      {
        title: "Worker Verifications",
        to: "/cooperative/verifications",
        icon: UserCheck,
      },
      {
        title: "Members Directory",
        to: "/cooperative/members",
        icon: Users,
      },
    ],
  },
];

export const CooperativeLayout = () => {
  return (
    <DashboardLayout
      currentPortal="cooperative"
      branding={cooperativeBranding}
      groups={cooperativeNavGroups}
    />
  );
};

export default CooperativeLayout;