import { Menu, PanelLeft, PanelLeftClose, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavbarUserDropdown } from "@/components/common/navbar/NavbarUserDropdown";
import { NotificationBell } from "@/components/common/notifications/NotificationBell";
import { useSidebar } from "./SidebarContext";

export interface DashboardHeaderProps {
  currentPortal: "worker" | "superadmin" | "cooperative";
  portalTitle?: string;
  portalBadge?: string;
  children?: React.ReactNode;
}

export const DashboardHeader = ({
  currentPortal,
  portalTitle,
  portalBadge,
  children,
}: DashboardHeaderProps) => {
  const { isCollapsed, toggleCollapse, toggleMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-20 w-full h-16 border-b border-slate-200/80 dark:border-border/80 bg-white/95 dark:bg-card/90 backdrop-blur-md shadow-2xs">
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left: Desktop Collapse Trigger + Portal Context */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop collapse toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden lg:flex size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Portal Title / Breadcrumb context */}
          {portalTitle && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground tracking-tight">
                {portalTitle}
              </span>
              {portalBadge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25 hidden sm:inline-block">
                  {portalBadge}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Custom Actions + Customer View + User Dropdown + Mobile Menu Toggle in Right Corner */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role-specific custom actions slot */}
          {children}

          {/* Quick link to customer marketplace */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted/60 transition-colors"
            title="Browse fairgig as a customer"
          >
            <Store className="size-3.5" />
            <span className="hidden md:inline">Customer View</span>
          </Link>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User profile dropdown */}
          <NavbarUserDropdown currentPortal={currentPortal} />

          {/* Mobile navigation toggle button in the right corner */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobile}
            className="lg:hidden size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="size-4" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
