import React from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CooperativeInfo {
  _id?: string;
  cooperativeName?: string;
  cooperativeEmail?: string;
  cooperativePhone?: string;
  cooperativeAddress?: string;
}

interface CooperativeCardProps {
  cooperative: CooperativeInfo | null;
}

export const CooperativeCard: React.FC<CooperativeCardProps> = ({
  cooperative,
}) => {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Building2 className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Cooperative Affiliation
            </h3>
            <p className="text-xs text-muted-foreground">
              Your governing collective & fair wage guarantor
            </p>
          </div>
        </div>

        {cooperative && (
          <Badge variant="outline" className="text-xs rounded-md">
            ID: {cooperative._id?.slice(-6) || "COOP"}
          </Badge>
        )}
      </div>

      {cooperative ? (
        <div className="rounded-lg bg-muted/40 p-4 border border-border/50 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Cooperative Name:</span>
            <span className="font-bold text-foreground">
              {cooperative.cooperativeName || "Gig Cooperative Union"}
            </span>
          </div>
          {cooperative.cooperativeEmail && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Official Email:</span>
              <span className="text-foreground">{cooperative.cooperativeEmail}</span>
            </div>
          )}
          {cooperative.cooperativePhone && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Helpline:</span>
              <span className="text-foreground">{cooperative.cooperativePhone}</span>
            </div>
          )}
          {cooperative.cooperativeAddress && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Office:</span>
              <span className="text-foreground">{cooperative.cooperativeAddress}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
          Associated with the Central Cooperative Federation network. Standard rates and insurance apply to all dispatches.
        </div>
      )}

      {/* Insurance & Welfare Guarantee Bar */}
      <div className="rounded-lg bg-emerald-500/10 p-3.5 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <div className="font-bold text-foreground">Cooperative Insurance Protection</div>
            <div className="text-[11px] text-muted-foreground">Covered up to ₹5,00,000 for on-duty accidental & medical safety</div>
          </div>
        </div>
        <a
          href="/worker/welfare"
          className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-xs shrink-0"
        >
          <span>Policy & Claims</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default CooperativeCard;
