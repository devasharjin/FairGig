import React from "react";

export const ServicesSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse pt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl bg-card border border-border/70 p-6 space-y-5 shadow-xs"
        >
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="size-14 rounded-2xl bg-muted shrink-0" />
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded-lg bg-muted" />
            <div className="h-3.5 w-full rounded-md bg-muted/60" />
            <div className="h-3.5 w-4/5 rounded-md bg-muted/60" />
          </div>

          {/* Rate Box */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 rounded bg-muted/60" />
              <div className="h-6 w-20 rounded bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
              <div className="h-3.5 w-20 rounded bg-muted/60" />
              <div className="h-3.5 w-16 rounded bg-muted/60 ml-auto" />
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="flex justify-between items-center pt-1">
            <div className="h-3.5 w-24 rounded bg-muted/60" />
            <div className="h-3.5 w-20 rounded bg-muted/60" />
          </div>

          {/* Button */}
          <div className="pt-3 border-t border-border/40">
            <div className="h-11 w-full rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesSkeleton;
