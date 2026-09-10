import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Handshake,
  LogIn,
  Menu,
  Home,
  Grid,
  UserPlus,
  Briefcase,
  User,
  LogOut,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/features/auth/store";
import { logout } from "@/features/auth/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const { user, clearAuth } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sheet on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore network errors on logout
    }
    clearAuth();
    toast.success("Logged out successfully");
    setIsMobileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/services", label: "Services", icon: Grid },
    ...(user
      ? [
          { to: "/bookings", label: "My Bookings", icon: Briefcase },
          { to: "/profile", label: "My Profile", icon: User },
        ]
      : []),
    { to: "/contact", label: "Contact Us", icon: PhoneCall },
  ];

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

            {user && (
              <>
                <NavbarNavLink to="/bookings">
                  My Bookings
                </NavbarNavLink>

                <NavbarNavLink to="/profile">
                  My Profile
                </NavbarNavLink>
              </>
            )}

            <NavbarNavLink to="/contact">
              Contact Us
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
          {/* Mobile Sheet Header */}
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

          {/* User Profile Card (if authenticated) */}
          {user && (
            <div className="p-4 border-b border-border/40 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs sm:text-sm text-foreground truncate">
                      {user.name || "Customer"}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 h-3.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold"
                    >
                      <ShieldCheck className="size-2.5 mr-0.5" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links in Mobile Sheet */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.end
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon
                    className={`size-4 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Action Section in Mobile Sheet */}
          <div className="p-4 border-t border-border/50 bg-muted/20">
            {user ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-center gap-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Log Out</span>
              </Button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full block"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 rounded-xl text-xs font-semibold"
                  >
                    <LogIn className="size-3.5" />
                    <span>Log In</span>
                  </Button>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full block"
                >
                  <Button className="w-full justify-center gap-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground">
                    <UserPlus className="size-3.5" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default CustomerNavbar;