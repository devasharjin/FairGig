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
import { useCustomerServices } from "@/features/customer/services/hooks";
import { useCreateBooking } from "@/features/customer/bookings/hooks";
import { useCustomerProfile } from "@/features/customer/profile/hooks";
import { useAuthStore } from "@/features/auth/store";
import type { CustomerService } from "@/features/customer/services/types";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface EmergencySosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: services = [], isLoading: isLoadingServices } = useCustomerServices({ isActive: true });
  const { data: profileData } = useCustomerProfile();
  const createBooking = useCreateBooking();

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [address, setAddress] = useState("");
  const [immediateContact, setImmediateContact] = useState("");
  const [notes, setNotes] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Auto-select first service when services load
  useEffect(() => {
    if (services.length > 0) {
      const exists = services.some((s) => s._id === selectedServiceId);
      if (!exists) setSelectedServiceId(services[0]._id);
    }
  }, [services, selectedServiceId]);

  const selectedService: CustomerService | undefined = useMemo(
    () => services.find((s) => s._id === selectedServiceId) ?? services[0],
    [services, selectedServiceId]
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
      const createdBooking = await createBooking.mutateAsync({
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

      // Dispatch real-time emergency alert directly to all active workers
      try {
        const socket = getSocket();
        socket.emit("emergency:dispatched", {
          bookingId: (createdBooking as any)?._id,
          bookingNumber: (createdBooking as any)?.bookingNumber,
          serviceName: selectedService.name,
          categoryName: (selectedService as any)?.category?.name || "Emergency Service",
          rate: emergencyRate,
          totalAmount: estimatedTotal,
          address: { street: address.trim() },
          immediateContact: immediateContact.trim(),
          urgencyLevel: "CRITICAL",
          timestamp: new Date().toISOString(),
        });
      } catch (socketErr) {
        console.warn("Client emergency socket dispatch failed:", socketErr);
      }

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
                    {t("emergencyModal.title")}
                  </DialogTitle>
                  <Badge className="bg-white/20 border-0 text-white text-[9px] font-black uppercase tracking-wider py-0 px-1.5">
                    {t("emergencyModal.priority")}
                  </Badge>
                </div>
                <DialogDescription className="text-[11px] text-rose-100/75 mt-0">
                  {t("emergencyModal.subtitle")}
                </DialogDescription>
              </div>
              {selectedService && (
                <div className="text-right shrink-0 relative z-10">
                  <p className="text-[9px] text-rose-200/70 font-medium leading-none mb-0.5">
                    {t("emergencyModal.estFirstHr")}
                  </p>
                  <p className="text-xl font-black text-white leading-none">₹{estimatedTotal}</p>
                  <p className="text-[9px] text-rose-200/60">{t("emergencyModal.surgeText")}</p>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* ── Body ────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 space-y-4">

          {/* Direct Service Selection Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Wrench className="size-3.5 text-rose-500" />
                <span>{t("emergencyModal.selectServiceLabel")}</span>
                <span className="text-rose-500 font-bold">*</span>
              </Label>
              {selectedService && (
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {typeof selectedService.category === "object" && selectedService.category !== null
                    ? (selectedService.category as any).name
                    : "Emergency Ready"}
                </span>
              )}
            </div>

            <Select
              value={selectedServiceId}
              onValueChange={(val) => val && setSelectedServiceId(val)}
              disabled={isLoadingServices || services.length === 0}
            >
              <SelectTrigger className="h-10 text-xs rounded-xl border-border/70 bg-card hover:border-rose-500/50 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 w-full transition-all">
                <SelectValue
                  placeholder={
                    isLoadingServices
                      ? t("common.loading")
                      : services.length === 0
                        ? t("home.showcase.noServices")
                        : t("emergencyModal.servicePlaceholder")
                  }
                >
                  {selectedService ? selectedService.name : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl">
                {services.map((svc) => {
                  const catName =
                    typeof svc.category === "object" && svc.category !== null
                      ? (svc.category as any).name
                      : undefined;
                  const rate = Math.round((svc.firstHourRate ?? svc.hourlyPrice ?? 0) * 1.2);
                  return (
                    <SelectItem key={svc._id} value={svc._id} className="text-xs cursor-pointer py-2">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span className="font-semibold text-foreground">{svc.name}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground ml-auto shrink-0">
                          {catName && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50">
                              {catName}
                            </span>
                          )}
                          <span className="font-bold text-rose-600 dark:text-rose-400">₹{rate}/hr</span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-2 gap-3">

            {/* Address */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <MapPin className="size-3 text-rose-500" />
                  {t("emergencyModal.locationLabel")} <span className="text-destructive ml-0.5">*</span>
                </Label>
                <button
                  type="button"
                  onClick={handleGps}
                  disabled={isLocating}
                  className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Crosshair className={cn("size-2.5", isLocating && "animate-spin")} />
                  <span>{isLocating ? t("emergencyModal.locating") : t("emergencyModal.gpsButton")}</span>
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
                {t("emergencyModal.contactLabel")} <span className="text-destructive ml-0.5">*</span>
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
                {t("emergencyModal.notesLabel")} <span className="opacity-60 font-normal">{t("emergencyModal.optional")}</span>
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
              <span>{t("emergencyModal.directCoop")}</span>
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
                {t("common.cancel")}
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
                    <span>{t("emergencyModal.broadcasting")}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-3.5" />
                    <span>{t("emergencyModal.broadcastSos")}</span>
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
