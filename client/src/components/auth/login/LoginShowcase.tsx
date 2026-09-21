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
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-accent/10 border-accent/25 text-accent rounded-md shadow-xs"
        >
          <Sparkles className="size-3.5" />
          Cooperative Gig Network
        </Badge>

        <h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-foreground leading-tight">
          Welcome back to your trusted cooperative community.
        </h1>

        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Sign in to manage your active bookings, coordinate with verified cooperative
          workers, and access your personalized dashboard with complete transparency.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Shield className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-foreground">
              Verified & Vetted Network
            </h2>
            <p className="text-xs text-muted-foreground">
              Every guild member and artisan is authenticated with verified government and trade credentials.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-foreground">
              Direct Fair-Trade Tariffs
            </h2>
            <p className="text-xs text-muted-foreground">
              Zero middleman markup, ensuring standardized pricing and dignified floor wages.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Users className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-foreground">
              Community Health & Welfare Protection
            </h2>
            <p className="text-xs text-muted-foreground">
              Emergency health relief, trade insurance, and transparent cooperative oversight.
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
