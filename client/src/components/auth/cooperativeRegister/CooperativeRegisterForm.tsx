import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { cooperativeRegister, getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { CooperativeRegisterPayload } from "@/features/auth/types";



export default function CooperativeRegisterForm() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Check roles
  const userRoles: string[] = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof user?.role === "string"
      ? [user.role.toUpperCase()]
      : [];

  const isAlreadyCooperative = userRoles.includes("COOPERATIVE");

  // Form states
  const [cooperativeName, setCooperativeName] = useState("");
  const [cooperativeEmail, setCooperativeEmail] = useState("");
  const [cooperativePhone, setCooperativePhone] = useState("");
  const [cooperativeAddress, setCooperativeAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cooperativeName.trim() || cooperativeName.trim().length < 3) {
      toast.error("Please enter a valid cooperative society name.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CooperativeRegisterPayload = {
        cooperativeName: cooperativeName.trim(),
        cooperativeEmail: cooperativeEmail.trim() || undefined,
        cooperativePhone: cooperativePhone.trim() || undefined,
        cooperativeAddress: cooperativeAddress.trim() || undefined,
      };

      await cooperativeRegister(payload);
      toast.success("Cooperative society registered successfully!");

      try {
        const updated = await getMe();
        if (updated) setUser(updated);
      } catch { }

      navigate("/cooperative", { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <Navigate to="/login?redirect=/register/cooperative" replace />;
  if (isAlreadyCooperative) return <Navigate to="/cooperative" replace />;

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border border-border/70 bg-card/90 shadow-2xl backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden transition-all">
        {/* Header */}
        <CardHeader className="space-y-1.5 pb-3 pt-6 sm:pt-7 px-5 sm:px-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider gap-1.5"
            >
              <Building2 className="size-3 text-primary" />
              Society Onboarding
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Register a Cooperative Society
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unite skilled tradesmen under a registered cooperative to bid collectively on contracts.
          </p>
        </CardHeader>

        {/* Compact Form Body */}
        <CardContent className="px-5 sm:px-8 space-y-3.5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Cooperative Legal Name */}
            <div className="space-y-1.5">
              <Label htmlFor="coopName" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                Cooperative Legal Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="coopName"
                placeholder="e.g. Maharashtra Artisans Cooperative Society"
                value={cooperativeName}
                onChange={(e) => setCooperativeName(e.target.value)}
                required
                className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="coopEmail" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Official Email
                </Label>
                <Input
                  id="coopEmail"
                  type="email"
                  placeholder="contact@coop.org"
                  value={cooperativeEmail}
                  onChange={(e) => setCooperativeEmail(e.target.value)}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="coopPhone" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Contact Phone
                </Label>
                <Input
                  id="coopPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={cooperativePhone}
                  onChange={(e) => setCooperativePhone(e.target.value)}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
              </div>
            </div>

            {/* Registered Address */}
            <div className="space-y-1.5">
              <Label htmlFor="coopAddress" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Registered Address
              </Label>
              <Input
                id="coopAddress"
                placeholder="e.g. Cooperative Bhavan, Nariman Point, Mumbai"
                value={cooperativeAddress}
                onChange={(e) => setCooperativeAddress(e.target.value)}
                className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
              />
            </div>



            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer mt-2 active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Activating Society Profile...
                </>
              ) : (
                <>
                  Complete Cooperative Registration
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <Separator className="bg-border/50 my-1" />

        {/* Footer */}
        <CardFooter className="flex items-center justify-between px-5 sm:px-8 py-3.5 text-xs text-muted-foreground">
          <span>Need to switch account?</span>
          <Link
            to="/login"
            className="font-medium text-primary hover:underline inline-flex items-center gap-1 transition-colors"
          >
            Sign in
            <ChevronRight className="size-3" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
