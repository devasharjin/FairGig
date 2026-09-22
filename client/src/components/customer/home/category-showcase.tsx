import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { useCustomerServices } from "@/features/customer/services/hooks";
import type { CustomerService } from "@/features/customer/services/types";
import { ServiceBookingDialog } from "@/components/customer/services/service-booking-dialog";
import { Button } from "@/components/ui/button";

export const CategoryShowcase: React.FC = () => {
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
              <span>Verified Co-op Artisans</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Explore Available Services
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Book certified plumbers, electricians, gardeners, and technicians directly from registered worker cooperatives.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:text-accent/80 transition-colors self-start sm:self-auto group shrink-0"
          >
            <span>View All Services</span>
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
            No trade services currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedServices.map((svc) => {
              const firstHourRate = svc.firstHourRate ?? svc.hourlyPrice ?? 0;
              return (
                <div
                  key={svc._id}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/80 hover:border-accent/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-3">
                    {/* Top: Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 text-2xl group-hover:scale-105 transition-transform duration-200">
                        {svc.icon ? (
                          <span>{svc.icon}</span>
                        ) : (
                          <Wrench className="size-5" />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors pt-1 line-clamp-1">
                      {svc.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {svc.description || "Certified guild service delivered with standard benchmark pricing and insured guarantee."}
                    </p>

                    {/* Guarantee badge */}
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="size-3.5" />
                      <span>Co-op Protected Rate</span>
                    </div>
                  </div>

                  {/* Bottom Rate & Book Now Button */}
                  <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Starting at</span>
                      <span className="text-base font-bold text-foreground">
                        ₹{firstHourRate}<span className="text-xs font-normal text-muted-foreground">/hr</span>
                      </span>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleBookNow(svc)}
                      size="sm"
                      className="rounded-xl px-3.5 h-9 font-semibold text-xs gap-1.5 cursor-pointer shadow-xs hover:shadow-md transition-all group/btn"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
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
