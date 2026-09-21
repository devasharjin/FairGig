import { cn } from "@/lib/utils";
import type { SidebarGroupConfig } from "./types";
import { SidebarNavItem } from "./SidebarNavItem";
import { useSidebar } from "./SidebarContext";

interface SidebarNavGroupProps {
  group: SidebarGroupConfig;
  isMobileDrawer?: boolean;
}

export const SidebarNavGroup = ({
  group,
  isMobileDrawer = false,
}: SidebarNavGroupProps) => {
  const { isCollapsed } = useSidebar();
  const showCollapsed = isCollapsed && !isMobileDrawer;

  return (
    <div className="flex flex-col space-y-1">
      {group.heading && (
        <div
          className={cn(
            "px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase select-none transition-all",
            showCollapsed && "px-0 pt-4 pb-1 text-center text-[9px] text-muted-foreground font-semibold"
          )}
        >
          {showCollapsed ? "•••" : group.heading}
        </div>
      )}

      <nav className="flex flex-col space-y-1.5">
        {group.items.map((item) => (
          <SidebarNavItem
            key={item.to}
            item={item}
            isMobileDrawer={isMobileDrawer}
          />
        ))}
      </nav>
    </div>
  );
};
