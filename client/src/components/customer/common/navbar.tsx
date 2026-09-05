import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Handshake, LogIn, Menu, Home, Grid, UserPlus } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  NavbarLogo,
  NavbarNavLink,
  NavbarUserDropdown,
} from "@/components/common/navbar";

export const CustomerNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sheet on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left Side: Brand Logo & Desktop Navigation Links */}
        <div className="flex items-center gap-8">
          <NavbarLogo
            to="/"
            icon={Handshake}
            subtitle="Cooperative Platform"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <NavbarNavLink to="/" end>
              Home
            </NavbarNavLink>

            <NavbarNavLink to="/services">
              Services
            </NavbarNavLink>
          </nav>
        </div>

        {/* Right Side: Auth Controls & Mobile Menu Toggle in the Right Corner */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            /* Logged In: Reusable User Dropdown */
            <NavbarUserDropdown currentPortal="customer" />
          ) : (
            /* Desktop Not Logged In: Login & Sign Up */
            <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile Menu Toggle Button (In the Right Corner) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 sm:w-80 flex flex-col gap-0 outline-none"
          showCloseButton={true}
        >
          <SheetHeader className="p-4 border-b border-border/50 text-left">
            <SheetTitle className="flex items-center gap-2 text-base font-bold">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Handshake className="size-4" />
              </div>
              <span className="leading-none">
                <span>fair</span>
                <span className="text-primary font-extrabold ml-0.5">gig</span>
              </span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Cooperative Platform Navigation
            </SheetDescription>
          </SheetHeader>

          {/* Navigation Links in Mobile Sheet */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Home className="size-4 text-muted-foreground" />
              <span>Home</span>
            </Link>

            <Link
              to="/services"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Grid className="size-4 text-muted-foreground" />
              <span>Services</span>
            </Link>
          </div>

          {/* Bottom Auth Section in Mobile Sheet */}
          {!user && (
            <div className="p-4 border-t border-border/50 space-y-2 bg-muted/20">
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="w-full block"
              >
                <Button variant="outline" className="w-full justify-center gap-2 rounded-xl">
                  <LogIn className="size-4" />
                  <span>Log In</span>
                </Button>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileOpen(false)}
                className="w-full block"
              >
                <Button className="w-full justify-center gap-2 rounded-xl">
                  <UserPlus className="size-4" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default CustomerNavbar;