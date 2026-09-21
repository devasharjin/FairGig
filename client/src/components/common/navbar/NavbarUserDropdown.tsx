import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Wrench,
  Building2,
  Store,
  ChevronDown,
  ShieldAlert,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/features/auth/store";
import { logout } from "@/features/auth/api";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface NavbarUserDropdownProps {
  currentPortal?: "customer" | "worker" | "cooperative" | "superadmin";
  className?: string;
}

export const NavbarUserDropdown = ({
  currentPortal = "customer",
  className,
}: NavbarUserDropdownProps) => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  if (!user) return null;

  // Determine user roles
  const userRoles: string[] = Array.isArray(user.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof user.role === "string"
    ? [user.role.toUpperCase()]
    : [];

  const isWorker = userRoles.includes("WORKER");
  const isCooperative = userRoles.includes("COOPERATIVE");
  const isSuperAdmin = userRoles.includes("SUPERADMIN") || userRoles.includes("ADMIN");

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore network errors on logout
    }
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 h-9 px-2.5 sm:px-3 rounded-lg border border-border bg-card hover:bg-muted/60 cursor-pointer transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40 shadow-xs",
          className
        )}
      >
        <div className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shrink-0">
          {user.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            <User className="size-3" />
          )}
        </div>
        <span className="text-xs font-medium text-foreground max-w-28 truncate hidden sm:inline-block">
          {user.name || "My Account"}
        </span>
        <ChevronDown className="size-3 text-muted-foreground opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-1.5 rounded-xl shadow-lg border border-border/80 bg-popover"
      >
        {/* Profile Summary Header */}
        <div className="px-3 py-2 select-none">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-semibold text-sm text-foreground truncate">
                {user.name || "Authenticated User"}
              </p>
              {currentPortal === "worker" && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 rounded font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                >
                  Active
                </Badge>
              )}
              {currentPortal === "superadmin" && (
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1.5 py-0 rounded font-semibold"
                >
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            {userRoles.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5">
                {userRoles.map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 rounded-md font-medium uppercase tracking-wider"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Portal Switching & Registration Options */}
        <DropdownMenuGroup>
          {/* Customer View (shown if in worker, coop, or fed portal) */}
          {currentPortal !== "customer" ? (
            <DropdownMenuItem
              onClick={() => navigate("/")}
              className="cursor-pointer gap-2.5 py-2.5 px-3 rounded-xl transition-colors"
            >
              <Store className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium text-sm">Customer View</span>
                <span className="text-[11px] text-muted-foreground">
                  Browse services and book gigs
                </span>
              </div>
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer gap-2.5 py-2.5 px-3 rounded-xl transition-colors"
              >
                <User className="size-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">My Profile</span>
                  <span className="text-[11px] text-muted-foreground">
                    Personal details & saved addresses
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/bookings")}
                className="cursor-pointer gap-2.5 py-2.5 px-3 rounded-xl transition-colors"
              >
                <Briefcase className="size-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">My Bookings</span>
                  <span className="text-[11px] text-muted-foreground">
                    Track active & past service orders
                  </span>
                </div>
              </DropdownMenuItem>
            </>
          )}

          {/* Worker Option */}
          {currentPortal !== "worker" && (
            <DropdownMenuItem
              onClick={() => navigate(isWorker ? "/worker" : "/register/worker")}
              className="cursor-pointer gap-2.5 py-2.5 px-3 rounded-xl transition-colors"
            >
              <Wrench className={cn("size-4", isWorker ? "text-primary" : "text-muted-foreground")} />
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {isWorker ? "Worker Dashboard" : "Register as Worker"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isWorker ? "Manage gigs & job requests" : "Offer skills and earn fair wages"}
                </span>
              </div>
            </DropdownMenuItem>
          )}

          {/* Cooperative Option */}
          {currentPortal !== "cooperative" && (
            <DropdownMenuItem
              onClick={() => navigate(isCooperative ? "/cooperative" : "/register/cooperative")}
              className="cursor-pointer gap-2.5 py-2.5 px-3 rounded-xl transition-colors"
            >
              <Building2 className={cn("size-4", isCooperative ? "text-primary" : "text-muted-foreground")} />
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {isCooperative ? "Cooperative Dashboard" : "Register as Cooperative"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isCooperative ? "Manage members & bids" : "Form or affiliate a cooperative society"}
                </span>
              </div>
            </DropdownMenuItem>
          )}


          {/* SuperAdmin Option (only if user has superadmin role and not currently in admin portal) */}
          {isSuperAdmin && currentPortal !== "superadmin" && (
            <DropdownMenuItem
              onClick={() => navigate("/admin")}
              className="cursor-pointer gap-2.5 py-2.5 px-3 rounded-xl transition-colors"
            >
              <ShieldAlert className="size-4 text-destructive" />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-destructive">Admin Console</span>
                <span className="text-[11px] text-muted-foreground">
                  Platform management & oversight
                </span>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Log Out Action */}
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer gap-2.5 py-2 px-3 rounded-xl"
        >
          <LogOut className="size-4" />
          <span className="font-medium text-sm">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserDropdown;
