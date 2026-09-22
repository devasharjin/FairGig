import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useCreateAdminService,
  useUpdateAdminService,
} from "@/features/admin/services/hooks";
import type { Service } from "@/features/admin/services/types";
import {
  Briefcase,
  Coins,
  IndianRupee,
  Loader2,
  Truck,
} from "lucide-react";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: Service | null;
  defaultCategoryId?: string;
}

export const ServiceDialog: React.FC<ServiceDialogProps> = ({
  open,
  onOpenChange,
  serviceToEdit,
}) => {
  const isEditing = Boolean(serviceToEdit);
  const createMutation = useCreateAdminService();
  const updateMutation = useUpdateAdminService();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  // Pricing & Salary Distribution state
  const [firstHourRate, setFirstHourRate] = useState<string>("");
  const [additionalHourRate, setAdditionalHourRate] = useState<string>("");
  const [cooperativeShare, setCooperativeShare] = useState<string>("10");
  const [insuranceShare, setInsuranceShare] = useState<string>("5");

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    firstHourRate?: string;
    additionalHourRate?: string;
    cooperativeShare?: string;
    insuranceShare?: string;
    combinedShares?: string;
  }>({});

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name || "");
      setIcon(serviceToEdit.icon || "");
      setDescription(serviceToEdit.description || "");

      const fRate =
        serviceToEdit.firstHourRate !== undefined
          ? serviceToEdit.firstHourRate
          : serviceToEdit.hourlyPrice !== undefined
          ? serviceToEdit.hourlyPrice
          : "";
      const aRate =
        serviceToEdit.additionalHourRate !== undefined
          ? serviceToEdit.additionalHourRate
          : fRate;

      setFirstHourRate(fRate !== "" ? String(fRate) : "");
      setAdditionalHourRate(aRate !== "" ? String(aRate) : "");
      setCooperativeShare(
        serviceToEdit.cooperativeShare !== undefined
          ? String(serviceToEdit.cooperativeShare)
          : "10"
      );
      setInsuranceShare(
        serviceToEdit.insuranceShare !== undefined
          ? String(serviceToEdit.insuranceShare)
          : "5"
      );
    } else {
      setName("");
      setIcon("");
      setDescription("");
      setFirstHourRate("");
      setAdditionalHourRate("");
      setCooperativeShare("10");
      setInsuranceShare("5");
    }
    setErrors({});
  }, [serviceToEdit, open]);

  const validate = () => {
    const nextErrors: {
      name?: string;
      description?: string;
      firstHourRate?: string;
      additionalHourRate?: string;
      cooperativeShare?: string;
      insuranceShare?: string;
      combinedShares?: string;
    } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      nextErrors.name = "Service name is required (e.g. Plumber, Electrician)";
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      nextErrors.name = "Service name must be between 2 and 100 characters";
    }

    if (!description.trim()) {
      nextErrors.description = "Service description is required";
    } else if (description.trim().length > 1000) {
      nextErrors.description = "Description cannot exceed 1000 characters";
    }

    const fRate = parseFloat(firstHourRate);
    if (isNaN(fRate) || fRate < 0) {
      nextErrors.firstHourRate = "Please specify a non-negative first hour rate (>= 0)";
    }

    const aRate = parseFloat(additionalHourRate);
    if (isNaN(aRate) || aRate < 0) {
      nextErrors.additionalHourRate = "Please specify a non-negative additional hour rate (>= 0)";
    }

    const coop = parseFloat(cooperativeShare);
    if (isNaN(coop) || coop < 0 || coop > 100) {
      nextErrors.cooperativeShare = "Cooperative share must be between 0% and 100%";
    }

    const ins = parseFloat(insuranceShare);
    if (isNaN(ins) || ins < 0 || ins > 100) {
      nextErrors.insuranceShare = "Insurance share must be between 0% and 100%";
    }

    if (!isNaN(coop) && !isNaN(ins) && coop + ins > 100) {
      nextErrors.combinedShares = `Combined cooperative (${coop}%) and insurance (${ins}%) share cannot exceed 100% (currently ${coop + ins}%)`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isPending) return;

    const parsedFirst = parseFloat(firstHourRate);
    const parsedAddl = parseFloat(additionalHourRate);
    const parsedCoop = parseFloat(cooperativeShare);
    const parsedIns = parseFloat(insuranceShare);

    try {
      if (isEditing && serviceToEdit) {
        await updateMutation.mutateAsync({
          id: serviceToEdit._id,
          payload: {
            name: name.trim(),
            icon: icon.trim(),
            description: description.trim(),
            priceType: "hourly",
            firstHourRate: parsedFirst,
            additionalHourRate: parsedAddl,
            transportFee: 30,
            cooperativeShare: parsedCoop,
            insuranceShare: parsedIns,
            hourlyPrice: parsedFirst,
            isActive: true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          icon: icon.trim(),
          description: description.trim(),
          priceType: "hourly",
          firstHourRate: parsedFirst,
          additionalHourRate: parsedAddl,
          transportFee: 30,
          cooperativeShare: parsedCoop,
          insuranceShare: parsedIns,
          hourlyPrice: parsedFirst,
          isActive: true,
        });
      }
      onOpenChange(false);
    } catch {
      // Handled by mutation toast
    }
  };

  const numCoop = parseFloat(cooperativeShare) || 0;
  const numIns = parseFloat(insuranceShare) || 0;
  const workerPercent = Math.max(0, 100 - numCoop - numIns);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-2xl rounded-2xl p-4 sm:p-5 border border-border/80 shadow-2xl bg-card overflow-hidden">
        <DialogHeader className="pb-1">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Briefcase className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {isEditing ? "Edit Trade Service & Pricing" : "Add Direct Trade Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
                {isEditing
                  ? "Update hourly rate tiers, transport fee benchmark, and salary deductions."
                  : "Define a direct trade service (e.g. Plumber, Electrician, Gardener) with hourly ceiling rates."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {/* Service Name & Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="service-name" className="text-xs font-semibold text-foreground">
                Trade Service Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="service-name"
                placeholder="e.g. Plumber, Electrician, Gardener"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className={`h-9 text-xs ${errors.name ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="service-icon" className="text-xs font-semibold text-foreground">
                Icon / Emoji
              </Label>
              <Input
                id="service-icon"
                placeholder="e.g. 🚰, ⚡, 🌱, 🪚"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                disabled={isPending}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Service Pricing & Distribution Card */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  Rates & Salary Distribution
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Ceiling Hourly Tiers
                </span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30 text-primary py-0 px-1.5">
                  Standardized
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* First Hour Rate */}
              <div className="space-y-1">
                <Label htmlFor="first-hour-rate" className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                  <span>First Hr (₹) <span className="text-destructive">*</span></span>
                  <span className="text-[10px] text-muted-foreground font-normal">≤ 60m</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground">
                    <IndianRupee className="size-3" />
                  </div>
                  <Input
                    id="first-hour-rate"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="250"
                    value={firstHourRate}
                    onChange={(e) => setFirstHourRate(e.target.value)}
                    disabled={isPending}
                    className={`pl-7 h-8 text-xs font-mono font-bold ${errors.firstHourRate ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.firstHourRate && (
                  <p className="text-[10px] font-medium text-destructive">{errors.firstHourRate}</p>
                )}
              </div>

              {/* Additional Hour Rate */}
              <div className="space-y-1">
                <Label htmlFor="addl-hour-rate" className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                  <span>Addl Hr (₹) <span className="text-destructive">*</span></span>
                  <span className="text-[10px] text-muted-foreground font-normal">Per Hr</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground">
                    <IndianRupee className="size-3" />
                  </div>
                  <Input
                    id="addl-hour-rate"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="180"
                    value={additionalHourRate}
                    onChange={(e) => setAdditionalHourRate(e.target.value)}
                    disabled={isPending}
                    className={`pl-7 h-8 text-xs font-mono font-bold ${errors.additionalHourRate ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.additionalHourRate && (
                  <p className="text-[10px] font-medium text-destructive">{errors.additionalHourRate}</p>
                )}
              </div>

              {/* Cooperative Share */}
              <div className="space-y-1">
                <Label htmlFor="coop-share" className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                  <span>Co-op Admin</span>
                  <span className="text-[10px] text-muted-foreground font-mono font-bold">10%</span>
                </Label>
                <div className="relative">
                  <Input
                    id="coop-share"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="10"
                    value={cooperativeShare}
                    onChange={(e) => setCooperativeShare(e.target.value)}
                    disabled={isPending}
                    className="h-8 text-xs font-mono pr-6"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-muted-foreground text-xs font-mono">
                    %
                  </div>
                </div>
              </div>

              {/* Insurance Share */}
              <div className="space-y-1">
                <Label htmlFor="ins-share" className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                  <span>Welfare/Ins</span>
                  <span className="text-[10px] text-muted-foreground font-mono font-bold">5%</span>
                </Label>
                <div className="relative">
                  <Input
                    id="ins-share"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="5"
                    value={insuranceShare}
                    onChange={(e) => setInsuranceShare(e.target.value)}
                    disabled={isPending}
                    className="h-8 text-xs font-mono pr-6"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-muted-foreground text-xs font-mono">
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Split Distribution Preview Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground font-medium">Platform Payout Split:</span>
                <span className="font-semibold text-foreground">
                  Worker: <strong className="text-emerald-600 dark:text-emerald-400">{workerPercent}%</strong> &bull; Co-op: {numCoop}% &bull; Welfare: {numIns}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden flex">
                <div style={{ width: `${workerPercent}%` }} className="bg-emerald-500 h-full" title={`Worker Take-home: ${workerPercent}%`} />
                <div style={{ width: `${numCoop}%` }} className="bg-primary h-full" title={`Cooperative Admin: ${numCoop}%`} />
                <div style={{ width: `${numIns}%` }} className="bg-blue-500 h-full" title={`Welfare/Insurance: ${numIns}%`} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="service-description" className="text-xs font-semibold text-foreground">
              Trade Scope & Details <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="service-description"
              rows={3}
              placeholder="Describe tasks, common issues resolved, tools provided, and job scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className={`w-full p-2.5 rounded-lg border bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none ${
                errors.description ? "border-destructive ring-destructive/30" : "border-input"
              }`}
            />
            {errors.description && (
              <p className="text-[11px] font-medium text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-8 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Publish Trade Service"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
