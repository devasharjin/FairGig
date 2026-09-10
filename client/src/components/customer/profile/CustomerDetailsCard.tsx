import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CustomerDetailsCardProps {
  user: {
    name?: string;
    email?: string;
    phone?: string;
    role?: any;
    accountStatus?: string;
    createdAt?: string;
    isEmailVerified?: boolean;
  } | null;
  onOpenEdit: () => void;
}

export const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({
  user,
  onOpenEdit,
}) => {
  const roles: string[] = Array.isArray(user?.role)
    ? user.role.map((r) => String(r).toUpperCase())
    : typeof user?.role === "string"
    ? [user.role.toUpperCase()]
    : ["CUSTOMER"];

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User className="size-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Customer Details
            </h2>
            <p className="text-xs text-muted-foreground">
              Your registered contact information and platform credentials
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenEdit}
          className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors"
        >
          <Edit3 className="size-3.5" />
          <span>Edit Details</span>
        </Button>
      </div>

      {/* Grid of Profile Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <User className="size-3.5 text-primary" />
            <span>Full Name</span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.name || "Not provided"}
          </p>
        </div>

        {/* Email Address */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Mail className="size-3.5 text-primary" />
              <span>Email Address</span>
            </div>
            {user?.isEmailVerified && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.email || "Not provided"}
          </p>
        </div>

        {/* Phone Number */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Phone className="size-3.5 text-primary" />
            <span>Phone Number</span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.phone || "No phone number added"}
          </p>
        </div>

        {/* Member Since */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            <span>Member Since</span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">
            {joinedDate}
          </p>
        </div>
      </div>

      {/* Account Status & Roles */}
      <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Account Status:</span>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold gap-1"
          >
            <CheckCircle className="size-3" />
            {user?.accountStatus || "ACTIVE"}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <Shield className="size-3 text-muted-foreground" />
            Roles:
          </span>
          {roles.map((r) => (
            <Badge
              key={r}
              variant="secondary"
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md"
            >
              {r}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsCard;
