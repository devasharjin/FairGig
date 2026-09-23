import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavbarNavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  end?: boolean;
  className?: string;
  isCompact?: boolean;
  stackWords?: boolean;
  isNonEnglish?: boolean;
}

export const NavbarNavLink = ({
  to,
  children,
  icon: Icon,
  end = false,
  className,
  isCompact = false,
  stackWords = false,
  isNonEnglish = false,
}: NavbarNavLinkProps) => {
  const isMultiWord =
    stackWords &&
    typeof children === "string" &&
    children.trim().includes(" ");

  const words = isMultiWord ? (children as string).trim().split(/\s+/) : [];
  const firstWord = words[0];
  const secondWord = words.slice(1).join(" ");

  // Dynamic sizing: Non-English scripts (Malayalam, Tamil, Hindi, Telugu) get bold font with refined, balanced sizing
  const sizingClasses = isNonEnglish
    ? isMultiWord
      ? "px-2 md:px-2.5 py-0.5 text-[11px] md:text-[11.5px] xl:text-xs font-bold tracking-tight min-h-9 h-9"
      : isCompact
      ? "px-2.5 md:px-3 py-1 text-xs md:text-[12.5px] xl:text-[13px] font-bold tracking-tight min-h-9 h-9"
      : "px-3 sm:px-3.5 py-1.5 text-[13px] sm:text-[13.5px] font-bold tracking-tight min-h-9 h-9"
    : isCompact
    ? "px-2 md:px-2.5 py-1 text-[11px] md:text-xs xl:text-[12.5px] tracking-tight min-h-9 h-9 font-medium"
    : "px-3.5 py-1.5 text-sm font-medium";

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 select-none text-center",
          sizingClasses,
          isMultiWord ? "leading-[1.15]" : "whitespace-nowrap",
          isActive
            ? "bg-slate-300 dark:bg-slate-800 text-primary dark:text-teal-300 shadow-xs"
            : isNonEnglish
            ? "text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
            : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50",
          className
        )
      }
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {isMultiWord ? (
        <span className="flex flex-col items-center justify-center text-center">
          <span className="whitespace-nowrap">{firstWord}</span>
          <span className="whitespace-nowrap">{secondWord}</span>
        </span>
      ) : (
        <span className="truncate">{children}</span>
      )}
    </NavLink>
  );
};

export default NavbarNavLink;
