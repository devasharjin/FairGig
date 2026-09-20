import { useState } from "react";
import {
  Briefcase,
  IndianRupee,
  Users,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
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
import { Badge } from "@/components/ui/badge";
import { submitContractBid } from "@/features/cooperative/bids/api";
import type { InstitutionalContractItem } from "@/features/cooperative/bids/types";

interface SubmitBidModalProps {
  contract: InstitutionalContractItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitBidModal = ({
  contract,
  isOpen,
  onClose,
  onSuccess,
}: SubmitBidModalProps) => {
  const [proposedAmount, setProposedAmount] = useState("");
  const [proposedWorkersCount, setProposedWorkersCount] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill if updating existing proposal
  const handleOpen = () => {
    if (contract?.myBid) {
      setProposedAmount(String(contract.myBid.proposedAmount));
      setProposedWorkersCount(String(contract.myBid.proposedWorkersCount));
      setProposalNotes(contract.myBid.proposalNotes || "");
    } else if (contract) {
      setProposedAmount(String(contract.budget));
      setProposedWorkersCount(String(contract.requiredWorkers));
      setProposalNotes("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    const amount = Number(proposedAmount);
    const workers = Number(proposedWorkersCount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid bid amount (₹)");
      return;
    }

    if (isNaN(workers) || workers < 1) {
      toast.error("Please specify at least 1 member worker");
      return;
    }

    if (!proposalNotes.trim()) {
      toast.error("Please provide execution details or society qualifications");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContractBid({
        contractId: contract._id,
        proposedAmount: amount,
        proposedWorkersCount: workers,
        proposalNotes: proposalNotes.trim(),
      });

      toast.success("Collective society bid submitted successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit society bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contract) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) handleOpen();
        else onClose();
      }}
    >
      <DialogContent className="max-w-lg p-0 rounded-2xl bg-card border-border/80 shadow-2xl">
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 border-b border-border/60">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border-primary/20 rounded-md"
            >
              {contract.contractNumber}
            </Badge>
            <span className="text-xs text-muted-foreground">• {contract.clientType}</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {contract.hasSubmittedBid ? "Update Society Bid" : "Submit Collective Bid"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {contract.title}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Tender Baseline Summary */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-input/20 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground">Target Budget:</span>
              <p className="font-bold text-foreground text-sm mt-0.5">
                ₹{contract.budget.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Required Workers:</span>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {contract.requiredWorkers} Workers ({contract.tradeRequired})
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bidAmount" className="text-xs font-semibold text-foreground">
              Proposed Contract Amount (₹)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ₹
              </span>
              <Input
                id="bidAmount"
                type="number"
                placeholder={String(contract.budget)}
                value={proposedAmount}
                onChange={(e) => setProposedAmount(e.target.value)}
                className="pl-8 text-sm h-10 rounded-xl"
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Collective contract remuneration to be distributed among participating members.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="workersCount" className="text-xs font-semibold text-foreground">
              Member Workers to Mobilize
            </Label>
            <div className="relative">
              <Users className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="workersCount"
                type="number"
                min="1"
                placeholder={String(contract.requiredWorkers)}
                value={proposedWorkersCount}
                onChange={(e) => setProposedWorkersCount(e.target.value)}
                className="pl-9 text-sm h-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposalNotes" className="text-xs font-semibold text-foreground">
              Society Execution Plan & Proposal Notes
            </Label>
            <Textarea
              id="proposalNotes"
              rows={3}
              placeholder="Detail your cooperative's equipment readiness, supervisor allocation, quality assurance, or completion guarantee..."
              value={proposalNotes}
              onChange={(e) => setProposalNotes(e.target.value)}
              className="text-xs rounded-xl"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs h-9"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs h-9 gap-1.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Briefcase className="size-3.5" />
                  {contract.hasSubmittedBid ? "Update Proposal" : "Confirm & Submit Bid"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
