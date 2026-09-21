import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Zap,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCooperativeOverview } from "@/features/cooperative/overview/api";
import type { CooperativeOverviewResponse } from "@/features/cooperative/overview/types";

export default function CooperativeHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<CooperativeOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOverview = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const res = await getCooperativeOverview();
      setData(res);
      if (showToast) toast.success("Cooperative data synced successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to load cooperative dashboard");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading Cooperative Society Command Center...
        </p>
      </div>
    );
  }

  const coop = data?.cooperative;
  const workforce = data?.workforce || { total: 0, active: 0, pending: 0, approved: 0, rejected: 0 };
  const financials = data?.financials || { grossTurnover: 0, cooperativeShareEarned: 0, workerNetDisbursed: 0, welfareReserveFund: 0, paidTransactionsCount: 0 };
  const gigs = data?.gigs || { total: 0, completed: 0, inProgress: 0, pending: 0, emergency: 0 };
  const pendingActions = data?.pendingActions || { pendingWorkersCount: 0, pendingClaimsCount: 0, activeEmergencyGigs: 0 };
  const recentBookings = data?.recentBookings || [];
  const topTrades = data?.topTrades || [];

  const completionRate =
    gigs.total > 0 ? Math.round((gigs.completed / gigs.total) * 100) : 100;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Society Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="size-14 sm:size-16 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary font-bold text-xl shadow-xs shrink-0 overflow-hidden">
              {coop?.logo ? (
                <img
                  src={coop.logo}
                  alt={coop.name}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-7 text-primary" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {coop?.name || "Cooperative Society"}
                </h1>
                <Badge
                  variant={coop?.verificationStatus === "Approved" ? "default" : "secondary"}
                  className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                >
                  <ShieldCheck className="size-3 mr-1" />
                  {coop?.verificationStatus === "Approved"
                    ? "Verified Society"
                    : "Verification In Review"}
                </Badge>
              </div>

              <div className="flex items-center gap-3.5 text-xs text-muted-foreground flex-wrap pt-0.5">
                {coop?.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-accent" /> {coop.address}
                  </span>
                )}
                {coop?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="size-3 text-accent" /> {coop.email}
                  </span>
                )}
                {coop?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3 text-accent" /> {coop.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOverview(true)}
              disabled={isRefreshing}
              className="rounded-lg gap-1.5 text-xs h-9 shadow-xs"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Sync Data
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/cooperative/forecasting")}
              className="rounded-lg gap-1.5 text-xs h-9 shadow-xs"
            >
              <Sparkles className="size-3.5" />
              AI Demand Map
            </Button>
          </div>
        </div>
      </div>

      {/* Action Alert Banners */}
      {(pendingActions.pendingWorkersCount > 0 ||
        pendingActions.pendingClaimsCount > 0 ||
        pendingActions.activeEmergencyGigs > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pendingActions.pendingWorkersCount > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {pendingActions.pendingWorkersCount} Worker{" "}
                    {pendingActions.pendingWorkersCount === 1 ? "Applicant" : "Applicants"}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Credentials waiting for approval
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 rounded-lg border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 shadow-xs"
                onClick={() => navigate("/cooperative/verifications")}
              >
                Review
              </Button>
            </div>
          )}

          {pendingActions.pendingClaimsCount > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {pendingActions.pendingClaimsCount} Welfare{" "}
                    {pendingActions.pendingClaimsCount === 1 ? "Claim" : "Claims"}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Emergency relief requests
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 rounded-lg border-rose-500/30 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 shadow-xs"
                onClick={() => navigate("/cooperative/welfare")}
              >
                Inspect
              </Button>
            </div>
          )}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workforce */}
        <Card className="rounded-xl border-border/80 hover:border-border transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Member Workforce
            </CardTitle>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {workforce.total}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                {workforce.active} Active
              </span>
              <span>•</span>
              <span>{workforce.pending} Pending</span>
            </div>
          </CardContent>
        </Card>

        {/* Turnover & Share */}
        <Card className="rounded-xl border-border/80 hover:border-border transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Society Turnover
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              ₹{financials.grossTurnover.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="text-accent font-medium">
                ₹{financials.cooperativeShareEarned.toLocaleString("en-IN")} Share
              </span>
              <span>•</span>
              <span>{financials.paidTransactionsCount} Orders</span>
            </div>
          </CardContent>
        </Card>

        {/* Welfare Fund */}
        <Card className="rounded-xl border-border/80 hover:border-border transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Welfare Reserve Pool
            </CardTitle>
            <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              ₹{financials.welfareReserveFund.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 rounded-md">
                100% Guaranteed
              </Badge>
              <span>Relief Ready</span>
            </div>
          </CardContent>
        </Card>

        {/* Gigs Dispatched */}
        <Card className="rounded-xl border-border/80 hover:border-border transition-all shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gigs Executed
            </CardTitle>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{gigs.total}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{completionRate}% Completed</span>
              <span>•</span>
              <span>{gigs.inProgress} In Progress</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Bookings & Dispatch Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-xl border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Recent Society Gig Dispatches
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Real-time status of service orders fulfilled by member workers
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/cooperative/payments")}
                className="text-xs gap-1 text-accent hover:text-accent rounded-lg"
              >
                View Payments <ArrowRight className="size-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No bookings recorded yet for this cooperative society.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 text-muted-foreground border-y border-border/60">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Service & Order</th>
                        <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Customer</th>
                        <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Assigned Worker</th>
                        <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Amount</th>
                        <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {recentBookings.map((b) => (
                        <tr
                          key={b._id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-foreground">
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {b.service?.name || "Household Service"}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {b.bookingNumber || b._id.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {b.customer?.name || "Guest Customer"}
                          </td>
                          <td className="py-3 px-4 text-foreground font-medium">
                            {b.worker?.userId?.name || "Unassigned"}
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">
                            ₹{b.totalAmount || 0}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                b.status === "COMPLETED"
                                  ? "default"
                                  : b.status === "IN_PROGRESS"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-[10px] rounded-md font-semibold px-2 py-0.5"
                            >
                              {b.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Trade Distribution & Society Hub (1 col) */}
        <div className="space-y-6">
          {/* Trade Distribution */}
          <Card className="rounded-xl border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">
                Workforce Trade Capacity
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Active member concentration across trade categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {topTrades.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No trade data categorized yet.
                </p>
              ) : (
                topTrades.map((item) => {
                  const percent =
                    workforce.total > 0
                      ? Math.round((item.workerCount / workforce.total) * 100)
                      : 0;
                  return (
                    <div key={item.trade} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-foreground">{item.trade}</span>
                        <span className="text-muted-foreground font-mono">
                          {item.workerCount} Workers ({percent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(10, percent))}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Quick Hub Navigation */}
          <Card className="rounded-xl border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">
                Society Management Hub
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Quick access to core operational workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between rounded-lg h-9 text-xs hover:bg-muted/50 hover:border-border"
                onClick={() => navigate("/cooperative/members")}
              >
                <span className="flex items-center gap-2">
                  <Users className="size-3.5 text-primary" /> Members Directory & Roster
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between rounded-lg h-9 text-xs hover:bg-muted/50 hover:border-border"
                onClick={() => navigate("/cooperative/verifications")}
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="size-3.5 text-amber-600 dark:text-amber-400" /> Worker Verification Queue
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between rounded-lg h-9 text-xs hover:bg-muted/50 hover:border-border"
                onClick={() => navigate("/cooperative/welfare")}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-rose-600 dark:text-rose-400" /> Welfare Reserve & Claims
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between rounded-lg h-9 text-xs hover:bg-muted/50 hover:border-border"
                onClick={() => navigate("/cooperative/payments")}
              >
                <span className="flex items-center gap-2">
                  <Wallet className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Settlements & Payouts
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}