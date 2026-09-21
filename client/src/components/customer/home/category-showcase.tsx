import React from "react";
import { Link } from "react-router-dom";
import { Layers, Briefcase, ChevronRight, ArrowRight } from "lucide-react";
import { useCustomerCategories } from "@/features/customer/categories/hooks";

export const CategoryShowcase: React.FC = () => {
  const { data: categories = [], isLoading } = useCustomerCategories({
    isActive: true,
  });

  const displayedCategories = categories.slice(0, 4);

  return (
    <section className="py-10 sm:py-14 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent tracking-wider uppercase">
              <Layers className="size-3.5" />
              <span>Service Domains</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Explore by Trade Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              From certified electrical work to master carpentry, explore skilled domains
              governed by registered worker cooperatives.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:text-accent/80 transition-colors self-start sm:self-auto group"
          >
            <span>View All Categories</span>
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-card border border-border/80 animate-pulse p-5 space-y-3"
              >
                <div className="size-10 rounded-lg bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted/60" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-card border border-dashed border-border text-muted-foreground text-sm">
            No service categories currently published.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayedCategories.map((cat) => (
              <Link
                key={cat._id}
                to={`/services?category=${cat._id}`}
                className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border/80 hover:border-accent/60 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Category Icon */}
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-xs">
                    {cat.icon ? (
                      <span dangerouslySetInnerHTML={{ __html: cat.icon }} />
                    ) : (
                      <Briefcase className="size-5" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors mt-3">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat.description || "Certified trade services dispatched from local cooperatives."}
                  </p>
                </div>

                {/* Bottom Arrow Indicator */}
                <div className="mt-4 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-accent">
                  <span>Browse services</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
