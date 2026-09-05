import React from "react";

export const ServicesSkeleton: React.FC = () => {
  return (
    <div className="space-y-10 animate-pulse">
      {[1, 2].map((categoryIndex) => (
        <div key={categoryIndex} className="space-y-5">
          {/* Category Header Skeleton */}
          <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-muted/50 border border-border/60">
            <div className="flex items-center gap-3.5">
              <div className="size-12 sm:size-14 rounded-2xl bg-muted shrink-0" />
              <div className="space-y-2">
                <div className="h-5 w-40 sm:w-56 rounded-lg bg-muted" />
                <div className="h-3.5 w-60 sm:w-80 rounded-lg bg-muted/70" />
              </div>
            </div>
            <div className="h-6 w-24 rounded-xl bg-muted shrink-0 hidden sm:block" />
          </div>

          {/* Service Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((cardIndex) => (
              <div
                key={cardIndex}
                className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card p-5 sm:p-6 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 rounded-lg bg-muted" />
                    <div className="h-6 w-16 rounded-lg bg-muted" />
                  </div>
                  <div className="h-5 w-3/4 rounded-lg bg-muted" />
                  <div className="space-y-1.5 pt-1">
                    <div className="h-3 w-full rounded-md bg-muted/60" />
                    <div className="h-3 w-4/5 rounded-md bg-muted/60" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <div className="h-10 w-full rounded-2xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
