import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wrench, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { useCustomerServices } from "@/features/customer/services/hooks";
import type { CustomerService } from "@/features/customer/services/types";
import { ServiceBookingDialog } from "@/components/customer/services/service-booking-dialog";
import { Button } from "@/components/ui/button";

export const CategoryShowcase: React.FC = () => {
  const { t } = useTranslation();
  const { data: services = [], isLoading } = useCustomerServices({
    isActive: true,
  });

  // State for opening booking dialog on home page
  const [bookingService, setBookingService] = useState<CustomerService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookNow = (service: CustomerService) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  // Exactly 4 services as requested
  const displayedServices = services.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 border-b border-border/60 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent tracking-wider uppercase">
              <Wrench className="size-3.5" />
              <span>{t("home.showcase.badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t("home.showcase.title")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              {t("home.showcase.desc")}
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:text-accent/80 transition-colors self-start sm:self-auto group shrink-0"
          >
            <span>{t("home.showcase.viewAll")}</span>
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Trade Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-card border border-border/70 animate-pulse p-6 space-y-4"
              >
                <div className="size-12 rounded-xl bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3.5 w-full rounded bg-muted/60" />
                <div className="h-3.5 w-2/3 rounded bg-muted/60" />
                <div className="pt-4 border-t border-border/40 flex justify-between">
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-4 w-12 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedServices.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-card border border-dashed border-border text-muted-foreground text-sm">
            {t("home.showcase.noServices")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedServices.map((svc) => {
              const firstHourRate = svc.firstHourRate ?? svc.hourlyPrice ?? 0;
              const tradeKey = svc.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_+|_+$/g, "");
              const localizedName = t(`services.trades.${tradeKey}`, {
                defaultValue: t(
                  `services.trades.${svc.name.toLowerCase().replace(/\s+/g, "_")}`,
                  { defaultValue: svc.name }
                ),
              });
              const localizedDesc = t(`services.tradeDescriptions.${tradeKey}`, {
                defaultValue:
                  svc.description || t("services.defaultDescription"),
              });

              return (
                <div
                  key={svc._id}
                  className="group relative flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex-1 flex flex-col">
                    {/* Top: Icon + Guarantee Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 text-2xl group-hover:scale-105 transition-transform duration-200">
                        {svc.icon ? (
                          <span>{svc.icon}</span>
                        ) : (
                          <Wrench className="size-5" />
                        )}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 shrink-0">
                        <ShieldCheck className="size-3.5 shrink-0" />
                        <span className="truncate max-w-[120px]">{t("home.showcase.protectedRate")}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.25rem] flex items-center leading-snug">
                      {localizedName}
                    </h3>

                    {/* Localized Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem] mt-1.5 mb-4">
                      {localizedDesc}
                    </p>

                    {/* Dedicated Pricing Block */}
                    <div className="mt-auto mb-4 p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t("home.showcase.startingAt")}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-extrabold text-foreground">
                          ₹{firstHourRate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("home.showcase.perHour")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Full-width Book Now Button */}
                  <Button
                    type="button"
                    onClick={() => handleBookNow(svc)}
                    className="w-full h-10 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all group/btn bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span>{t("home.showcase.bookNow")}</span>
                    <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direct Service Booking Dialog */}
      <ServiceBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        service={bookingService}
      />
    </section>
  );
};

export default CategoryShowcase;
