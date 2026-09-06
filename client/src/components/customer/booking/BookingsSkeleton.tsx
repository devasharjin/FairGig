import React from "react";
import { cn } from "@/lib/utils";

export interface BookingsSkeletonProps {
  count?: number;
  className?: string;
}

export const BookingsSkeleton: React.FC<BookingsSkeletonProps> = ({
  count = 4,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="p-6 rounded-3xl border border-border/60 bg-card/40 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-muted/60 rounded-lg w-1/4" />
            <div className="h-6 bg-muted/50 rounded-lg w-28" />
          </div>
          <div className="h-7 bg-muted/40 rounded-xl w-3/4" />
          <div className="h-16 bg-muted/30 rounded-2xl" />
          <div className="h-12 bg-muted/20 rounded-2xl" />
        </div>
      ))}
    </div>
  );
};

export default BookingsSkeleton;
