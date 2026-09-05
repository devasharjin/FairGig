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
import {
  useAdminCategories,
  useCreateAdminService,
  useUpdateAdminService,
} from "@/features/admin/services/hooks";
import type { Category, Service, ServicePriceType } from "@/features/admin/services/types";
import {
  Briefcase,
  Clock,
  Coins,
  IndianRupee,
  Loader2,
  Ruler,
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
  const [priceType, setPriceType] = useState<ServicePriceType>("hourly");
  const [hourlyPrice, setHourlyPrice] = useState<string>("");
  const [metersPrice, setMetersPrice] = useState<string>("");

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    category?: string;
    price?: string;
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
      setPriceType(serviceToEdit.priceType || "hourly");
      setHourlyPrice(
        serviceToEdit.hourlyPrice !== undefined ? String(serviceToEdit.hourlyPrice) : ""
      );
      setMetersPrice(
        serviceToEdit.metersPrice !== undefined ? String(serviceToEdit.metersPrice) : ""
      );
    } else {
      setName("");
      setDescription("");
      setCategoryId(defaultCategoryId || (categories[0]?._id ?? ""));
      setPriceType("hourly");
      setHourlyPrice("");
      setMetersPrice("");
    }
    setErrors({});
  }, [serviceToEdit, defaultCategoryId, open, categories]);

  const validate = () => {
    const nextErrors: {
      name?: string;
      description?: string;
      category?: string;
      price?: string;
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

    if (priceType === "hourly") {
      const p = parseFloat(hourlyPrice);
      if (isNaN(p) || p < 0) {
        nextErrors.price = "Please specify a valid hourly price (>= 0)";
      }
    } else {
      const p = parseFloat(metersPrice);
      if (isNaN(p) || p < 0) {
        nextErrors.price = "Please specify a valid price per meter (>= 0)";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isPending) return;

    const parsedHourly = priceType === "hourly" ? parseFloat(hourlyPrice) : undefined;
    const parsedMeters = priceType === "meters" ? parseFloat(metersPrice) : undefined;

    try {
      if (isEditing && serviceToEdit) {
        await updateMutation.mutateAsync({
          id: serviceToEdit._id,
          payload: {
            name: name.trim(),
            description: description.trim(),
            category: categoryId,
            priceType,
            hourlyPrice: parsedHourly,
            metersPrice: parsedMeters,
            isActive : true,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          category: categoryId,
          priceType,
          hourlyPrice: parsedHourly,
          metersPrice: parsedMeters,
          isActive : true,
        });
      }
      onOpenChange(false);
    } catch {
      // Handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 border border-border/80 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isEditing ? "Edit Service" : "Add New Gig Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Update service specification and pricing rules."
                  : "Define a standardized gig service available for cooperatives and customers."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Service Name */}
          <div className="space-y-1.5">
            <Label htmlFor="service-name" className="text-xs font-semibold text-foreground">
              Service Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="service-name"
              placeholder="e.g. Ceiling Fan Installation & Repair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className={`h-10 text-sm ${errors.name ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="service-category" className="text-xs font-semibold text-foreground">
                Category <span className="text-destructive">*</span>
              </Label>
              {categories.length === 0 && !isLoadingCategories && (
                <span className="text-[11px] text-amber-500 font-medium">
                  No categories found. Please create one first!
                </span>
              )}
            </div>

            <select
              id="service-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isPending || isLoadingCategories}
              className={`w-full h-10 px-3 rounded-2xl border bg-input/20 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition cursor-pointer ${
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


          {/* Pricing Model Segmented Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Coins className="size-3.5 text-primary" />
              Pricing Metric <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted/30 border border-border/60">
              <button
                type="button"
                onClick={() => setPriceType("hourly")}
                disabled={isPending}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition cursor-pointer ${
                  priceType === "hourly"
                    ? "bg-card text-foreground shadow-sm border border-border/80 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Clock className="size-3.5 text-primary" />
                <span>Hourly Rate (₹/hr)</span>
              </button>

              <button
                type="button"
                onClick={() => setPriceType("meters")}
                disabled={isPending}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition cursor-pointer ${
                  priceType === "meters"
                    ? "bg-card text-foreground shadow-sm border border-border/80 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Ruler className="size-3.5 text-emerald-500" />
                <span>Per Meter (₹/m)</span>
              </button>
            </div>

            {/* Price Input */}
            <div className="pt-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <IndianRupee className="size-4" />
                </div>
                {priceType === "hourly" ? (
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter hourly benchmark rate (e.g. 250)"
                    value={hourlyPrice}
                    onChange={(e) => setHourlyPrice(e.target.value)}
                    disabled={isPending}
                    className={`pl-9 h-10 text-sm ${errors.price ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  />
                ) : (
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Enter rate per meter (e.g. 45)"
                    value={metersPrice}
                    onChange={(e) => setMetersPrice(e.target.value)}
                    disabled={isPending}
                    className={`pl-9 h-10 text-sm ${errors.price ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  />
                )}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-muted-foreground font-medium">
                  {priceType === "hourly" ? "/ hour" : "/ meter"}
                </div>
              </div>
              {errors.price && (
                <p className="text-[11px] font-medium text-destructive mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
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
              rows={3}
              placeholder="Provide a clear description of what this service entails, scope of work, and standard expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className={`w-full rounded-2xl border bg-input/20 p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none resize-none transition ${
                errors.description ? "border-destructive" : "border-input"
              }`}
            />
            {errors.description && (
              <p className="text-[11px] font-medium text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl text-xs font-semibold"
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
