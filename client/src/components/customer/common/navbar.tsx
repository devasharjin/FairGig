import { Link } from "react-router-dom";
import { Handshake, LogIn } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import {
  NavbarLogo,
  NavbarNavLink,
  NavbarUserDropdown,
} from "@/components/common/navbar";

export const CustomerNavbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left Side: Reusable Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <NavbarLogo
            to="/"
            icon={Handshake}
            subtitle="Cooperative Platform"
          />

          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <NavbarNavLink to="/" end>
              Home
            </NavbarNavLink>

            <NavbarNavLink to="/categories">
              Categories
            </NavbarNavLink>
          </nav>
        </div>

        {/* Right Side: Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            /* Logged In: Reusable User Dropdown */
            <NavbarUserDropdown currentPortal="customer" />
          ) : (
            /* Not Logged In: Login & Sign Up */
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl h-9 px-3.5 text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <LogIn className="size-3.5 mr-1.5" />
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="rounded-xl h-9 px-4 text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;