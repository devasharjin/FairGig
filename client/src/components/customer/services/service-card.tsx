import React, { useState } from "react";
import { Clock, ArrowRight, ShieldCheck, CheckCircle2, Truck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CustomerService } from "@/features/customer/services/types";

interface ServiceCardProps {
  service: CustomerService;
  onBookService: (service: CustomerService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBookService,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const firstHourRate = service.firstHourRate ?? service.hourlyPrice ?? 0;
  const additionalHourRate = service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0;
  const transportFee = service.transportFee ?? 30;
  const estimatedInitialTotal = firstHourRate + transportFee;

  const isLongDescription = (service.description || "").length > 130;
  const displayDescription = isExpanded || !isLongDescription
    ? service.description
    : `${service.description.slice(0, 130)}...`;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
      {/* Top section */}
      <div>
        {/* Price & Metric Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-primary/10 border-primary/20 text-primary"
          >
            <Clock className="size-3.5 shrink-0" />
            <span>Hourly Ceiling Billing</span>
          </Badge>

          {/* Pricing Highlight */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xs font-bold text-muted-foreground">₹</span>
              <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {firstHourRate}
              </span>
              <span className="text-xs font-medium text-muted-foreground">/1st hr</span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 block">
              +₹{additionalHourRate}/addl hr • +₹{transportFee} transport
            </span>
          </div>
        </div>

        {/* Service Name */}
        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {service.name}
        </h3>

        {/* Service Description */}
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {displayDescription}
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* Transparent Rates Grid */}
        <div className="mt-4 p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">First 60 mins:</span>
            <span className="font-bold text-foreground">₹{firstHourRate}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Additional hourly rate:</span>
            <span className="font-medium text-foreground">₹{additionalHourRate} / hr</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Truck className="size-3 text-primary" /> Fixed Transport Fee:
            </span>
            <span className="font-medium text-foreground">₹{transportFee}</span>
          </div>
          <div className="pt-1.5 border-t border-border/50 flex justify-between items-baseline">
            <span className="font-semibold text-foreground text-[11px]">Estimated (1st Hour):</span>
            <span className="font-extrabold text-primary text-xs">₹{estimatedInitialTotal}</span>
          </div>
        </div>

        {/* Platform Transparency Notice */}
        <div className="mt-2.5 flex items-start gap-1.5 text-[10px] text-muted-foreground leading-tight">
          <Info className="size-3 text-muted-foreground shrink-0 mt-0.5" />
          <span>
            Ceiling rule applies: any partial hour rounds up. Cooperative admin & insurance shares are internal platform allocations from worker earnings, NOT added customer fees.
          </span>
        </div>

        {/* Value Highlights */}
        <div className="mt-3 flex flex-wrap gap-2 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-500" />
            Verified Worker
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3 text-primary" />
            Transparent Pricing
          </span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-5 pt-3">
        <Button
          onClick={() => onBookService(service)}
          className="w-full h-10 sm:h-11 rounded-2xl font-semibold flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all cursor-pointer shadow-sm"
        >
          <span>Book Now</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
