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
  useAdminCategories,
  useCreateAdminService,
  useUpdateAdminService,
} from "@/features/admin/services/hooks";
import type { Category, Service } from "@/features/admin/services/types";
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
  defaultCategoryId,
}) => {
  const isEditing = Boolean(serviceToEdit);
  const { data: categories = [], isLoading: isLoadingCategories } = useAdminCategories();
  const createMutation = useCreateAdminService();
  const updateMutation = useUpdateAdminService();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Pricing & Salary Distribution state
  const [firstHourRate, setFirstHourRate] = useState<string>("");
  const [additionalHourRate, setAdditionalHourRate] = useState<string>("");
  const [cooperativeShare, setCooperativeShare] = useState<string>("10");
  const [insuranceShare, setInsuranceShare] = useState<string>("5");

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    category?: string;
    firstHourRate?: string;
    additionalHourRate?: string;
    cooperativeShare?: string;
    insuranceShare?: string;
    combinedShares?: string;
  }>({});

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name || "");
      setDescription(serviceToEdit.description || "");
      const catId =
        typeof serviceToEdit.category === "object"
          ? (serviceToEdit.category as Category)._id
          : serviceToEdit.category;
      setCategoryId(catId || "");

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
      setDescription("");
      setCategoryId(defaultCategoryId || (categories[0]?._id ?? ""));
      setFirstHourRate("");
      setAdditionalHourRate("");
      setCooperativeShare("10");
      setInsuranceShare("5");
    }
    setErrors({});
  }, [serviceToEdit, defaultCategoryId, open, categories]);

  const validate = () => {
    const nextErrors: {
      name?: string;
      description?: string;
      category?: string;
      firstHourRate?: string;
      additionalHourRate?: string;
      cooperativeShare?: string;
      insuranceShare?: string;
      combinedShares?: string;
    } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      nextErrors.name = "Service name is required";
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      nextErrors.name = "Service name must be between 2 and 100 characters";
    }

    if (!description.trim()) {
      nextErrors.description = "Service description is required";
    } else if (description.trim().length > 1000) {
      nextErrors.description = "Description cannot exceed 1000 characters";
    }

    if (!categoryId) {
      nextErrors.category = "Please select a category";
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
            description: description.trim(),
            category: categoryId,
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
          description: description.trim(),
          category: categoryId,
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
                {isEditing ? "Edit Service & Pricing Model" : "Add New Gig Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
                {isEditing
                  ? "Update hourly rate tiers, transport fee benchmark, and salary deductions."
                  : "Define a standardized gig service with hourly ceiling rates and cooperative distributions."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {/* Service Name & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="service-name" className="text-xs font-semibold text-foreground">
                Service Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="service-name"
                placeholder="e.g. Ceiling Fan Repair & Electrician"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="service-category" className="text-xs font-semibold text-foreground">
                  Category <span className="text-destructive">*</span>
                </Label>
                {categories.length === 0 && !isLoadingCategories && (
                  <span className="text-[10px] text-amber-500 font-medium">
                    No categories found
                  </span>
                )}
              </div>
              <select
                id="service-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isPending || isLoadingCategories}
                className={`w-full h-9 px-3 rounded-lg border bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition cursor-pointer ${
                  errors.category ? "border-destructive ring-destructive/30" : "border-input"
                }`}
              >
                <option value="" disabled className="bg-popover text-muted-foreground">
                  {isLoadingCategories ? "Loading categories..." : "Select parent category..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="bg-popover text-foreground">
                    {cat.name} {!cat.isActive ? "(Inactive)" : ""}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] font-medium text-destructive">{errors.category}</p>
              )}
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
                    placeholder="300"
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
                  <span>Add'l Hr (₹) <span className="text-destructive">*</span></span>
                  <span className="text-[10px] text-muted-foreground font-normal">+60m</span>
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
                    placeholder="150"
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
                  <span>Coop (%) <span className="text-destructive">*</span></span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">Admin</span>
                </Label>
                <div className="relative">
                  <Input
                    id="coop-share"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    placeholder="10"
                    value={cooperativeShare}
                    onChange={(e) => setCooperativeShare(e.target.value)}
                    disabled={isPending}
                    className={`h-8 text-xs font-mono font-bold pr-6 ${errors.cooperativeShare ? "border-destructive" : ""}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-muted-foreground font-bold text-xs">
                    %
                  </div>
                </div>
                {errors.cooperativeShare && (
                  <p className="text-[10px] font-medium text-destructive">{errors.cooperativeShare}</p>
                )}
              </div>

              {/* Insurance Share */}
              <div className="space-y-1">
                <Label htmlFor="ins-share" className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                  <span>Insurance (%) <span className="text-destructive">*</span></span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Pool</span>
                </Label>
                <div className="relative">
                  <Input
                    id="ins-share"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    placeholder="5"
                    value={insuranceShare}
                    onChange={(e) => setInsuranceShare(e.target.value)}
                    disabled={isPending}
                    className={`h-8 text-xs font-mono font-bold pr-6 ${errors.insuranceShare ? "border-destructive" : ""}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-muted-foreground font-bold text-xs">
                    %
                  </div>
                </div>
                {errors.insuranceShare && (
                  <p className="text-[10px] font-medium text-destructive">{errors.insuranceShare}</p>
                )}
              </div>
            </div>

            {errors.combinedShares && (
              <p className="text-[11px] font-medium text-destructive">{errors.combinedShares}</p>
            )}

            {/* Visual allocation pill & transport benchmark */}
            <div className="py-1.5 px-2.5 rounded-lg bg-card border border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-muted-foreground font-medium text-[11px]">Payout Split:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                  Worker {workerPercent.toFixed(1)}%
                </span>
                <span className="text-muted-foreground text-[10px]">•</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-[11px]">
                  Coop {numCoop}%
                </span>
                <span className="text-muted-foreground text-[10px]">•</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                  Insurance {numIns}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Truck className="size-3 text-primary shrink-0" />
                <span>₹30 transport fee (flat benchmark)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="service-desc" className="text-xs font-semibold text-foreground">
                Service Scope & Description <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {description.length}/1000
              </span>
            </div>
            <textarea
              id="service-desc"
              rows={2}
              placeholder="Provide a clear description of what this service entails, scope of work, and standard expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className={`w-full rounded-xl border bg-input/20 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 outline-none resize-none transition h-14 ${
                errors.description ? "border-destructive" : "border-input"
              }`}
            />
            {errors.description && (
              <p className="text-[11px] font-medium text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg text-xs h-8 sm:h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-lg text-xs font-semibold h-8 sm:h-9"
            >
              {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              {isEditing ? "Save Service" : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;

