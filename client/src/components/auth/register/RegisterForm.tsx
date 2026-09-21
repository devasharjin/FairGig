import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { customerRegister, getMe } from "@/features/auth/api";
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

export default function RegisterForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation helper
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Minimalist password strength calculator
  const getStrengthScore = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strengthScore = getStrengthScore();
  const strengthText = ["Weak", "Fair", "Good", "Strong"][Math.max(0, strengthScore - 1)] || "Weak";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await customerRegister({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      toast.success("Account created successfully!");

      try {
        const userProfile = await getMe();
        if (userProfile) {
          setUser(userProfile);
        }
      } catch {
        // Fallback
      }

      navigate("/dashboard/customer", { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-7 w-full max-w-lg mx-auto lg:max-w-none">
      <Card className="border border-border/70 bg-card/85 shadow-2xl backdrop-blur-xl rounded-xl overflow-hidden transition-all">
        {/* Header - responsive padding & typography */}
        <CardHeader className="space-y-1.5 sm:space-y-2 pb-3 pt-6 sm:pt-8 px-4 sm:px-7 md:px-9">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase gap-1.5"
            >
              <Sparkles className="size-3 text-primary" />
              Customer Registration
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Join FairGig to book verified, cooperative-backed trade experts with transparent fair wages.
          </p>
        </CardHeader>

        {/* Form Content - responsive touch-friendly inputs */}
        <CardContent className="px-4 sm:px-7 md:px-9 space-y-3.5 sm:space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                required
                className="h-11 rounded-xl text-base sm:text-sm bg-input/20 border-border/80 focus-visible:ring-primary/20"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="h-11 rounded-xl text-base sm:text-sm bg-input/20 border-border/80 focus-visible:ring-primary/20"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  maxLength={20}
                  className="h-11 rounded-xl text-base sm:text-sm bg-input/20 border-border/80 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    className="h-11 pr-11 rounded-xl text-base sm:text-sm bg-input/20 border-border/80 focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold text-foreground/85 flex items-center gap-1.5"
                >
                  <Lock className="size-3.5 text-muted-foreground" />
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="h-11 pr-11 rounded-xl text-base sm:text-sm bg-input/20 border-border/80 focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="flex-1 grid grid-cols-4 gap-1.5 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-full transition-all duration-300 ${
                        strengthScore >= level
                          ? strengthScore <= 1
                            ? "bg-destructive"
                            : strengthScore <= 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                  {strengthText}
                </span>
              </div>
            )}

            {/* Terms notice */}
            <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
              By creating an account, you agree to our{" "}
              <span className="text-foreground underline underline-offset-2 hover:text-primary cursor-pointer transition-colors">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-foreground underline underline-offset-2 hover:text-primary cursor-pointer transition-colors">
                Privacy Policy
              </span>
              .
            </p>

            {/* Submit Action Button with mobile touch target */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-11 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer active:scale-98 touch-manipulation mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Customer Account
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <Separator className="bg-border/50 my-1.5" />

        {/* Footer: Sign in link + Mobile-Friendly Grid Alternate Portals */}
        <CardFooter className="flex flex-col gap-3 px-4 sm:px-7 md:px-9 pb-5 sm:pb-6 pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
