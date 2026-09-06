import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Clock,
  Ruler,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { CustomerService } from "@/features/customer/services/types";
import { useCreateBooking } from "@/features/customer/bookings/hooks";
import { useAuthStore } from "@/features/auth/store";

interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: CustomerService | null;
}

export const ServiceBookingDialog: React.FC<ServiceBookingDialogProps> = ({
  open,
  onOpenChange,
  service,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const createBooking = useCreateBooking();

  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!service) return null;

  const isHourly = service.priceType === "hourly";
  const price = isHourly ? service.hourlyPrice : service.metersPrice;
  const unit = isHourly ? "/hr" : "/meter";

  const categoryName =
    typeof service.category === "object" && service.category !== null
      ? service.category.name
      : "Standard Service";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to book a service");
      onOpenChange(false);
      navigate("/login");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide your service location/address");
      return;
    }

    try {
      await createBooking.mutateAsync({
        serviceId: service._id,
        address: address.trim(),
        scheduledDate: preferredDate ? new Date(preferredDate).toISOString() : new Date().toISOString(),
        customerNotes: notes.trim(),
      });

      setAddress("");
      setPreferredDate("");
      setNotes("");
      onOpenChange(false);
      navigate("/bookings");
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 border border-border/80 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Request {service.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Category: <strong className="text-foreground">{categoryName}</strong> • Cooperative Gig Dispatch
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Pricing & Guarantee Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Standardized Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-primary">₹</span>
              <span className="text-xl font-extrabold text-foreground">{price ?? 0}</span>
              <span className="text-xs text-muted-foreground font-medium">{unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Verified Worker
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-primary" />
              No Hidden Fees
            </span>
            <Badge variant="outline" className="text-[10px] ml-auto py-0 px-2 rounded-lg">
              {isHourly ? "Hourly Bill" : "Per Meter"}
            </Badge>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Address / Location */}
          <div className="space-y-1.5">
            <Label htmlFor="req-address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              Service Address / Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="req-address"
              placeholder="e.g. Flat 302, Green Valley Apartments, Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={createBooking.isPending}
              className="h-10 text-sm"
              required
            />
          </div>

          {/* Preferred Date / Time */}
          <div className="space-y-1.5">
            <Label htmlFor="req-date" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Preferred Date & Time (Optional)
            </Label>
            <Input
              id="req-date"
              type="datetime-local"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              disabled={createBooking.isPending}
              className="h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Specific Requirements / Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="req-notes" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" />
              Special Instructions or Notes (Optional)
            </Label>
            <textarea
              id="req-notes"
              rows={3}
              placeholder="Describe specific issues, tools needed, or access instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={createBooking.isPending}
              className="w-full px-3 py-2 rounded-2xl border border-input bg-input/20 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createBooking.isPending}
              className="h-10 px-4 rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBooking.isPending}
              className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
            >
              {createBooking.isPending ? "Dispatching..." : "Confirm & Dispatch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
