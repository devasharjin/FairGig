import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Layers,
  CheckCircle2,
  Users,
  Store,
  CircleDot,
} from "lucide-react";

import {
  NavbarLogo,
  NavbarNavLink,
  NavbarUserDropdown,
} from "@/components/common/navbar";

export const SuperAdminNavbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Reusable Brand Logo & SuperAdmin NavLinks */}
        <div className="flex items-center gap-6 sm:gap-8">
          <NavbarLogo
            to="/admin"
            icon={ShieldAlert}
            subtitle="Platform Administration"
            badge="ADMIN"
          />

          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <NavbarNavLink to="/admin" end icon={Layers}>
              Overview
            </NavbarNavLink>

            <NavbarNavLink to="/admin/verifications" icon={CheckCircle2}>
              Verifications
            </NavbarNavLink>

            <NavbarNavLink
              to="/admin/users"
              icon={Users}
              className="hidden md:flex"
            >
              Users & Roles
            </NavbarNavLink>
          </nav>
        </div>

        {/* Right Side: System Status, Customer View, and User Dropdown */}
        <div className="flex items-center gap-3">
          {/* Live System Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:text-emerald-400">
            <CircleDot className="size-3 text-emerald-500 animate-pulse" />
            <span>Systems Normal</span>
          </div>

          {/* Customer View shortcut */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-xl hover:bg-muted/50 transition-colors"
            title="Browse fairgig as a customer"
          >
            <Store className="size-3.5" />
            <span>Customer View</span>
          </Link>

          {/* SuperAdmin User Dropdown */}
          <NavbarUserDropdown currentPortal="superadmin" />
        </div>
      </div>
    </header>
  );
};

export default SuperAdminNavbar;