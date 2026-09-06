import React from "react";
import { Building2 } from "lucide-react";
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
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
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
          <Badge variant="outline" className="text-xs">
            ID: {cooperative._id?.slice(-6) || "COOP"}
          </Badge>
        )}
      </div>

      {cooperative ? (
        <div className="rounded-2xl bg-muted/40 p-4 border border-border/50 space-y-2 text-xs">
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
        <div className="text-xs text-muted-foreground bg-muted/30 p-4 rounded-2xl">
          Associated with the Central Cooperative Federation network. Standard rates and insurance apply to all dispatches.
        </div>
      )}
    </div>
  );
};

export default CooperativeCard;
