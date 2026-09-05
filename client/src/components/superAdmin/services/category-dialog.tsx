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
  useCreateAdminCategory,
  useUpdateAdminCategory,
} from "@/features/admin/services/hooks";
import type { Category } from "@/features/admin/services/types";
import { Loader2, Tag } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: Category | null;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onOpenChange,
  categoryToEdit,
}) => {
  const isEditing = Boolean(categoryToEdit);
  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
      setIcon(categoryToEdit.icon || "");
      setIsActive(categoryToEdit.isActive ?? true);
    } else {
      setName("");
      setDescription("");
      setIcon("");
      setIsActive(true);
    }
    setErrors({});
  }, [categoryToEdit, open]);

  const validate = () => {
    const nextErrors: { name?: string; description?: string } = {};
    const trimmed = name.trim();
    if (!trimmed) {
      nextErrors.name = "Category name is required";
    } else if (trimmed.length < 2 || trimmed.length > 100) {
      nextErrors.name = "Category name must be between 2 and 100 characters";
    }

    if (description.length > 500) {
      nextErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isPending) return;

    try {
      if (isEditing && categoryToEdit) {
        await updateMutation.mutateAsync({
          id: categoryToEdit._id,
          payload: {
            name: name.trim(),
            description: description.trim(),
            icon: icon.trim(),
            isActive,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          icon: icon.trim(),
          isActive,
        });
      }
      onOpenChange(false);
    } catch {
      // Handled by mutation toast
    }
  };

  const generatedSlug = name
    ? name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Tag className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isEditing ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Update category details, HTML code icon, and availability."
                  : "Organize cooperative services under structured classifications."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs font-semibold text-foreground">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Electrical & Wiring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className={`h-10 text-sm ${errors.name ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
            )}
            {generatedSlug && (
              <p className="text-[11px] text-muted-foreground">
                Generated slug:{" "}
                <code className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-primary font-medium">
                  {generatedSlug}
                </code>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="category-desc" className="text-xs font-semibold text-foreground">
                Description
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {description.length}/500
              </span>
            </div>
            <textarea
              id="category-desc"
              rows={3}
              placeholder="Brief summary of services contained within this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="w-full rounded-2xl border border-input bg-input/20 p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none resize-none transition"
            />
            {errors.description && (
              <p className="text-[11px] font-medium text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Icon HTML code Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category-icon" className="text-xs font-semibold text-foreground">
                Icon (HTML Entity / Code)
              </Label>
              {icon && (
                <button
                  type="button"
                  onClick={() => setIcon("")}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  Clear icon
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Preview */}
              <div
                className="flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-muted/30 text-xl font-medium shrink-0 shadow-xs"
                title="Icon preview"
              >
                {icon ? (
                  <span dangerouslySetInnerHTML={{ __html: icon }} />
                ) : (
                  <Tag className="size-4 text-muted-foreground" />
                )}
              </div>

              {/* Input */}
              <div className="flex-1">
                <Input
                  id="category-icon"
                  placeholder="e.g. &#x1F527; or &#x26A1;"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  disabled={isPending}
                  className="h-10 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs font-semibold text-foreground">Active Status</p>
              <p className="text-[11px] text-muted-foreground">
                Inactive categories hide associated services from booking
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              disabled={isPending}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
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
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
