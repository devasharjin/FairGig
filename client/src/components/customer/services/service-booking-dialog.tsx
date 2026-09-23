import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Crown,
  Star,
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

export interface BookingPrefillData {
  address?: string;
  preferredDay?: string; // YYYY-MM-DD
  preferredTime?: string; // HH:mm
  notes?: string;
  bookingType?: BookingType;
  immediateContact?: string;
}

export interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: CustomerService | null;
  initialBookingType?: BookingType;
  initialData?: BookingPrefillData | null;
}

export const ServiceBookingDialog: React.FC<ServiceBookingDialogProps> = ({
  open,
  onOpenChange,
  service,
  initialBookingType = "SCHEDULED",
  initialData,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const createBooking = useCreateBooking();
  const { data: profileData } = useCustomerProfile();

  // Booking mode state: SCHEDULED | ON_DEMAND | EMERGENCY
  const [bookingType, setBookingType] = useState<BookingType>(initialBookingType);
  const [address, setAddress] = useState("");
  const [preferredDay, setPreferredDay] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");

  // Emergency specific state: immediate contact phone
  const [immediateContact, setImmediateContact] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Sync initial booking type & prefilled data when opening
  useEffect(() => {
    if (open) {
      if (initialData) {
        if (initialData.bookingType) setBookingType(initialData.bookingType);
        if (initialData.address) setAddress(initialData.address);
        if (initialData.preferredDay) setPreferredDay(initialData.preferredDay);
        if (initialData.preferredTime) setPreferredTime(initialData.preferredTime);
        if (initialData.notes) setNotes(initialData.notes);
        if (initialData.immediateContact) setImmediateContact(initialData.immediateContact);
      } else {
        setBookingType(initialBookingType);
      }
    }
  }, [open, initialBookingType, initialData]);

  // Pre-fill primary address & phone if available when opening dialog
  useEffect(() => {
    if (open) {
      if (!address && !initialData?.address) {
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
        setImmediateContact(user?.phone || profileData?.user?.phone || "");
      }
    }
  }, [open, profileData, user, address, immediateContact]);

  if (!service) return null;

  const isEmergency = bookingType === "EMERGENCY";
  const isPremium = bookingType === "PREMIUM" || (bookingType as string) === "ON_DEMAND";
  const isScheduled = bookingType === "SCHEDULED";

  // Surge rate multiplier: +15% for premium top-rated (>4.5★), +20% for emergency
  const rateMultiplier = isEmergency ? 1.20 : isPremium ? 1.15 : 1.0;
  const baseFirstHourRate = service.firstHourRate ?? service.hourlyPrice ?? 0;
  const baseAdditionalHourRate = service.additionalHourRate ?? service.firstHourRate ?? service.hourlyPrice ?? 0;

  const firstHourRate = Math.round(baseFirstHourRate * rateMultiplier);
  const additionalHourRate = Math.round(baseAdditionalHourRate * rateMultiplier);
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
        scheduledDate: (isScheduled || isPremium) && preferredDay
          ? new Date(`${preferredDay}T${preferredTime || "09:00"}`).toISOString()
          : new Date().toISOString(),
        customerNotes: notes.trim(),
        bookingType: isPremium ? "PREMIUM" : bookingType,
        isEmergency,
        urgencyLevel: isEmergency ? "CRITICAL" : isPremium ? "HIGH" : "STANDARD",
        emergencyDetails: isEmergency
          ? {
            immediateContact: immediateContact.trim(),
            notes: notes.trim(),
          }
          : undefined,
      });

      setAddress("");
      setPreferredDay("");
      setPreferredTime("");
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
          "max-w-xl rounded-2xl p-0 border shadow-2xl bg-card overflow-y-auto max-h-[92vh] sm:overflow-visible sm:max-h-none transition-all gap-0",
          isEmergency
            ? "border-rose-500/40 shadow-rose-500/10"
            : isPremium
              ? "border-amber-500/30 shadow-amber-500/10"
              : "border-border/80"
        )}
      >
        {/* ── Header ─────────────────────────────── */}
        <div
          className={cn(
            "px-6 pt-6 pb-4 border-b",
            isEmergency
              ? "border-rose-500/20 bg-rose-500/[0.04]"
              : isPremium
                ? "border-amber-500/20 bg-amber-500/[0.04]"
                : "border-border/60 bg-muted/20"
          )}
        >
          <DialogHeader>
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl shrink-0 transition-all mt-0.5",
                  isEmergency
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    : isPremium
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-primary/10 text-primary"
                )}
              >
                {isEmergency ? (
                  <AlertTriangle className="size-5 animate-pulse" />
                ) : isPremium ? (
                  <Crown className="size-5" />
                ) : (
                  <Sparkles className="size-4.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-bold text-foreground leading-snug flex items-center gap-2 flex-wrap">
                  <span className="truncate">
                    {t(`services.trades.${service.name.toLowerCase().replace(/\s+/g, "_")}`, { defaultValue: service.name })}
                  </span>
                  {isEmergency && (
                    <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-wider py-0.5 px-2 animate-pulse shrink-0">
                      SOS
                    </Badge>
                  )}
                  {isPremium && (
                    <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold py-0.5 px-2 shrink-0 flex items-center gap-1">
                      <Star className="size-2.5 fill-amber-500 text-amber-500" />
                      {t("bookingDialog.premium")} (&gt;4.5★)
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {categoryName} · {t("nav.cooperativePlatform")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Body ───────────────────────────────── */}
        <div className={cn(isEmergency ? "px-5 py-2.5 space-y-2.5" : "px-6 py-5 space-y-5")}>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-muted/50 border border-border/50">
            <button
              type="button"
              onClick={() => setBookingType("SCHEDULED")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isScheduled
                  ? "bg-card text-foreground shadow-sm border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="size-3.5 shrink-0" />
              <span>{t("bookingDialog.scheduled")}</span>
            </button>
            <button
              type="button"
              onClick={() => setBookingType("PREMIUM")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isPremium
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-amber-500/5"
              )}
            >
              <Crown className="size-3.5 text-amber-500 shrink-0" />
              <span>{t("bookingDialog.premium")}</span>
            </button>
            <button
              type="button"
              onClick={() => setBookingType("EMERGENCY")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isEmergency
                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-rose-500/5"
              )}
            >
              <AlertTriangle className="size-3.5 text-rose-500 shrink-0" />
              <span>{t("bookingDialog.emergency")}</span>
            </button>
          </div>

          {/* Mode Notice — only for premium; emergency notice lives in header */}
          {isPremium && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200">
              <Star className="size-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-1.5">
                  {t("bookingDialog.topRatedTitle")}
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded border border-amber-500/30">&gt; 4.5★</span>
                </p>
                <p className="leading-relaxed text-[11px] text-amber-700 dark:text-amber-300">
                  {t("bookingDialog.topRatedDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Pricing — compact inline row */}
          <div className="rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{t("bookingDialog.pricingEstimate")}</span>
                {isPremium && (
                  <Badge variant="outline" className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 py-0 px-2 flex items-center gap-1">
                    <Star className="size-2.5 fill-amber-500 text-amber-500" />
                    {t("bookingDialog.topRatedSurge")}
                  </Badge>
                )}
                {isEmergency && (
                  <Badge variant="destructive" className="text-[10px] font-bold bg-rose-600 text-white py-0 px-2">
                    {t("bookingDialog.emergencySurgeBadge")}
                  </Badge>
                )}
                {isScheduled && (
                  <Badge variant="secondary" className="text-[10px] font-medium text-muted-foreground py-0 px-2">
                    {t("bookingDialog.standardRateBadge")}
                  </Badge>
                )}
              </div>
              <span className="text-2xl font-extrabold text-primary leading-none">₹{estimatedInitialTotal}</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border/40 text-center text-[11px]">
              <div className="px-2 py-2">
                <p className="text-muted-foreground">{t("bookingDialog.firstHour")}</p>
                <p className="font-bold text-foreground mt-0.5">₹{firstHourRate}</p>
                {rateMultiplier !== 1.0 && (
                  <p className="text-[9px] text-muted-foreground line-through">₹{baseFirstHourRate}</p>
                )}
              </div>
              <div className="px-2 py-2">
                <p className="text-muted-foreground">{t("bookingDialog.addHour")}</p>
                <p className="font-bold text-foreground mt-0.5">₹{additionalHourRate}</p>
                {rateMultiplier !== 1.0 && (
                  <p className="text-[9px] text-muted-foreground line-through">₹{baseAdditionalHourRate}</p>
                )}
              </div>
              <div className="px-2 py-2">
                <p className="text-muted-foreground">{t("bookingDialog.transport")}</p>
                <p className="font-bold text-foreground mt-0.5">₹{transportFee}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={cn("space-y-3", !isEmergency && "space-y-4")}>

            {/* Emergency Contact Field */}
            {isEmergency && (
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.03] p-3 space-y-1.5">
                <Label className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="size-3" /> {t("bookingDialog.emergencyContactLabel")}
                </Label>
                <Input
                  placeholder={t("bookingDialog.emergencyContactPlaceholder")}
                  value={immediateContact}
                  onChange={(e) => setImmediateContact(e.target.value)}
                  className="h-9 text-xs rounded-lg border-rose-500/30 bg-card"
                  required={isEmergency}
                />
              </div>
            )}

            {/* Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="req-address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  {t("bookingDialog.deliveryAddress")} <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Crosshair className={cn("size-3", isLocating && "animate-spin")} />
                  {isLocating ? t("bookingDialog.locating") : t("bookingDialog.useGps")}
                </button>
              </div>

              {savedAddresses.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {savedAddresses.map((addr) => {
                    const addrFull = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
                    const isSelected = address === addrFull;
                    const Icon = addr.title?.toLowerCase() === "work" ? Building : Home;
                    return (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() => setAddress(addrFull)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer",
                          isSelected
                            ? "bg-primary/12 text-primary border-primary/35 shadow-xs"
                            : "bg-muted/40 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="size-3" />
                        {addr.title || "Address"}
                      </button>
                    );
                  })}
                </div>
              )}

              <Input
                id="req-address"
                placeholder={t("bookingDialog.addressPlaceholder")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={createBooking.isPending}
                className="h-9 text-sm rounded-lg"
                required
              />
            </div>

            {/* Date & Time — two separate pickers (Scheduled & Premium) */}
            {(isScheduled || isPremium) && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  {t("bookingDialog.preferredDateTime")}
                  <span className="text-muted-foreground font-normal">({t("common.optional")})</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Date picker */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t("bookingDialog.dateLabel")}</p>
                    <Input
                      id="req-date"
                      type="date"
                      value={preferredDay}
                      onChange={(e) => setPreferredDay(e.target.value)}
                      disabled={createBooking.isPending}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                  {/* Time picker */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t("bookingDialog.timeLabel")}</p>
                    <Input
                      id="req-time"
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      disabled={createBooking.isPending || !preferredDay}
                      className="h-9 text-xs rounded-lg disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="req-notes" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                {isEmergency ? t("bookingDialog.hazardDesc") : t("bookingDialog.accessNotes")}{" "}
                {!isEmergency && <span className="text-muted-foreground font-normal">({t("common.optional")})</span>}
              </Label>
              <textarea
                id="req-notes"
                rows={2}
                placeholder={
                  isEmergency
                    ? t("bookingDialog.hazardPlaceholder")
                    : t("bookingDialog.standardNotesPlaceholder")
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={createBooking.isPending}
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted/20 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50 transition resize-none"
              />
            </div>

            {/* Trust line — hidden in emergency to save height */}
            {!isEmergency && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0 text-primary" />
                <span>{t("bookingDialog.trustGuaranteeLine")}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={createBooking.isPending}
                className="h-9 px-4 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 hover:bg-muted transition-all cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className={cn(
                  "h-9 px-6 rounded-lg text-xs font-bold cursor-pointer shadow-sm text-white gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]",
                  isEmergency
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/25"
                    : isPremium
                      ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                      : "bg-primary hover:bg-primary/90 shadow-primary/20"
                )}
              >
                {createBooking.isPending ? (
                  t("bookingDialog.processing")
                ) : isEmergency ? (
                  <><AlertTriangle className="size-3.5" /><span>{t("bookingDialog.broadcastSos")}</span></>
                ) : isPremium ? (
                  <><Crown className="size-3.5" /><span>{t("bookingDialog.bookPremium")}</span></>
                ) : (
                  t("bookingDialog.confirmBooking")
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingDialog;

