import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  MapPin,
  Clock,
  Briefcase,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Calendar,
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
import type { CooperativeWorker } from "@/features/cooperative/verifications/types";

interface WorkerVerificationModalProps {
  worker: CooperativeWorker | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export const WorkerVerificationModal: React.FC<WorkerVerificationModalProps> = ({
  worker,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "documents">("details");
  const [activeDocTab, setActiveDocTab] = useState<"identity" | "certificate">("identity");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!worker) return null;

  const user = worker.userId;
  const isPending = worker.verificationStatus === "Pending";
  const isApproved = worker.verificationStatus === "Approved";
  const isRejected = worker.verificationStatus === "Rejected";

  const categoryName =
    typeof worker.category === "object" && (worker.category as any)?.name
      ? (worker.category as any).name
      : typeof worker.category === "string"
      ? worker.category
      : null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(worker._id);
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
      await onReject(worker._id, rejectionReason.trim());
      setRejectionReason("");
      setShowRejectInput(false);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const currentDoc =
    activeDocTab === "identity"
      ? worker.verificationDocuments?.identity
      : worker.verificationDocuments?.certificate;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl border-border/80 bg-card shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 sm:size-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                {user?.name?.[0]?.toUpperCase() || "W"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {user?.name || "Worker Applicant"}
                  </h3>
                  <Badge
                    variant={
                      isApproved
                        ? "default"
                        : isRejected
                        ? "destructive"
                        : "secondary"
                    }
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase border ${
                      isApproved
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : isPending
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {worker.verificationStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>Applied on {new Date(worker.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-3.5">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "details"
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Worker Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "documents"
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Verification Documents (2)
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {activeTab === "details" ? (
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Contact Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>{user?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span>{user?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Category, Skills & Experience */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Trade Category & Qualifications
                  </p>
                  {categoryName && (
                    <Badge variant="default" className="bg-primary text-primary-foreground text-xs font-semibold shadow-xs">
                      {categoryName}
                    </Badge>
                  )}
                </div>

                {worker.skills && worker.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-muted-foreground">Enabled Platform Services:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.skills.map((skill) => (
                        <span
                          key={skill._id}
                          className="px-2.5 py-1 rounded-xl text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-3.5 text-muted-foreground" />
                    <span>
                      Experience: <strong>{worker.experience} years</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <span>
                      Availability: <strong>{worker.availability}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Location */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Operating Location
                </p>
                <div className="flex items-start gap-2 text-xs text-foreground">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{worker.location?.address}</p>
                    <p className="text-muted-foreground">
                      {worker.location?.city}, {worker.location?.state} -{" "}
                      {worker.location?.pincode}
                    </p>
                    {worker.location?.latitude && worker.location?.longitude ? (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        GPS: {worker.location.latitude}, {worker.location.longitude}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Rejection Note if already rejected */}
              {isRejected && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Rejection Reason:</p>
                    <p className="mt-0.5">
                      {worker.verificationDocuments?.identity?.rejectionReason ||
                        "Application was rejected by the cooperative."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Documents Tab */
            <div className="space-y-3">
              {/* Document sub-tabs */}
              <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                <button
                  type="button"
                  onClick={() => setActiveDocTab("identity")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeDocTab === "identity"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="size-3.5" />
                  Government ID Proof
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab("certificate")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeDocTab === "certificate"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  Trade Certificate
                </button>
              </div>

              {/* Document Display / Preview */}
              {currentDoc?.url ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Status:{" "}
                      <strong className="text-foreground">{currentDoc.status}</strong>
                    </span>
                    <a
                      href={currentDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      Open in new tab <ExternalLink className="size-3" />
                    </a>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/10 p-2 overflow-hidden flex items-center justify-center h-[240px] sm:h-[280px]">
                    {currentDoc.url.includes(".pdf") ||
                    currentDoc.url.startsWith("data:application/pdf") ? (
                      <div className="flex flex-col items-center justify-center gap-2.5 py-4">
                        <FileText className="size-12 text-primary/60" />
                        <p className="text-xs font-medium text-foreground">
                          PDF Document Attached
                        </p>
                        <a
                          href={currentDoc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          View PDF Document <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    ) : (
                      <img
                        src={currentDoc.url}
                        alt="Verification Document"
                        className="h-[210px] sm:h-[250px] w-auto max-w-full rounded-xl object-contain shadow-xs border bg-background"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[240px] sm:h-[280px] flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/80 rounded-2xl">
                  No document uploaded for this section.
                </div>
              )}
            </div>
          )}

          {/* Rejection input box if opened */}
          {showRejectInput && (
            <div className="space-y-2 p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/20 animate-in fade-in-50">
              <label className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Reason for Rejection: <span className="text-destructive">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Specify why this worker application is being rejected (e.g. Unclear ID, invalid certificate)..."
                rows={2}
                className="w-full text-xs p-3 rounded-lg bg-background border border-border/80 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/10 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg text-xs h-9 px-4 shadow-xs"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {/* Reject Action */}
            {isPending && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
                className="rounded-lg text-xs h-9 px-4 gap-1.5 shadow-xs"
              >
                {isProcessing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                {showRejectInput ? "Confirm Rejection" : "Reject Application"}
              </Button>
            )}

            {/* Approve Action */}
            {(isPending || isRejected) && (
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isProcessing}
                className="rounded-lg text-xs h-9 px-5 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
              >
                {isProcessing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-3.5" />
                )}
                Approve & Enroll Member
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
