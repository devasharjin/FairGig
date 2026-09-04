import {
  Landmark,
  Layers,
  Building2,
  Scale,
} from "lucide-react";
import {
  DashboardLayout,
  type PortalBrandingConfig,
  type SidebarGroupConfig,
} from "@/components/common/sidebar";

const federationBranding: PortalBrandingConfig = {
  title: "fairgig",
  subtitle: "Apex Federation Portal",
  badge: "APEX",
  icon: Landmark,
  homePath: "/federation",
};

const federationNavGroups: SidebarGroupConfig[] = [
  {
    heading: "Overview",
    items: [
      {
        title: "Apex Dashboard",
        to: "/federation",
        icon: Layers,
        end: true,
      },
    ],
  },
  {
    heading: "Governance & Network",
    items: [
      {
        title: "Affiliated Co-ops",
        to: "/federation/cooperatives",
        icon: Building2,
      },
      {
        title: "Policies & Rates",
        to: "/federation/policies",
        icon: Scale,
      },
    ],
  },
];

export const FederationLayout = () => {
  return (
    <DashboardLayout
      currentPortal="federation"
      branding={federationBranding}
      groups={federationNavGroups}
    />
  );
};

export default FederationLayout;