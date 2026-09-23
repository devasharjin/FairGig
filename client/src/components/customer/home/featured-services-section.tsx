import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import { useCustomerServices } from "@/features/customer/services/hooks";
import { ServiceCard } from "@/components/customer/services/service-card";
import { Button } from "@/components/ui/button";
import type { CustomerService } from "@/features/customer/services/types";

interface FeaturedServicesSectionProps {
  onBookService: (service: CustomerService) => void;
}

export const FeaturedServicesSection: React.FC<FeaturedServicesSectionProps> = ({
  onBookService,
}) => {
  const { t } = useTranslation();
  const { data: services = [], isLoading } = useCustomerServices({
    isActive: true,
  });

  // Showcase up to 6 featured services
  const featured = services.slice(0, 6);

  return (
    <section className="py-14 sm:py-20 border-b border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary tracking-wider uppercase">
              <Sparkles className="size-3.5" />
              <span>{t("home.featured.tag", { defaultValue: "Standardized Gigs" })}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              {t("home.featured.title", { defaultValue: "Popular Cooperative Services" })}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              {t("home.featured.subtitle", { defaultValue: "Fixed hourly and metric billing verified by local federations. Request trusted service technicians directly." })}
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors self-start sm:self-auto group"
          >
            <span>{t("home.featured.browseCatalog", { defaultValue: "Browse Full Catalog" })}</span>
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid: 6 services on desktop, 4 on mobile */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i, index) => (
              <div
                key={i}
                className={`h-64 rounded-xl bg-muted/40 border border-border/60 animate-pulse p-6 ${
                  index >= 4 ? "hidden sm:block" : ""
                }`}
              />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-card border border-dashed border-border/70 text-muted-foreground text-sm">
            {t("home.featured.empty", { defaultValue: "No featured services currently available." })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featured.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBookService={onBookService}
                className={index >= 4 ? "hidden sm:flex" : undefined}
              />
            ))}
          </div>
        )}

        {/* View All CTA Banner */}
        {featured.length > 0 && (
          <div className="flex justify-center pt-4">
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-6 h-12 font-bold gap-2 cursor-pointer shadow-xs hover:border-primary/50"
              >
                <span>{t("home.featured.viewAll", { defaultValue: "View All Published Services" })}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
