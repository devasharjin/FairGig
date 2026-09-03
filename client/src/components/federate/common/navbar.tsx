import { Link } from "react-router-dom";
import {
  Landmark,
  Layers,
  Building2,
  Scale,
  Store,
} from "lucide-react";

import {
  NavbarLogo,
  NavbarNavLink,
  NavbarUserDropdown,
} from "@/components/common/navbar";

export const FederationNavbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Reusable Brand Logo & Federation NavLinks */}
        <div className="flex items-center gap-6 sm:gap-8">
          <NavbarLogo
            to="/federation"
            icon={Landmark}
            subtitle="Apex Federation Portal"
            badge="APEX"
          />

          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <NavbarNavLink to="/federation" end icon={Layers}>
              Dashboard
            </NavbarNavLink>

            <NavbarNavLink to="/federation/cooperatives" icon={Building2}>
              Affiliated Co-ops
            </NavbarNavLink>

            <NavbarNavLink
              to="/federation/policies"
              icon={Scale}
              className="hidden md:flex"
            >
              Policies & Rates
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

          <NavbarUserDropdown currentPortal="federation" />
        </div>
      </div>
    </header>
  );
};

export default FederationNavbar;