import { Link } from "react-router-dom";
import {
  Building2,
  Layers,
  Users,
  Briefcase,
  Store,
} from "lucide-react";

import {
  NavbarLogo,
  NavbarNavLink,
  NavbarUserDropdown,
} from "@/components/common/navbar";

export const CooperativeNavbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Reusable Brand Logo & Cooperative NavLinks */}
        <div className="flex items-center gap-6 sm:gap-8">
          <NavbarLogo
            to="/cooperative"
            icon={Building2}
            subtitle="Cooperative Portal"
            badge="SOCIETY"
          />

          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <NavbarNavLink to="/cooperative" end icon={Layers}>
              Dashboard
            </NavbarNavLink>

            <NavbarNavLink to="/cooperative/members" icon={Users}>
              Members
            </NavbarNavLink>

            <NavbarNavLink
              to="/cooperative/bids"
              icon={Briefcase}
              className="hidden md:flex"
            >
              Contracts & Bids
            </NavbarNavLink>
          </nav>
        </div>

        {/* Right: Customer View shortcut and User Dropdown */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden lg:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-xl hover:bg-muted/50 transition-colors"
            title="Browse fairgig as a customer"
          >
            <Store className="size-3.5" />
            <span>Customer View</span>
          </Link>

          <NavbarUserDropdown currentPortal="cooperative" />
        </div>
      </div>
    </header>
  );
};

export default CooperativeNavbar;