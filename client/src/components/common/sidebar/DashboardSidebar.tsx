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
    <div className="flex flex-col h-full select-none bg-[#0F2338] text-slate-200">
      {/* Sidebar Header / Logo */}
      <div
        className={cn(
          "h-16 flex items-center px-4 border-b border-[#1F364D] shrink-0 transition-all",
          isCollapsed && !isMobile ? "justify-center px-2" : "justify-between"
        )}
      >
        <Link
          to={branding.homePath}
          className="flex items-center gap-2.5 group outline-none overflow-hidden"
          title={`${branding.title || "fairgig"} - ${branding.subtitle || ""}`}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          <div className="size-8 rounded-lg bg-teal-600 text-white flex items-center justify-center transition-all duration-200 shadow-xs shrink-0 group-hover:bg-teal-500">
            <BrandIcon className="size-4" />
          </div>

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col overflow-hidden leading-none pr-4">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight flex items-center">
                  <span className="text-white">fair</span>
                  <span className="text-teal-400 font-bold ml-0.5">gig</span>
                </span>
                {branding.badge && (
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 font-bold uppercase tracking-wider bg-teal-500/15 text-teal-300 border-teal-400/30"
                  >
                    {branding.badge}
                  </Badge>
                )}
              </div>
              {branding.subtitle && (
                <span className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
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
      <div className="p-3 border-t border-[#1F364D] shrink-0 bg-[#0B1A2B]/60">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-colors bg-[#17324D]/60 border border-[#1F364D]/80",
            isCollapsed && !isMobile && "justify-center p-1.5"
          )}
        >
          <div className="size-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="size-4" />}
          </div>

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || "My Account"}
              </span>
              <span className="text-[10px] text-slate-400 truncate uppercase font-medium">
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
              "mt-2 w-full hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer",
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
          "hidden lg:flex flex-col sticky top-0 h-screen border-r border-[#1F364D] bg-[#0F2338] text-slate-200 transition-all duration-300 shrink-0 z-30",
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
          className="p-0 w-72 sm:w-80 bg-[#0F2338] text-slate-200 border-[#1F364D] flex flex-col gap-0 outline-none"
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
