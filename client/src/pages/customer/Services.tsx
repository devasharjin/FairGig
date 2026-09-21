import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Layers,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { useCustomerCategories } from "@/features/customer/categories/hooks";
import { useCustomerServices } from "@/features/customer/services/hooks";
import type { Category } from "@/features/customer/categories/types";
import type { CustomerService, ServicePriceType } from "@/features/customer/services/types";
import { ServiceSearchFilter } from "@/components/customer/services/service-search-filter";
import { CategoryServiceGroup } from "@/components/customer/services/category-service-group";
import { ServicesEmptyState } from "@/components/customer/services/services-empty-state";
import { ServicesSkeleton } from "@/components/customer/services/services-skeleton";
import { ServiceBookingDialog } from "@/components/customer/services/service-booking-dialog";
import { EmergencyBanner } from "@/components/customer/emergency/EmergencyBanner";
import { EmergencySosModal } from "@/components/customer/emergency/EmergencySosModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const CustomerServices: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial params from URL
  const urlQuery = searchParams.get("q") || searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";
  const urlPriceType = (searchParams.get("priceType") as ServicePriceType) || "all";

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState(urlCategory);
  const [selectedPriceType, setSelectedPriceType] = useState<ServicePriceType | "all">(urlPriceType);

  // Booking Dialog State
  const [bookingService, setBookingService] = useState<CustomerService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // TanStack Query: Fetch active categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useCustomerCategories({ isActive: true });

  // Sync state whenever URL search params change (e.g. navigation from home, back/forward buttons)
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    const cat = searchParams.get("category") || "all";
    const pt = (searchParams.get("priceType") as ServicePriceType) || "all";

    setSearchQuery(q);
    setSelectedCategoryId(cat);
    setSelectedPriceType(pt);
  }, [searchParams]);

  // Resolve category ID (supports passing category slug or _id in URL)
  const resolvedCategoryId = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === "all") return "all";
    const matched = categories.find(
      (c) => c._id === selectedCategoryId || c.slug === selectedCategoryId
    );
    return matched ? matched._id : selectedCategoryId;
  }, [selectedCategoryId, categories]);

  // Active Category object for display
  const activeCategoryObj = useMemo(() => {
    if (resolvedCategoryId === "all") return null;
    return categories.find((c) => c._id === resolvedCategoryId) || null;
  }, [resolvedCategoryId, categories]);

  // Helper to sync local filter changes to the URL search params
  const updateUrlParams = (
    newSearch: string,
    newCat: string,
    newPriceType: ServicePriceType | "all"
  ) => {
    const nextParams: Record<string, string> = {};
    if (newSearch.trim()) {
      nextParams.q = newSearch.trim();
    }
    if (newCat && newCat !== "all") {
      nextParams.category = newCat;
    }
    if (newPriceType && newPriceType !== "all") {
      nextParams.priceType = newPriceType;
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrlParams(value, selectedCategoryId, selectedPriceType);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    updateUrlParams(searchQuery, catId, selectedPriceType);
  };

  const handleSelectPriceType = (priceType: ServicePriceType | "all") => {
    setSelectedPriceType(priceType);
    updateUrlParams(searchQuery, selectedCategoryId, priceType);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("all");
    setSelectedPriceType("all");
    setSearchParams({}, { replace: true });
  };

  const handleClearCategory = () => {
    handleSelectCategory("all");
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  // TanStack Query: Fetch active services
  const {
    data: services = [],
    isLoading: isLoadingServices,
    isError: isServicesError,
    refetch: refetchServices,
  } = useCustomerServices({
    isActive: true,
    category: resolvedCategoryId !== "all" ? resolvedCategoryId : undefined,
    priceType: selectedPriceType !== "all" ? selectedPriceType : undefined,
    search: searchQuery.trim() || undefined,
  });

  const isLoading = isLoadingCategories || isLoadingServices;
  const isError = isCategoriesError || isServicesError;

  // Filter services locally for instant real-time response
  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      // Category filter
      if (resolvedCategoryId !== "all") {
        const catId =
          typeof svc.category === "object" && svc.category !== null
            ? svc.category._id
            : svc.category;
        if (catId !== resolvedCategoryId) return false;
      }

      // Price type filter
      if (selectedPriceType !== "all") {
        if (svc.priceType !== selectedPriceType) return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = svc.name.toLowerCase().includes(query);
        const matchesDesc = (svc.description || "").toLowerCase().includes(query);
        const categoryName =
          typeof svc.category === "object" && svc.category !== null
            ? svc.category.name.toLowerCase()
            : "";
        const matchesCategory = categoryName.includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    });
  }, [services, resolvedCategoryId, selectedPriceType, searchQuery]);

  // Group services by Category (display category name first and then their services)
  const groupedCategories = useMemo(() => {
    const groupMap = new Map<string, { category: Category; services: CustomerService[] }>();

    // Pre-populate with known active categories
    categories.forEach((cat) => {
      groupMap.set(cat._id, {
        category: cat,
        services: [],
      });
    });

    // Populate services into groups
    filteredServices.forEach((svc) => {
      const catObj =
        typeof svc.category === "object" && svc.category !== null
          ? (svc.category as Category)
          : null;
      const catId = catObj ? catObj._id : (svc.category as string);

      if (groupMap.has(catId)) {
        groupMap.get(catId)!.services.push(svc);
      } else if (catObj) {
        groupMap.set(catId, {
          category: catObj,
          services: [svc],
        });
      } else {
        const fallbackId = "other";
        if (!groupMap.has(fallbackId)) {
          groupMap.set(fallbackId, {
            category: {
              _id: fallbackId,
              name: "General Services",
              slug: "general-services",
              isActive: true,
              createdAt: "",
              updatedAt: "",
            },
            services: [],
          });
        }
        groupMap.get(fallbackId)!.services.push(svc);
      }
    });

    // When filtered to a specific category, return only that category's group
    return Array.from(groupMap.values()).filter((group) => {
      if (resolvedCategoryId !== "all") {
        return group.category._id === resolvedCategoryId && group.services.length > 0;
      }
      return group.services.length > 0;
    });
  }, [categories, filteredServices, resolvedCategoryId]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || resolvedCategoryId !== "all" || selectedPriceType !== "all"
  );

  const handleBookService = (service: CustomerService) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/30 to-background pt-8 pb-10 sm:pt-12 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-accent text-xs font-semibold shadow-xs">
            <Sparkles className="size-3.5" />
            <span>Cooperative Gig Services Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {activeCategoryObj ? (
              <>
                <span className="text-accent">{activeCategoryObj.name}</span> Services
              </>
            ) : searchQuery ? (
              <>
                Services matching "<span className="text-accent">{searchQuery}</span>"
              </>
            ) : (
              <>
                Discover Verified <span className="text-accent">Cooperative Services</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {activeCategoryObj?.description
              ? activeCategoryObj.description
              : "Transparent hourly and metered pricing backed by verified local cooperative trade workers. Reliable service dispatched directly to your location."}
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Vetted Workers
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-accent" />
              Standardized Rates
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5 text-accent" />
              Direct Guild Dispatch
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Urgent Emergency SOS Callout Banner */}
        <EmergencyBanner onTriggerEmergency={() => setIsEmergencyOpen(true)} />

        {/* Search & Filters Section */}
        <section className="sticky top-16 z-20 -mx-4 px-4 py-3 sm:mx-0 sm:px-0 sm:py-3 bg-background border-b border-border/40 transition-all">
          <ServiceSearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedCategoryId={resolvedCategoryId}
            onSelectCategory={handleSelectCategory}
            selectedPriceType={selectedPriceType}
            onSelectPriceType={handleSelectPriceType}
            categories={categories}
            totalServicesCount={filteredServices.length}
            totalCategoriesCount={groupedCategories.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Active Filter Breadcrumbs / Tags */}
          {(resolvedCategoryId !== "all" || searchQuery.trim()) && (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="text-xs text-muted-foreground font-semibold">Active filters:</span>

              {activeCategoryObj && (
                <Badge
                  variant="secondary"
                  className="pl-2.5 pr-1.5 py-1 rounded-xl text-xs flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20"
                >
                  <span>Category: {activeCategoryObj.name}</span>
                  <button
                    type="button"
                    onClick={handleClearCategory}
                    className="p-0.5 rounded-full hover:bg-primary/20 transition cursor-pointer"
                    title="Remove category filter"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}

              {searchQuery.trim() && (
                <Badge
                  variant="secondary"
                  className="pl-2.5 pr-1.5 py-1 rounded-xl text-xs flex items-center gap-1.5 bg-muted border border-border"
                >
                  <span>Query: "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-0.5 rounded-full hover:bg-foreground/10 transition cursor-pointer"
                    title="Clear search query"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-primary hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Content States */}
        {isLoading ? (
          <ServicesSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-destructive/20 bg-destructive/5 my-6 space-y-3">
            <AlertCircle className="size-10 text-destructive" />
            <h3 className="text-base font-bold text-foreground">
              Unable to load gig services
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              There was an issue connecting to the cooperative service server. Please try refreshing.
            </p>
            <Button
              onClick={() => {
                refetchCategories();
                refetchServices();
              }}
              variant="outline"
              className="mt-2 rounded-2xl gap-2 font-semibold cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        ) : groupedCategories.length === 0 ? (
          <ServicesEmptyState
            searchQuery={searchQuery}
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        ) : (
          /* Grouped Services: Displays Category Name first and then their services */
          <div className="space-y-12 sm:space-y-16">
            {groupedCategories.map((group) => (
              <CategoryServiceGroup
                key={group.category._id}
                category={group.category}
                services={group.services}
                onBookService={handleBookService}
              />
            ))}
          </div>
        )}
      </div>

      {/* Service Booking / Dispatch Modal */}
      <ServiceBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        service={bookingService}
      />

      {/* 1-Tap Emergency SOS Modal */}
      <EmergencySosModal
        open={isEmergencyOpen}
        onOpenChange={setIsEmergencyOpen}
      />
    </div>
  );
};

export default CustomerServices;