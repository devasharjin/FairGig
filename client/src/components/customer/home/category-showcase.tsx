import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Briefcase, ChevronRight } from "lucide-react";
import { useCustomerCategories } from "@/features/customer/categories/hooks";
import { Badge } from "@/components/ui/badge";

export const CategoryShowcase: React.FC = () => {
  const { data: categories = [], isLoading } = useCustomerCategories({
    isActive: true,
  });

  return (
    <section className="py-14 sm:py-20 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary tracking-wider uppercase">
              <Layers className="size-3.5" />
              <span>Service Domains</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              From critical electrical repairs to master carpentry, explore skilled domains
              governed by registered worker cooperatives.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors self-start sm:self-auto group"
          >
            <span>View All Categories</span>
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 rounded-3xl bg-muted/40 border border-border/60 animate-pulse p-6 space-y-4"
              >
                <div className="size-12 rounded-2xl bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted/60" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-muted/20 border border-dashed border-border/70 text-muted-foreground text-sm">
            No service categories currently published.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/services?category=${cat._id}`}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Category Icon */}
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 text-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs">
                    {cat.icon ? (
                      <span dangerouslySetInnerHTML={{ __html: cat.icon }} />
                    ) : (
                      <Briefcase className="size-6" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors mt-4">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat.description || "Certified trade services dispatched from local cooperatives."}
                  </p>
                </div>

                {/* Bottom Arrow Indicator */}
                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Browse services</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
