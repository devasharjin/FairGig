import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface NavbarLogoProps {
  to?: string;
  icon?: LucideIcon;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export const NavbarLogo = ({
  to = "/",
  icon: Icon = Handshake,
  subtitle = "Cooperative Platform",
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
      <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs shrink-0">
        <Icon className="size-5" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight flex items-center leading-none">
            <span className="text-foreground">fair</span>
            <span className="text-primary font-extrabold ml-0.5">gig</span>
          </span>
          {subtitle && (
            <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
              {subtitle}
            </span>
          )}
        </div>
        {badge && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20 hidden sm:inline-flex"
          >
            {badge}
          </Badge>
        )}
      </div>
    </Link>
  );
};

export default NavbarLogo;
