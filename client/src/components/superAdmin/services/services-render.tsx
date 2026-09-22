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
import type { Service } from "@/features/admin/services/types";
import {
  useDeleteAdminService,
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
  Trash2,
  Wrench,
} from "lucide-react";

interface ServicesRenderProps {
  services: Service[];
  isLoadingServices: boolean;
  onEditService: (service: Service) => void;
  onOpenNewService: () => void;
  // Backwards compatibility props
  activeTab?: string;
  categories?: any[];
  isLoadingCategories?: boolean;
  onEditCategory?: (category: any) => void;
  onOpenNewCategory?: () => void;
}

export const ServicesRender: React.FC<ServicesRenderProps> = ({
  services,
  isLoadingServices,
  onEditService,
  onOpenNewService,
}) => {
  const updateServiceMutation = useUpdateAdminService();
  const deleteServiceMutation = useDeleteAdminService();

  // Delete modal state
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Toggle quick status
  const handleToggleServiceStatus = (service: Service) => {
    updateServiceMutation.mutate({
      id: service._id,
      payload: {
        isActive: !service.isActive,
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

  // Loading skeleton
  if (isLoadingServices) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-card border border-border/80 animate-pulse space-y-4"
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
      <div>
        {services.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40 my-2">
            <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="size-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">No trade services found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
              No services match your active filters, or none have been configured yet.
            </p>
            <Button
              onClick={onOpenNewService}
              className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add First Trade Service</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {services.map((service) => {
              const firstRate =
                service.firstHourRate !== undefined
                  ? service.firstHourRate
                  : service.hourlyPrice ?? 0;
              const addlRate =
                service.additionalHourRate !== undefined
                  ? service.additionalHourRate
                  : firstRate;

              return (
                <div
                  key={service._id}
                  className="group relative flex flex-col justify-between p-5 rounded-3xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-md transition duration-200"
                >
                  {/* Top Row: Icon & Status */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-muted/70 text-foreground border border-border/60">
                        {service.icon ? (
                          <span className="text-sm">{service.icon}</span>
                        ) : (
                          <Wrench className="size-3 text-primary" />
                        )}
                        <span>Trade Service</span>
                      </span>

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

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition font-heading">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Rates Matrix */}
                    <div className="mt-4 p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Clock className="size-3" />
                          1st Hour Ceiling:
                        </span>
                        <span className="font-bold text-foreground font-mono">
                          ₹{firstRate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Clock className="size-3" />
                          Additional Hr:
                        </span>
                        <span className="font-semibold text-foreground font-mono">
                          ₹{addlRate} / hr
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                        <span className="text-muted-foreground">Fixed Transport:</span>
                        <span className="font-mono text-muted-foreground">
                          ₹{service.transportFee ?? 30}
                        </span>
                      </div>
                    </div>

                    {/* Split Percentages */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground px-1">
                      <span>Co-op: {service.cooperativeShare ?? 10}%</span>
                      <span>Welfare: {service.insuranceShare ?? 5}%</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Worker: {Math.max(0, 100 - (service.cooperativeShare ?? 10) - (service.insuranceShare ?? 5))}%
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditService(service)}
                      className="flex-1 h-8 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                    >
                      <Edit2 className="size-3.5" />
                      <span>Edit Service</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setServiceToDelete(service)}
                      className="size-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Service Modal */}
      <Dialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null);
        }}
      >
        <DialogContent className="max-w-md rounded-2xl p-5 border border-border/80 shadow-2xl bg-card">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Delete Trade Service
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to permanently delete this trade service?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {serviceToDelete && (
            <div className="my-3 p-3.5 rounded-xl bg-destructive/5 border border-destructive/20 text-xs">
              <p className="font-bold text-foreground">{serviceToDelete.name}</p>
              <p className="text-muted-foreground mt-0.5 line-clamp-2">
                {serviceToDelete.description}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServiceToDelete(null)}
              disabled={deleteServiceMutation.isPending}
              className="h-8 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDeleteService}
              disabled={deleteServiceMutation.isPending}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              {deleteServiceMutation.isPending && (
                <Loader2 className="size-3.5 animate-spin" />
              )}
              <span>Delete Service</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesRender;
