import { useState } from "react";
import {
  ShieldAlert,
  Calendar,
  IndianRupee,
  FileText,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fileWorkerClaim } from "@/features/welfare/api";
import type { WelfareClaimType, WelfareUrgency, IWelfareDocument } from "@/features/welfare/types";

interface FileClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  policyLimits: {
    accidentalInjuryMax: number;
    hospitalizationMax: number;
    emergencyHardshipMax: number;
    toolEquipmentLossMax: number;
    healthCheckupAnnualMax: number;
  };
}

export const FileClaimModal = ({
  isOpen,
  onClose,
  onSuccess,
  policyLimits,
}: FileClaimModalProps) => {
  const [claimType, setClaimType] = useState<WelfareClaimType>("ACCIDENTAL_INJURY");
  const [urgency, setUrgency] = useState<WelfareUrgency>("STANDARD");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split("T")[0]);
  const [amountRequested, setAmountRequested] = useState("");
  const [documents, setDocuments] = useState<IWelfareDocument[]>([]);
  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine current limit based on selected claim type
  const getCurrentMaxLimit = () => {
    switch (claimType) {
      case "ACCIDENTAL_INJURY":
        return policyLimits.accidentalInjuryMax;
      case "MEDICAL_HOSPITALIZATION":
        return policyLimits.hospitalizationMax;
      case "EMERGENCY_HARDSHIP":
        return policyLimits.emergencyHardshipMax;
      case "TOOL_EQUIPMENT_LOSS":
        return policyLimits.toolEquipmentLossMax;
      case "HEALTH_CHECKUP":
        return policyLimits.healthCheckupAnnualMax;
      default:
        return policyLimits.accidentalInjuryMax;
    }
  };

  const maxLimit = getCurrentMaxLimit();

  const handleAddDocument = () => {
    if (!docTitle.trim() || !docUrl.trim()) {
      toast.error("Please provide both document title and URL");
      return;
    }
    setDocuments([...documents, { title: docTitle.trim(), url: docUrl.trim() }]);
    setDocTitle("");
    setDocUrl("");
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a claim title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter incident details");
      return;
    }

    const amount = Number(amountRequested);
    if (isNaN(amount) || amount < 100) {
      toast.error("Requested amount must be at least ₹100");
      return;
    }

    if (amount > maxLimit) {
      toast.error(`Amount exceeds the ₹${maxLimit.toLocaleString("en-IN")} policy limit for this category`);
      return;
    }

    setIsSubmitting(true);
    try {
      await fileWorkerClaim({
        claimType,
        urgency,
        title: title.trim(),
        description: description.trim(),
        incidentDate,
        amountRequested: amount,
        documents,
      });

      toast.success("Welfare claim filed successfully! Your cooperative has been notified.");
      onSuccess();
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setAmountRequested("");
      setDocuments([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit welfare claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">File Welfare & Insurance Claim</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit an on-duty incident, hospitalization, emergency relief, or equipment claim to your cooperative society.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Claim Type & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Claim Type</Label>
              <Select
                value={claimType}
                onValueChange={(val) => setClaimType(val as WelfareClaimType)}
              >
                <SelectTrigger className="rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCIDENTAL_INJURY">Accidental Injury (On-Duty)</SelectItem>
                  <SelectItem value="MEDICAL_HOSPITALIZATION">Hospitalization / Inpatient</SelectItem>
                  <SelectItem value="EMERGENCY_HARDSHIP">Emergency Hardship Relief</SelectItem>
                  <SelectItem value="TOOL_EQUIPMENT_LOSS">Tool / Equipment Loss</SelectItem>
                  <SelectItem value="HEALTH_CHECKUP">Preventative Health Checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Urgency Level</Label>
              <Select
                value={urgency}
                onValueChange={(val) => setUrgency(val as WelfareUrgency)}
              >
                <SelectTrigger className="rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard Review</SelectItem>
                  <SelectItem value="URGENT">Urgent (48-hr review)</SelectItem>
                  <SelectItem value="CRITICAL">Critical Emergency (24-hr SOS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Policy Limit Banner */}
          <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Category Maximum Cover:</span>
            <span className="font-bold text-primary flex items-center gap-0.5">
              <IndianRupee className="size-3.5" />
              {maxLimit.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Claim Subject / Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wrist fracture during electrical repair"
              className="rounded-xl h-10 text-xs"
              required
            />
          </div>

          {/* Incident Date & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="size-3.5" />
                Incident Date
              </Label>
              <Input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="rounded-xl h-10 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <IndianRupee className="size-3.5" />
                Amount Requested (₹)
              </Label>
              <Input
                type="number"
                min={100}
                max={maxLimit}
                value={amountRequested}
                onChange={(e) => setAmountRequested(e.target.value)}
                placeholder={`Max ₹${maxLimit}`}
                className="rounded-xl h-10 text-xs font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Incident Details & Circumstances</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, hospital or clinic visited, police report if any, or specific assistance required..."
              rows={3}
              className="rounded-xl text-xs resize-none"
              required
            />
          </div>

          {/* Supporting Evidence / Documents */}
          <div className="space-y-2 pt-1 border-t border-border/60">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Supporting Documents & Bills (Optional)</span>
              <span className="text-[10px] text-muted-foreground">Add medical bills, doctor prescription, or photos</span>
            </Label>

            <div className="flex gap-2">
              <Input
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Doc name (e.g. Hospital Discharge Bill)"
                className="rounded-xl h-9 text-xs flex-1"
              />
              <Input
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="URL / Cloud Link"
                className="rounded-xl h-9 text-xs flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDocument}
                className="rounded-xl h-9 shrink-0 text-xs"
              >
                <Plus className="size-3.5 mr-1" />
                Add
              </Button>
            </div>

            {documents.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-muted/60 text-xs border border-border/50"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="size-3.5 text-primary shrink-0" />
                      <span className="font-semibold truncate">{doc.title}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{doc.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
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
                <span>Submitting Claim...</span>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Submit for Review</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
