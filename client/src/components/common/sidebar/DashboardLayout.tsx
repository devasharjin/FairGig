import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./SidebarContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import type { PortalBrandingConfig, SidebarGroupConfig } from "./types";

export interface DashboardLayoutProps {
  currentPortal: "worker" | "superadmin" | "cooperative";
  branding: PortalBrandingConfig;
  groups: SidebarGroupConfig[];
  headerActions?: React.ReactNode;
}

export const DashboardLayout = ({
  currentPortal,
  branding,
  groups,
  headerActions,
}: DashboardLayoutProps) => {
  return (
    <SidebarProvider portalTheme={branding.portalTheme || currentPortal}>
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Responsive Dashboard Sidebar */}
        <DashboardSidebar branding={branding} groups={groups} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          {/* Top Dashboard Header */}
          <DashboardHeader
            currentPortal={currentPortal}
            portalTitle={branding.subtitle || branding.title}
            portalBadge={branding.badge}
          >
            {headerActions}
          </DashboardHeader>

          {/* Page Viewport */}
          <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </main>

          {/* Minimal Dashboard Footer */}
          <footer className="border-t border-border/40 py-3 px-6 text-center text-xs text-muted-foreground/80 select-none">
            fairgig platform &copy; {new Date().getFullYear()} &bull; Cooperative Gig Services
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
