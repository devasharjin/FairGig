import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Building2,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  Landmark,
  ChevronRight,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

import { cooperativeRegister, getMe, getFederations } from "@/features/auth/api";
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
import type { CooperativeRegisterPayload, FederationOption } from "@/features/auth/types";

// Categorized Services for the Select component
const SERVICE_CATEGORIES = [
  {
    category: "Electrical & Technical",
    services: [
      "Electrical Installations",
      "HVAC & Cooling Systems",
      "Solar & Renewable Energy",
      "Appliance Maintenance",
    ],
  },
  {
    category: "Plumbing & Piping",
    services: [
      "Plumbing & Sanitation",
      "Industrial Piping",
      "Water Treatment & Filtration",
    ],
  },
  {
    category: "Civil & Construction",
    services: [
      "Carpentry & Woodwork",
      "Commercial Painting",
      "Flooring & Tiling",
      "Masonry & Brickwork",
    ],
  },
  {
    category: "Facility & Operations",
    services: [
      "Deep Cleaning & Sanitization",
      "Pest Control Services",
      "Facility Management",
      "Logistics & Transport",
    ],
  },
];

const PRESET_FEDERATIONS: FederationOption[] = [
  {
    _id: "65f0a2c3d4e5f6a7b8c90101",
    federativeName: "National Apex Federation of Labour Cooperatives",
    federativeAddress: "New Delhi",
  },
  {
    _id: "65f0a2c3d4e5f6a7b8c90102",
    federativeName: "All-India Construction & Trades Guild Federation",
    federativeAddress: "Mumbai, Maharashtra",
  },
  {
    _id: "65f0a2c3d4e5f6a7b8c90103",
    federativeName: "Southern Regional Cooperative Workers Union",
    federativeAddress: "Bengaluru, Karnataka",
  },
];

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
  const [services, setServices] = useState<string[]>([]);

  // Federation
  const [federationsList, setFederationsList] = useState<FederationOption[]>(PRESET_FEDERATIONS);
  const [federationSelection, setFederationSelection] = useState<string>("none");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getFederations()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFederationsList(data);
        }
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddService = (service: string) => {
    if (!service) return;
    if (services.includes(service)) {
      toast.error(`"${service}" is already added.`);
      return;
    }
    setServices((prev) => [...prev, service]);
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices((prev) => prev.filter((s) => s !== serviceToRemove));
  };

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
        federationId: federationSelection !== "none" ? federationSelection : undefined,
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

            {/* Federation Affiliation Dropdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Landmark className="size-3.5 text-primary" />
                  Apex Federation Affiliation
                </Label>
                <span className="text-[10px] text-muted-foreground">Optional</span>
              </div>
              <Select value={federationSelection} onValueChange={(val) => val && setFederationSelection(val)}>
                <SelectTrigger className="w-full h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80 cursor-pointer">
                  <SelectValue placeholder="Select apex federation or independent" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  <SelectItem value="none" className="text-xs py-2 cursor-pointer font-medium">
                    ⚡ Independent Society (No Apex Federation)
                  </SelectItem>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] text-primary uppercase font-bold px-2 py-1">
                      Affiliated Federations
                    </SelectLabel>
                    {federationsList.map((f) => (
                      <SelectItem key={f._id} value={f._id} className="text-xs py-2 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{f.federativeName}</span>
                          {f.federativeAddress && (
                            <span className="text-[10px] text-muted-foreground">{f.federativeAddress}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Trade Services Offered */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  Core Trade Services Offered
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {services.length} selected
                </span>
              </div>

              <Select value="" onValueChange={(val) => { if (val) handleAddService(val); }}>
                <SelectTrigger className="w-full h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80 cursor-pointer">
                  <SelectValue placeholder="Add services offered by your members..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectGroup key={cat.category}>
                      <SelectLabel className="text-[10px] uppercase font-bold text-primary px-2 py-1">
                        {cat.category}
                      </SelectLabel>
                      {cat.services.map((s) => {
                        const isSelected = services.includes(s);
                        return (
                          <SelectItem
                            key={s}
                            value={s}
                            disabled={isSelected}
                            className="text-xs py-1.5 cursor-pointer"
                          >
                            {isSelected ? `✓ ${s}` : s}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>

              {services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {services.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-xs py-1 px-2.5 rounded-lg gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(s)}
                        className="hover:text-destructive transition-colors cursor-pointer"
                        title={`Remove ${s}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
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
