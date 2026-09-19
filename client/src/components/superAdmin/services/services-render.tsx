import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category, Service } from "@/features/admin/services/types";
import {
  useDeleteAdminCategory,
  useDeleteAdminService,
  useUpdateAdminCategory,
  useUpdateAdminService,
} from "@/features/admin/services/hooks";
import {
  AlertTriangle,
  Briefcase,
  Clock,
  Edit2,
  IndianRupee,
  Loader2,
  Plus,
  Ruler,
  Tag,
  Trash2,
} from "lucide-react";

interface ServicesRenderProps {
  activeTab: "services" | "categories";
  services: Service[];
  categories: Category[];
  isLoadingServices: boolean;
  isLoadingCategories: boolean;
  onEditService: (service: Service) => void;
  onEditCategory: (category: Category) => void;
  onOpenNewService: () => void;
  onOpenNewCategory: () => void;
}

export const ServicesRender: React.FC<ServicesRenderProps> = ({
  activeTab,
  services,
  categories,
  isLoadingServices,
  isLoadingCategories,
  onEditService,
  onEditCategory,
  onOpenNewService,
  onOpenNewCategory,
}) => {
  const updateServiceMutation = useUpdateAdminService();
  const deleteServiceMutation = useDeleteAdminService();
  const updateCategoryMutation = useUpdateAdminCategory();
  const deleteCategoryMutation = useDeleteAdminCategory();

  // Delete modal state
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Toggle quick status
  const handleToggleServiceStatus = (service: Service) => {
    const catId =
      typeof service.category === "object"
        ? (service.category as Category)._id
        : service.category;

    updateServiceMutation.mutate({
      id: service._id,
      payload: {
        isActive: !service.isActive,
        category: catId,
      },
    });
  };

  const handleToggleCategoryStatus = (category: Category) => {
    updateCategoryMutation.mutate({
      id: category._id,
      payload: {
        isActive: !category.isActive,
      },
    });
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteServiceMutation.mutateAsync(serviceToDelete._id);
      setServiceToDelete(null);
    } catch {
      // Handled by toast
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete._id);
      setCategoryToDelete(null);
    } catch {
      // Handled by toast
    }
  };

  // Helper to count services per category
  const getServicesCountForCategory = (catId: string) => {
    return services.filter((s) => {
      const sCatId =
        typeof s.category === "object" ? (s.category as Category)?._id : s.category;
      return sCatId === catId;
    }).length;
  };

  // ----------------------------------------------------
  // SKELETON LOADING
  // ----------------------------------------------------
  if (
    (activeTab === "services" && isLoadingServices) ||
    (activeTab === "categories" && isLoadingCategories)
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-border/60 bg-card/60 animate-pulse space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-2xl bg-muted" />
              <div className="w-16 h-5 rounded-full bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded-md bg-muted" />
              <div className="h-3 w-full rounded-md bg-muted/60" />
              <div className="h-3 w-1/2 rounded-md bg-muted/60" />
            </div>
            <div className="pt-2 border-t border-border/40 flex justify-between">
              <div className="h-6 w-20 rounded-lg bg-muted" />
              <div className="h-6 w-16 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* ----------------------------------------------------
          SERVICES TAB
          ---------------------------------------------------- */}
      {activeTab === "services" && (
        <div>
          {services.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40 my-2">
              <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Briefcase className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">No services found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
                No services match your active filters, or none have been published yet.
              </p>
              <Button
                onClick={onOpenNewService}
                className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add First Service</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {services.map((service) => {
                const categoryObj =
                  typeof service.category === "object"
                    ? (service.category as Category)
                    : categories.find((c) => c._id === service.category);

                return (
                  <div
                    key={service._id}
                    className="group relative flex flex-col justify-between p-5 rounded-3xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition duration-200"
                  >
                    {/* Top Row: Category & Status */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        {categoryObj ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-muted/70 text-foreground border border-border/60">
                            {categoryObj.icon ? (
                              <span
                                dangerouslySetInnerHTML={{ __html: categoryObj.icon }}
                                className="text-xs"
                              />
                            ) : (
                              <Tag className="size-3 text-primary" />
                            )}
                            <span className="truncate max-w-[130px]">{categoryObj.name}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
                            <Tag className="size-3" />
                            Uncategorized
                          </span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleServiceStatus(service)}
                            title={service.isActive ? "Click to disable" : "Click to enable"}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                              service.isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-muted text-muted-foreground border border-border/80 hover:bg-muted/80"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>

                      {/* Service Title with Icon */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 text-base shadow-xs group-hover:scale-105 transition duration-150">
                          {categoryObj?.icon ? (
                            <span dangerouslySetInnerHTML={{ __html: categoryObj.icon }} />
                          ) : (
                            <Briefcase className="size-4" />
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition line-clamp-1">
                          {service.name}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom: Pricing Breakdown & Actions */}
                    <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        {/* Price Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-extrabold text-xs">
                            <IndianRupee className="size-3" />
                            <span>1st hr: ₹{service.firstHourRate ?? service.hourlyPrice ?? 0}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-muted text-muted-foreground font-semibold text-[11px]">
                            <span>+₹{service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0}/addl hr</span>
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-mono text-[10px]">
                            +₹30 flat transport
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0 ml-auto">
                          <button
                            type="button"
                            onClick={() => onEditService(service)}
                            title="Edit Service"
                            className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setServiceToDelete(service)}
                            title="Delete Service"
                            className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5 border-t border-border/40">
                        <span>Salary Allocations:</span>
                        <span className="font-semibold text-foreground">
                          Coop: <strong className="text-purple-600 dark:text-purple-400">{service.cooperativeShare ?? 10}%</strong> • Ins: <strong className="text-blue-600 dark:text-blue-400">{service.insuranceShare ?? 5}%</strong>
                        </span>
                      </div>
                    </div>
                          onClick={() => setServiceToDelete(service)}
                          title="Delete Service"
                          className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          CATEGORIES TAB
          ---------------------------------------------------- */}
      {activeTab === "categories" && (
        <div>
          {categories.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40 my-2">
              <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Tag className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">No categories found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
                Categories group gig services into logical classifications. Create one to get started.
              </p>
              <Button
                onClick={onOpenNewCategory}
                className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Create Category</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {categories.map((category) => {
                const count = getServicesCountForCategory(category._id);

                return (
                  <div
                    key={category._id}
                    className="group relative flex flex-col justify-between p-5 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/40 hover:shadow-md transition duration-200"
                  >
                    <div>
                      {/* Top Row: Icon & Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xl font-medium shadow-xs">
                          {category.icon ? (
                            <span dangerouslySetInnerHTML={{ __html: category.icon }} />
                          ) : (
                            <Tag className="size-5" />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleCategoryStatus(category)}
                          title={category.isActive ? "Click to disable" : "Click to enable"}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            category.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground border border-border/80 hover:bg-muted/80"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>

                      {/* Name & Slug */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {category.name}
                        </h4>
                        <span className="inline-block font-mono text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                          /{category.slug}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                        {category.description || "No description provided."}
                      </p>
                    </div>

                    {/* Bottom: Attached Services count & Actions */}
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Briefcase className="size-3.5 text-primary" />
                        <span>
                          {count} {count === 1 ? "Service" : "Services"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditCategory(category)}
                          title="Edit Category"
                          className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category)}
                          title="Delete Category"
                          className="size-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          DELETE SERVICE CONFIRMATION DIALOG
          ---------------------------------------------------- */}
      <Dialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
        <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Delete Service
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to permanently delete this gig service?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {serviceToDelete && (
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 my-2">
              <p className="text-xs font-bold text-foreground">{serviceToDelete.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                {serviceToDelete.description}
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setServiceToDelete(null)}
              disabled={deleteServiceMutation.isPending}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteService}
              disabled={deleteServiceMutation.isPending}
              className="rounded-xl text-xs font-semibold"
            >
              {deleteServiceMutation.isPending && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          DELETE CATEGORY CONFIRMATION DIALOG
          ---------------------------------------------------- */}
      <Dialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Delete Category
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to delete this service category?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {categoryToDelete && (
            <div className="space-y-2 my-2">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <p className="text-xs font-bold text-foreground">{categoryToDelete.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                  Slug: {categoryToDelete.slug}
                </p>
              </div>

              {getServicesCountForCategory(categoryToDelete._id) > 0 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                  <p className="font-semibold">Associated Services Detected</p>
                  <p className="text-[11px] mt-0.5">
                    This category currently has{" "}
                    <strong>{getServicesCountForCategory(categoryToDelete._id)}</strong> active
                    service(s). Backend policy requires reassigning or deleting those services
                    first.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
              disabled={deleteCategoryMutation.isPending}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteCategory}
              disabled={deleteCategoryMutation.isPending}
              className="rounded-xl text-xs font-semibold"
            >
              {deleteCategoryMutation.isPending && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
