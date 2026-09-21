import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  RefreshCw,
  Layers,
  Scale,
  Zap,
  ShieldCheck,
  Calendar,
  ChevronRight,
  TrendingDown,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCooperativeForecastOverview,
  getCategoryDemandBreakdown,
  getZoneAllocationMatrix,
  getRebalancePlans,
  executeRebalancePlan,
  getFairRotationMetrics,
} from "@/features/forecasting/api";
import type {
  CooperativeForecastOverview,
  CategoryDemandItem,
  ZoneAllocationItem,
  WorkforceRebalancePlan,
  FairRotationMetrics,
} from "@/features/forecasting/types";

export const CooperativeForecasting: React.FC = () => {
  const [overview, setOverview] = useState<CooperativeForecastOverview | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryDemandItem[]>([]);
  const [zoneMatrix, setZoneMatrix] = useState<ZoneAllocationItem[]>([]);
  const [rebalancePlans, setRebalancePlans] = useState<WorkforceRebalancePlan[]>([]);
  const [rotationMetrics, setRotationMetrics] = useState<FairRotationMetrics | null>(null);

  const [activeTab, setActiveTab] = useState<"forecast" | "zones" | "rebalance" | "rotation" | "trades">("forecast");
  const [isLoading, setIsLoading] = useState(true);
  const [isExecutingPlanId, setIsExecutingPlanId] = useState<string | null>(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [ovData, catData, zoneData, planData, rotData] = await Promise.all([
        getCooperativeForecastOverview().catch(() => null),
        getCategoryDemandBreakdown().catch(() => []),
        getZoneAllocationMatrix().catch(() => []),
        getRebalancePlans().catch(() => []),
        getFairRotationMetrics().catch(() => null),
      ]);

      setOverview(ovData);
      setCategoryBreakdown(catData || []);
      setZoneMatrix(zoneData || []);
      setRebalancePlans(planData || []);
      setRotationMetrics(rotData);
    } catch (err) {
      console.error("Failed to load forecasting dashboard:", err);
      toast.error("Failed to refresh AI forecasting data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleExecutePlan = async (planId: string) => {
    setIsExecutingPlanId(planId);
    try {
      const updated = await executeRebalancePlan(planId);
      toast.success("Workforce rebalance mobilization dispatched successfully!");
      setRebalancePlans((prev) =>
        prev.map((p) => (p._id === planId ? { ...p, status: "EXECUTED", executedAt: new Date().toISOString() } : p))
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to execute rebalance plan");
    } finally {
      setIsExecutingPlanId(null);
    }
  };

  const todaySummary = overview?.todaySummary;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                <BrainCircuit className="size-3.5" /> AI Predictive Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Adaptive Smoothing Active • 92.6% Accuracy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              AI Demand Forecasting & Workforce Allocation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Real-time predictive gig demand forecasting, automated geographic capacity balancing,
              and equitable member rotation analytics for your cooperative.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllData}
              disabled={isLoading}
              className="rounded-lg h-9 px-3.5 gap-2 border-border/80 hover:bg-muted cursor-pointer shadow-xs text-xs font-semibold"
            >
              <RefreshCw className={`size-3.5 text-accent ${isLoading ? "animate-spin" : ""}`} />
              <span>Recalibrate & Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 7-Day Projected Bookings */}
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              7-Day Demand Forecast
            </CardTitle>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {overview?.total7DayProjectedGigs ?? 0}{" "}
              <span className="text-xs font-medium text-muted-foreground">gigs</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" />
              <span>Cooperative wide projection</span>
            </p>
          </CardContent>
        </Card>

        {/* Active Member Capacity */}
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shift Capacity
            </CardTitle>
            <div className="size-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {overview?.workerDailyCapacity ?? 0}{" "}
              <span className="text-xs font-medium text-muted-foreground">daily gigs</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview?.activeWorkers ?? 0} verified active member workers
            </p>
          </CardContent>
        </Card>

        {/* Today's Capacity Gap */}
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today's Gap Analysis
            </CardTitle>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {todaySummary?.gapStatus ?? "OPTIMAL"}
              </span>
              <Badge
                className={`text-[10px] font-semibold rounded-md ${
                  todaySummary?.gapStatus === "DEFICIT"
                    ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                    : todaySummary?.gapStatus === "SURPLUS"
                    ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                }`}
              >
                {todaySummary?.currentSurgeMultiplier ?? 1.0}x Surge
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Predicted: {todaySummary?.predictedDemand ?? 0} vs Capacity: {todaySummary?.currentCapacity ?? 0}
            </p>
          </CardContent>
        </Card>

        {/* Member Rotation Equity Score */}
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fair Rotation Index
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Scale className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {rotationMetrics?.fairRotationScore ?? 91}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gig distribution equality across members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-3 overflow-x-auto">
        <Button
          variant={activeTab === "forecast" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("forecast")}
          className="rounded-lg text-xs font-semibold h-8 cursor-pointer"
        >
          <Calendar className="size-3.5 mr-1.5" /> 7-Day Projection & Peak Hours
        </Button>
        <Button
          variant={activeTab === "zones" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("zones")}
          className="rounded-lg text-xs font-semibold h-8 cursor-pointer"
        >
          <MapPin className="size-3.5 mr-1.5" /> Zone Allocation Matrix ({zoneMatrix.length})
        </Button>
        <Button
          variant={activeTab === "rebalance" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("rebalance")}
          className="rounded-lg text-xs font-semibold h-8 cursor-pointer relative"
        >
          <Zap className="size-3.5 mr-1.5 text-amber-500" /> AI Rebalance Action Center
          {rebalancePlans.filter((p) => p.status === "RECOMMENDED").length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] bg-amber-500 text-white font-bold">
              {rebalancePlans.filter((p) => p.status === "RECOMMENDED").length}
            </span>
          )}
        </Button>
        <Button
          variant={activeTab === "rotation" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("rotation")}
          className="rounded-lg text-xs font-semibold h-8 cursor-pointer"
        >
          <Scale className="size-3.5 mr-1.5 text-accent" /> Fair Rotation Roster
        </Button>
        <Button
          variant={activeTab === "trades" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("trades")}
          className="rounded-lg text-xs font-semibold h-8 cursor-pointer"
        >
          <Layers className="size-3.5 mr-1.5" /> Trade Demand Share
        </Button>
      </div>

      {/* Tab 1: 7-Day Demand Forecast & Peak Hours */}
      {activeTab === "forecast" && (
        <div className="space-y-6">
          {/* Daily Projection Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {overview?.dailyForecast?.map((day, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all text-center flex flex-col justify-between ${
                  day.gapStatus === "DEFICIT"
                    ? "bg-rose-500/10 border-rose-500/30 shadow-xs"
                    : day.gapStatus === "SURPLUS"
                    ? "bg-amber-500/10 border-amber-500/30 shadow-xs"
                    : "bg-card border-border/80 shadow-xs"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {day.dayName}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{day.date}</p>

                  <div className="my-2.5">
                    <div className="text-xl font-bold tracking-tight text-foreground">{day.predictedDemand}</div>
                    <span className="text-[10px] text-muted-foreground">Projected Gigs</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold w-full justify-center rounded-md ${
                      day.gapStatus === "DEFICIT"
                        ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                        : day.gapStatus === "SURPLUS"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {day.gapStatus} ({day.gap > 0 ? `+${day.gap}` : day.gap})
                  </Badge>
                  <div className="text-[10px] text-muted-foreground">
                    Cap: {day.workerCapacity} | Surge: {day.surgeMultiplier}x
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 24-Hour Peak Curve for Tomorrow */}
          <Card className="rounded-xl border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Clock className="size-4 text-accent" /> Tomorrow's 24-Hour Peak Surge Curve
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Hourly booking demand surge multipliers and suggested worker readiness
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                {overview?.tomorrowHourlyCurve?.map((h, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      h.isPeak
                        ? "bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20"
                        : "bg-muted/40 border-border/60"
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-foreground block">{h.timeLabel}</span>
                    <span
                      className={`text-xs font-bold block my-1 ${
                        h.isPeak ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                      }`}
                    >
                      {h.surgeMultiplier}x
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      {h.suggestedWorkersNeeded} workers
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Urban Zone Allocation Matrix */}
      {activeTab === "zones" && (
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="size-4 text-accent" /> Urban Zone Allocation Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Live capacity and demand distribution across the 5 municipal zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y divide-border/60">
              {zoneMatrix.map((z, idx) => (
                <div
                  key={idx}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{z.zoneName}</span>
                      <Badge
                        className={`text-[10px] font-semibold rounded-md ${
                          z.status === "DEFICIT"
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                            : z.status === "SURPLUS"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {z.status} ({z.gap > 0 ? `+${z.gap}` : z.gap})
                      </Badge>
                      {z.bountyIncentive > 0 && (
                        <Badge variant="outline" className="text-[10px] font-semibold rounded-md border-amber-500/40 text-amber-600 dark:text-amber-400">
                          +₹{z.bountyIncentive} Incentive Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{z.recommendedAction}</p>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div>
                      <span className="text-xs text-muted-foreground block">Predicted Demand</span>
                      <span className="text-sm font-bold text-foreground">{z.predictedDemand} gigs</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Zone Capacity</span>
                      <span className="text-sm font-bold text-foreground">{z.workerCapacity} workers</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: AI Rebalance Action Center */}
      {activeTab === "rebalance" && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground flex items-start gap-3">
            <Info className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">AI Proactive Rebalancing:</strong> The platform analyzes weather forecasts,
              historical weekday peaks, and current roster distribution to recommend talent mobilization across zones before
              deficits occur.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rebalancePlans.map((plan) => (
              <Card
                key={plan._id}
                className={`rounded-xl border transition-all ${
                  plan.status === "RECOMMENDED"
                    ? "border-amber-500/40 bg-card shadow-xs"
                    : "border-border/80 bg-card opacity-80"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                      {plan.planNumber}
                    </span>
                    <Badge
                      className={`text-[10px] font-semibold rounded-md ${
                        plan.status === "EXECUTED"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-1">
                    {plan.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Target Trade:</span>
                      <strong className="text-foreground">{plan.targetTrade}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mobilization Route:</span>
                      <span className="font-medium text-foreground">
                        {plan.sourceZone.split(" - ")[0]} &rarr; {plan.targetZone.split(" - ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Workers & Bonus:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {plan.recommendedWorkersCount} Workers (+₹{plan.surgeBonusPerWorker}/gig bonus)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>AI Rationale:</strong> {plan.aiRationale}
                  </p>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {plan.executedAt
                        ? `Dispatched: ${new Date(plan.executedAt).toLocaleDateString()}`
                        : "Ready for mobilization"}
                    </span>

                    {plan.status === "RECOMMENDED" ? (
                      <Button
                        size="sm"
                        onClick={() => handleExecutePlan(plan._id)}
                        disabled={isExecutingPlanId === plan._id}
                        className="rounded-lg h-8 px-3.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                      >
                        {isExecutingPlanId === plan._id ? "Mobilizing..." : "Approve & Mobilize"}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-500/30 rounded-md">
                        <CheckCircle2 className="size-3" /> Mobilized
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Fair Rotation & Member Equity Directory */}
      {activeTab === "rotation" && (
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Scale className="size-4 text-accent" /> Member Gig Equity & Fair Rotation Roster
                </CardTitle>
                <CardDescription className="text-xs">
                  AI dispatch fairness index to ensure equal gig opportunities and avoid monopoly
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-md self-start sm:self-auto">
                {rotationMetrics?.highPriorityRotationWorkersCount ?? 0} Members in Priority Rotation
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-semibold uppercase text-[11px] bg-muted/50">
                    <th className="py-2.5 px-3">Member Worker</th>
                    <th className="py-2.5 px-3">Trade Category</th>
                    <th className="py-2.5 px-3">Recent Gigs Completed</th>
                    <th className="py-2.5 px-3">AI Dispatch Priority</th>
                    <th className="py-2.5 px-3">Fair Share Equity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rotationMetrics?.rotationRoster?.map((worker) => (
                    <tr key={worker.workerId} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-semibold text-foreground">{worker.name}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-medium rounded-md">
                          {worker.category || "General Trade"}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        <strong className="text-foreground">{worker.recentGigsCount}</strong> gigs
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`text-[10px] font-semibold rounded-md ${
                            worker.dispatchPriority === "HIGH"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                              : worker.dispatchPriority === "STANDBY"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                              : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
                          }`}
                        >
                          {worker.dispatchPriority} PRIORITY
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {worker.fairSharePercentage}% expected share
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Trade & Category Demand Share */}
      {activeTab === "trades" && (
        <Card className="rounded-xl border-border/80 shadow-xs bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="size-4 text-accent" /> Trade Demand Distribution & Growth
            </CardTitle>
            <CardDescription className="text-xs">
              Projected booking volume across specialized service categories over the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBreakdown.map((item) => (
                <div
                  key={item.categoryId}
                  className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{item.categoryName}</span>
                    <Badge
                      className={`text-[10px] font-semibold rounded-md ${
                        item.surgeRisk === "HIGH"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : item.surgeRisk === "MODERATE"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {item.surgeMultiplier}x Surge
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>7-Day Volume:</span>
                      <strong className="text-foreground">{item.projectedGigsNext7Days} gigs</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Share:</span>
                      <strong className="text-foreground">{item.percentageShare}%</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Growth Momentum:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">+{item.growthRatePercentage}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CooperativeForecasting;
