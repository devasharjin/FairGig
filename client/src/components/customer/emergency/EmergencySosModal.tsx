import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Crosshair,
  Wrench,
  Zap,
  Lock,
  Flame,
  ShieldCheck,
  CheckCircle2,
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
import { useCustomerServices } from "@/features/customer/services/hooks";
import { useCreateBooking } from "@/features/customer/bookings/hooks";
import { useCustomerProfile } from "@/features/customer/profile/hooks";
import { useAuthStore } from "@/features/auth/store";
import type { CustomerService } from "@/features/customer/services/types";

interface EmergencySosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmergencyCategoryPreset {
  id: string;
  name: string;
  hazardLabel: string;
  keyword: string;
  icon: React.ElementType;
}

const PRESETS: EmergencyCategoryPreset[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    hazardLabel: "Burst Pipe / Severe Leak",
    keyword: "plumb",
    icon: Wrench,
  },
  {
    id: "electrical",
    name: "Electrical",
    hazardLabel: "Electrical Spark / Power Failure",
    keyword: "electr",
    icon: Zap,
  },
  {
    id: "locksmith",
    name: "Lockout",
    hazardLabel: "Jammed Lock / Locked Out",
    keyword: "lock",
    icon: Lock,
  },
  {
    id: "appliance",
    name: "Appliance",
    hazardLabel: "Short Circuit / Danger Hazard",
    keyword: "appliance",
    icon: Flame,
  },
];

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: services = [] } = useCustomerServices({ isActive: true });
  const { data: profileData } = useCustomerProfile();
  const createBooking = useCreateBooking();

  const [selectedPreset, setSelectedPreset] = useState<string>("plumbing");
  const [address, setAddress] = useState("");
  const [immediateContact, setImmediateContact] = useState("");
  const [hazardDescription, setHazardDescription] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Pre-fill profile address & phone
  useEffect(() => {
    if (open) {
      if (!address) {
        if (profileData?.address?.street) {
          const formatted = [
            profileData.address.street,
            profileData.address.city,
            profileData.address.state,
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

  // Match active service by selected preset keyword
  const matchedService: CustomerService | undefined = React.useMemo(() => {
    const current = PRESETS.find((p) => p.id === selectedPreset);
    if (!current) return services[0];
    const match = services.find((s) => {
      const name = s.name.toLowerCase();
      const desc = (s.description || "").toLowerCase();
      const catName =
        typeof s.category === "object" && s.category !== null
          ? s.category.name.toLowerCase()
          : "";
      return (
        name.includes(current.keyword) ||
        desc.includes(current.keyword) ||
        catName.includes(current.keyword)
      );
    });
    return match || services[0];
  }, [selectedPreset, services]);

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
        toast.success("Location acquired from GPS!");
      },
      (err) => {
        setIsLocating(false);
        toast.error(`Could not retrieve location: ${err.message}`);
      },
      { timeout: 10000 }
    );
  };

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit an emergency request");
      onOpenChange(false);
      navigate("/login");
      return;
    }

    if (!matchedService) {
      toast.error("No active service found for this trade. Please contact hotline.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide your service location or use current GPS");
      return;
    }

    if (!immediateContact.trim()) {
      toast.error("Please provide an immediate contact phone number");
      return;
    }

    const currentPreset = PRESETS.find((p) => p.id === selectedPreset);

    try {
      await createBooking.mutateAsync({
        serviceId: matchedService._id,
        address: address.trim(),
        scheduledDate: new Date().toISOString(),
        customerNotes: hazardDescription.trim(),
        bookingType: "EMERGENCY",
        isEmergency: true,
        urgencyLevel: "CRITICAL",
        emergencyDetails: {
          hazardType: currentPreset?.hazardLabel || "Critical Emergency",
          severity: "CRITICAL",
          immediateContact: immediateContact.trim(),
          notes: hazardDescription.trim(),
        },
      });

      setAddress("");
      setHazardDescription("");
      onOpenChange(false);
      navigate("/bookings");
    } catch {
      // Handled by mutation toast
    }
  };

  const firstHourRate = matchedService?.firstHourRate ?? matchedService?.hourlyPrice ?? 300;
  const transportFee = matchedService?.transportFee ?? 30;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 border border-rose-500/50 shadow-2xl bg-card ring-2 ring-rose-500/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="size-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-lg font-black text-foreground">
                  Emergency SOS Dispatch
                </DialogTitle>
                <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-wider py-0 px-2">
                  Immediate Priority
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Broadcast directly to top-of-queue for verified local cooperative workers
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 1. Quick Emergency Trade Selector */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs font-bold text-foreground">
            What is the emergency?
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPreset(p.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                    isSelected
                      ? "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold shadow-xs scale-[1.02]"
                      : "border-border/70 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-xs">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected service match banner */}
        {matchedService && (
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[11px]">Matched Trade Service:</span>
              <strong className="text-foreground">{matchedService.name}</strong>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground block text-[11px]">Standard Ceiling Rate:</span>
              <span className="font-bold text-foreground">
                ₹{firstHourRate} 1st hr + ₹{transportFee} flat
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleEmergencySubmit} className="space-y-3.5 pt-1">
          {/* Address with GPS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-rose-500" />
                Service Address / Exact Location <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Crosshair className={`size-3 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "Locating..." : "Use Current GPS"}</span>
              </button>
            </div>
            <Input
              placeholder="e.g. Flat 302, Green Valley Apartments, Main Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-10 text-sm rounded-xl border-rose-500/30"
              required
            />
          </div>

          {/* Immediate Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-rose-500" />
              Immediate Contact Number <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. 9876543210 (For worker to call while en-route)"
              value={immediateContact}
              onChange={(e) => setImmediateContact(e.target.value)}
              className="h-10 text-sm rounded-xl border-rose-500/30"
              required
            />
          </div>

          {/* Hazard Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Brief Hazard Notes / Access Instructions
            </Label>
            <textarea
              rows={2}
              placeholder="e.g. Water valve leaking heavily near meter, gate security code is 1234..."
              value={hazardDescription}
              onChange={(e) => setHazardDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-rose-500/20 bg-input/20 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500 transition resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-950 dark:text-rose-200 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="size-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span>
              <strong>Immediate Dispatch Policy:</strong> Clicking broadcast alerts all online cooperative responders with high-priority audio/visual radar notification. Zero middleman markup.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createBooking.isPending}
              className="h-10 px-4 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createBooking.isPending}
              className="h-10 px-6 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-md shadow-rose-600/30 gap-2"
            >
              <AlertTriangle className="size-4 animate-bounce" />
              <span>{createBooking.isPending ? "Broadcasting SOS..." : "Broadcast Emergency SOS Now"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencySosModal;
