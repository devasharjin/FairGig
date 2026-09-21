import React from "react";
import { MapPin } from "lucide-react";

interface LocationInfo {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ServiceAreaCardProps {
  location?: LocationInfo | null;
}

export const ServiceAreaCard: React.FC<ServiceAreaCardProps> = ({ location }) => {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <MapPin className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            Service Area
          </h3>
          <p className="text-xs text-muted-foreground">
            Base dispatch location
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Address:</span>
          <span className="font-medium text-foreground text-right max-w-[180px]">
            {location?.address || "Not specified"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">City / State:</span>
          <span className="font-medium text-foreground">
            {location?.city || "—"}, {location?.state || "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pincode:</span>
          <span className="font-medium text-foreground">
            {location?.pincode || "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaCard;
