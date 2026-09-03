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
          "px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 select-none",
          isActive
            ? "text-primary font-semibold bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
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
