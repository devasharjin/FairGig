import React from "react";
import { Phone, Mail, MapPin, Navigation, User, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkerJobCustomer } from "@/features/worker/gigs/types";
import type { BookingAddress } from "@/features/customer/bookings/types";

export interface WorkerCustomerInfoCardProps {
  customer?: WorkerJobCustomer;
  address?: BookingAddress;
  className?: string;
}

export const WorkerCustomerInfoCard: React.FC<WorkerCustomerInfoCardProps> = ({
  customer,
  address,
  className,
}) => {
  const initial = customer?.name?.charAt(0).toUpperCase() || "C";

  const mapQuery = encodeURIComponent(
    [address?.street, address?.city, address?.state, address?.pincode]
      .filter(Boolean)
      .join(", ")
  );

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Customer & Worksite Contact
          </h3>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold gap-1"
        >
          <ShieldCheck className="size-3 text-emerald-500" />
          Verified Client
        </Badge>
      </div>

      {/* Customer profile snippet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/60">
        <div className="flex items-center gap-3.5">
          {customer?.profilePicture ? (
            <img
              src={customer.profilePicture}
              alt={customer.name}
              className="size-13 rounded-lg object-cover ring-2 ring-primary/20 shrink-0"
            />
          ) : (
            <div className="size-13 rounded-lg bg-primary/15 text-primary text-xl font-extrabold flex items-center justify-center shrink-0 shadow-xs">
              {initial}
            </div>
          )}

          <div className="space-y-0.5">
            <h4 className="text-base font-bold text-foreground">
              {customer?.name || "Customer"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {customer?.phone ? `Contact: ${customer.phone}` : "Verified Customer"}
            </p>
          </div>
        </div>

        {/* 1-click Contact Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {customer?.phone && (
            <a href={`tel:${customer.phone}`} className="flex-1 sm:flex-initial">
              <Button
                size="sm"
                className="w-full sm:w-auto rounded-lg h-9 px-3.5 gap-2 text-xs font-semibold cursor-pointer shadow-xs bg-primary text-primary-foreground"
              >
                <Phone className="size-3.5" />
                <span>Call Client</span>
              </Button>
            </a>
          )}

          {customer?.email && (
            <a href={`mailto:${customer.email}`} title={`Email: ${customer.email}`}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg size-9 p-0 cursor-pointer"
              >
                <Mail className="size-3.5 text-muted-foreground" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Worksite Address & Maps Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h4 className="text-xs font-bold text-foreground">
              Service Worksite Location
            </h4>
          </div>

          {mapQuery && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              <Navigation className="size-3.5" />
              <span>Navigate in Maps</span>
              <ExternalLink className="size-3 ml-0.5" />
            </a>
          )}
        </div>

        <div className="p-4 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
          <p className="font-bold text-foreground text-sm">
            {address?.street || "Address provided at booking"}
          </p>
          <p className="text-muted-foreground">
            {[address?.city, address?.state, address?.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
          {address?.landmark && (
            <p className="text-[11px] text-muted-foreground pt-1">
              <strong>Landmark:</strong> {address.landmark}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerCustomerInfoCard;
