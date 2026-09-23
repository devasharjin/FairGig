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
import { User, Phone, Mail, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

interface EditCustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    name?: string;
    phone?: string;
    email?: string;
  } | null;
  onSubmit: (data: { name: string; phone: string }) => Promise<void> | void;
  isPending?: boolean;
}

export const EditCustomerDetailsDialog: React.FC<EditCustomerDetailsDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending = false,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error(t("profile.editDetailsModal.nameError"));
      return;
    }

    if (!phone.trim()) {
      toast.error(t("profile.editDetailsModal.phoneError"));
      return;
    }

    await onSubmit({
      name: name.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7 border border-border/80 shadow-2xl bg-card">
        <DialogHeader className="text-left space-y-1 pb-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {t("profile.editDetailsModal.title")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("profile.editDetailsModal.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Email (Read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" />
              <span>{t("profile.editDetailsModal.emailLabel")}</span>
            </Label>
            <Input
              value={initialData?.email || ""}
              disabled
              className="rounded-xl h-10 bg-muted/50 border-border/50 text-muted-foreground text-xs cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground">
              {t("profile.editDetailsModal.emailNotice")}
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="customer-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              <span>{t("profile.editDetailsModal.fullNameLabel")}</span>
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer-name"
              placeholder={t("profile.editDetailsModal.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
              disabled={isPending}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="customer-phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-primary" />
              <span>{t("profile.editDetailsModal.phoneLabel")}</span>
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer-phone"
              placeholder={t("profile.editDetailsModal.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl h-10 border-border/80 text-sm focus-visible:ring-primary"
              disabled={isPending}
              required
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl h-10 px-4 text-xs font-semibold cursor-pointer"
            >
              {t("profile.editDetailsModal.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl h-10 px-5 text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("profile.editDetailsModal.saving")}</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{t("profile.editDetailsModal.saveChanges")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDetailsDialog;
