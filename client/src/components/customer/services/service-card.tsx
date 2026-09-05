import React, { useState } from "react";
import { Clock, Ruler, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
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
  const isHourly = service.priceType === "hourly";
  const price = isHourly ? service.hourlyPrice : service.metersPrice;
  const unit = isHourly ? "/hr" : "/meter";

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
            {isHourly ? (
              <>
                <Clock className="size-3.5 shrink-0" />
                <span>Hourly Service</span>
              </>
            ) : (
              <>
                <Ruler className="size-3.5 shrink-0" />
                <span>Metered Service</span>
              </>
            )}
          </Badge>

          {/* Pricing Highlight */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xs font-bold text-muted-foreground">₹</span>
              <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {price ?? 0}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{unit}</span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 block">
              {isHourly ? "Billed per working hour" : "Standard distance/unit"}
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

        {/* Value Highlights */}
        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-500" />
            Vetted Gig Worker
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3 text-primary" />
            Standardized Pricing
          </span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-5 pt-3">
        <Button
          onClick={() => onBookService(service)}
          className="w-full h-10 sm:h-11 rounded-2xl font-semibold flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all cursor-pointer shadow-sm"
        >
          <span>Request Service</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
