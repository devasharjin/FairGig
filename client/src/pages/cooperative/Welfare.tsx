import { useState, useEffect } from "react";
import {
  ShieldCheck,
  HeartHandshake,
  IndianRupee,
  Users,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Plus,
  AlertTriangle,
  Calendar,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCooperativeWelfareStats,
  getCooperativeClaims,
  getCooperativeWorkerWelfareList,
} from "@/features/welfare/api";
import type {
  CooperativeWelfareStats,
  WelfareClaim,
  CooperativeWorkerWelfareItem,
  WelfareClaimStatus,
} from "@/features/welfare/types";
import { ReviewClaimDialog } from "@/components/cooperative/welfare/ReviewClaimDialog";
import { EmergencyGrantDialog } from "@/components/cooperative/welfare/EmergencyGrantDialog";

export const CooperativeWelfare = () => {
  const [stats, setStats] = useState<CooperativeWelfareStats | null>(null);
  const [claims, setClaims] = useState<WelfareClaim[]>([]);
  const [workers, setWorkers] = useState<CooperativeWorkerWelfareItem[]>([]);
  const [activeTab, setActiveTab] = useState<"claims" | "directory">("claims");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedClaimForReview, setSelectedClaimForReview] = useState<WelfareClaim | null>(null);
  const [isEmergencyGrantOpen, setIsEmergencyGrantOpen] = useState(false);
  const [preselectedWorkerId, setPreselectedWorkerId] = useState<string | undefined>();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, claimsData, workersData] = await Promise.all([
        getCooperativeWelfareStats(),
        getCooperativeClaims({ status: selectedStatus, search: searchQuery }),
        getCooperativeWorkerWelfareList(),
      ]);
      setStats(statsData);
      setClaims(claimsData.claims || []);
      setWorkers(workersData.workers || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load cooperative welfare data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const getStatusBadge = (status: WelfareClaimStatus) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 gap-1 text-[11px]">
            <Clock className="size-3" />
            Submitted
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1 text-[11px]">
            <RefreshCw className="size-3 animate-spin" />
            Under Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 text-[11px]">
            <CheckCircle2 className="size-3" />
            Approved
          </Badge>
        );
      case "DISBURSED":
        return (
          <Badge variant="outline" className="bg-emerald-600 text-white border-transparent gap-1 text-[11px]">
            <IndianRupee className="size-3" />
            Disbursed
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1 text-[11px]">
            <XCircle className="size-3" />
            Declined
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-card border border-border/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
              <ShieldCheck className="size-3.5" />
              Cooperative Social Security Reserve
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-foreground">
              {stats?.cooperative?.name || "Society Welfare Management"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Worker Welfare & Insurance Fund
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage the pooled insurance deductions from member gig earnings, evaluate incident claims, and disburse relief aid.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => {
              setPreselectedWorkerId(undefined);
              setIsEmergencyGrantOpen(true);
            }}
            className="rounded-lg gap-2 text-xs font-semibold h-9 shadow-xs"
          >
            <HeartHandshake className="size-4" />
            Issue Emergency Relief Grant
          </Button>
          <Button
            variant="outline"
            onClick={fetchData}
            className="rounded-lg gap-1.5 text-xs h-9 shadow-xs"
            disabled={isLoading}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin text-accent" : ""}`} />
            Sync
          </Button>
        </div>
      </div>

      {/* Fund Metrics 4-Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
          <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <IndianRupee className="size-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Available Fund Reserve</div>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              ₹{(stats?.availableFundReserve || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Available for welfare payouts
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Pool Collected</div>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              ₹{(stats?.totalPoolCollected || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              From {stats?.totalCompletedGigs || 0} completed gigs
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
          <div className="size-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <HeartHandshake className="size-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Claims Disbursed</div>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              ₹{(stats?.totalDisbursedAmount || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Across all settled incidents
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center gap-4">
          <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Covered Member Workers</div>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              {stats?.totalWorkersCovered || 0}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5">
              100% active insurance enrollment
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("claims")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "claims"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Claims Evaluation Queue ({claims.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "directory"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Worker Insurance Directory ({workers.length})
        </button>
      </div>

      {/* TAB 1: CLAIMS QUEUE */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search claim # or worker name..."
                className="rounded-lg pl-9 h-9 text-xs"
              />
            </form>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/70 text-xs overflow-x-auto max-w-full">
              {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DISBURSED", "REJECTED"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer text-[11px] shrink-0 ${
                    selectedStatus === status
                      ? "bg-card text-foreground shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border/80 bg-card/40">
              <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="size-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">No Claims Pending</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                There are currently no worker claims matching the selected filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => (
                <div
                  key={claim._id}
                  className="p-4 rounded-xl bg-card border border-border/80 hover:border-border transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        {claim.claimNumber}
                      </span>
                      {getStatusBadge(claim.status)}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-foreground">
                        {claim.claimType.replace(/_/g, " ")}
                      </span>
                      {claim.urgency === "CRITICAL" && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-destructive/15 text-destructive">
                          SOS Critical
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-foreground">{claim.title}</h4>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <User className="size-3 text-accent" />
                        {claim.workerUser?.name || "Member Worker"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(claim.incidentDate).toLocaleDateString()}
                      </span>
                      {claim.booking && (
                        <>
                          <span>•</span>
                          <span>Booking #{claim.booking.bookingNumber}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/60">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-muted-foreground font-medium">Requested Amount</div>
                      <div className="text-base font-bold text-foreground flex items-center sm:justify-end gap-0.5">
                        <IndianRupee className="size-3.5" />
                        {claim.amountRequested.toLocaleString("en-IN")}
                      </div>
                      {claim.amountApproved && claim.amountApproved !== claim.amountRequested && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Approved: ₹{claim.amountApproved.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setSelectedClaimForReview(claim)}
                      className="rounded-lg text-xs font-semibold gap-1 shadow-xs h-8 px-3"
                    >
                      <span>Evaluate</span>
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WORKER DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="p-3 pl-4">Member Worker</th>
                    <th className="p-3">Policy Identifier</th>
                    <th className="p-3">Insurance Status</th>
                    <th className="p-3">Gigs Completed</th>
                    <th className="p-3">Accrued Pool Contribution</th>
                    <th className="p-3 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {workers.map((w) => (
                    <tr key={w.workerId} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{w.user?.name || "Worker"}</span>
                          {w.category && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 rounded-md">
                              {w.category}
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{w.user?.phone || w.user?.email || "—"}</div>
                      </td>
                      <td className="p-3 font-mono font-medium text-foreground">
                        {w.policyNumber}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="size-2.5" />
                          Active & Insured
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-foreground">
                        {w.completedJobs}
                      </td>
                      <td className="p-3 font-bold text-accent">
                        ₹{w.totalInsuranceContributed.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPreselectedWorkerId(w.workerId);
                            setIsEmergencyGrantOpen(true);
                          }}
                          className="rounded-lg text-[11px] gap-1 h-8 shadow-xs"
                        >
                          <HeartHandshake className="size-3 text-accent" />
                          Issue Relief
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <ReviewClaimDialog
        claim={selectedClaimForReview}
        isOpen={!!selectedClaimForReview}
        onClose={() => setSelectedClaimForReview(null)}
        onSuccess={fetchData}
      />

      {/* Emergency Grant Dialog */}
      <EmergencyGrantDialog
        workers={workers}
        preselectedWorkerId={preselectedWorkerId}
        isOpen={isEmergencyGrantOpen}
        onClose={() => setIsEmergencyGrantOpen(false)}
        onSuccess={fetchData}
        availableReserve={stats?.availableFundReserve || 0}
      />
    </div>
  );
};

export default CooperativeWelfare;
