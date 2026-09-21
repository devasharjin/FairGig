import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavbarNavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  end?: boolean;
  className?: string;
}

export const NavbarNavLink = ({
  to,
  children,
  icon: Icon,
  end = false,
  className,
}: NavbarNavLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "px-3.5 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer flex items-center gap-1.5 select-none",
          isActive
            ? "bg-slate-300 dark:bg-slate-800 text-primary dark:text-teal-300 font-semibold shadow-xs"
            : "text-slate-600 dark:text-slate-400 font-medium hover:text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50",
          className
        )
      }
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span>{children}</span>
    </NavLink>
  );
};

export default NavbarNavLink;
