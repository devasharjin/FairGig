import React from "react";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WorkerVerificationStatsProps {
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const WorkerVerificationStats: React.FC<WorkerVerificationStatsProps> = ({
  counts,
}) => {
  const statCards = [
    {
      title: "Total Applicants",
      value: counts.total,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Pending Approval",
      value: counts.pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Approved Members",
      value: counts.approved,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Rejected",
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
            className={`border ${stat.border} bg-card shadow-xs rounded-xl overflow-hidden`}
          >
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`size-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
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
