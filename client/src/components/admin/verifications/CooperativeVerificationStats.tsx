import React from "react";
import { Building2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CooperativeVerificationStatsProps {
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const CooperativeVerificationStats: React.FC<CooperativeVerificationStatsProps> = ({
  counts,
}) => {
  const statCards = [
    {
      title: "Total Societies",
      value: counts.total,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Pending Review",
      value: counts.pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Approved Cooperatives",
      value: counts.approved,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Rejected Societies",
      value: counts.rejected,
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`border ${stat.border} bg-card/85 shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm`}
          >
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`size-10 sm:size-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
              >
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
