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
          "group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-150 outline-none select-none",
          isActive
            ? "bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 shadow-xs"
            : "text-slate-300 hover:bg-white/5 hover:text-white",
          showCollapsed && "justify-center px-2"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "size-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
              isActive ? "text-teal-300" : "text-slate-400 group-hover:text-slate-200"
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
                  ? "bg-teal-400/20 text-teal-300 border-teal-400/30"
                  : "bg-white/10 text-slate-300 border-white/10"
              )}
            >
              {item.badge}
            </Badge>
          )}

          {/* Collapsed Tooltip Floating Bubble (Desktop Only) */}
          {showCollapsed && (
            <div className="pointer-events-none absolute left-full ml-2.5 hidden z-50 rounded-lg bg-[#132235] text-slate-100 px-2.5 py-1 text-xs font-semibold shadow-xl border border-slate-700 whitespace-nowrap group-hover:flex items-center gap-1.5">
              <span>{item.title}</span>
              {item.badge && (
                <span className="text-[10px] px-1 rounded bg-teal-500/20 text-teal-300 font-bold">
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
