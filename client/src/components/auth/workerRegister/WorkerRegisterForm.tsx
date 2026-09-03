import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Wrench,
  X,
  Building2,
  ArrowRight,
  Loader2,
  Clock,
  Briefcase,
  MapPin,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { workerRegister, getMe, getCooperatives } from "@/features/auth/api";
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
import type { CooperativeOption, WorkerRegisterPayload } from "@/features/auth/types";
import { cn } from "@/lib/utils";

// Categorized trade skills for the dropdown
const TRADE_SKILL_CATEGORIES = [
  {
    category: "Electrical & Technical",
    skills: ["Electrical", "HVAC Repair", "Appliance Repair", "Solar Installation", "Security Systems"],
  },
  {
    category: "Plumbing & Piping",
    skills: ["Plumbing", "Pipe Fitting", "Water Purifier Repair", "Drain Cleaning"],
  },
  {
    category: "Carpentry & Construction",
    skills: ["Carpentry", "Masonry", "Painting", "Tile & Flooring", "Roofing"],
  },
  {
    category: "Maintenance & Care",
    skills: ["Deep Cleaning", "Pest Control", "Locksmith", "Gardening", "Glass Repair"],
  },
];

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

export default function WorkerRegisterForm() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Check roles
  const userRoles: string[] = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof user?.role === "string"
    ? [user.role.toUpperCase()]
    : [];

  const isAlreadyWorker = userRoles.includes("WORKER");

  // Form states
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"Full-Time" | "Part-Time">("Full-Time");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(2);

  // Address
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  // Cooperative
  const [cooperativesList, setCooperativesList] = useState<CooperativeOption[]>(PRESET_COOPERATIVES);
  const [coopSelection, setCoopSelection] = useState<string>("none");
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

  const handleAddSkill = (skill: string) => {
    if (!skill) return;
    if (skills.includes(skill)) {
      toast.error(`"${skill}" is already added.`);
      return;
    }
    setSkills((prev) => [...prev, skill]);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (skills.length === 0) {
      toast.error("Please select at least one trade skill.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: WorkerRegisterPayload = {
        skills,
        availability,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        address: {
          city: city.trim() || undefined,
          state: stateName.trim() || undefined,
          pincode: pincode.trim() || undefined,
        },
      };

      if (coopSelection !== "none" && coopSelection) {
        payload.cooperativeId = coopSelection;
      }

      await workerRegister(payload);
      toast.success("Worker profile activated successfully!");

      try {
        const updated = await getMe();
        if (updated) setUser(updated);
      } catch {}

      navigate("/worker", { replace: true });
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

  // Auth & role checks
  if (!user) return <Navigate to="/login?redirect=/register/worker" replace />;
  if (isAlreadyWorker) return <Navigate to="/worker" replace />;

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
              <Wrench className="size-3 text-primary" />
              Pro Registration
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Complete Your Worker Profile
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select your skills and affiliation to begin accepting guaranteed fair-wage gigs.
          </p>
        </CardHeader>

        {/* Compact Form */}
        <CardContent className="px-5 sm:px-8 space-y-3.5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. Trade Skills */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Wrench className="size-3.5 text-primary" />
                  Primary Trade Skills <span className="text-destructive">*</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {skills.length} selected
                </span>
              </div>

              {/* Skills Dropdown */}
              <Select value="" onValueChange={(val) => { if (val) handleAddSkill(val); }}>
                <SelectTrigger className="w-full h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80 cursor-pointer">
                  <SelectValue placeholder="Add trade skills (e.g. Electrical, Plumbing)..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {TRADE_SKILL_CATEGORIES.map((cat) => (
                    <SelectGroup key={cat.category}>
                      <SelectLabel className="text-[10px] uppercase font-bold text-primary px-2 py-1">
                        {cat.category}
                      </SelectLabel>
                      {cat.skills.map((s) => {
                        const isSelected = skills.includes(s);
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

              {/* Selected Badges */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-xs py-1 px-2.5 rounded-lg gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
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

            {/* 2. Experience & Availability Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Experience */}
              <div className="space-y-1.5">
                <Label htmlFor="experience" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  Experience (Years)
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  max={50}
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Math.max(0, parseInt(e.target.value) || 0))}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
              </div>

              {/* Availability */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Briefcase className="size-3.5 text-muted-foreground" />
                  Availability Status
                </Label>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-input/20 border border-border/80 h-10">
                  <button
                    type="button"
                    onClick={() => setAvailability("Full-Time")}
                    className={cn(
                      "rounded-lg text-xs font-medium transition-all cursor-pointer",
                      availability === "Full-Time"
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Full-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvailability("Part-Time")}
                    className={cn(
                      "rounded-lg text-xs font-medium transition-all cursor-pointer",
                      availability === "Part-Time"
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Part-Time
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Cooperative Affiliation Dropdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-primary" />
                  Cooperative Affiliation
                </Label>
                <span className="text-[10px] text-muted-foreground">Optional</span>
              </div>
              <Select value={coopSelection} onValueChange={(val) => val && setCoopSelection(val)}>
                <SelectTrigger className="w-full h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80 cursor-pointer">
                  <SelectValue placeholder="Select affiliation status" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  <SelectItem value="none" className="text-xs py-2 cursor-pointer font-medium">
                    ⚡ Independent Pro (No Cooperative)
                  </SelectItem>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] text-primary uppercase font-bold px-2 py-1">
                      Registered Cooperatives
                    </SelectLabel>
                    {cooperativesList.map((c) => (
                      <SelectItem key={c._id} value={c._id} className="text-xs py-2 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{c.cooperativeName}</span>
                          {c.cooperativeAddress && (
                            <span className="text-[10px] text-muted-foreground">{c.cooperativeAddress}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Service Location (Single 3-column row) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Primary Location <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
                <Input
                  placeholder="State"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
                <Input
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={10}
                  className="h-10 rounded-xl text-xs sm:text-sm bg-input/20 border-border/80"
                />
              </div>
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
                  Activating Worker Profile...
                </>
              ) : (
                <>
                  Complete Worker Registration
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
