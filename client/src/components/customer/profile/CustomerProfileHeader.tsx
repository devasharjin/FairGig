import React from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CustomerAddress } from "@/features/customer/profile/types";

interface CustomerProfileHeaderProps {
  user: {
    name?: string;
    email?: string;
    phone?: string;
    role?: any;
    createdAt?: string;
  } | null;
  address?: CustomerAddress | null;
  onOpenEdit: () => void;
}

export const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({
  user,
  address,
  onOpenEdit,
}) => {
  const { t, i18n } = useTranslation();
  const memberSinceYear = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(i18n.language || undefined, {
        month: "short",
        year: "numeric",
      })
    : t("profile.header.member");

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "C";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {/* Avatar / Initial Bubble */}
          <div className="size-16 sm:size-20 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-inner shrink-0">
            {userInitial}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold gap-1.5"
              >
                <ShieldCheck className="size-3.5 text-emerald-500" />
                {t("profile.header.verifiedCustomer", { defaultValue: t("profile.verifiedCustomer") })}
              </Badge>

              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold gap-1"
              >
                <Sparkles className="size-3" />
                {t("profile.header.cooperativePatron", { defaultValue: t("profile.coopPatron") })}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {user?.name || t("profile.header.customerProfile", { defaultValue: t("profile.customerProfile") })}
            </h1>

            <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-y-1.5 gap-x-4">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{user?.email}</span>
              </span>

              {user?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground shrink-0" />
                  <span>{user.phone}</span>
                </span>
              )}

              {address?.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                  <span>
                    {address.city}
                    {address.state ? `, ${address.state}` : ""}
                  </span>
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <span>{t("profile.header.joined", { date: memberSinceYear, defaultValue: t("profile.joined", { date: memberSinceYear }) })}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Button
            onClick={onOpenEdit}
            className="rounded-2xl h-11 px-5 text-sm font-semibold shadow-xs gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <Edit3 className="size-4" />
            <span>
              {t("profile.header.editProfile", {
                defaultValue: t("profile.header.editprofile", {
                  defaultValue: t("profile.editProfileBtn"),
                }),
              })}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileHeader;
