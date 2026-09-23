import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  if (services.length === 0) return null;

  const categoryName = category.name
    ? t("services.categories." + category.name.toLowerCase().replace(/\s+/g, "_"), { defaultValue: category.name })
    : category.name;

  return (
    <section
      id={`category-${category._id}`}
      className="scroll-mt-28 space-y-5 pt-2"
    >
      {/* Category Header */}
    <div className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-gradient-to-r from-[#17324D]/[0.06] to-white px-3 py-2.5 ring-1 ring-[#17324D]/[0.08]">
  {/* Icon + Title */}
  <div className="flex min-w-0 items-center gap-3">
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#17324D]/10 bg-white text-[#17324D] shadow-sm"
      title={categoryName}
    >
      {category.icon ? (
        <span
          className="flex items-center justify-center [&_svg]:size-5"
          dangerouslySetInnerHTML={{ __html: category.icon }}
        />
      ) : (
        <Briefcase className="size-5" />
      )}
    </div>

    <h2 className="text-sm sm:text-base font-bold tracking-tight text-[#172B3A]">
      {categoryName}
    </h2>
  </div>

  {/* Count Badge */}
  <Badge
    variant="secondary"
    className="shrink-0 gap-1 rounded-md border border-[#17324D]/10 bg-white px-2 py-1 text-[11px] font-medium text-[#17324D]"
  >
    <Sparkles className="size-3 text-[#168C83]" />
    {services.length} {services.length === 1 ? t("services.trades.service", { defaultValue: "Service" }) : t("services.trades.services", { defaultValue: "Services" })}
  </Badge>
</div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
