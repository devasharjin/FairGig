import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
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
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 outline-none select-none",
          isActive
            ? "bg-primary text-primary-foreground font-semibold shadow-[0_2px_12px_rgba(23,50,77,0.28)] pl-3.5"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
          showCollapsed && "justify-center px-2 py-2.5"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left accent bar — white/teal on dark bg */}
          {isActive && !showCollapsed && (
            <span
              className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full bg-accent"
              style={{ boxShadow: "1px 0 6px rgba(22,140,131,0.55)" }}
            />
          )}

          {/* Collapsed Active Dot */}
          {isActive && showCollapsed && (
            <span
              className="absolute top-1.5 right-1.5 size-[5px] rounded-full bg-accent"
              style={{ boxShadow: "0 0 5px rgba(22,140,131,0.8)" }}
            />
          )}

          <Icon
            className={cn(
              "size-[17px] shrink-0 transition-all duration-200 stroke-[1.7]",
              isActive
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                : "text-slate-400 group-hover:text-primary group-hover:scale-[1.08]"
            )}
          />

          {!showCollapsed && (
            <span
              className={cn(
                "truncate flex-1 tracking-[-0.01em] leading-normal transition-colors",
                isActive
                  ? "text-white font-semibold"
                  : "text-slate-600 group-hover:text-slate-900"
              )}
            >
              {item.title}
            </span>
          )}

          {!showCollapsed && item.badge && (
            <span
              className={cn(
                "ml-auto text-[9px] px-1.5 py-[3px] rounded-md font-extrabold uppercase tracking-widest leading-none border transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white border-white/25"
                  : "bg-slate-100 text-slate-400 border-slate-200 group-hover:bg-primary/8 group-hover:text-primary group-hover:border-primary/20"
              )}
            >
              {item.badge}
            </span>
          )}

          {/* Collapsed Tooltip */}
          {showCollapsed && (
            <div
              className="pointer-events-none absolute left-full ml-3.5 hidden z-50 group-hover:flex items-center gap-2"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}
            >
              {/* Arrow */}
              <span
                className="size-2.5 rotate-45 bg-slate-900 border-l border-b border-white/10 shrink-0 -mr-[7px]"
              />
              <div className="flex items-center gap-2 bg-slate-900 text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl border border-white/8 whitespace-nowrap animate-in fade-in duration-150">
                <span>{item.title}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-[3px] rounded-md font-extrabold bg-accent/25 text-accent tracking-widest uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};
