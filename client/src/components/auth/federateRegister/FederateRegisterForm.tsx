import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Landmark,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  Building2,
  ChevronRight,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import { federativeRegister, getMe, getCooperatives } from "@/features/auth/api";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FederativeRegisterPayload, CooperativeOption } from "@/features/auth/types";

const PRESET_COOPERATIVES: CooperativeOption[] = [
  {
    _id: "65f0a1b2c3d4e5f6a7b8c901",
    cooperativeName: "Metro Trades & Artisans Guild",
    cooperativeAddress: "Mumbai, Maharashtra",
  },
  {
    _id: "65f0a1b2c3d4e5f6a7b8c902",
    cooperativeName: "National Skilled Workers Alliance",
    cooperativeAddress: "Bengaluru, Karnataka",
  },
  {
    _id: "65f0a1b2c3d4e5f6a7b8c903",
    cooperativeName: "Urban Home Services Cooperative",
    cooperativeAddress: "Delhi NCR",
  },
  {
    _id: "65f0a1b2c3d4e5f6a7b8c904",
    cooperativeName: "Apex Technicians Collective",
    cooperativeAddress: "Pune, Maharashtra",
  },
];

export default function FederateRegisterForm() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Check roles
  const userRoles: string[] = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof user?.role === "string"
    ? [user.role.toUpperCase()]
    : [];

  const isAlreadyFederation = userRoles.includes("FEDERATION");

  // Form states
  const [federationName, setFederationName] = useState("");
  const [federationEmail, setFederationEmail] = useState("");
  const [federationPhone, setFederationPhone] = useState("");
  const [federationAddress, setFederationAddress] = useState("");
  const [federationDescription, setFederationDescription] = useState("");
  const [affiliatedCoopIds, setAffiliatedCoopIds] = useState<string[]>([]);

  // Cooperatives list
  const [cooperativesList, setCooperativesList] = useState<CooperativeOption[]>(PRESET_COOPERATIVES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCooperatives()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCooperativesList(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddCooperative = (coopId: string) => {
    if (!coopId) return;
    if (affiliatedCoopIds.includes(coopId)) {
      toast.error("Cooperative is already added.");
      return;
    }
    setAffiliatedCoopIds((prev) => [...prev, coopId]);
  };

  const handleRemoveCooperative = (coopIdToRemove: string) => {
    setAffiliatedCoopIds((prev) => prev.filter((id) => id !== coopIdToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!federationName.trim() || federationName.trim().length < 3) {
      toast.error("Please enter a valid federation name.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: FederativeRegisterPayload = {
        federativeName: federationName.trim(),
        federativeEmail: federationEmail.trim() || undefined,
        federativePhone: federationPhone.trim() || undefined,
        federativeAddress: federationAddress.trim() || undefined,
        federativeDescription: federationDescription.trim() || undefined,
        members: affiliatedCoopIds.length > 0 ? affiliatedCoopIds : undefined,
      };

      await federativeRegister(payload);
      toast.success("Apex Federation registered successfully!");

      try {
        const updated = await getMe();
        if (updated) setUser(updated);
      } catch {}

      navigate("/federation", { replace: true });
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

  if (!user) return <Navigate to="/login?redirect=/register/federation" replace />;
  if (isAlreadyFederation) return <Navigate to="/federation" replace />;

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
              <Landmark className="size-3 text-primary" />
              Apex Federation Onboarding
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Register an Apex Federation
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Form state or national apex unions to govern policy, wage standards, and worker welfare.
          </p>
        </CardHeader>

        {/* Compact Form Body */}
        <CardContent className="px-5 sm:px-8 space-y-3.5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Federation Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fedName" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <Landmark className="size-3.5 text-primary" />
                Apex Federation Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fedName"
                placeholder="e.g. National Apex Union of Skilled Trade Cooperatives"
                value={federationName}
                onChange={(e) => setFederationName(e.target.value)}
                required
                className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fedEmail" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Secretariat Email
                </Label>
                <Input
                  id="fedEmail"
                  type="email"
                  placeholder="secretariat@federation.coop"
                  value={federationEmail}
                  onChange={(e) => setFederationEmail(e.target.value)}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fedPhone" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Secretariat Phone
                </Label>
                <Input
                  id="fedPhone"
                  type="tel"
                  placeholder="+91 11 2345 6789"
                  value={federationPhone}
                  onChange={(e) => setFederationPhone(e.target.value)}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
              </div>
            </div>

            {/* Headquarters Address */}
            <div className="space-y-1.5">
              <Label htmlFor="fedAddress" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Apex Headquarters Address
              </Label>
              <Input
                id="fedAddress"
                placeholder="e.g. Cooperative Towers, Institutional Area, New Delhi"
                value={federationAddress}
                onChange={(e) => setFederationAddress(e.target.value)}
                className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
              />
            </div>

            {/* Charter Scope */}
            <div className="space-y-1.5">
              <Label htmlFor="fedDesc" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <FileText className="size-3.5 text-muted-foreground" />
                Charter & Jurisdiction Scope
              </Label>
              <Input
                id="fedDesc"
                placeholder="e.g. State-level regulatory oversight, welfare trusts, and minimum tariff enforcement"
                value={federationDescription}
                onChange={(e) => setFederationDescription(e.target.value)}
                className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
              />
            </div>

            {/* Affiliated Member Cooperatives */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-primary" />
                  Affiliated Member Cooperatives
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {affiliatedCoopIds.length} affiliated
                </span>
              </div>

              <Select value="" onValueChange={(val) => { if (val) handleAddCooperative(val); }}>
                <SelectTrigger className="w-full h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80 cursor-pointer">
                  <SelectValue placeholder="Add registered cooperative societies..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase font-bold text-primary px-2 py-1">
                      Registered Societies
                    </SelectLabel>
                    {cooperativesList.map((c) => {
                      const isAdded = affiliatedCoopIds.includes(c._id);
                      return (
                        <SelectItem
                          key={c._id}
                          value={c._id}
                          disabled={isAdded}
                          className="text-xs py-1.5 cursor-pointer"
                        >
                          {isAdded ? `✓ ${c.cooperativeName} (Added)` : c.cooperativeName}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {affiliatedCoopIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {affiliatedCoopIds.map((id) => {
                    const coop = cooperativesList.find((c) => c._id === id);
                    const name = coop ? coop.cooperativeName : "Cooperative Society";
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="text-xs py-1 px-2.5 rounded-lg gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all"
                      >
                        <span className="max-w-44 truncate">{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCooperative(id)}
                          className="hover:text-destructive transition-colors cursor-pointer"
                          title={`Remove ${name}`}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
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
                  Activating Apex Federation...
                </>
              ) : (
                <>
                  Complete Federation Registration
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
