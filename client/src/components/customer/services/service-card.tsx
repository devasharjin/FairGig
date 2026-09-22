import React from "react";
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerService } from "@/features/customer/services/types";

interface ServiceCardProps {
  service: CustomerService;
  onBookService: (service: CustomerService) => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBookService,
  className,
}) => {
  const firstHourRate = service.firstHourRate ?? service.hourlyPrice ?? 0;
  const additionalHourRate =
    service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0;
  const transportFee = service.transportFee ?? 30;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl bg-card/95 border border-border/70 backdrop-blur-xs",
        "p-6 shadow-xs hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 hover:-translate-y-1",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      <div className="space-y-4">
        {/* Top Bar: Service Icon */}
        <div className="flex items-center justify-between">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 border border-primary/20 text-3xl shadow-xs group-hover:scale-105 transition-transform duration-300">
            {service.icon ? (
              <span role="img" aria-label={service.name}>
                {service.icon}
              </span>
            ) : (
              <ShieldCheck className="size-6 text-primary" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors line-clamp-1">
            {service.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {service.description ||
              "Certified trade artisan dispatched directly by the local cooperative. Standard tariff protected with full quality warranty."}
          </p>
        </div>

        {/* Premium Pricing Highlight Banner */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Benchmark Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold text-muted-foreground">₹</span>
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                {firstHourRate}
              </span>
              <span className="text-xs font-medium text-muted-foreground">/ 1st hr</span>
            </div>
          </div>

          {/* Micro Rate Details Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3 text-accent shrink-0" />
              <span>Add'l:</span>
              <strong className="text-foreground font-semibold">₹{additionalHourRate}/hr</strong>
            </div>

            <div className="flex items-center justify-end gap-1 text-muted-foreground">
              <Truck className="size-3 text-accent shrink-0" />
              <span>Travel:</span>
              <strong className="text-foreground font-semibold">₹{transportFee}</strong>
            </div>
          </div>
        </div>

        {/* Cooperative Trust Guarantees */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="size-3.5" />
            100% Vetted Artisan
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <ShieldCheck className="size-3.5 text-accent" />
            ₹5L Protected
          </span>
        </div>
      </div>

      {/* Book Action Button */}
      <div className="mt-5 pt-3 border-t border-border/40">
        <Button
          onClick={() => onBookService(service)}
          className="w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all group/btn"
        >
          <span>Book Service</span>
          <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
