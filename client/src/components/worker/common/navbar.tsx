import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  CircleDot,
  Store,
  Layers,
  Briefcase,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  NavbarLogo,
  NavbarNavLink,
  NavbarUserDropdown,
} from "@/components/common/navbar";
import { cn } from "@/lib/utils";

export const WorkerNavbar = () => {
  const [isOnline, setIsOnline] = useState(true);

  const toggleOnlineStatus = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    toast.success(
      nextStatus
        ? "Status: Online (You can receive new gig requests)"
        : "Status: Offline (Gig requests paused)"
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Reusable Brand Logo & Worker Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <NavbarLogo
            to="/worker"
            icon={Wrench}
            subtitle="Worker Portal"
            badge="PRO"
          />

          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <NavbarNavLink to="/worker" end icon={Layers}>
              Dashboard
            </NavbarNavLink>

            <NavbarNavLink to="/worker/jobs" icon={Briefcase}>
              Gigs & Jobs
            </NavbarNavLink>

            <NavbarNavLink
              to="/worker/schedule"
              icon={Calendar}
              className="hidden md:flex"
            >
              Schedule
            </NavbarNavLink>
          </nav>
        </div>

        {/* Right Side: Online Status, Customer View Shortcut, and Reusable User Menu */}
        <div className="flex items-center gap-3">
          {/* Interactive Online/Offline Toggle */}
          <button
            type="button"
            onClick={toggleOnlineStatus}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs",
              isOnline
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/15"
                : "bg-muted/50 text-muted-foreground border-border/70 hover:bg-muted"
            )}
            title={isOnline ? "You are online and accepting gigs" : "You are offline"}
          >
            <CircleDot
              className={cn(
                "size-3",
                isOnline ? "text-emerald-500 animate-pulse" : "text-muted-foreground"
              )}
            />
            <span className="hidden sm:inline">
              {isOnline ? "Online" : "Offline"}
            </span>
          </button>

          {/* Quick Switch to Customer View */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-xl hover:bg-muted/50 transition-colors"
            title="Browse fairgig as a customer"
          >
            <Store className="size-3.5" />
            <span>Customer View</span>
          </Link>

          {/* Reusable User Dropdown with current portal context */}
          <NavbarUserDropdown currentPortal="worker" />
        </div>
      </div>
    </header>
  );
};

export default WorkerNavbar;