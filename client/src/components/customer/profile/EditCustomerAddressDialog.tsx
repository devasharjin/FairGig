import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Home,
  Briefcase,
  Building,
  Loader2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import type {
  AddressFormData,
  SavedAddress,
  CustomerAddress,
} from "@/features/customer/profile/types";

interface EditCustomerAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit-saved" | "edit-primary";
  initialData?: SavedAddress | CustomerAddress | null;
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  isPending?: boolean;
}

const TITLE_OPTIONS = ["Home", "Work", "Office", "Other"];

export const EditCustomerAddressDialog: React.FC<
  EditCustomerAddressDialogProps
> = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isPending = false,
}) => {
  const { t } = useTranslation();
  const isEditing = mode === "edit-saved" || mode === "edit-primary";

  const [title, setTitle] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("India");
  const [landmark, setLandmark] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle((initialData as SavedAddress).title || "Home");
      setStreet(initialData.street || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setZip(initialData.zip || "");
      setCountry(initialData.country || "India");
      setLandmark(initialData.landmark || "");
      setIsDefault(Boolean((initialData as SavedAddress).isDefault));
    } else {
      setTitle("Home");
      setStreet("");
      setCity("");
      setState("");
      setZip("");
      setCountry("India");
      setLandmark("");
      setIsDefault(false);
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!street.trim()) {
      toast.error(t("profile.editAddressModal.streetError"));
      return;
    }

    await onSubmit({
      title: title.trim() || "Home",
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      country: country.trim() || "India",
      landmark: landmark.trim(),
      isDefault,
    });
  };

  const getTitleIcon = (tStr: string) => {
    if (tStr === "Home") return Home;
    if (tStr === "Work" || tStr === "Office") return Briefcase;
    return Building;
  };

  const getTagLabel = (opt: string) => {
    switch (opt.toLowerCase()) {
      case "home":
        return t("profile.editAddressModal.tags.home");
      case "work":
        return t("profile.editAddressModal.tags.work");
      case "office":
        return t("profile.editAddressModal.tags.office");
      case "other":
      default:
        return t("profile.editAddressModal.tags.other");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-7 border border-border/80 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1 pb-1">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {mode === "add"
                  ? t("profile.editAddressModal.addNewTitle")
                  : mode === "edit-primary"
                  ? t("profile.editAddressModal.updatePrimaryTitle")
                  : t("profile.editAddressModal.editSavedTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("profile.editAddressModal.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Address Label Pills */}
          {mode !== "edit-primary" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {t("profile.editAddressModal.tagLabel")}
              </Label>
              <div className="flex flex-wrap gap-2">
                {TITLE_OPTIONS.map((opt) => {
                  const Icon = getTitleIcon(opt);
                  const isSelected = title.toLowerCase() === opt.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setTitle(opt)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/40 text-muted-foreground border-border/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{getTagLabel(opt)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Street Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address-street" className="text-xs font-semibold text-foreground">
              {t("profile.editAddressModal.streetLabel")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address-street"
              placeholder={t("profile.editAddressModal.streetPlaceholder")}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
              disabled={isPending}
              required
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="address-city" className="text-xs font-semibold text-foreground">
                {t("profile.editAddressModal.cityLabel")}
              </Label>
              <Input
                id="address-city"
                placeholder={t("profile.editAddressModal.cityPlaceholder")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address-state" className="text-xs font-semibold text-foreground">
                {t("profile.editAddressModal.stateLabel")}
              </Label>
              <Input
                id="address-state"
                placeholder={t("profile.editAddressModal.statePlaceholder")}
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
                disabled={isPending}
              />
            </div>
          </div>

          {/* PIN Code and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="address-zip" className="text-xs font-semibold text-foreground">
                {t("profile.editAddressModal.zipLabel")}
              </Label>
              <Input
                id="address-zip"
                placeholder={t("profile.editAddressModal.zipPlaceholder")}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address-country" className="text-xs font-semibold text-foreground">
                {t("profile.editAddressModal.countryLabel")}
              </Label>
              <Input
                id="address-country"
                placeholder={t("profile.editAddressModal.countryPlaceholder")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Landmark */}
          <div className="space-y-1.5">
            <Label htmlFor="address-landmark" className="text-xs font-semibold text-foreground">
              {t("profile.editAddressModal.landmarkLabel")}
            </Label>
            <Input
              id="address-landmark"
              placeholder={t("profile.editAddressModal.landmarkPlaceholder")}
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
              disabled={isPending}
            />
          </div>

          {/* Default Address Checkbox */}
          {mode !== "edit-primary" && (
            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="size-4 rounded text-primary focus:ring-primary border-border/80 cursor-pointer"
                disabled={isPending}
              />
              <span className="text-xs font-medium text-foreground">
                {t("profile.editAddressModal.setDefaultLabel")}
              </span>
            </label>
          )}

          {/* Dialog Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl h-10 px-4 text-xs font-semibold cursor-pointer"
            >
              {t("profile.editAddressModal.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl h-10 px-5 text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("profile.editAddressModal.saving")}</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{isEditing ? t("profile.editAddressModal.saveChanges") : t("profile.editAddressModal.addAddress")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerAddressDialog;
