import React, { useMemo, useState } from "react";
import {
  useAdminCategories,
  useAdminServices,
} from "@/features/admin/services/hooks";
import type { Category, Service } from "@/features/admin/services/types";
import { ServiceToolbar } from "@/components/superAdmin/services/service-toolbar";
import { ServicesRender } from "@/components/superAdmin/services/services-render";
import { ServiceDialog } from "@/components/superAdmin/services/serviceDialog";
import { CategoryDialog } from "@/components/superAdmin/services/category-dialog";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Layers,
  Ruler,
  ShieldAlert,
  Sparkles,
  Tag,
} from "lucide-react";

const AdminServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceType, setPriceType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog States
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // TanStack Queries
  // Unfiltered baseline queries for counts and select options
  const { data: allCategories = [], isLoading: isLoadingAllCategories } =
    useAdminCategories();
  const { data: allServices = [] } = useAdminServices();

  // Active filtered queries
  const servicesFilterParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      category: selectedCategory || undefined,
      priceType: priceType !== "all" ? (priceType as any) : undefined,
      isActive:
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
          ? false
          : undefined,
    }),
    [search, selectedCategory, priceType, statusFilter]
  );

  const categoriesFilterParams = useMemo(
    () => ({
      search: activeTab === "categories" ? search.trim() || undefined : undefined,
      isActive:
        activeTab === "categories" && statusFilter !== "all"
          ? statusFilter === "active"
          : undefined,
    }),
    [activeTab, search, statusFilter]
  );

  const { data: filteredServices = [], isLoading: isLoadingFilteredServices } =
    useAdminServices(servicesFilterParams);

  const { data: filteredCategories = [], isLoading: isLoadingFilteredCategories } =
    useAdminCategories(categoriesFilterParams);

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalServices = allServices.length;
    const activeServices = allServices.filter((s) => s.isActive).length;
    const hourlyServices = allServices.filter((s) => s.priceType === "hourly").length;
    const metersServices = allServices.filter((s) => s.priceType === "meters").length;
    const totalCategories = allCategories.length;
    const activeCategories = allCategories.filter((c) => c.isActive).length;

    return {
      totalServices,
      activeServices,
      hourlyServices,
      metersServices,
      totalCategories,
      activeCategories,
    };
  }, [allServices, allCategories]);

  // Dialog Open Handlers
  const handleOpenNewService = () => {
    setServiceToEdit(null);
    setIsServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setServiceToEdit(service);
    setIsServiceDialogOpen(true);
  };

  const handleOpenNewCategory = () => {
    setCategoryToEdit(null);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsCategoryDialogOpen(true);
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
            Service Governance & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure standardized gig classifications, benchmark hourly rates, and distance
            metering metrics for cooperative service dispatch.
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

        {/* Categories */}
        <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Categories</span>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Tag className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-foreground font-heading">
              {metrics.totalCategories}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
              <span>{metrics.activeCategories} Active Classifications</span>
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
              <span>Standard time-based pricing</span>
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
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearch("");
          setStatusFilter("all");
        }}
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceType={priceType}
        onPriceTypeChange={setPriceType}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenNewService={handleOpenNewService}
        onOpenNewCategory={handleOpenNewCategory}
        totalServices={allServices.length}
        totalCategories={allCategories.length}
        categories={allCategories}
      />

      {/* Main Content Render */}
      <ServicesRender
        activeTab={activeTab}
        services={filteredServices}
        categories={activeTab === "categories" ? filteredCategories : allCategories}
        isLoadingServices={isLoadingFilteredServices}
        isLoadingCategories={isLoadingFilteredCategories}
        onEditService={handleEditService}
        onEditCategory={handleEditCategory}
        onOpenNewService={handleOpenNewService}
        onOpenNewCategory={handleOpenNewCategory}
      />

      {/* Service Dialog (Create / Edit) */}
      <ServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        serviceToEdit={serviceToEdit}
        defaultCategoryId={selectedCategory || undefined}
      />

      {/* Category Dialog (Create / Edit) */}
      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
};

export default AdminServices;