import React from "react";
import { Briefcase, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "./service-card";
import type { CustomerService } from "@/features/customer/services/types";
import type { Category } from "@/features/customer/categories/types";

interface CategoryServiceGroupProps {
  category: Category;
  services: CustomerService[];
  onBookService: (service: CustomerService) => void;
}

export const CategoryServiceGroup: React.FC<CategoryServiceGroupProps> = ({
  category,
  services,
  onBookService,
}) => {
  if (services.length === 0) return null;

  return (
    <section
      id={`category-${category._id}`}
      className="scroll-mt-28 space-y-4 sm:space-y-6 pt-2"
    >
      {/* Category Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-muted/40 border border-border/70 backdrop-blur-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Category Icon */}
          <div
            className="flex size-12 sm:size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shrink-0 text-xl sm:text-2xl shadow-xs"
            title={category.name}
          >
            {category.icon ? (
              <span dangerouslySetInnerHTML={{ __html: category.icon }} />
            ) : (
              <Briefcase className="size-6 text-primary" />
            )}
          </div>

          {/* Titles & Desc */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {category.name}
              </h2>
            </div>
            {category.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Count Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge
            variant="secondary"
            className="rounded-xl px-3 py-1 text-xs font-semibold bg-background border border-border/80 text-foreground"
          >
            <Sparkles className="size-3 text-primary mr-1" />
            {services.length} {services.length === 1 ? "Service" : "Services"}
          </Badge>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onBookService={onBookService}
          />
        ))}
      </div>
    </section>
  );
};
