import React from "react";
import { FileText, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CredentialsCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
          <FileText className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            Credentials & KYC
          </h3>
          <p className="text-xs text-muted-foreground">
            Official verification documents
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3.5 rounded-lg border border-border/60 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="size-4 text-muted-foreground" />
            <div>
              <span className="font-semibold text-foreground block">
                Government ID
              </span>
              <span className="text-[11px] text-muted-foreground">
                Aadhaar / Driver License
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] rounded-md"
          >
            Verified
          </Badge>
        </div>

        <div className="p-3.5 rounded-lg border border-border/60 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="size-4 text-muted-foreground" />
            <div>
              <span className="font-semibold text-foreground block">
                Trade Certification
              </span>
              <span className="text-[11px] text-muted-foreground">
                Vocational / Cooperative Skill Cert
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] rounded-md"
          >
            Verified
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CredentialsCard;
