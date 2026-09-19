import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  IndianRupee,
  Users,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Award,
  TrendingUp,
  FileText,
  Building2,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  HeartHandshake,
  Wrench,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getPlatformWelfareStats,
  getAdminClaims,
  auditAdminClaim,
} from "@/features/welfare/api";
import type {
  PlatformWelfareStats,
  WelfareClaim,
  WelfareClaimStatus,
} from "@/features/welfare/types";

export const SuperAdminWelfare = () => {
  const [stats, setStats] = useState<PlatformWelfareStats | null>(null);
  const [claims, setClaims] = useState<WelfareClaim[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Audit modal state
  const [selectedClaimForAudit, setSelectedClaimForAudit] = useState<WelfareClaim | null>(null);
  const [auditNotes, setAuditNotes] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, claimsData] = await Promise.all([
        getPlatformWelfareStats(),
        getAdminClaims({ status: selectedStatus, search: searchQuery }),
      ]);
      setStats(statsData);
      setClaims(claimsData.claims || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load platform welfare analytics");
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

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaimForAudit) return;

    if (!auditNotes.trim()) {
      toast.error("Please provide audit observation notes");
      return;
    }

    setIsAuditing(true);
    try {
      await auditAdminClaim(selectedClaimForAudit._id, {
        notes: auditNotes.trim(),
        auditAction: "SUPERADMIN_COMPLIANCE_VERIFIED",
      });

      toast.success("Super admin audit entry logged successfully");
      setSelectedClaimForAudit(null);
      setAuditNotes("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to record audit review");
    } finally {
      setIsAuditing(false);
    }
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <ShieldAlert className="size-3.5" />
              Platform Apex Administration
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-emerald-600">
              Pradhan Mantri Suraksha Bima Scheme Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Platform Welfare & Insurance Reserve Governance
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitor apex insurance reserve health across all affiliated cooperatives, audit loss ratios, and inspect nationwide claim settlements.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchData}
          className="rounded-2xl gap-1.5 text-xs shrink-0"
          disabled={isLoading}
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Reserve
        </Button>
      </div>

      {/* Platform Reserve Health 5-Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Platform Insurance Pool</span>
            <IndianRupee className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">
            ₹{(stats?.totalInsurancePool || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            5% automatic gig contribution
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Net Available Reserve</span>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            ₹{(stats?.availableReserve || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Solvent & fully backed
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total Claims Settled</span>
            <Award className="size-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">
            ₹{(stats?.totalSettledAmount || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {stats?.claimsOverview?.settledClaimsCount || 0} claims paid out
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Incurred Loss Ratio</span>
            <TrendingUp className="size-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">
            {stats?.lossRatio || 0}%
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Healthy actuarial ratio (&lt;60%)
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Covered Gig Workers</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">
            {stats?.totalWorkersEnrolled || 0}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Active verified policyholders
          </div>
        </div>
      </div>

      {/* Underwriting Scheme Details Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-muted/60 via-card to-background border border-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Master Policy Scheme</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-foreground">
              {stats?.policyConfig?.underwriter}
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            {stats?.policyConfig?.schemeName}
          </h3>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-background border border-border font-medium">
              Accident: <strong>₹5,00,000</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-background border border-border font-medium">
              Hospitalization: <strong>₹2,00,000</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-background border border-border font-medium">
              Distress Grant: <strong>₹25,000</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-background border border-border font-medium">
              Tool Cover: <strong>₹15,000</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-background border border-border font-medium">
              Health Checkup: <strong>₹3,000</strong>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 text-xs space-y-1 shrink-0">
          <div className="text-muted-foreground font-semibold">Pending Platform Liability:</div>
          <div className="text-lg font-bold text-amber-600">
            ₹{(stats?.pendingLiability || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Across {stats?.claimsOverview?.pendingClaimsCount || 0} claims pending review
          </div>
        </div>
      </div>

      {/* Platform Claims Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Nationwide Claims Ledger</h3>
            <p className="text-xs text-muted-foreground">Audit decisions, inspect documents, and enforce cooperative compliance</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claim, worker, or society..."
              className="rounded-2xl pl-9 h-10 text-xs"
            />
          </form>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 text-xs overflow-x-auto max-w-full">
          {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DISBURSED", "REJECTED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer text-[11px] shrink-0 ${
                selectedStatus === status
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40">
            <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="size-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">No Claims on Record</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              No claims match the specified filter or query.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <div
                key={claim._id}
                className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {claim.claimNumber}
                    </span>
                    {getStatusBadge(claim.status)}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-foreground">
                      {claim.claimType.replace(/_/g, " ")}
                    </span>
                    {claim.cooperative && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <Building2 className="size-3" />
                        {claim.cooperative.cooperativeName}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-foreground">{claim.title}</h4>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span>Beneficiary: <strong className="text-foreground">{claim.workerUser?.name || "Worker"}</strong></span>
                    <span>•</span>
                    <span>Date: {new Date(claim.incidentDate).toLocaleDateString()}</span>
                    {claim.disbursementTxnId && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-emerald-600">Txn: {claim.disbursementTxnId}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/60">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-muted-foreground font-medium">Claim Amount</div>
                    <div className="text-base font-extrabold text-foreground flex items-center sm:justify-end gap-0.5">
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
                    variant="outline"
                    onClick={() => {
                      setSelectedClaimForAudit(claim);
                      setAuditNotes("");
                    }}
                    className="rounded-xl text-xs font-semibold gap-1"
                  >
                    <span>Audit Log</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Super Admin Audit Modal */}
      {selectedClaimForAudit && (
        <Dialog open={!!selectedClaimForAudit} onOpenChange={() => setSelectedClaimForAudit(null)}>
          <DialogContent className="max-w-lg p-6 rounded-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {selectedClaimForAudit.claimNumber}
                </span>
                {getStatusBadge(selectedClaimForAudit.status)}
              </div>
              <DialogTitle className="text-base font-bold">Audit Inspection: {selectedClaimForAudit.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Affiliated Cooperative: {selectedClaimForAudit.cooperative?.cooperativeName || "Cooperative Society"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-muted/60 space-y-1">
                <div className="text-muted-foreground font-semibold">Incident Description:</div>
                <p className="text-foreground leading-relaxed">{selectedClaimForAudit.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl border border-border/80">
                  <div className="text-muted-foreground">Requested:</div>
                  <div className="text-base font-extrabold text-foreground mt-0.5">
                    ₹{selectedClaimForAudit.amountRequested.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-border/80">
                  <div className="text-muted-foreground">Approved:</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {selectedClaimForAudit.amountApproved
                      ? `₹${selectedClaimForAudit.amountApproved.toLocaleString("en-IN")}`
                      : "—"}
                  </div>
                </div>
              </div>

              {selectedClaimForAudit.reviewNotes && (
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                  <div className="font-semibold text-primary">Cooperative Committee Notes:</div>
                  <p className="text-foreground">{selectedClaimForAudit.reviewNotes}</p>
                </div>
              )}

              {/* Action Trail */}
              {selectedClaimForAudit.auditLog && selectedClaimForAudit.auditLog.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="font-semibold text-foreground">Action Trail:</div>
                  <div className="space-y-2">
                    {selectedClaimForAudit.auditLog.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px]">
                        <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground">
                            {log.action.replace(/_/g, " ")} •{" "}
                            <span className="text-muted-foreground font-normal">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {log.notes && <div className="text-muted-foreground">{log.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Super Admin Observation Input */}
              <form onSubmit={handleAuditSubmit} className="space-y-3 pt-3 border-t border-border/60">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Log Super Admin Compliance Note</Label>
                  <Textarea
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    placeholder="Enter compliance verification comments, policy check outcome, or instructions..."
                    rows={2}
                    className="rounded-xl text-xs resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedClaimForAudit(null)}
                    className="rounded-xl text-xs"
                    disabled={isAuditing}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAuditing}
                    className="rounded-xl text-xs font-bold gap-1"
                  >
                    {isAuditing ? "Saving..." : "Record Audit Entry"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SuperAdminWelfare;
