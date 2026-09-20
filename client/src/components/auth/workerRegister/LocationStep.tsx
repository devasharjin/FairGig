import React from "react";
import {
  Compass,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationStepProps {
  address: string;
  onAddressChange: (val: string) => void;
  city: string;
  onCityChange: (val: string) => void;
  stateName: string;
  onStateNameChange: (val: string) => void;
  pincode: string;
  onPincodeChange: (val: string) => void;
  latitude?: number;
  longitude?: number;
  isDetectingLocation: boolean;
  onDetectLocation: () => void;
  onBack: () => void;
  onNext: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  address,
  onAddressChange,
  city,
  onCityChange,
  stateName,
  onStateNameChange,
  pincode,
  onPincodeChange,
  latitude,
  longitude,
  isDetectingLocation,
  onDetectLocation,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Auto GPS Detection Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-primary/5 border border-primary/15 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Compass className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Auto-Detect GPS Location
            </p>
            <p className="text-[11px] text-muted-foreground">
              {latitude && longitude
                ? `Lat: ${latitude}, Long: ${longitude}`
                : "Lock your operational base coordinates with one tap."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDetectLocation}
          disabled={isDetectingLocation}
          className="rounded-xl text-xs gap-1.5 h-8 border-primary/30 shrink-0 cursor-pointer"
        >
          {isDetectingLocation ? (
            <Loader2 className="size-3.5 animate-spin text-primary" />
          ) : latitude && longitude ? (
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          ) : (
            <Compass className="size-3.5 text-primary" />
          )}
          {latitude && longitude ? "GPS Verified" : "Detect GPS"}
        </Button>
      </div>

      {/* Street Address */}
      <div className="space-y-1.5">
        <Label
          htmlFor="address"
          className="text-xs font-bold text-foreground"
        >
          Street Address / Workshop Locality <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="e.g. 12 Artisans Road, Industrial Estate"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          required
          className="h-11 rounded-2xl bg-input/20 border-border/80 text-sm"
        />
      </div>

      {/* City, State, Pincode in 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs font-bold text-foreground">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="e.g. Mumbai"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            required
            className="h-11 rounded-2xl bg-input/20 border-border/80 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-xs font-bold text-foreground">
            State <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            type="text"
            placeholder="e.g. Maharashtra"
            value={stateName}
            onChange={(e) => onStateNameChange(e.target.value)}
            required
            className="h-11 rounded-2xl bg-input/20 border-border/80 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pincode" className="text-xs font-bold text-foreground">
            Postal Pincode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pincode"
            type="text"
            maxLength={10}
            placeholder="e.g. 400001"
            value={pincode}
            onChange={(e) => onPincodeChange(e.target.value)}
            required
            className="h-11 rounded-2xl bg-input/20 border-border/80 text-sm"
          />
        </div>
      </div>

      {/* Back and Continue Navigation */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 px-5 rounded-2xl text-sm font-medium border-border/80 gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="flex-1 h-11 rounded-2xl text-sm font-semibold shadow-md shadow-primary/10 gap-2 cursor-pointer"
        >
          Continue to Document Upload
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
