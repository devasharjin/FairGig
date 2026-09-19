import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Briefcase,
  Home,
  Building,
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
import { useCustomerProfile } from "@/features/customer/profile/hooks";
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
  const { data: profileData } = useCustomerProfile();

  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  // Pre-fill primary address if available when opening dialog
  useEffect(() => {
    if (open) {
      if (!address) {
        if (profileData?.address?.street) {
          const formatted = [
            profileData.address.street,
            profileData.address.city,
            profileData.address.state,
            profileData.address.zip,
          ]
            .filter(Boolean)
            .join(", ");
          setAddress(formatted);
        } else if (profileData?.savedAddresses && profileData.savedAddresses.length > 0) {
          const defaultAddr =
            profileData.savedAddresses.find((a) => a.isDefault) ||
            profileData.savedAddresses[0];
          const formatted = [
            defaultAddr.street,
            defaultAddr.city,
            defaultAddr.state,
            defaultAddr.zip,
          ]
            .filter(Boolean)
            .join(", ");
          setAddress(formatted);
        }
      }
    }
  }, [open, profileData]);

  if (!service) return null;

  const firstHourRate = service.firstHourRate ?? service.hourlyPrice ?? 0;
  const additionalHourRate = service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0;
  const transportFee = service.transportFee ?? 30;
  const estimatedInitialTotal = firstHourRate + transportFee;

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
        scheduledDate: preferredDate
          ? new Date(preferredDate).toISOString()
          : new Date().toISOString(),
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

  const savedAddresses = profileData?.savedAddresses || [];

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
                Category: <strong className="text-foreground">{categoryName}</strong> • Fair Cooperative Dispatch
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Pricing & Transparent Billing Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Standardized Hourly Ceiling Pricing</span>
            </span>
            <Badge variant="outline" className="text-[10px] py-0 px-2 rounded-lg bg-primary/10 text-primary border-primary/20 font-semibold">
              Ceiling Billing
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>First Hour Rate (duration ≤ 60 mins):</span>
              <strong className="text-foreground">₹{firstHourRate}</strong>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Additional Hourly Rate:</span>
              <strong className="text-foreground">₹{additionalHourRate} / hr</strong>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Fixed Transport Fee:</span>
              <strong className="text-foreground">₹{transportFee}</strong>
            </div>
            <div className="pt-2 border-t border-border/60 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Estimated Initial Amount (1st Hour):
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ₹{firstHourRate} service + ₹{transportFee} transport
                </span>
              </div>
              <span className="text-xl font-extrabold text-primary">₹{estimatedInitialTotal}</span>
            </div>
          </div>

          {/* Billing Rules & Allocation Explanations */}
          <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1.5 text-[11px] text-muted-foreground leading-relaxed">
            <p>
              ⏱ <strong>Billing Rule:</strong> Work duration is recorded automatically by the backend upon worker start and completion. Billed hours round up using the ceiling rule (e.g. up to 60m = 1 hr, 61–120m = 2 hrs).
            </p>
            <p>
              🛡 <strong>Cooperative Protection:</strong> Cooperative admin and worker insurance shares are platform-level allocations funded from service earnings, and are <em>not</em> added as extra customer charges.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/50">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Verified Worker
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-primary" />
              No Hidden Charges
            </span>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Address / Location */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="req-address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                Service Address / Location <span className="text-destructive">*</span>
              </Label>
            </div>

            {/* Quick-select chips from saved addresses if available */}
            {savedAddresses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5 pb-1">
                {savedAddresses.map((addr) => {
                  const addrFull = [addr.street, addr.city, addr.state, addr.zip]
                    .filter(Boolean)
                    .join(", ");
                  const isSelected = address === addrFull;
                  const Icon =
                    addr.title?.toLowerCase() === "work" ? Building : Home;
                  return (
                    <button
                      type="button"
                      key={addr._id}
                      onClick={() => setAddress(addrFull)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary/15 text-primary border-primary/40"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="size-3" />
                      <span>{addr.title || "Address"}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <Input
              id="req-address"
              placeholder="e.g. Flat 302, Green Valley Apartments, Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={createBooking.isPending}
              className="h-10 text-sm rounded-xl"
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
              className="h-10 text-xs sm:text-sm rounded-xl"
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
              className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-sm bg-primary text-primary-foreground"
            >
              {createBooking.isPending ? "Dispatching..." : "Confirm & Dispatch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingDialog;
