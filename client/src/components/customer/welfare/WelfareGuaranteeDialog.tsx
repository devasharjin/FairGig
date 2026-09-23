import React from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  HeartHandshake,
  Award,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelfareGuaranteeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelfareGuaranteeDialog: React.FC<WelfareGuaranteeDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">{t("welfare.title")}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("welfare.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs text-muted-foreground">
          <p className="leading-relaxed text-foreground">
            {t("welfare.desc")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                {t("welfare.cover1Title", { defaultValue: "₹5,00,000 Accident Cover" })}
              </div>
              <p className="text-[11px] leading-relaxed">
                {t("welfare.cover1Desc", { defaultValue: "Full accidental disability and trauma protection for every worker while on duty." })}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Stethoscope className="size-4 text-rose-500" />
                {t("welfare.cover2Title", { defaultValue: "₹2,00,000 Hospitalization" })}
              </div>
              <p className="text-[11px] leading-relaxed">
                {t("welfare.cover2Desc", { defaultValue: "Cashless emergency medical coverage so no tradesperson faces catastrophic health debt." })}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <HeartHandshake className="size-4 text-purple-500" />
                {t("welfare.cover3Title", { defaultValue: "Cooperative Welfare Pool" })}
              </div>
              <p className="text-[11px] leading-relaxed">
                {t("welfare.cover3Desc", { defaultValue: "5% of service rates are pooled into the society welfare fund for emergency distress grants." })}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Award className="size-4 text-emerald-500" />
                {t("welfare.cover4Title", { defaultValue: "Zero Exploitation" })}
              </div>
              <p className="text-[11px] leading-relaxed">
                {t("welfare.cover4Desc", { defaultValue: "Workers collectively own their cooperative societies and set fair floor wages." })}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-foreground flex items-start gap-2.5">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              {t("welfare.peaceOfMind", { defaultValue: "Your Peace of Mind: When you hire through FairGig, you receive skilled, background-verified professionals protected by India's National Cooperative Workers Insurance Trust." })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold cursor-pointer"
            >
              {t("welfare.closeBtn", { defaultValue: "Close & Continue" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelfareGuaranteeDialog;
