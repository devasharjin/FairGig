import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Wrench,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { useCustomerServices } from "@/features/customer/services/hooks";
import type { CustomerService, ServicePriceType } from "@/features/customer/services/types";
import { ServiceSearchFilter } from "@/components/customer/services/service-search-filter";
import { ServiceCard } from "@/components/customer/services/service-card";
import { ServicesEmptyState } from "@/components/customer/services/services-empty-state";
import { ServicesSkeleton } from "@/components/customer/services/services-skeleton";
import { ServiceBookingDialog } from "@/components/customer/services/service-booking-dialog";
import { EmergencyBanner } from "@/components/customer/emergency/EmergencyBanner";
import { EmergencySosModal } from "@/components/customer/emergency/EmergencySosModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const CustomerServices: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial params from URL
  const urlQuery = searchParams.get("q") || searchParams.get("search") || "";
  const urlTrade = searchParams.get("trade") || searchParams.get("category") || "all";
  const urlPriceType = (searchParams.get("priceType") as ServicePriceType) || "all";

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedTrade, setSelectedTrade] = useState(urlTrade);
  const [selectedPriceType, setSelectedPriceType] = useState<ServicePriceType | "all">(urlPriceType);

  // Booking Dialog State
  const [bookingService, setBookingService] = useState<CustomerService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // TanStack Query: Fetch active services
  const {
    data: services = [],
    isLoading,
    isError,
    refetch: refetchServices,
  } = useCustomerServices({
    isActive: true,
  });

  // Sync state whenever URL search params change
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    const trade = searchParams.get("trade") || searchParams.get("category") || "all";
    const pt = (searchParams.get("priceType") as ServicePriceType) || "all";

    setSearchQuery(q);
    setSelectedTrade(trade);
    setSelectedPriceType(pt);
  }, [searchParams]);

  // Helper to sync local filter changes to the URL search params
  const updateUrlParams = (
    newSearch: string,
    newTrade: string,
    newPriceType: ServicePriceType | "all"
  ) => {
    const nextParams: Record<string, string> = {};
    if (newSearch.trim()) {
      nextParams.q = newSearch.trim();
    }
    if (newTrade && newTrade !== "all") {
      nextParams.trade = newTrade;
    }
    if (newPriceType && newPriceType !== "all") {
      nextParams.priceType = newPriceType;
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrlParams(value, selectedTrade, selectedPriceType);
  };

  const handleSelectTrade = (trade: string) => {
    setSelectedTrade(trade);
    updateUrlParams(searchQuery, trade, selectedPriceType);
  };

  const handleSelectPriceType = (priceType: ServicePriceType | "all") => {
    setSelectedPriceType(priceType);
    updateUrlParams(searchQuery, selectedTrade, priceType);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTrade("all");
    setSelectedPriceType("all");
    setSearchParams({}, { replace: true });
  };

  const handleClearTrade = () => {
    handleSelectTrade("all");
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  // Filter services locally for instant real-time response
  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      // Trade filter (matches service name e.g. "Plumber", "Electrician", "Gardener")
      if (selectedTrade !== "all") {
        const tradeLower = selectedTrade.toLowerCase();
        const nameLower = svc.name.toLowerCase();
        if (!nameLower.includes(tradeLower)) {
          return false;
        }
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
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [services, selectedTrade, selectedPriceType, searchQuery]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedTrade !== "all" || selectedPriceType !== "all"
  );

  const handleBookService = (service: CustomerService) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  const localizedSelectedTrade = selectedTrade !== "all"
    ? t(`services.trades.${selectedTrade.toLowerCase().replace(/\s+/g, "_")}`, { defaultValue: selectedTrade })
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/30 to-background pt-8 pb-10 sm:pt-12 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-accent text-xs font-semibold shadow-xs">
            <Sparkles className="size-3.5" />
            <span>{t("services.badge")}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {selectedTrade !== "all" ? (
              t("services.verifiedTitle", { trade: localizedSelectedTrade })
            ) : searchQuery ? (
              t("services.matchingTitle", { query: searchQuery })
            ) : (
              t("services.directTitle")
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("services.subtitle")}
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              {t("services.trust1")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-accent" />
              {t("services.trust2")}
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="size-3.5 text-accent" />
              {t("services.trust3")}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Urgent Emergency SOS Callout Banner */}
        <EmergencyBanner onTriggerEmergency={() => setIsEmergencyOpen(true)} />

        {/* Search & Filters Section */}
        <section className="sticky top-16 z-20 -mx-4 px-4 py-3 sm:mx-0 sm:px-0 sm:py-3 bg-background/95 backdrop-blur-sm border-b border-border/40 transition-all">
          <ServiceSearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedPriceType={selectedPriceType}
            onSelectPriceType={handleSelectPriceType}
            selectedTrade={selectedTrade}
            onSelectTrade={handleSelectTrade}
            totalServicesCount={filteredServices.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Active Filter Breadcrumbs / Tags */}
          {(selectedTrade !== "all" || searchQuery.trim()) && (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="text-xs text-muted-foreground font-semibold">{t("services.activeFilters")}</span>

              {selectedTrade !== "all" && (
                <Badge
                  variant="secondary"
                  className="pl-2.5 pr-1.5 py-1 rounded-xl text-xs flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20"
                >
                  <span>{t("services.tradeFilter", { trade: localizedSelectedTrade })}</span>
                  <button
                    type="button"
                    onClick={handleClearTrade}
                    className="p-0.5 rounded-full hover:bg-primary/20 transition cursor-pointer"
                    title="Remove trade filter"
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
                  <span>{t("services.queryFilter", { query: searchQuery })}</span>
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
                {t("services.clearAll")}
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
              {t("services.errorTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              {t("services.errorDesc")}
            </p>
            <Button
              onClick={() => refetchServices()}
              variant="outline"
              className="mt-2 rounded-2xl gap-2 font-semibold cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>{t("services.retryBtn")}</span>
            </Button>
          </div>
        ) : filteredServices.length === 0 ? (
          <ServicesEmptyState
            searchQuery={searchQuery}
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        ) : (
          /* Direct Services Grid: Clean, Spacious, 3-Column Premium Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
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