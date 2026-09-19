import { useState, useEffect } from "react";
import {
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Calendar,
  FileText,
  PhoneCall,
  Plus,
  RefreshCw,
  Award,
  ChevronRight,
  Stethoscope,
  Wrench,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getWorkerWelfareOverview, getWorkerClaims } from "@/features/welfare/api";
import type {
  WorkerWelfareSummary,
  WelfareClaim,
  WelfareClaimStatus,
} from "@/features/welfare/types";
import { FileClaimModal } from "@/components/worker/welfare/FileClaimModal";

export const WorkerWelfare = () => {
  const [overview, setOverview] = useState<WorkerWelfareSummary | null>(null);
  const [claims, setClaims] = useState<WelfareClaim[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedClaimDetails, setSelectedClaimDetails] = useState<WelfareClaim | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [overviewData, claimsData] = await Promise.all([
        getWorkerWelfareOverview(),
        getWorkerClaims({ status: selectedStatus }),
      ]);
      setOverview(overviewData);
      setClaims(claimsData.claims || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load welfare & insurance data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStatus]);

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
            Under Committee Review
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

  const getClaimTypeIcon = (type: string) => {
    switch (type) {
      case "ACCIDENTAL_INJURY":
        return <AlertCircle className="size-4 text-amber-500" />;
      case "MEDICAL_HOSPITALIZATION":
        return <Stethoscope className="size-4 text-rose-500" />;
      case "EMERGENCY_HARDSHIP":
        return <HeartHandshake className="size-4 text-purple-500" />;
      case "TOOL_EQUIPMENT_LOSS":
        return <Wrench className="size-4 text-blue-500" />;
      default:
        return <ShieldCheck className="size-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Policy Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/15 via-emerald-500/10 to-transparent p-6 sm:p-8 border border-primary/25 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-xs">
                <ShieldCheck className="size-3.5" />
                {overview?.policy?.tier || "Cooperative Gold Shield"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & 100% Insured
              </span>
              <span className="text-xs font-mono font-bold text-foreground px-2 py-0.5 rounded-lg bg-background/80 border border-border">
                {overview?.policy?.policyNumber || "FG-WLF-ACTIVE"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Worker Welfare & Group Insurance Hub
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every completed gig automatically builds your welfare safety net. Underwritten by{" "}
              <strong className="text-foreground">{overview?.policy?.underwriter || "National Cooperative Workers Insurance Trust (NCWIT)"}</strong> under the{" "}
              <span>{overview?.policy?.schemeName || "Pradhan Mantri Suraksha Bima & Cooperative Gig Welfare Security"}</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <Button
              onClick={() => setIsFileModalOpen(true)}
              className="rounded-2xl gap-2 font-bold shadow-md h-11 text-xs"
            >
              <Plus className="size-4" />
              File Welfare / Insurance Claim
            </Button>
            <Button
              variant="outline"
              onClick={fetchData}
              className="rounded-2xl gap-1.5 text-xs h-11"
              disabled={isLoading}
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Coverage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="rounded-2xl border-border/70 hover:border-primary/40 transition">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-semibold flex items-center justify-between">
              <span>Personal Accident</span>
              <ShieldCheck className="size-3.5 text-primary" />
            </CardDescription>
            <CardTitle className="text-lg font-extrabold text-foreground">
              ₹{(overview?.policy?.coverage?.accidentalInjuryMax || 500000).toLocaleString("en-IN")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[10px] text-muted-foreground">On-duty accidental injury, fracture, or disability cover</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 hover:border-primary/40 transition">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-semibold flex items-center justify-between">
              <span>Hospitalization</span>
              <Stethoscope className="size-3.5 text-rose-500" />
            </CardDescription>
            <CardTitle className="text-lg font-extrabold text-foreground">
              ₹{(overview?.policy?.coverage?.hospitalizationMax || 200000).toLocaleString("en-IN")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[10px] text-muted-foreground">Cashless inpatient medical care and emergency surgery</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 hover:border-primary/40 transition">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-semibold flex items-center justify-between">
              <span>Distress Relief</span>
              <HeartHandshake className="size-3.5 text-purple-500" />
            </CardDescription>
            <CardTitle className="text-lg font-extrabold text-foreground">
              ₹{(overview?.policy?.coverage?.emergencyHardshipMax || 25000).toLocaleString("en-IN")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[10px] text-muted-foreground">Immediate 24-hr crisis stipend for family distress</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 hover:border-primary/40 transition">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-semibold flex items-center justify-between">
              <span>Tool Protection</span>
              <Wrench className="size-3.5 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-lg font-extrabold text-foreground">
              ₹{(overview?.policy?.coverage?.toolEquipmentLossMax || 15000).toLocaleString("en-IN")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[10px] text-muted-foreground">Reimbursement for stolen or damaged trade equipment</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 hover:border-primary/40 transition">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-[11px] font-semibold flex items-center justify-between">
              <span>Annual Health</span>
              <Sparkles className="size-3.5 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-lg font-extrabold text-foreground">
              ₹{(overview?.policy?.coverage?.healthCheckupAnnualMax || 3000).toLocaleString("en-IN")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-[10px] text-muted-foreground">Full annual preventative diagnostic checkup allowance</p>
          </CardContent>
        </Card>
      </div>

      {/* Welfare Accrual & Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border/80 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <IndianRupee className="size-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Your Accrued Insurance Pool Share</div>
            <div className="text-2xl font-black text-foreground">
              ₹{(overview?.contributions?.totalInsuranceAccrued || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Across {overview?.contributions?.coveredJobsCompleted || 0} completed bookings
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/80 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="size-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Active Claims Tracked</div>
            <div className="text-2xl font-black text-foreground">
              {overview?.claimsOverview?.pendingClaimsCount || 0}
              <span className="text-xs font-normal text-muted-foreground ml-1">in review</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {overview?.claimsOverview?.totalClaimsCount || 0} total claims filed to date
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/80 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Total Benefits Disbursed</div>
            <div className="text-2xl font-black text-foreground">
              ₹{(overview?.claimsOverview?.totalBenefitsReceived || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Directly deposited to your account
            </div>
          </div>
        </div>
      </div>

      {/* Claims History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">My Welfare & Insurance Claims</h3>
            <p className="text-xs text-muted-foreground">Track status and review notes from your cooperative committee</p>
          </div>

          {/* Filter tabs */}
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
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40">
            <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">No Claims Found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
              {selectedStatus === "ALL"
                ? "You have not filed any welfare or insurance claims yet. You are fully protected under your active policy."
                : `No claims currently marked as ${selectedStatus}.`}
            </p>
            <Button
              onClick={() => setIsFileModalOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
            >
              <Plus className="size-3.5" />
              File a Claim
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {claims.map((claim) => (
              <div
                key={claim._id}
                onClick={() => setSelectedClaimDetails(claim)}
                className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    {getClaimTypeIcon(claim.claimType)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        {claim.claimNumber}
                      </span>
                      {getStatusBadge(claim.status)}
                      {claim.urgency === "CRITICAL" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/15 text-destructive">
                          SOS Critical
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{claim.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(claim.incidentDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{claim.claimType.replace(/_/g, " ")}</span>
                      {claim.booking && (
                        <>
                          <span>•</span>
                          <span>Booking #{claim.booking.bookingNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/60">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-muted-foreground font-medium">Requested Amount</div>
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
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 24/7 Helpline Card */}
      <div className="p-5 rounded-3xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PhoneCall className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Cooperative Medical & Welfare Helpline</h4>
            <p className="text-xs text-muted-foreground">
              Immediate on-site accident support or cashless hospital admission assistance:{" "}
              <strong className="text-foreground">+91 1800-FAIR-GIG</strong> (Toll-Free 24/7)
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = "tel:18003247444";
          }}
          className="rounded-xl text-xs gap-1.5 shrink-0"
        >
          <PhoneCall className="size-3.5 text-primary" />
          Call Support
        </Button>
      </div>

      {/* Claim Submission Modal */}
      <FileClaimModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSuccess={fetchData}
        policyLimits={overview?.policy?.coverage || {
          accidentalInjuryMax: 500000,
          hospitalizationMax: 200000,
          emergencyHardshipMax: 25000,
          toolEquipmentLossMax: 15000,
          healthCheckupAnnualMax: 3000,
        }}
      />

      {/* Claim Details View Modal */}
      {selectedClaimDetails && (
        <Dialog open={!!selectedClaimDetails} onOpenChange={() => setSelectedClaimDetails(null)}>
          <DialogContent className="max-w-lg p-6 rounded-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {selectedClaimDetails.claimNumber}
                </span>
                {getStatusBadge(selectedClaimDetails.status)}
              </div>
              <DialogTitle className="text-base font-bold">{selectedClaimDetails.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Incident Date: {new Date(selectedClaimDetails.incidentDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-muted/60 space-y-1">
                <div className="text-muted-foreground font-semibold">Incident Details:</div>
                <p className="text-foreground leading-relaxed">{selectedClaimDetails.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl border border-border/80">
                  <div className="text-muted-foreground">Requested:</div>
                  <div className="text-base font-extrabold text-foreground mt-0.5">
                    ₹{selectedClaimDetails.amountRequested.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-border/80">
                  <div className="text-muted-foreground">Approved:</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {selectedClaimDetails.amountApproved
                      ? `₹${selectedClaimDetails.amountApproved.toLocaleString("en-IN")}`
                      : "Pending"}
                  </div>
                </div>
              </div>

              {selectedClaimDetails.reviewNotes && (
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                  <div className="font-semibold text-primary">Committee Review Notes:</div>
                  <p className="text-foreground">{selectedClaimDetails.reviewNotes}</p>
                </div>
              )}

              {selectedClaimDetails.rejectionReason && (
                <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-1 text-destructive">
                  <div className="font-semibold">Reason for Decline:</div>
                  <p>{selectedClaimDetails.rejectionReason}</p>
                </div>
              )}

              {selectedClaimDetails.disbursementTxnId && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <div className="font-semibold">Disbursement Transaction ID:</div>
                  <div className="font-mono font-bold mt-0.5">{selectedClaimDetails.disbursementTxnId}</div>
                  {selectedClaimDetails.disbursedAt && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Paid on: {new Date(selectedClaimDetails.disbursedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Audit Timeline */}
              {selectedClaimDetails.auditLog && selectedClaimDetails.auditLog.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="font-semibold text-foreground">Action Timeline:</div>
                  <div className="space-y-2">
                    {selectedClaimDetails.auditLog.map((log, idx) => (
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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkerWelfare;
