import React from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CooperativeDetailsStepProps {
  cooperativeName: string;
  setCooperativeName: (name: string) => void;
  cooperativeEmail: string;
  setCooperativeEmail: (email: string) => void;
  cooperativePhone: string;
  setCooperativePhone: (phone: string) => void;
  cooperativeAddress: string;
  setCooperativeAddress: (addr: string) => void;
  onNext: () => void;
}

export const CooperativeDetailsStep: React.FC<CooperativeDetailsStepProps> = ({
  cooperativeName,
  setCooperativeName,
  cooperativeEmail,
  setCooperativeEmail,
  cooperativePhone,
  setCooperativePhone,
  cooperativeAddress,
  setCooperativeAddress,
  onNext,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Society Name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="coopName"
          className="text-xs font-semibold text-foreground flex items-center gap-1.5"
        >
          <Building2 className="size-3.5 text-primary" />
          Cooperative Legal Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="coopName"
          placeholder="e.g. Apex Artisans & Tradesmen Cooperative Society"
          value={cooperativeName}
          onChange={(e) => setCooperativeName(e.target.value)}
          required
          className="h-10 rounded-xl text-xs sm:text-sm bg-background border-border/80 focus-visible:ring-primary/20"
        />
        <p className="text-[11px] text-muted-foreground">
          Enter the official society name registered with the state cooperative department.
        </p>
      </div>

      <Separator className="bg-border/60 my-1" />

      {/* 3. Email & Phone Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="coopEmail"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Mail className="size-3.5 text-primary" />
            Official Society Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="coopEmail"
            type="email"
            placeholder="office@cooperative.org"
            value={cooperativeEmail}
            onChange={(e) => setCooperativeEmail(e.target.value)}
            required
            className="h-10 rounded-xl text-xs sm:text-sm bg-background border-border/80 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="coopPhone"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Phone className="size-3.5 text-primary" />
            Official Contact Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="coopPhone"
            type="tel"
            placeholder="+91 98765 43210"
            value={cooperativePhone}
            onChange={(e) => setCooperativePhone(e.target.value)}
            required
            className="h-10 rounded-xl text-xs sm:text-sm bg-background border-border/80 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* 4. Registered Office Address */}
      <div className="space-y-1.5">
        <Label
          htmlFor="coopAddress"
          className="text-xs font-semibold text-foreground flex items-center gap-1.5"
        >
          <MapPin className="size-3.5 text-primary" />
          Registered Office Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="coopAddress"
          placeholder="e.g. Sahakar Bhavan, Civil Lines, Sector 5, Pune, Maharashtra - 411001"
          value={cooperativeAddress}
          onChange={(e) => setCooperativeAddress(e.target.value)}
          required
          className="h-10 rounded-xl text-xs sm:text-sm bg-background border-border/80 focus-visible:ring-primary/20"
        />
      </div>

      {/* Step 1 Action Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={onNext}
          className="w-full h-11 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer active:scale-98"
        >
          Continue to Verification Documents
          <ArrowRight className="size-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
