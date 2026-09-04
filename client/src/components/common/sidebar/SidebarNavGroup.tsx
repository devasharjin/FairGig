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
            "px-3 pt-4 pb-1 text-[11px] font-bold tracking-wider text-muted-foreground/70 uppercase select-none transition-all",
            showCollapsed && "px-0 text-center text-[9px] truncate"
          )}
        >
          {showCollapsed ? "• • •" : group.heading}
        </div>
      )}

      <nav className="flex flex-col space-y-1">
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
