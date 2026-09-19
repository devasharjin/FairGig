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
  Zap,
  AlertTriangle,
  Clock,
  Phone,
  Crosshair,
  Sparkles,
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
import type { BookingType, UrgencyLevel } from "@/features/customer/bookings/types";
import { useCreateBooking } from "@/features/customer/bookings/hooks";
import { useCustomerProfile } from "@/features/customer/profile/hooks";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";

interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: CustomerService | null;
  initialBookingType?: BookingType;
}

const COMMON_EMERGENCY_HAZARDS = [
  "Water Pipe Burst / Heavy Leak",
  "Electrical Spark / Short Circuit",
  "Door Lock Jammed / Lockout",
  "Appliance Burning Smell / Danger",
  "Drainage Overflow / Sewage Backup",
  "Other Urgent Safety Hazard",
];

export const ServiceBookingDialog: React.FC<ServiceBookingDialogProps> = ({
  open,
  onOpenChange,
  service,
  initialBookingType = "SCHEDULED",
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const createBooking = useCreateBooking();
  const { data: profileData } = useCustomerProfile();

  // Booking mode state: SCHEDULED | ON_DEMAND | EMERGENCY
  const [bookingType, setBookingType] = useState<BookingType>(initialBookingType);
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  // Emergency specific states
  const [hazardType, setHazardType] = useState(COMMON_EMERGENCY_HAZARDS[0]);
  const [severity, setSeverity] = useState<UrgencyLevel>("CRITICAL");
  const [immediateContact, setImmediateContact] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Sync initial booking type when opening
  useEffect(() => {
    if (open) {
      setBookingType(initialBookingType);
    }
  }, [open, initialBookingType]);

  // Pre-fill primary address & phone if available when opening dialog
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

      if (!immediateContact) {
        setImmediateContact(user?.phone || profileData?.phone || "");
      }
    }
  }, [open, profileData, user, address, immediateContact]);

  if (!service) return null;

  const isEmergency = bookingType === "EMERGENCY";
  const isOnDemand = bookingType === "ON_DEMAND";
  const isScheduled = bookingType === "SCHEDULED";

  const firstHourRate = service.firstHourRate ?? service.hourlyPrice ?? 0;
  const additionalHourRate = service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0;
  const transportFee = service.transportFee ?? 30;
  const estimatedInitialTotal = firstHourRate + transportFee;

  const categoryName =
    typeof service.category === "object" && service.category !== null
      ? service.category.name
      : "Standard Service";

  // GPS Location handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setAddress(`GPS: Lat ${latitude.toFixed(5)}, Long ${longitude.toFixed(5)} (Current Location)`);
        setIsLocating(false);
        toast.success("Current location captured!");
      },
      (err) => {
        setIsLocating(false);
        toast.error(`Could not retrieve location: ${err.message}`);
      },
      { timeout: 10000 }
    );
  };

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

    if (isEmergency && !immediateContact.trim()) {
      toast.error("Please provide an immediate contact phone number for emergency responder dispatch");
      return;
    }

    try {
      await createBooking.mutateAsync({
        serviceId: service._id,
        address: address.trim(),
        scheduledDate: isScheduled && preferredDate ? new Date(preferredDate).toISOString() : new Date().toISOString(),
        customerNotes: notes.trim(),
        bookingType,
        isEmergency,
        urgencyLevel: isEmergency ? severity : isOnDemand ? "HIGH" : "STANDARD",
        emergencyDetails: isEmergency
          ? {
              hazardType,
              severity: severity as "CRITICAL" | "HIGH" | "MEDIUM",
              immediateContact: immediateContact.trim(),
              notes: notes.trim(),
            }
          : undefined,
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
      <DialogContent
        className={cn(
          "max-w-lg rounded-3xl p-6 border shadow-2xl bg-card max-h-[90vh] overflow-y-auto transition-all",
          isEmergency
            ? "border-rose-500/50 ring-2 ring-rose-500/20 shadow-rose-500/10"
            : isOnDemand
            ? "border-amber-500/40 ring-1 ring-amber-500/20 shadow-amber-500/10"
            : "border-border/80"
        )}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl shrink-0 transition-all",
                isEmergency
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : isOnDemand
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-primary/10 text-primary"
              )}
            >
              {isEmergency ? (
                <AlertTriangle className="size-6 animate-pulse" />
              ) : isOnDemand ? (
                <Zap className="size-5" />
              ) : (
                <Briefcase className="size-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2 flex-wrap">
                <span>Request {service.name}</span>
                {isEmergency && (
                  <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-wider py-0.5 px-2 animate-pulse">
                    🚨 SOS Emergency
                  </Badge>
                )}
                {isOnDemand && (
                  <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold py-0.5 px-2">
                    ⚡ On-Demand
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Category: <strong className="text-foreground">{categoryName}</strong> • Fair Cooperative Platform
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 1. Booking Mode Selector Tabs */}
        <div className="mt-3">
          <Label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Select Dispatch Mode:
          </Label>
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border/60 text-xs">
            {/* Scheduled Mode */}
            <button
              type="button"
              onClick={() => setBookingType("SCHEDULED")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl font-semibold transition-all cursor-pointer text-center",
                isScheduled
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="size-4 text-primary" />
              <span className="text-[11px] leading-tight">Schedule Later</span>
            </button>

            {/* On-Demand Mode */}
            <button
              type="button"
              onClick={() => setBookingType("ON_DEMAND")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl font-semibold transition-all cursor-pointer text-center",
                isOnDemand
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="size-4 text-amber-500" />
              <span className="text-[11px] leading-tight">On-Demand (ASAP)</span>
            </button>

            {/* Emergency SOS Mode */}
            <button
              type="button"
              onClick={() => setBookingType("EMERGENCY")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl font-semibold transition-all cursor-pointer text-center",
                isEmergency
                  ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground hover:bg-rose-500/10"
              )}
            >
              <AlertTriangle className="size-4 text-rose-500 animate-bounce" />
              <span className="text-[11px] leading-tight">🚨 Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Dispatch Mode Explanatory Notice */}
        {isEmergency && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-950 dark:text-rose-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4 shrink-0" />
              <span>Priority SOS Broadcast Active</span>
            </div>
            <p className="leading-relaxed text-[11px] opacity-90">
              Your request will be sent directly to the top of all qualified worker queues in your area with a high-priority sound and visual alert for immediate rapid dispatch.
            </p>
          </div>
        )}

        {isOnDemand && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
              <Zap className="size-4 shrink-0" />
              <span>Immediate On-Demand Dispatch</span>
            </div>
            <p className="leading-relaxed text-[11px] opacity-90">
              Dispatched without delay. The nearest available verified worker will be matched within minutes.
            </p>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Standardized Hourly Ceiling Pricing</span>
            <Badge variant="outline" className="text-[10px] py-0 px-2 rounded-lg bg-primary/10 text-primary border-primary/20 font-semibold">
              Ceiling Billing
            </Badge>
          </div>

          <div className="space-y-1 text-xs">
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
              <strong className="text-foreground">₹{transportFee} (Flat)</strong>
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
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Emergency-Specific Form Fields */}
          {isEmergency && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-rose-500" />
                  Primary Emergency Hazard / Issue <span className="text-destructive">*</span>
                </Label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-rose-500/30 bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  required
                >
                  {COMMON_EMERGENCY_HAZARDS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-rose-500" />
                    Immediate Contact Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 9876543210"
                    value={immediateContact}
                    onChange={(e) => setImmediateContact(e.target.value)}
                    className="h-10 text-xs sm:text-sm rounded-xl border-rose-500/30"
                    required={isEmergency}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Urgency Severity Level
                  </Label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as UrgencyLevel)}
                    className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  >
                    <option value="CRITICAL">Critical • Danger / Active Flooding / Spark</option>
                    <option value="HIGH">High • Blocked / Inoperable / Severe</option>
                    <option value="MEDIUM">Medium • Urgent Repair Needed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Address / Location with GPS quick-fill */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="req-address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                Service Address / Location <span className="text-destructive">*</span>
              </Label>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Crosshair className={cn("size-3", isLocating && "animate-spin")} />
                <span>{isLocating ? "Locating..." : "Use Current GPS"}</span>
              </button>
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
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary/15 text-primary border-primary/40"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                      )}
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

          {/* Preferred Date / Time (Only shown for SCHEDULED bookings) */}
          {isScheduled && (
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
          )}

          {/* Special Instructions or Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="req-notes" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" />
              {isEmergency ? "Hazard Description & Access Instructions" : "Special Instructions (Optional)"}
            </Label>
            <textarea
              id="req-notes"
              rows={2}
              placeholder={
                isEmergency
                  ? "Describe where the leak/spark is, gate security code, landmark for immediate arrival..."
                  : "Describe specific issues, tools needed, or access instructions..."
              }
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
              className={cn(
                "h-10 px-6 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shadow-sm text-white gap-1.5 transition-all",
                isEmergency
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                  : isOnDemand
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {createBooking.isPending ? (
                "Broadcasting..."
              ) : isEmergency ? (
                <>
                  <AlertTriangle className="size-4" />
                  <span>Broadcast Emergency SOS</span>
                </>
              ) : isOnDemand ? (
                <>
                  <Zap className="size-4" />
                  <span>Dispatch On-Demand</span>
                </>
              ) : (
                "Confirm & Dispatch"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingDialog;
