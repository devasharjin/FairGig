import React from "react";
import { Wrench, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TradeSkill {
  _id?: string;
  name?: string;
  description?: string;
  hourlyPrice?: number;
  metersPrice?: number;
  priceType?: string;
}

interface TradeSkillsGridProps {
  skills: (TradeSkill | string)[];
  category?: any;
}

export const TradeSkillsGrid: React.FC<TradeSkillsGridProps> = ({ skills, category }) => {
  const categoryName =
    typeof category === "object" && category?.name
      ? category.name
      : typeof category === "string"
      ? category
      : null;

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Wrench className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Verified Trade Services & Rate Card
            </h3>
            <p className="text-xs text-muted-foreground">
              Authorized trade services (Plumber, Electrician, Gardener, etc.) under platform cooperative dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {categoryName && (
            <Badge variant="default" className="text-xs font-semibold bg-primary text-primary-foreground shadow-xs rounded-md">
              {categoryName}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs font-semibold rounded-md">
            {skills.length} {skills.length === 1 ? "Service" : "Services"}
          </Badge>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-border rounded-lg space-y-2">
          <Wrench className="size-8 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">
            No specialized skills loaded yet. Cooperative default gig assignment applies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill, idx) => {
            const name = typeof skill === "string" ? skill : skill.name;
            const desc = typeof skill === "object" ? skill.description : "";
            const hourly = typeof skill === "object" ? skill.hourlyPrice : null;
            const meters = typeof skill === "object" ? skill.metersPrice : null;

            return (
              <div
                key={typeof skill === "object" ? skill._id || idx : idx}
                className="rounded-lg border border-border/70 bg-card/60 p-4 hover:border-primary/40 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="size-4 text-emerald-500 shrink-0" />
                    <h4 className="text-sm font-bold text-foreground">
                      {name}
                    </h4>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]"
                  >
                    Verified
                  </Badge>
                </div>

                {desc && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {desc}
                  </p>
                )}

                <div className="pt-1 flex items-center justify-between text-xs border-t border-border/40">
                  <span className="text-muted-foreground">
                    Cooperative Rate:
                  </span>
                  <span className="font-extrabold text-foreground">
                    {hourly ? `₹${hourly}/hr` : meters ? `₹${meters}/m` : "Standard Rate"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TradeSkillsGrid;
