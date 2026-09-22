import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Briefcase,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

import { loginUser, getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { getRoleDashboardPath } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field touched states
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!email.trim() || !isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Welcome back! Logging you in...");

      // Determine user object
      let userToSet = res?.user;
      if (!userToSet) {
        try {
          userToSet = await getMe();
        } catch {
          // fallback
        }
      }

      if (userToSet) {
        setUser(userToSet);
      }

      // Redirect to the redirect query param if provided, otherwise default role dashboard
      const redirectUrl = searchParams.get("redirect");
      const role = userToSet?.role;
      const targetPath = (redirectUrl && redirectUrl.startsWith("/"))
        ? redirectUrl
        : getRoleDashboardPath(role);
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-7 w-full max-w-lg mx-auto lg:max-w-none">
      <Card className="border border-border/80 bg-card shadow-lg rounded-xl overflow-hidden transition-all">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="rounded-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase gap-1 bg-accent/10 text-accent border-accent/25"
            >
              <Sparkles className="size-3" />
              Sign In
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">Account Login</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Enter your credentials to access your cooperative portal</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground/85">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                {touched.email && isEmailValid && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="size-3" /> Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="alex@example.com"
                  required
                  autoComplete="email"
                  className={`h-10 pl-9 pr-3 rounded-lg text-sm transition-all ${
                    touched.email && !isEmailValid
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""
                  }`}
                />
              </div>
              {touched.email && !isEmailValid && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3" />
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/85">
                  Password <span className="text-destructive">*</span>
                </Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="size-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className={`h-10 pl-9 pr-9 rounded-lg text-sm transition-all ${
                    touched.password && !isPasswordValid
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {touched.password && !isPasswordValid && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3" />
                  Password is required.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg text-sm font-semibold shadow-xs hover:bg-primary/90 transition-all cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Signing you in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <Separator className="bg-border/60" />

        {/* Card Footer: Sign Up & Alternate Portals */}
        <CardFooter className="flex flex-col gap-4 pb-2">
          <p className="text-xs text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
            >
              Create an account
            </Link>
          </p>

          {/* Alternative Portal Selector */}
          <div className="w-full p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-muted-foreground text-center sm:text-left">
              <Briefcase className="size-3.5 text-primary shrink-0" />
              <span>Looking to offer services or register an org?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/register/worker"
                className="px-2.5 py-1 rounded-lg bg-background hover:bg-muted border border-border/60 text-foreground font-medium text-[11px] transition-colors"
              >
                Worker
              </Link>
              <Link
                to="/register/cooperative"
                className="px-2.5 py-1 rounded-lg bg-background hover:bg-muted border border-border/60 text-foreground font-medium text-[11px] transition-colors"
              >
                Cooperative
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
