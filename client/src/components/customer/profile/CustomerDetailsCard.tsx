import React from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  Calendar,
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
  const { t, i18n } = useTranslation();
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(i18n.language || "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : t("profile.details.recently");

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="size-9 sm:size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-foreground truncate">
              {t("profile.details.title")}
            </h2>
            <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">
              {t("profile.details.subtitle")}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenEdit}
          className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors shrink-0"
        >
          <Edit3 className="size-3.5" />
          <span className="hidden sm:inline">{t("profile.details.editDetails")}</span>
          <span className="sm:hidden">{t("profile.details.edit")}</span>
        </Button>
      </div>

      {/* Grid of Profile Attributes */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {/* Full Name */}
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground">
            <User className="size-3 sm:size-3.5 text-primary shrink-0" />
            <span className="truncate">{t("profile.details.fullName")}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate" title={user?.name || ""}>
            {user?.name || t("profile.details.notProvided")}
          </p>
        </div>

        {/* Email Address */}
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground min-w-0">
              <Mail className="size-3 sm:size-3.5 text-primary shrink-0" />
              <span className="truncate">{t("profile.details.emailAddress")}</span>
            </div>
            {user?.isEmailVerified && (
              <Badge
                variant="outline"
                className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-3.5 sm:h-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0"
              >
                {t("profile.details.verified")}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate" title={user?.email || ""}>
            {user?.email || t("profile.details.notProvided")}
          </p>
        </div>

        {/* Phone Number */}
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground">
            <Phone className="size-3 sm:size-3.5 text-primary shrink-0" />
            <span className="truncate">{t("profile.details.phoneNumber")}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate" title={user?.phone || ""}>
            {user?.phone || t("profile.details.noPhone")}
          </p>
        </div>

        {/* Member Since */}
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground">
            <Calendar className="size-3 sm:size-3.5 text-primary shrink-0" />
            <span className="truncate">{t("profile.details.memberSince")}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate" title={joinedDate}>
            {joinedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsCard;
