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

  const getClaimTypeLabel = (type: WelfareClaimType) => {
    switch (type) {
      case "ACCIDENTAL_INJURY":
        return "Personal Accident";
      case "MEDICAL_HOSPITALIZATION":
        return "Hospitalization";
      case "EMERGENCY_HARDSHIP":
        return "Distress Relief";
      case "TOOL_EQUIPMENT_LOSS":
        return "Tool Protection";
      case "HEALTH_CHECKUP":
        return "Annual Health";
      default:
        return "Personal Accident";
    }
  };

  const getUrgencyLabel = (u: WelfareUrgency) => {
    switch (u) {
      case "STANDARD":
        return "Standard Review";
      case "URGENT":
        return "Urgent (48-hr)";
      case "CRITICAL":
        return "Critical SOS (24-hr)";
      default:
        return "Standard Review";
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
      <DialogContent className="max-w-xl max-h-[96vh] sm:max-h-[90vh] overflow-y-auto sm:overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-0.5 sm:mb-1">
            <div className="size-9 sm:size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldAlert className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-bold truncate sm:overflow-visible sm:whitespace-normal">
                File Welfare & Insurance Claim
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">
                Submit an on-duty incident, hospitalization, emergency relief, or equipment claim.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4 pt-1.5 sm:pt-2">
          {/* Claim Type & Urgency */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="space-y-1 sm:space-y-1.5">
              <Label className="text-xs font-semibold">Claim Type</Label>
              <Select
                value={claimType}
                onValueChange={(val) => setClaimType(val as WelfareClaimType)}
              >
                <SelectTrigger className="w-full rounded-lg h-9 sm:h-10 text-xs px-2.5 sm:px-3 text-left">
                  <span className="truncate flex-1 font-medium">
                    {getClaimTypeLabel(claimType)}
                  </span>
                </SelectTrigger>
                <SelectContent
                  className="w-[calc(100vw-2.5rem)] sm:w-[380px] max-w-sm min-w-[280px] p-1.5 shadow-2xl border border-border/80 bg-popover z-[100]"
                  align="start"
                  alignItemWithTrigger={false}
                >
                  <SelectItem value="ACCIDENTAL_INJURY" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-2 text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-foreground">Personal Accident</span>
                        <span className="text-[10px] text-muted-foreground">On-duty injury & disability</span>
                      </div>
                      <span className="text-xs font-bold text-primary font-mono shrink-0">
                        ₹{(policyLimits.accidentalInjuryMax || 500000).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDICAL_HOSPITALIZATION" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-2 text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-foreground">Hospitalization</span>
                        <span className="text-[10px] text-muted-foreground">Cashless inpatient medical care</span>
                      </div>
                      <span className="text-xs font-bold text-primary font-mono shrink-0">
                        ₹{(policyLimits.hospitalizationMax || 200000).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EMERGENCY_HARDSHIP" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-2 text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-foreground">Distress Relief</span>
                        <span className="text-[10px] text-muted-foreground">Immediate 24-hr crisis stipend</span>
                      </div>
                      <span className="text-xs font-bold text-primary font-mono shrink-0">
                        ₹{(policyLimits.emergencyHardshipMax || 25000).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="TOOL_EQUIPMENT_LOSS" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-2 text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-foreground">Tool Protection</span>
                        <span className="text-[10px] text-muted-foreground">Stolen or damaged trade gear</span>
                      </div>
                      <span className="text-xs font-bold text-primary font-mono shrink-0">
                        ₹{(policyLimits.toolEquipmentLossMax || 15000).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="HEALTH_CHECKUP" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-2 text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-foreground">Annual Health</span>
                        <span className="text-[10px] text-muted-foreground">Preventative diagnostic allowance</span>
                      </div>
                      <span className="text-xs font-bold text-primary font-mono shrink-0">
                        ₹{(policyLimits.healthCheckupAnnualMax || 3000).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label className="text-xs font-semibold">Urgency Level</Label>
              <Select
                value={urgency}
                onValueChange={(val) => setUrgency(val as WelfareUrgency)}
              >
                <SelectTrigger className="w-full rounded-lg h-9 sm:h-10 text-xs px-2.5 sm:px-3 text-left">
                  <span className="truncate flex-1 font-medium">
                    {getUrgencyLabel(urgency)}
                  </span>
                </SelectTrigger>
                <SelectContent
                  className="w-[calc(100vw-2.5rem)] sm:w-[320px] max-w-sm min-w-[240px] p-1.5 shadow-2xl border border-border/80 bg-popover z-[100]"
                  align="end"
                  alignItemWithTrigger={false}
                >
                  <SelectItem value="STANDARD" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs text-foreground">Standard Review</span>
                      <span className="text-[10px] text-muted-foreground">Normal committee review (3-5 days)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="URGENT" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">Urgent Review</span>
                      <span className="text-[10px] text-muted-foreground">Expedited review within 48 hours</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CRITICAL" className="py-2 px-2.5 cursor-pointer">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs text-destructive">Critical Emergency</span>
                      <span className="text-[10px] text-muted-foreground">Immediate 24-hr SOS crisis assistance</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Policy Limit Banner */}
          <div className="py-1.5 px-3 sm:p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Category Maximum Cover:</span>
            <span className="font-bold text-primary flex items-center gap-0.5">
              <IndianRupee className="size-3.5" />
              {maxLimit.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1 sm:space-y-1.5">
            <Label className="text-xs font-semibold">Claim Subject / Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wrist fracture during electrical repair"
              className="rounded-lg h-9 sm:h-10 text-xs"
              required
            />
          </div>

          {/* Incident Date & Amount */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="space-y-1 sm:space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Calendar className="size-3.5" />
                Incident Date
              </Label>
              <Input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="rounded-lg h-9 sm:h-10 text-xs px-2.5 sm:px-3"
                required
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <IndianRupee className="size-3.5" />
                Amount (₹)
              </Label>
              <Input
                type="number"
                min={100}
                max={maxLimit}
                value={amountRequested}
                onChange={(e) => setAmountRequested(e.target.value)}
                placeholder={`Max ₹${maxLimit}`}
                className="rounded-lg h-9 sm:h-10 text-xs font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 sm:space-y-1.5">
            <Label className="text-xs font-semibold">Incident Details & Circumstances</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, hospital or clinic visited, police report if any..."
              rows={2}
              className="rounded-lg text-xs resize-none h-15 sm:h-auto sm:rows-3 py-2 px-3"
              required
            />
          </div>

          {/* Supporting Evidence / Documents */}
          <div className="pt-1 border-t border-border/60">
            {/* Mobile View: Collapsible */}
            <div className="sm:hidden">
              <details className="group">
                <summary className="text-xs font-semibold text-primary flex items-center justify-between cursor-pointer py-1 list-none">
                  <span className="flex items-center gap-1">
                    <Plus className="size-3.5 group-open:rotate-45 transition-transform" />
                    <span>Supporting Docs & Bills (Optional)</span>
                  </span>
                  {documents.length > 0 && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                      {documents.length} added
                    </span>
                  )}
                </summary>
                <div className="space-y-2 pt-2 pb-1">
                  <div className="flex gap-1.5">
                    <Input
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="Doc name"
                      className="rounded-lg h-8 text-xs flex-1"
                    />
                    <Input
                      value={docUrl}
                      onChange={(e) => setDocUrl(e.target.value)}
                      placeholder="URL / Cloud Link"
                      className="rounded-lg h-8 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddDocument}
                      className="rounded-lg h-8 px-2.5 text-xs shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  {documents.length > 0 && (
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-1.5 px-2 rounded-md bg-muted/60 text-xs border border-border/50"
                        >
                          <span className="font-semibold truncate max-w-[180px]">{doc.title}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(idx)}
                            className="text-muted-foreground hover:text-destructive p-0.5"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </div>

            {/* Desktop View (UNCHANGED) */}
            <div className="hidden sm:block space-y-2">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Supporting Documents & Bills (Optional)</span>
                <span className="text-[10px] text-muted-foreground">Add medical bills, doctor prescription, or photos</span>
              </Label>

              <div className="flex gap-2">
                <Input
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Doc name (e.g. Hospital Discharge Bill)"
                  className="rounded-lg h-9 text-xs flex-1"
                />
                <Input
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="URL / Cloud Link"
                  className="rounded-lg h-9 text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDocument}
                  className="rounded-lg h-9 shrink-0 text-xs cursor-pointer"
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
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/60 text-xs border border-border/50"
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
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2.5 sm:pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg h-9 text-xs cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg h-9 text-xs font-bold gap-1.5 shadow-xs cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
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
