import type { LucideIcon } from "lucide-react";

export interface SidebarItemConfig {
  title: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  isExternal?: boolean;
}

export interface SidebarGroupConfig {
  heading?: string;
  items: SidebarItemConfig[];
}

export interface PortalBrandingConfig {
  title?: string;
  subtitle?: string;
  badge?: string;
  icon: LucideIcon;
  homePath: string;
  portalTheme?: "worker" | "cooperative" | "superadmin";
}
