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
  ArrowRight,
  Mic,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/features/auth/store";
import { useVoiceAssistantStore } from "@/features/customer/voice/voiceStore";
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
import { NotificationBell } from "@/components/common/notifications/NotificationBell";

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-[#0F2338] shadow-xs transition-colors">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left Side: Brand Logo & Desktop Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <NavbarLogo
            to="/"
            icon={Handshake}
            subtitle="Cooperative Platform"
          />

          {/* Desktop Navigation Links — Ultra-clean text pills */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
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
              Contact
            </NavbarNavLink>
          </nav>
        </div>

        {/* Right Side: Voice Booking, Auth Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* AI Voice Assistant Trigger Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => useVoiceAssistantStore.getState().openAssistant()}
            className="h-9 px-3 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs gap-1.5 cursor-pointer shadow-xs"
          >
            <Mic className="size-3.5 text-accent animate-pulse" />
            <span className="hidden sm:inline">Voice Booking</span>
          </Button>

          {/* Real-Time Notification Bell */}
          {user && <NotificationBell />}

          {user ? (
            /* Logged In: Reusable Clean User Dropdown */
            <NavbarUserDropdown currentPortal="customer" />
          ) : (
            /* Desktop Not Logged In: Log In & Get Started CTA */
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-9 px-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <LogIn className="size-3.5 mr-1.5 opacity-70" />
                  <span>Log In</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="rounded-lg h-9 px-4 text-xs font-semibold shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5 ml-1.5 opacity-80" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
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
          className="p-0 w-72 sm:w-80 flex flex-col gap-0 outline-none bg-card border-r border-border"
          showCloseButton={true}
        >
          {/* Mobile Sheet Header */}
          <SheetHeader className="p-4 border-b border-border/50 text-left">
            <SheetTitle className="flex items-center gap-2 text-base font-bold">
              <div className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Handshake className="size-4" />
              </div>
              <span className="tracking-tight text-foreground">fair<span className="text-accent">gig</span></span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Cooperative Gig Services Platform
            </SheetDescription>
          </SheetHeader>

          {/* User Profile Card in Drawer (if logged in) */}
          {user && (
            <div className="p-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="size-4" />}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {user.name || "Customer"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email || ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2 py-1 block">
              Menu
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.end
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  <Icon className="size-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Sheet Footer / Action Buttons */}
          <div className="p-4 border-t border-border/50 space-y-2 bg-muted/10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsMobileOpen(false);
                useVoiceAssistantStore.getState().openAssistant();
              }}
              className="w-full justify-center gap-2 rounded-lg text-xs font-semibold text-primary border-primary/25 bg-primary/5 hover:bg-primary/10 cursor-pointer h-9 mb-1"
            >
              <Mic className="size-3.5 text-accent animate-pulse" />
              <span>AI Voice Booking Assistant</span>
            </Button>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-center gap-2 rounded-lg text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer h-9"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-lg text-xs font-semibold h-9"
                  >
                    <LogIn className="size-3.5 mr-1.5" />
                    <span>Log In</span>
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button
                    size="sm"
                    className="w-full rounded-lg text-xs font-semibold h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>Create Customer Account</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Helpline / Verification Notice */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>Cooperative Guarantee Protection</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default CustomerNavbar;