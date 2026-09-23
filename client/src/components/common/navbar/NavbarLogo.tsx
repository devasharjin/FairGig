import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface NavbarLogoProps {
  to?: string;
  icon?: LucideIcon;
  subtitle?: string;
  subtitleClassName?: string;
  badge?: string;
  className?: string;
}

export const NavbarLogo = ({
  to = "/",
  icon: Icon = Handshake,
  subtitle = "Cooperative Platform",
  subtitleClassName,
  badge,
  className,
}: NavbarLogoProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 group transition-transform active:scale-98 select-none shrink-0",
        className
      )}
    >
      <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-all duration-200 shadow-xs shrink-0 group-hover:bg-primary/90">
        <Icon className="size-4" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight flex items-center leading-none">
            <span className="text-foreground">fair</span>
            <span className="text-accent font-bold ml-0.5">gig</span>
          </span>
          {subtitle && (
            <span
              className={cn(
                "text-[10px] text-muted-foreground font-medium tracking-normal mt-0.5",
                subtitleClassName
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
        {badge && (
          <Badge
            variant="outline"
            className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider bg-accent/10 text-accent border-accent/25 hidden sm:inline-flex"
          >
            {badge}
          </Badge>
        )}
      </div>
    </Link>
  );
};

export default NavbarLogo;
