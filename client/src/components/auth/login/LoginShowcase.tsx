import {
  Sparkles,
  Shield,
  CheckCircle2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LoginShowcase() {
  return (
    <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4">
      <div className="space-y-4">
        <Badge
          variant="outline"
          className="gap-1.5 px-3 py-1 text-xs font-semibold bg-primary/5 border-primary/20 text-primary rounded-full shadow-xs"
        >
          <Sparkles className="size-3.5" />
          Cooperative Gig Network
        </Badge>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          Welcome back to your trusted community.
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in to manage your active bookings, coordinate with verified cooperative
          workers, and access your personalized dashboard with seamless transparency.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/60 shadow-xs backdrop-blur-xs">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Shield className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-foreground">
              Verified & Vetted Network
            </h2>
            <p className="text-xs text-muted-foreground">
              Every guild member and artisan is authenticated with verified credentials.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/60 shadow-xs backdrop-blur-xs">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-foreground">
              Direct Fair-Trade Services
            </h2>
            <p className="text-xs text-muted-foreground">
              Zero middleman markup, ensuring competitive pricing and fair compensation.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/60 shadow-xs backdrop-blur-xs">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Users className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-foreground">
              Protected Escrow & Real-Time Tracking
            </h2>
            <p className="text-xs text-muted-foreground">
              Secure milestone releases and instant dispute arbitration when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Trust quote */}
      <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="size-4 text-emerald-500" />
        <span>256-bit encrypted data protection & verified privacy.</span>
      </div>
    </div>
  );
}
