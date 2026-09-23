import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  UserCheck,
  AlertTriangle,
  Zap,
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Server,
  Database,
  BrainCircuit,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdminPlatformOverview } from "@/features/admin/overview/api";
import type { PlatformOverviewData } from "@/features/admin/overview/types";

export function SuperAdminHome() {
  const [data, setData] = useState<PlatformOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const overview = await getAdminPlatformOverview();
      setData(overview);
    } catch (err: any) {
      toast.error(err.message || "Failed to load platform overview telemetry");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpis = data?.kpis;
  const orders = data?.orderBreakdown;
  const health = data?.systemHealth;
  const recentBookings = data?.recentActivity || [];

  const formatCurrency = (amt: number | undefined) => {
    return `₹${(amt || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const totalOrdersCalc = (orders?.emergencyCount || 0) + (orders?.onDemandCount || 0) + (orders?.scheduledCount || 0) || 1;
  const emergencyPct = Math.round(((orders?.emergencyCount || 0) / totalOrdersCalc) * 100);
  const onDemandPct = Math.round(((orders?.onDemandCount || 0) / totalOrdersCalc) * 100);
  const scheduledPct = 100 - emergencyPct - onDemandPct;

  return (
    <div className="space-y-8 p-6 pb-16 max-w-7xl mx-auto">
      {/* Platform Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2.5 py-0.5 font-semibold text-xs tracking-wide">
              SUPERADMIN PORTAL
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE TELEMETRY ACTIVE</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Platform Command Center
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Real-time financial flows, workforce capacity, emergency orders, and multi-tier cooperative governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sync Live State</span>
          </Button>

          <Link to="/admin/verifications">
            <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground shadow-sm">
              <FileCheck2 className="size-4" />
              <span>Pending Reviews</span>
              {Boolean(kpis?.pendingCooperatives) && (
                <span className="ml-1 px-1.5 py-0.2 bg-white/20 text-white rounded-full text-xs font-bold">
                  {kpis?.pendingCooperatives}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <RefreshCw className="size-10 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Aggregating platform metrics & live financial ledgers...
          </p>
        </div>
      ) : (
        <>
          {/* Executive KPI Tier 1: Core Financial Flows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gross Platform Volume */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-card/60 backdrop-blur-sm relative overflow-hidden group hover:border-primary/40 transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <IndianRupee className="size-16 text-primary" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Gross Platform GTV
                </CardDescription>
                <CardTitle className="text-2xl font-black tracking-tight text-foreground flex items-center">
                  {formatCurrency(kpis?.grossGtv)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Worker Earnings:</span>
                  <span className="font-semibold text-foreground font-mono">{formatCurrency(kpis?.totalWorkerPayouts)}</span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "85%" }} />
                </div>
              </CardContent>
            </Card>

            {/* Platform Revenue */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-card/60 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="size-16 text-emerald-500" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Platform Commission
                </CardDescription>
                <CardTitle className="text-2xl font-black tracking-tight text-foreground flex items-center text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(kpis?.platformRevenue)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Retained Margin:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    {kpis?.grossGtv ? Math.round(((kpis.platformRevenue || 0) / kpis.grossGtv) * 100) : 10}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }} />
                </div>
              </CardContent>
            </Card>

            {/* Welfare & Insurance Reserve */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-card/60 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="size-16 text-blue-500" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Welfare Reserve Pool
                </CardDescription>
                <CardTitle className="text-2xl font-black tracking-tight text-foreground flex items-center text-blue-600 dark:text-blue-400">
                  {formatCurrency(kpis?.welfareReservePool)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">Covering Gig Workers</span>
                  <Link to="/admin/welfare" className="text-blue-500 hover:underline flex items-center gap-0.5">
                    Fund Audit <ArrowUpRight className="size-3" />
                  </Link>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "100%" }} />
                </div>
              </CardContent>
            </Card>

            {/* Total Order Volume */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-card/60 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layers className="size-16 text-amber-500" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Order Volume
                </CardDescription>
                <CardTitle className="text-2xl font-black tracking-tight text-foreground">
                  {(kpis?.totalBookings || 0).toLocaleString()} Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Fulfilled:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {kpis?.completedBookings || 0} ({orders?.completedPercentage || 0}%)
                  </span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, orders?.completedPercentage || 0)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Executive KPI Tier 2: Workforce & Ecosystem Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/50 shadow-sm bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Cooperative Societies</p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {kpis?.approvedCooperatives || 0} <span className="text-xs font-normal text-muted-foreground">Active</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                    <span>Total Registered: {kpis?.totalCooperatives || 0}</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Building2 className="size-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Gig Workforce Capacity</p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {kpis?.totalWorkers || 0} <span className="text-xs font-normal text-muted-foreground">Workers</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-blue-500 inline-block" />
                    <span>Active Field Capacity</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <UserCheck className="size-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Consumer Demand Base</p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {kpis?.totalCustomers || 0} <span className="text-xs font-normal text-muted-foreground">Customers</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-purple-500 inline-block" />
                    <span>Total Platform Users: {kpis?.totalUsers || 0}</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                  <Users className="size-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Dispatch Breakdown & System Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Dispatch Channels */}
            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Zap className="size-4 text-amber-500" />
                      Order Dispatch & Service Channels
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Breakdown of booked jobs across Emergency, Rapid On-Demand, and Scheduled appointments
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {kpis?.totalBookings || 0} TOTAL JOBS
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Stacked Progress Bar */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-secondary/80 rounded-full flex overflow-hidden p-0.5 gap-0.5">
                    <div
                      style={{ width: `${emergencyPct}%` }}
                      className="bg-rose-500 h-full rounded-l-full transition-all relative group cursor-pointer"
                      title={`Emergency: ${orders?.emergencyCount} (${emergencyPct}%)`}
                    />
                    <div
                      style={{ width: `${onDemandPct}%` }}
                      className="bg-amber-500 h-full transition-all relative group cursor-pointer"
                      title={`On-Demand: ${orders?.onDemandCount} (${onDemandPct}%)`}
                    />
                    <div
                      style={{ width: `${Math.max(0, scheduledPct)}%` }}
                      className="bg-indigo-500 h-full rounded-r-full transition-all relative group cursor-pointer"
                      title={`Scheduled: ${orders?.scheduledCount} (${scheduledPct}%)`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-rose-500" />
                      <span className="font-medium text-foreground">Emergency ({orders?.emergencyCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500" />
                      <span className="font-medium text-foreground">On-Demand ({orders?.onDemandCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-indigo-500" />
                      <span className="font-medium text-foreground">Scheduled ({orders?.scheduledCount || 0})</span>
                    </div>
                  </div>
                </div>

                {/* Status Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                    </div>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                      {kpis?.completedBookings || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Successful settlements</p>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Active Work</span>
                      <Activity className="size-3.5 text-blue-500 animate-spin" />
                    </div>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300 font-mono">
                      {kpis?.activeBookings || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Workers on-site</p>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Match</span>
                      <Clock className="size-3.5 text-amber-500" />
                    </div>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-300 font-mono">
                      {kpis?.pendingBookings || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Awaiting acceptance</p>
                  </div>

                  <div className="p-3 bg-slate-500/10 border border-slate-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Cancelled</span>
                      <XCircle className="size-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-bold text-foreground font-mono">
                      {kpis?.cancelledBookings || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Resolved / Terminated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure & Telemetry Health */}
            <Card className="border-border/50 shadow-sm flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Server className="size-4 text-emerald-500" />
                        System Telemetry & Health
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Autonomous cluster operational telemetry
                      </CardDescription>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] font-semibold shrink-0">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {/* Service 1: MongoDB Cluster */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border/70 hover:border-emerald-500/30 transition flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Database className="size-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">MongoDB Cluster</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>Primary DB Replica Set</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 gap-1 shrink-0">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {health?.databaseStatus || "CONNECTED"}
                    </Badge>
                  </div>

                  {/* Service 2: AI Demand Forecaster */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border/70 hover:border-blue-500/30 transition flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <BrainCircuit className="size-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">AI Demand Forecaster</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>Predictive Dynamic Dispatch</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[11px] font-bold px-2 py-0.5 gap-1 shrink-0">
                      <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                      {health?.aiTelemetryStatus || "ONLINE"}
                    </Badge>
                  </div>

                  {/* Telemetry Metrics: Uptime & Nodes */}
                  <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                    <div className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/70 transition-colors space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <Activity className="size-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">Platform Uptime</span>
                      </div>
                      <div className="text-lg font-black font-mono text-foreground tracking-tight">
                        {health?.uptimeHours ? `${health.uptimeHours} hrs` : "99.98 hrs"}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                        High Availability
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/70 transition-colors space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <ShieldAlert className="size-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">Active Nodes</span>
                      </div>
                      <div className="text-lg font-black font-mono text-foreground tracking-tight">
                        {health?.activeNodes || 1} <span className="text-xs font-semibold text-muted-foreground font-sans">Node</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium truncate">
                        1 Primary Instance
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 pt-2">
                <Link to="/admin/forecasting">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-9 rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group cursor-pointer">
                    <BrainCircuit className="size-3.5 text-primary group-hover:text-primary-foreground transition-colors" />
                    <span>Open AI Forecast Telemetry</span>
                    <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Quick Governance Navigation Grid */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Administrative Governance Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/users" className="group">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                        <Users className="size-5" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">User & Role Governance</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manage permissions, suspend/activate accounts, inspect audit trails.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/services" className="group">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform">
                        <IndianRupee className="size-5" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Services & Pricing Engine</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Central billing rates, hourly pricing, cooperative shares & fixed transport fee.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/verifications" className="group">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Society Verifications</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Review pending registration licenses, cooperative credentials and compliance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/welfare" className="group">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-105 transition-transform">
                        <ShieldAlert className="size-5" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Welfare & Insurance Audit</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Audit worker emergency healthcare claims, tool replacement grants and fund pool.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Live Platform Activity Feed */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    Real-Time Dispatch Activity Feed
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Latest booking transactions across cooperatives and gig workers
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  Latest {recentBookings.length} Events
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No dispatch activity recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-muted-foreground border-b border-border/40 font-medium">
                      <tr>
                        <th className="pb-2.5 pl-2 font-medium">Job Ref</th>
                        <th className="pb-2.5 font-medium">Customer</th>
                        <th className="pb-2.5 font-medium">Service / Unit</th>
                        <th className="pb-2.5 font-medium">Channel</th>
                        <th className="pb-2.5 font-medium">Status</th>
                        <th className="pb-2.5 font-medium">Total Amount</th>
                        <th className="pb-2.5 pr-2 font-medium text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3 pl-2 font-mono font-semibold text-foreground">
                            {b.bookingNumber}
                          </td>
                          <td className="py-3 text-foreground font-medium">
                            {b.customerName}
                          </td>
                          <td className="py-3">
                            <div className="text-foreground font-medium">{b.serviceName}</div>
                            <div className="text-[11px] text-muted-foreground">{b.cooperativeName}</div>
                          </td>
                          <td className="py-3">
                            {b.isEmergency ? (
                              <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-semibold">
                                <AlertTriangle className="size-2.5 mr-1" /> EMERGENCY
                              </Badge>
                            ) : b.bookingType === "PREMIUM" || b.bookingType === "ON_DEMAND" ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold">
                                <Zap className="size-2.5 mr-1" /> PREMIUM
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-semibold">
                                <Calendar className="size-2.5 mr-1" /> SCHEDULED
                              </Badge>
                            )}
                          </td>
                          <td className="py-3">
                            {b.status === "COMPLETED" ? (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
                                COMPLETED
                              </Badge>
                            ) : b.status === "ACCEPTED" || b.status === "IN_PROGRESS" ? (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold">
                                IN PROGRESS
                              </Badge>
                            ) : b.status === "PENDING" ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold">
                                PENDING
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-slate-500/10 text-muted-foreground border-slate-500/30 text-[10px] font-semibold">
                                {b.status}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 font-mono font-semibold text-foreground">
                            {formatCurrency(b.amount)}
                          </td>
                          <td className="py-3 pr-2 text-right text-muted-foreground font-mono text-[11px]">
                            {b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default SuperAdminHome;