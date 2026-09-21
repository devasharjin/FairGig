import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Calendar,
  ImageIcon,
  FileCheck,
  User,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminCooperative } from "@/features/admin/verifications/types";

interface CooperativeVerificationModalProps {
  cooperative: AdminCooperative | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onRevertToPending?: (id: string) => Promise<void>;
}

export const CooperativeVerificationModal: React.FC<CooperativeVerificationModalProps> = ({
  cooperative,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRevertToPending,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "logo" | "certificate">("details");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cooperative) return null;

  const applicant = cooperative.userId;
  const isPending = cooperative.verificationStatus === "Pending";
  const isApproved = cooperative.verificationStatus === "Approved";
  const isRejected = cooperative.verificationStatus === "Rejected";

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(cooperative._id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setShowRejectInput(true);
      return;
    }

    setIsProcessing(true);
    try {
      await onReject(cooperative._id, rejectionReason.trim());
      setShowRejectInput(false);
      setRejectionReason("");
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevert = async () => {
    if (!onRevertToPending) return;
    setIsProcessing(true);
    try {
      await onRevertToPending(cooperative._id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const isCertPdf =
    cooperative.verificationCertificate?.url?.toLowerCase().endsWith(".pdf") ||
    cooperative.verificationCertificate?.url?.includes("/raw/upload/");

  const commonRejectionReasons = [
    "Registration certificate is illegible or expired.",
    "Registered office address or contact phone could not be verified.",
    "Society legal name does not match the uploaded certificate.",
    "Document uploaded is incomplete or missing regulatory seal.",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-border/80 shadow-2xl bg-card">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-gradient-to-r from-muted/30 via-background to-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              {cooperative.cooperativeLogo?.url ? (
                <img
                  src={cooperative.cooperativeLogo.url}
                  alt={cooperative.cooperativeName}
                  className="size-12 rounded-2xl object-cover border border-border/80 bg-background"
                />
              ) : (
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Building2 className="size-6" />
                </div>
              )}
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                  {cooperative.cooperativeName}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Calendar className="size-3 text-muted-foreground" />
                  <span>Submitted on {new Date(cooperative.createdAt).toLocaleString()}</span>
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant={
                isApproved
                  ? "default"
                  : isRejected
                  ? "destructive"
                  : "secondary"
              }
              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase border self-start sm:self-auto ${
                isApproved
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : isPending
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              {cooperative.verificationStatus}
            </Badge>
          </div>

          {/* Modal Tab Switcher */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/40 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "details"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              Society Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logo")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "logo"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <ImageIcon className="size-3.5" />
              Society Logo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("certificate")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "certificate"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <FileCheck className="size-3.5" />
              Registration Certificate
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* TAB 1: DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Previous Rejection Alert if any */}
              {isRejected && cooperative.rejectedReason && (
                <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2.5">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-[11px]">
                      Current Rejection Notice
                    </span>
                    <p className="mt-0.5">{cooperative.rejectedReason}</p>
                  </div>
                </div>
              )}

              {/* Cooperative Office & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-muted/25 border border-border/60 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3 text-primary" />
                    Official Society Email
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {cooperative.cooperativeEmail}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/25 border border-border/60 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3 text-primary" />
                    Official Contact Phone
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {cooperative.cooperativePhone}
                  </p>
                </div>
              </div>

              {/* Physical Address */}
              <div className="p-3.5 rounded-2xl bg-muted/25 border border-border/60 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3 text-primary" />
                  Registered Office Address
                </p>
                <p className="text-xs sm:text-sm text-foreground">
                  {cooperative.cooperativeAddress}
                </p>
              </div>

              {/* Applicant User Account Information */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <User className="size-3.5 text-primary" />
                  Registered Account Holder (Representative)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Applicant Name</span>
                    <span className="font-semibold text-foreground">{applicant?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Account Email</span>
                    <span className="font-semibold text-foreground">{applicant?.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Account Status</span>
                    <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                      {applicant?.accountStatus || "ACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO PREVIEW */}
          {activeTab === "logo" && (
            <div className="space-y-2.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-primary" />
                  Official Society Brand Logo
                </p>
                {cooperative.cooperativeLogo?.url && (
                  <a
                    href={cooperative.cooperativeLogo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    Open Original Image
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>

              {cooperative.cooperativeLogo?.url ? (
                <div className="h-[230px] sm:h-[270px] flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/60 overflow-hidden">
                  <img
                    src={cooperative.cooperativeLogo.url}
                    alt="Cooperative Logo Full Preview"
                    className="h-[170px] sm:h-[200px] w-auto max-w-full rounded-xl object-contain shadow-xs border border-border/80 bg-background"
                  />
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-2 truncate max-w-full">
                    Public ID: <span className="font-mono">{cooperative.cooperativeLogo.publicId}</span>
                  </p>
                </div>
              ) : (
                <div className="h-[230px] sm:h-[270px] flex items-center justify-center rounded-2xl bg-muted/20 border border-dashed border-border/80 text-muted-foreground text-xs">
                  No logo uploaded for this society.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CERTIFICATE PREVIEW */}
          {activeTab === "certificate" && (
            <div className="space-y-2.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileCheck className="size-3.5 text-primary" />
                  Registration Certificate / Societies Act Bylaws
                </p>
                {cooperative.verificationCertificate?.url && (
                  <a
                    href={cooperative.verificationCertificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    Open Full Document
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>

              {cooperative.verificationCertificate?.url ? (
                <div className="h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/60 overflow-hidden">
                  {isCertPdf ? (
                    <div className="w-full text-center space-y-3 py-2">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <FileText className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          PDF Certificate Attached
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-md mx-auto">
                          Click below to inspect or download the official verification certificate in a new tab.
                        </p>
                      </div>
                      <a
                        href={cooperative.verificationCertificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
                      >
                        <ExternalLink className="size-3.5" />
                        View Official PDF Document
                      </a>
                    </div>
                  ) : (
                    <img
                      src={cooperative.verificationCertificate.url}
                      alt="Certificate Preview"
                      className="h-[200px] sm:h-[240px] w-auto max-w-full rounded-xl object-contain shadow-xs border border-border/80 bg-background"
                    />
                  )}
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-2 truncate max-w-full">
                    Public ID: <span className="font-mono">{cooperative.verificationCertificate.publicId}</span>
                  </p>
                </div>
              ) : (
                <div className="h-[260px] sm:h-[300px] flex items-center justify-center rounded-2xl bg-muted/20 border border-dashed border-border/80 text-muted-foreground text-xs">
                  No verification certificate uploaded.
                </div>
              )}
            </div>
          )}

          {/* Rejection Reason Form Section (when triggered) */}
          {showRejectInput && (
            <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-destructive flex items-center gap-1.5">
                  <XCircle className="size-3.5" />
                  State Rejection Reason (Required)
                </span>
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this cooperative registration is rejected (e.g. invalid certificate, address mismatch)..."
                className="w-full rounded-xl border border-destructive/30 bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-destructive/20 resize-none text-foreground"
              />

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Suggested Reasons:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commonRejectionReasons.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setRejectionReason(reason)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-left cursor-pointer"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 sm:p-6 border-t border-border/60 bg-muted/10 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl text-xs font-semibold border-border/80 cursor-pointer"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {/* Revert to Pending Option for already reviewed societies */}
            {!isPending && onRevertToPending && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRevert}
                disabled={isProcessing}
                className="rounded-xl text-xs font-semibold border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3.5 mr-1" />
                Reset to Pending
              </Button>
            )}

            {/* Reject Button */}
            {!isRejected && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReject}
                disabled={isProcessing}
                className="rounded-xl text-xs font-semibold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                ) : (
                  <XCircle className="size-3.5 mr-1" />
                )}
                {showRejectInput ? "Confirm Rejection" : "Reject Application"}
              </Button>
            )}

            {/* Approve Button */}
            {!isApproved && (
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isProcessing}
                className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                ) : (
                  <CheckCircle2 className="size-3.5 mr-1" />
                )}
                Approve Cooperative
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
