import { useState } from "react";
import {
  HeartHandshake,
  IndianRupee,
  User,
  CheckCircle2,
  AlertTriangle,
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
import { issueEmergencyGrant } from "@/features/welfare/api";
import type { CooperativeWorkerWelfareItem } from "@/features/welfare/types";

interface EmergencyGrantDialogProps {
  workers: CooperativeWorkerWelfareItem[];
  preselectedWorkerId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableReserve: number;
}

export const EmergencyGrantDialog = ({
  workers,
  preselectedWorkerId,
  isOpen,
  onClose,
  onSuccess,
  availableReserve,
}: EmergencyGrantDialogProps) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState(preselectedWorkerId || "");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [disbursementTxnId, setDisbursementTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWorkerId) {
      toast.error("Please select a beneficiary worker");
      return;
    }

    const grantAmt = Number(amount);
    if (isNaN(grantAmt) || grantAmt < 100 || grantAmt > 25000) {
      toast.error("Emergency grant amount must be between ₹100 and ₹25,000");
      return;
    }

    if (grantAmt > availableReserve) {
      toast.error(`Amount exceeds available society reserve of ₹${availableReserve.toLocaleString("en-IN")}`);
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide the justification for this emergency grant");
      return;
    }

    setIsSubmitting(true);
    try {
      await issueEmergencyGrant({
        workerId: selectedWorkerId,
        amount: grantAmt,
        reason: reason.trim(),
        disbursementTxnId: disbursementTxnId.trim() || undefined,
      });

      toast.success("Emergency relief grant issued and recorded successfully!");
      onSuccess();
      onClose();
      setAmount("");
      setReason("");
    } catch (err: any) {
      toast.error(err.message || "Failed to issue emergency grant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Issue Emergency Relief Grant</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Disburse an immediate crisis stipend directly to a member worker facing acute distress.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Select Worker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Beneficiary Worker</Label>
            <Select value={selectedWorkerId} onValueChange={(val) => val && setSelectedWorkerId(val)}>
              <SelectTrigger className="rounded-xl h-10 text-xs">
                <SelectValue placeholder="Select member worker" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((w) => (
                  <SelectItem key={w.workerId} value={w.workerId}>
                    {w.user?.name || "Worker"}{w.category ? ` • ${w.category}` : ""} ({w.policyNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-semibold">Grant Amount (₹)</Label>
              <span className="text-[11px] text-muted-foreground">Max limit: ₹25,000</span>
            </div>
            <Input
              type="number"
              min={100}
              max={25000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="rounded-xl h-10 text-xs font-mono font-bold"
              required
            />
          </div>

          {/* Justification Reason */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Emergency Justification / Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail the emergency circumstances (e.g. Acute family medical emergency, sudden flood damage)..."
              rows={3}
              className="rounded-xl text-xs resize-none"
              required
            />
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Disbursement Reference / UTR (Optional)</Label>
            <Input
              value={disbursementTxnId}
              onChange={(e) => setDisbursementTxnId(e.target.value)}
              placeholder="e.g. IMPS-REF-89421"
              className="rounded-xl h-9 text-xs font-mono"
            />
          </div>

          {/* Fund note */}
          <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs flex items-center justify-between text-muted-foreground">
            <span>Available Society Fund Reserve:</span>
            <span className="font-bold text-foreground">₹{availableReserve.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
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
              className="rounded-xl text-xs font-bold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <span>Disbursing Grant...</span>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Authorize & Disburse Grant</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
