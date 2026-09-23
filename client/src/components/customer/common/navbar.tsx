import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { NotificationBell } from "@/components/common/notifications/NotificationBell";
import { LanguageSelector } from "./LanguageSelector";
import { cn } from "@/lib/utils";

export const CustomerNavbar = () => {
  const { t, i18n } = useTranslation();
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
    { to: "/", label: t("nav.home"), icon: Home, end: true },
    { to: "/services", label: t("nav.services"), icon: Grid },
    ...(user
      ? [
        { to: "/bookings", label: t("nav.myBookings"), icon: Briefcase },
        { to: "/profile", label: t("nav.myProfile"), icon: User },
      ]
      : []),
    { to: "/contact", label: t("nav.contact"), icon: PhoneCall },
  ];

  // Dynamic language & length detection:
  // If active language is Malayalam or localized menu labels are long,
  // proportionally decrease menu size and ensure menus never crowd or cover the language selector.
  const currentLang = (i18n.language || "en").split("-")[0];
  const isMalayalam = currentLang === "ml";
  const isNonEnglish = currentLang !== "en";
  const maxLabelLength = Math.max(
    ...navLinks.map((l) => (typeof l.label === "string" ? l.label.length : 0))
  );
  const isHighLength = isMalayalam || maxLabelLength > 12;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-[#0F2338] shadow-xs transition-colors">
      <div className="w-full flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-2">
        {/* Left Side: Brand Logo & Desktop Navigation Links */}
        <div
          className={cn(
            "flex items-center min-w-0 mr-3 lg:mr-6",
            isHighLength
              ? "gap-2.5 md:gap-3 lg:gap-4 xl:gap-6"
              : "gap-6 lg:gap-8 xl:gap-10"
          )}
        >
          <NavbarLogo
            to="/"
            icon={Handshake}
            subtitle={t("nav.cooperativePlatform")}
            subtitleClassName={
              isHighLength
                ? "hidden xl:block max-w-[130px] truncate"
                : undefined
            }
          />

          {/* Desktop Navigation Links — Dynamically scaled and styled */}
          <nav
            className={cn(
              "hidden md:flex items-center transition-all duration-200 select-none",
              isNonEnglish ? "font-bold" : "font-medium",
              isHighLength
                ? "gap-1 xl:gap-1.5"
                : "gap-1 text-sm"
            )}
          >
            {navLinks.map((link) => (
              <NavbarNavLink
                key={link.to}
                to={link.to}
                end={link.end}
                isCompact={isHighLength}
                stackWords={isMalayalam}
                isNonEnglish={isNonEnglish}
              >
                {link.label}
              </NavbarNavLink>
            ))}
          </nav>
        </div>

        {/* Right Side: Language Switcher, Auth Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 ml-auto">
          {/* Customer Language Selector Dropdown */}
          <LanguageSelector />

          {/* Real-Time Notification Bell */}
          {user && <NotificationBell />}

          {user ? (
            /* Logged In: Reusable Clean User Dropdown */
            <NavbarUserDropdown currentPortal="customer" />
          ) : (
            /* Desktop Not Logged In: Log In & Get Started CTA */
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-lg h-9 font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors whitespace-nowrap",
                    isHighLength ? "px-2.5 text-xs" : "px-3.5 text-xs"
                  )}
                >
                  <LogIn className="size-3.5 mr-1.5 opacity-70 shrink-0" />
                  <span>{t("nav.logIn")}</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className={cn(
                    "rounded-lg h-9 font-semibold shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 whitespace-nowrap",
                    isHighLength ? "px-3 text-xs" : "px-4 text-xs"
                  )}
                >
                  <span>{t("nav.getStarted")}</span>
                  <ArrowRight className="size-3.5 ml-1.5 opacity-80 shrink-0" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer shrink-0"
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
              {t("nav.cooperativePlatform")}
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

          {/* Mobile Navigation Links and Language Switcher */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2 py-1 block">
                {t("nav.menu")}
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
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      isNonEnglish ? "text-sm font-bold" : "text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : isNonEnglish
                        ? "text-slate-800 dark:text-slate-200 hover:text-foreground hover:bg-muted/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Language Selector */}
            <div className="pt-3 border-t border-border/50">
              <LanguageSelector isMobile />
            </div>
          </div>

          {/* Mobile Sheet Footer / Action Buttons */}
          <div className="p-4 border-t border-border/50 space-y-2 bg-muted/10">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-center gap-2 rounded-lg text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer h-9"
              >
                <LogOut className="size-3.5" />
                <span>{t("nav.signOut")}</span>
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
                    <span>{t("nav.logIn")}</span>
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button
                    size="sm"
                    className="w-full rounded-lg text-xs font-semibold h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>{t("nav.createCustomerAccount")}</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Helpline / Verification Notice */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>{t("nav.coopGuarantee")}</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default CustomerNavbar;