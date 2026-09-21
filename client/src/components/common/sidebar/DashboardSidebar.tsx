import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col h-full select-none bg-card text-foreground">
      {/* Sidebar Header / Logo */}
      <div
        className={cn(
          "h-16 flex items-center px-4 border-b border-border shrink-0 transition-all duration-300",
          isCollapsed && !isMobile ? "justify-center px-2" : "justify-between"
        )}
      >
        <Link
          to={branding.homePath}
          className="flex items-center gap-3 group outline-none overflow-hidden"
          title={`${branding.title || "fairgig"} - ${branding.subtitle || ""}`}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          {/* Brand Emblem — Deep Navy with inner glow + teal icon */}
          <div
            className="size-9 rounded-xl shrink-0 flex items-center justify-center transition-all duration-200 group-hover:scale-[1.06]"
            style={{
              background: "linear-gradient(135deg, #1e3f5c 0%, #17324D 60%, #142a40 100%)",
              boxShadow: "0 2px 10px rgba(23,50,77,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <BrandIcon className="size-[18px] text-accent" style={{ filter: "drop-shadow(0 0 4px rgba(22,140,131,0.6))" }} />
          </div>

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col overflow-hidden leading-none pr-2 gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[15px] tracking-tight flex items-center leading-none">
                  <span className="text-slate-800">fair</span>
                  <span className="text-accent">gig</span>
                </span>
                {branding.badge && (
                  <span
                    className="text-[8px] px-1.5 py-[3px] font-extrabold uppercase tracking-[0.13em] rounded-md leading-none"
                    style={{
                      background: "rgba(22,140,131,0.1)",
                      color: "#168C83",
                      border: "1px solid rgba(22,140,131,0.22)",
                    }}
                  >
                    {branding.badge}
                  </span>
                )}
              </div>
              {branding.subtitle && (
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.08em] truncate leading-none">
                  {branding.subtitle}
                </span>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups List (Scrollable) */}
      {/* Navigation Groups List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 select-none scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {groups.map((group, idx) => (
          <SidebarNavGroup
            key={group.heading || idx}
            group={group}
            isMobileDrawer={isMobile}
          />
        ))}
      </div>

      {/* Sidebar Footer / User Context Card */}
      <div className="p-3 border-t border-border shrink-0 bg-muted/20 space-y-2">
        {/* User Card */}
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-all duration-150 bg-card hover:bg-muted/60 border border-border shadow-2xs group",
            isCollapsed && !isMobile && "justify-center p-1.5"
          )}
        >
          {/* Avatar with status indicator */}
          <div className="relative shrink-0">
            <div className="size-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="size-4" />}
            </div>
            {/* Online indicator dot */}
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
          </div>

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {user?.name || "My Account"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase font-medium">
                {branding.badge || "Authenticated"}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse / Expand Toggle Button */}
        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "w-full hidden lg:flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer",
              isCollapsed && "justify-center px-0 py-2"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            ) : (
              <>
                <span className="text-[11px] text-muted-foreground font-medium">Collapse menu</span>
                <ChevronLeft className="size-4 shrink-0" />
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
          "hidden lg:flex flex-col sticky top-0 h-screen border-r border-border bg-card text-foreground transition-all duration-300 shrink-0 z-30 shadow-2xs",
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
          className="p-0 w-72 sm:w-80 bg-card text-foreground border-r border-border flex flex-col gap-0 outline-none"
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

export default DashboardSidebar;
