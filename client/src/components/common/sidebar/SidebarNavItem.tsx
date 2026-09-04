import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SidebarItemConfig } from "./types";
import { useSidebar } from "./SidebarContext";

interface SidebarNavItemProps {
  item: SidebarItemConfig;
  isMobileDrawer?: boolean;
}

export const SidebarNavItem = ({ item, isMobileDrawer = false }: SidebarNavItemProps) => {
  const { isCollapsed } = useSidebar();
  const Icon = item.icon;
  const showCollapsed = isCollapsed && !isMobileDrawer;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={showCollapsed ? item.title : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none select-none",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          showCollapsed && "justify-center px-2"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "size-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
              isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}
          />

          {!showCollapsed && (
            <span className="truncate flex-1 tracking-tight">{item.title}</span>
          )}

          {!showCollapsed && item.badge && (
            <Badge
              variant={item.badgeVariant || (isActive ? "secondary" : "outline")}
              className={cn(
                "ml-auto text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold uppercase tracking-wider rounded-md",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                  : "bg-muted text-muted-foreground border-border/60"
              )}
            >
              {item.badge}
            </Badge>
          )}

          {/* Collapsed Tooltip Floating Bubble (Desktop Only) */}
          {showCollapsed && (
            <div className="pointer-events-none absolute left-full ml-2.5 hidden z-50 rounded-lg bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg border border-border/80 whitespace-nowrap group-hover:flex items-center gap-1.5">
              <span>{item.title}</span>
              {item.badge && (
                <span className="text-[10px] px-1 rounded bg-primary/10 text-primary font-bold">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};
