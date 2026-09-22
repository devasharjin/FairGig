import React, { useMemo, useState } from "react";
import { useAdminServices } from "@/features/admin/services/hooks";
import type { Service } from "@/features/admin/services/types";
import { ServiceToolbar } from "@/components/superAdmin/services/service-toolbar";
import { ServicesRender } from "@/components/superAdmin/services/services-render";
import { ServiceDialog } from "@/components/superAdmin/services/serviceDialog";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Ruler,
  ShieldAlert,
  Wrench,
} from "lucide-react";

const AdminServices: React.FC = () => {
  // Filter States
  const [search, setSearch] = useState("");
  const [priceType, setPriceType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog States
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  // TanStack Queries
  const { data: allServices = [] } = useAdminServices();

  // Active filtered queries
  const servicesFilterParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      priceType: priceType !== "all" ? (priceType as any) : undefined,
      isActive:
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
          ? false
          : undefined,
    }),
    [search, priceType, statusFilter]
  );

  const { data: filteredServices = [], isLoading: isLoadingFilteredServices } =
    useAdminServices(servicesFilterParams);

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalServices = allServices.length;
    const activeServices = allServices.filter((s) => s.isActive).length;
    const hourlyServices = allServices.filter((s) => s.priceType === "hourly").length;
    const metersServices = allServices.filter((s) => s.priceType === "meters").length;

    return {
      totalServices,
      activeServices,
      hourlyServices,
      metersServices,
    };
  }, [allServices]);

  // Dialog Open Handlers
  const handleOpenNewService = () => {
    setServiceToEdit(null);
    setIsServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setServiceToEdit(service);
    setIsServiceDialogOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <ShieldAlert className="size-3.5" />
            <span>Superadmin Services & Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Direct Trade Services & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure direct trade services (Plumber, Electrician, Gardener, Carpenter, Painter, etc.), ceiling hourly rates, transport benchmarks, and cooperative shares.
          </p>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Services */}
        <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Services</span>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground font-heading">
              {metrics.totalServices}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <CheckCircle2 className="size-3" />
              <span>{metrics.activeServices} Active Published</span>
            </div>
          </div>
        </div>

        {/* Verified Trades */}
        <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active Trades</span>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wrench className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground font-heading">
              {metrics.activeServices}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
              <span>Ready for dispatch</span>
            </div>
          </div>
        </div>

        {/* Hourly Services */}
        <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Hourly Services</span>
            <div className="size-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground font-heading">
              {metrics.hourlyServices}
            </span>
            <div className="text-[11px] text-muted-foreground mt-1">
              <span>Standard hourly pricing</span>
            </div>
          </div>
        </div>

        {/* Metered Services */}
        <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Metered Services</span>
            <div className="size-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Ruler className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground font-heading">
              {metrics.metersServices}
            </span>
            <div className="text-[11px] text-muted-foreground mt-1">
              <span>Distance & area pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <ServiceToolbar
        search={search}
        onSearchChange={setSearch}
        priceType={priceType}
        onPriceTypeChange={setPriceType}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenNewService={handleOpenNewService}
        totalServices={allServices.length}
      />

      {/* Main Content Render */}
      <ServicesRender
        services={filteredServices}
        isLoadingServices={isLoadingFilteredServices}
        onEditService={handleEditService}
        onOpenNewService={handleOpenNewService}
      />

      {/* Service Dialog (Create / Edit) */}
      <ServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        serviceToEdit={serviceToEdit}
      />
    </div>
  );
};

export default AdminServices;