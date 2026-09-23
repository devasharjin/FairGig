import React from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Home,
  Briefcase,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  Star,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  CustomerAddress,
  SavedAddress,
} from "@/features/customer/profile/types";

interface CustomerAddressesCardProps {
  primaryAddress?: CustomerAddress | null;
  savedAddresses?: SavedAddress[];
  onAddNewAddress: () => void;
  onEditAddress: (address: SavedAddress) => void;
  onEditPrimary: () => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
  isSettingDefault?: boolean;
  isDeleting?: boolean;
}

export const CustomerAddressesCard: React.FC<CustomerAddressesCardProps> = ({
  primaryAddress,
  savedAddresses = [],
  onAddNewAddress,
  onEditAddress,
  onEditPrimary,
  onDeleteAddress,
  onSetDefaultAddress,
}) => {
  const { t } = useTranslation();

  const getAddressIcon = (title?: string) => {
    const lower = (title || "").toLowerCase();
    if (lower.includes("home")) return Home;
    if (lower.includes("work") || lower.includes("office")) return Briefcase;
    return MapPin;
  };

  const hasPrimaryAddress = Boolean(
    primaryAddress && primaryAddress.street && primaryAddress.street.trim()
  );
  const hasSavedAddresses = savedAddresses.length > 0;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {t("profile.addresses.title")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("profile.addresses.subtitle")}
            </p>
          </div>
        </div>

        <Button
          onClick={onAddNewAddress}
          size="sm"
          className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>
            {t("profile.addresses.addNewAddress", {
              defaultValue: t("profile.address.addnewadddress", {
                defaultValue: t("profile.addresses.addNew", {
                  defaultValue: "Add New Address",
                }),
              }),
            })}
          </span>
        </Button>
      </div>

      {/* Primary Address Highlight Banner */}
      {hasPrimaryAddress ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 text-xs font-bold gap-1 px-2.5 py-0.5"
              >
                <Star className="size-3 fill-primary" />
                {t("profile.addresses.activePrimary")}
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {t("profile.addresses.usedAsDefault")}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onEditPrimary}
              className="h-8 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 gap-1 rounded-lg px-2.5 cursor-pointer"
            >
              <Edit2 className="size-3" />
              <span>{t("profile.addresses.updatePrimary")}</span>
            </Button>
          </div>

          <div className="flex items-start gap-3">
            <Navigation className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs sm:text-sm">
              <p className="font-semibold text-foreground leading-snug">
                {primaryAddress?.street}
              </p>
              {primaryAddress?.landmark && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{t("profile.addresses.landmark")}</span>{" "}
                  {primaryAddress.landmark}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {[
                  primaryAddress?.city,
                  primaryAddress?.state,
                  primaryAddress?.zip,
                  primaryAddress?.country || "India",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Saved Addresses Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            {t("profile.addresses.savedLocations", { count: savedAddresses.length })}
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {t("profile.addresses.quickSelection")}
          </span>
        </div>

        {hasSavedAddresses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {savedAddresses.map((addr) => {
              const Icon = getAddressIcon(addr.title);
              return (
                <div
                  key={addr._id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    addr.isDefault
                      ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                      : "border-border/70 bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-7 rounded-xl flex items-center justify-center shrink-0 ${
                            addr.isDefault
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-foreground">
                          {addr.title || "Address"}
                        </span>
                      </div>

                      {addr.isDefault ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 gap-1"
                        >
                          <CheckCircle2 className="size-2.5" />
                          {t("profile.addresses.default")}
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSetDefaultAddress(addr._id)}
                          className="h-6 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 rounded-md cursor-pointer"
                        >
                          {t("profile.addresses.setDefault")}
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-foreground/90 space-y-0.5 pl-1">
                      <p className="font-medium text-foreground leading-snug">
                        {addr.street}
                      </p>
                      {addr.landmark && (
                        <p className="text-[11px] text-muted-foreground">
                          {t("profile.addresses.landmark")} {addr.landmark}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        {[addr.city, addr.state, addr.zip, addr.country || "India"]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditAddress(addr)}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground rounded-lg cursor-pointer gap-1"
                    >
                      <Edit2 className="size-3" />
                      <span>{t("profile.addresses.edit")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAddress(addr._id)}
                      className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer gap-1"
                    >
                      <Trash2 className="size-3" />
                      <span>{t("profile.addresses.delete")}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !hasPrimaryAddress ? (
          /* Empty State when zero addresses exist */
          <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-border/70 bg-muted/20 space-y-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <MapPin className="size-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-foreground">
                {t("profile.addresses.emptyTitle", { defaultValue: t("profile.addresses.noAddresses") })}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("profile.addresses.emptyDesc", { defaultValue: t("profile.addresses.noAddressesDesc") })}
              </p>
            </div>
            <Button
              onClick={onAddNewAddress}
              size="sm"
              className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>{t("profile.addresses.addFirst", { defaultValue: t("profile.addresses.addFirstAddress") })}</span>
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-2">
            {t("profile.addresses.noAdditional")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerAddressesCard;
