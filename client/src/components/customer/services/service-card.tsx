import React, { useState } from "react";
import { Clock, ArrowRight, ShieldCheck, CheckCircle2, Truck, Info, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const firstHourRate = service.firstHourRate ?? service.hourlyPrice ?? 0;
  const additionalHourRate = service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0;
  const transportFee = service.transportFee ?? 30;
  const estimatedInitialTotal = firstHourRate + transportFee;

  // Truncate logic
  const description = service.description || "";
  const isLongDescription = description.length > 110;
  const displayDescription =
    isExpanded || !isLongDescription
      ? description
      : `${description.slice(0, 110)}...`;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border/80 hover:border-accent/60 shadow-xs hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div>
        {/* Top: Category & Price Highlight */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold bg-muted text-foreground px-2 py-0.5 rounded-md border border-border/80"
          >
            {typeof service.category === "object" ? service.category.name : "Cooperative Service"}
          </Badge>

          {/* Pricing Highlight */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xs font-semibold text-muted-foreground">₹</span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {firstHourRate}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">/1st hr</span>
            </div>
            <span className="text-[10px] text-muted-foreground block">
              +₹{additionalHourRate}/addl hr &bull; +₹{transportFee} transport
            </span>
          </div>
        </div>

        {/* Service Name */}
        <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {service.name}
        </h3>

        {/* Service Description */}
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          {displayDescription}
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1 text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* Transparent Rates Grid */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">First 60 mins:</span>
            <span className="font-semibold text-foreground">₹{firstHourRate}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Additional hourly rate:</span>
            <span className="font-medium text-foreground">₹{additionalHourRate} / hr</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Truck className="size-3 text-accent" /> Fixed Transport Fee:
            </span>
            <span className="font-medium text-foreground">₹{transportFee}</span>
          </div>
          <div className="pt-1.5 border-t border-border/50 flex justify-between items-baseline">
            <span className="font-semibold text-foreground text-[11px]">Estimated (1st Hour):</span>
            <span className="font-bold text-accent text-xs">₹{estimatedInitialTotal}</span>
          </div>
        </div>

        {/* Platform Transparency Notice */}
        <div className="mt-2 flex items-start gap-1 text-[10px] text-muted-foreground leading-tight">
          <Info className="size-3 text-muted-foreground shrink-0 mt-0.5" />
          <span>
            Standardized cooperative rates. No surge markups or hidden fees.
          </span>
        </div>

        {/* Value Highlights */}
        <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
            Verified Artisan
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3 text-accent" />
            Tariff Protected
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <HeartHandshake className="size-3" />
            Insured (₹5L)
          </span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-4 pt-2">
        <Button
          onClick={() => onBookService(service)}
          className="w-full h-9 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Book Now</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
