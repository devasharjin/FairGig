import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Crosshair,
  ShieldCheck,
  Zap,
  Layers,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCustomerCategories } from "@/features/customer/categories/hooks";
import { useCustomerServices } from "@/features/customer/services/hooks";
import { useCreateBooking } from "@/features/customer/bookings/hooks";
import { useCustomerProfile } from "@/features/customer/profile/hooks";
import { useAuthStore } from "@/features/auth/store";
import type { CustomerService } from "@/features/customer/services/types";
import { cn } from "@/lib/utils";

interface EmergencySosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: categories = [], isLoading: isLoadingCats } = useCustomerCategories({ isActive: true });
  const { data: services = [], isLoading: isLoadingServices } = useCustomerServices({ isActive: true });
  const { data: profileData } = useCustomerProfile();
  const createBooking = useCreateBooking();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [address, setAddress] = useState("");
  const [immediateContact, setImmediateContact] = useState("");
  const [notes, setNotes] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Auto-select first category when data loads
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0]._id);
    }
  }, [categories, selectedCategoryId]);

  // Services belonging to the selected category
  const categoryServices = useMemo(() => {
    if (!selectedCategoryId) return [];
    return services.filter((s) => {
      const catId =
        typeof s.category === "object" && s.category !== null
          ? s.category._id
          : s.category;
      return catId === selectedCategoryId;
    });
  }, [services, selectedCategoryId]);

  // Auto-select first service when category changes
  useEffect(() => {
    if (categoryServices.length > 0) {
      const exists = categoryServices.some((s) => s._id === selectedServiceId);
      if (!exists) setSelectedServiceId(categoryServices[0]._id);
    } else {
      setSelectedServiceId("");
    }
  }, [categoryServices, selectedServiceId]);

  const selectedService: CustomerService | undefined = useMemo(
    () => categoryServices.find((s) => s._id === selectedServiceId) ?? categoryServices[0],
    [categoryServices, selectedServiceId]
  );

  // Pre-fill address & phone from profile
  useEffect(() => {
    if (!open) return;
    if (!address) {
      const addr = profileData?.address;
      const saved = profileData?.savedAddresses;
      if (addr?.street) {
        setAddress([addr.street, addr.city, addr.state].filter(Boolean).join(", "));
      } else if (saved?.length) {
        const def = saved.find((a) => a.isDefault) ?? saved[0];
        setAddress([def.street, def.city, def.state].filter(Boolean).join(", "));
      }
    }
    if (!immediateContact) {
      setImmediateContact(user?.phone || profileData?.user?.phone || "");
    }
  }, [open, profileData, user, address, immediateContact]);

  const handleGps = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setIsLocating(false);
        toast.success("Location captured!");
      },
      (err) => { setIsLocating(false); toast.error(err.message); },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in first"); onOpenChange(false); navigate("/login"); return; }
    if (!selectedService) { toast.error("Please select a service"); return; }
    if (!address.trim()) { toast.error("Please provide your location"); return; }
    if (!immediateContact.trim()) { toast.error("Please provide a contact number"); return; }
    try {
      await createBooking.mutateAsync({
        serviceId: selectedService._id,
        address: address.trim(),
        scheduledDate: new Date().toISOString(),
        customerNotes: notes.trim(),
        bookingType: "EMERGENCY",
        isEmergency: true,
        urgencyLevel: "CRITICAL",
        emergencyDetails: {
          immediateContact: immediateContact.trim(),
          notes: notes.trim(),
        },
      });
      setAddress(""); setNotes("");
      onOpenChange(false);
      navigate("/bookings");
    } catch { /* handled by mutation toast */ }
  };

  const baseRate = selectedService?.firstHourRate ?? selectedService?.hourlyPrice ?? 0;
  const emergencyRate = Math.round(baseRate * 1.2);
  const transport = selectedService?.transportFee ?? 30;
  const estimatedTotal = emergencyRate + transport;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] w-full rounded-2xl p-0 border border-rose-500/40 shadow-2xl bg-card ring-1 ring-rose-500/10 gap-0 overflow-hidden">

        {/* ── Header ──────────────────────────────── */}
        <div className="relative px-5 pt-4 pb-3.5 bg-gradient-to-r from-rose-600 to-rose-500 overflow-hidden">
          <div className="absolute -right-4 -top-4 size-20 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-8 top-5 size-10 rounded-full bg-white/5 pointer-events-none" />

          <DialogHeader>
            <div className="flex items-center gap-3 relative z-10">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white shrink-0 ring-1 ring-white/20">
                <AlertTriangle className="size-4.5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-sm font-black text-white">
                    Emergency SOS
                  </DialogTitle>
                  <Badge className="bg-white/20 border-0 text-white text-[9px] font-black uppercase tracking-wider py-0 px-1.5">
                    Priority
                  </Badge>
                </div>
                <DialogDescription className="text-[11px] text-rose-100/75 mt-0">
                  Immediate dispatch · Nearest cooperative responder
                </DialogDescription>
              </div>
              {selectedService && (
                <div className="text-right shrink-0 relative z-10">
                  <p className="text-[9px] text-rose-200/70 font-medium leading-none mb-0.5">
                    Est. 1st Hr
                  </p>
                  <p className="text-xl font-black text-white leading-none">₹{estimatedTotal}</p>
                  <p className="text-[9px] text-rose-200/60">+20% surge</p>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* ── Body ────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 space-y-4">

          {/* Service Selection — Step 1 + Step 2 */}
          <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden divide-y divide-border/40">

            {/* Step 1 — Category */}
            <div className="px-3.5 py-3 flex items-center gap-3">
              <div className={cn(
                "flex size-6 items-center justify-center rounded-full text-[10px] font-black shrink-0 transition-all",
                selectedCategoryId
                  ? "bg-rose-500 text-white"
                  : "bg-muted border border-border text-muted-foreground"
              )}>
                <Layers className="size-3" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                  Trade Category
                </Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={isLoadingCats}
                >
                  <SelectTrigger className="h-9 text-xs rounded-lg border-border/70 bg-card focus:ring-rose-500/40 focus:border-rose-500/50 w-full">
                    <SelectValue placeholder={isLoadingCats ? "Loading..." : "Select a category…"}>
                      {selectedCategoryId
                        ? (categories.find((c) => c._id === selectedCategoryId)?.name ?? "")
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id} className="text-xs">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Step 2 — Service */}
            <div className="px-3.5 py-3 flex items-center gap-3">
              <div className={cn(
                "flex size-6 items-center justify-center rounded-full text-[10px] font-black shrink-0 transition-all",
                selectedServiceId
                  ? "bg-rose-500 text-white"
                  : selectedCategoryId
                    ? "bg-muted border-2 border-rose-500/40 text-rose-600 dark:text-rose-400"
                    : "bg-muted border border-border text-muted-foreground opacity-50"
              )}>
                <Wrench className="size-3" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <Label className={cn(
                  "text-[11px] font-bold uppercase tracking-wider block transition-colors",
                  selectedCategoryId ? "text-foreground" : "text-muted-foreground/50"
                )}>
                  Specific Service
                </Label>
                <Select
                  value={selectedServiceId}
                  onValueChange={setSelectedServiceId}
                  disabled={!selectedCategoryId || isLoadingServices || categoryServices.length === 0}
                >
                  <SelectTrigger className={cn(
                    "h-9 text-xs rounded-lg border-border/70 bg-card w-full",
                    selectedCategoryId
                      ? "focus:ring-rose-500/40 focus:border-rose-500/50"
                      : "opacity-50 cursor-not-allowed"
                  )}>
                    <SelectValue
                      placeholder={
                        !selectedCategoryId
                          ? "Select a category first"
                          : isLoadingServices
                            ? "Loading services..."
                            : categoryServices.length === 0
                              ? "No services available"
                              : "Select a service…"
                      }
                    >
                      {selectedServiceId
                        ? (categoryServices.find((s) => s._id === selectedServiceId)?.name ?? "")
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoryServices.map((svc) => {
                      const rate = Math.round((svc.firstHourRate ?? svc.hourlyPrice ?? 0) * 1.2);
                      return (
                        <SelectItem key={svc._id} value={svc._id} className="text-xs">
                          <span className="flex items-center gap-2">
                            <span>{svc.name}</span>
                            <span className="text-muted-foreground font-normal">₹{rate}/hr</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-2 gap-3">

            {/* Address */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <MapPin className="size-3 text-rose-500" />
                  Location <span className="text-destructive ml-0.5">*</span>
                </Label>
                <button
                  type="button"
                  onClick={handleGps}
                  disabled={isLocating}
                  className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Crosshair className={cn("size-2.5", isLocating && "animate-spin")} />
                  <span>{isLocating ? "Locating..." : "GPS"}</span>
                </button>
              </div>
              <Input
                placeholder="Door / Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-9 text-xs rounded-lg"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <Phone className="size-3 text-rose-500" />
                Contact <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                placeholder="e.g. 9876543210"
                value={immediateContact}
                onChange={(e) => setImmediateContact(e.target.value)}
                className="h-9 text-xs rounded-lg"
                required
              />
            </div>

            {/* Access notes */}
            <div className="space-y-1.5 col-span-2">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Access Notes <span className="opacity-60 font-normal">(optional)</span>
              </Label>
              <Input
                placeholder="e.g. Gate code 1234, 3rd floor"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-rose-500 shrink-0" />
              <span>Direct Co-op · No Middleman</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={createBooking.isPending}
                className="h-8 px-3 rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createBooking.isPending || !selectedService}
                className="h-8 px-5 rounded-lg text-xs font-black bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-md shadow-rose-600/25 gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
              >
                {createBooking.isPending ? (
                  <>
                    <Zap className="size-3.5 animate-pulse" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-3.5" />
                    <span>Broadcast SOS</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencySosModal;
