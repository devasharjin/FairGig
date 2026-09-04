import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/features/auth/store";
import type { PortalBrandingConfig, SidebarGroupConfig } from "./types";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { useSidebar } from "./SidebarContext";

interface DashboardSidebarProps {
  branding: PortalBrandingConfig;
  groups: SidebarGroupConfig[];
  className?: string;
}

export const DashboardSidebar = ({
  branding,
  groups,
  className,
}: DashboardSidebarProps) => {
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebar();
  const { user } = useAuthStore();
  const BrandIcon = branding.icon;

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full select-none">
      {/* Sidebar Header / Logo */}
      <div
        className={cn(
          "h-16 flex items-center px-4 border-b border-sidebar-border shrink-0 transition-all",
          isCollapsed && !isMobile ? "justify-center px-2" : "justify-between"
        )}
      >
        <Link
          to={branding.homePath}
          className="flex items-center gap-3 group outline-none overflow-hidden"
          title={`${branding.title || "fairgig"} - ${branding.subtitle || ""}`}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs shrink-0">
            <BrandIcon className="size-5" />
          </div>

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col overflow-hidden leading-none pr-6">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight flex items-center">
                  <span className="text-foreground">fair</span>
                  <span className="text-primary font-extrabold ml-0.5">gig</span>
                </span>
                {branding.badge && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/25"
                  >
                    {branding.badge}
                  </Badge>
                )}
              </div>
              {branding.subtitle && (
                <span className="text-[11px] text-muted-foreground font-medium truncate mt-1">
                  {branding.subtitle}
                </span>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar">
        {groups.map((group, idx) => (
          <SidebarNavGroup
            key={group.heading || idx}
            group={group}
            isMobileDrawer={isMobile}
          />
        ))}
      </div>

      {/* Sidebar Footer / User Context Card */}
      <div className="p-3 border-t border-sidebar-border shrink-0 bg-sidebar/50">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-colors bg-muted/40",
            isCollapsed && !isMobile && "justify-center p-1.5"
          )}
        >
          <div className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="size-4" />}
          </div>

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.name || "My Account"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase font-medium">
                {branding.badge || "User"}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse / Expand Toggle Button at Bottom */}
        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "mt-2 w-full hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="size-4 shrink-0" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col sticky top-0 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0 z-30",
          isCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer using Shadcn Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 sm:w-80 bg-sidebar text-sidebar-foreground border-sidebar-border flex flex-col gap-0 outline-none"
          showCloseButton={true}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>
              {branding.title || "fairgig"} - {branding.subtitle || "Portal Navigation"}
            </SheetTitle>
            <SheetDescription>
              Portal navigation menu and account details
            </SheetDescription>
          </SheetHeader>
          {sidebarContent(true)}
        </SheetContent>
      </Sheet>
    </>
  );
};
