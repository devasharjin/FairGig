import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Calendar,
  IndianRupee,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  User,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCooperativeClaimStatus } from "@/features/welfare/api";
import type { WelfareClaim, WelfareClaimStatus } from "@/features/welfare/types";

interface ReviewClaimDialogProps {
  claim: WelfareClaim | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewClaimDialog = ({
  claim,
  isOpen,
  onClose,
  onSuccess,
}: ReviewClaimDialogProps) => {
  const [status, setStatus] = useState<WelfareClaimStatus>("UNDER_REVIEW");
  const [amountApproved, setAmountApproved] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [disbursementTxnId, setDisbursementTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (claim) {
      setStatus(claim.status === "SUBMITTED" ? "UNDER_REVIEW" : claim.status);
      setAmountApproved((claim.amountApproved || claim.amountRequested).toString());
      setReviewNotes(claim.reviewNotes || "");
      setRejectionReason(claim.rejectionReason || "");
      setDisbursementTxnId(claim.disbursementTxnId || `TXN-WLF-${Date.now()}`);
    }
  }, [claim]);

  if (!claim) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "APPROVED") {
      const amt = Number(amountApproved);
      if (isNaN(amt) || amt <= 0) {
        toast.error("Please enter a valid approved amount");
        return;
      }
    }

    if (status === "REJECTED" && !rejectionReason.trim()) {
      toast.error("Please state the reason for rejecting this claim");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCooperativeClaimStatus(claim._id, {
        status,
        amountApproved: status === "APPROVED" || status === "DISBURSED" ? Number(amountApproved) : undefined,
        reviewNotes: reviewNotes.trim(),
        rejectionReason: status === "REJECTED" ? rejectionReason.trim() : undefined,
        disbursementTxnId: status === "DISBURSED" ? disbursementTxnId.trim() : undefined,
      });

      toast.success(`Claim status updated to ${status}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update claim status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {claim.claimNumber}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-muted text-foreground">
              {claim.claimType.replace(/_/g, " ")}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold">{claim.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Submitted by member worker on {new Date(claim.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        {/* Worker Info & Details */}
        <div className="p-4 rounded-2xl bg-muted/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <User className="size-4 text-primary" />
              <span>{claim.workerUser?.name || "Worker"}</span>
            </div>
            {claim.workerUser?.phone && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="size-3" />
                <span>{claim.workerUser.phone}</span>
              </div>
            )}
          </div>
          <div className="text-foreground leading-relaxed pt-1 border-t border-border/40">
            <strong className="text-muted-foreground">Incident Description: </strong>
            {claim.description}
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
            <span>Incident Date: {new Date(claim.incidentDate).toLocaleDateString()}</span>
            <span className="font-bold text-foreground">
              Requested: ₹{claim.amountRequested.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Evidence Documents */}
          {claim.documents && claim.documents.length > 0 && (
            <div className="pt-2 border-t border-border/40 space-y-1">
              <div className="font-semibold text-muted-foreground text-[11px]">Submitted Documents:</div>
              <div className="flex flex-wrap gap-2">
                {claim.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-card border border-border text-primary hover:underline text-[11px]"
                  >
                    <FileText className="size-3" />
                    <span>{doc.title}</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Update Status Action</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as WelfareClaimStatus)}>
              <SelectTrigger className="rounded-xl h-10 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNDER_REVIEW">Under Committee Review</SelectItem>
                <SelectItem value="APPROVED">Approve for Payout</SelectItem>
                <SelectItem value="DISBURSED">Disburse Funds (Finalize Payment)</SelectItem>
                <SelectItem value="REJECTED">Reject / Decline Claim</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(status === "APPROVED" || status === "DISBURSED") && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Approved Amount (₹)</Label>
              <Input
                type="number"
                min={1}
                value={amountApproved}
                onChange={(e) => setAmountApproved(e.target.value)}
                className="rounded-xl h-10 text-xs font-mono font-bold"
                required
              />
            </div>
          )}

          {status === "DISBURSED" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Disbursement Transaction Reference</Label>
              <Input
                value={disbursementTxnId}
                onChange={(e) => setDisbursementTxnId(e.target.value)}
                placeholder="Bank UTR or cooperative voucher reference"
                className="rounded-xl h-10 text-xs font-mono"
                required
              />
            </div>
          )}

          {status === "REJECTED" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-destructive">Reason for Rejection</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why the claim does not qualify under the cooperative welfare policy..."
                rows={2}
                className="rounded-xl text-xs resize-none border-destructive/40"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Committee Review Notes</Label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Internal resolution notes or instructions for the worker..."
              rows={2}
              className="rounded-xl text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Update Claim Decision</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
