import {
  Sparkles,
  Shield,
  CheckCircle2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RegisterShowcase() {
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
          Fair services powered by people, for people.
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Create your customer account to connect directly with skilled local
          workers and cooperative collectives. Transparent pricing, secure
          payments, and ethical community standards.
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
              Verified Cooperative Workers
            </h2>
            <p className="text-xs text-muted-foreground">
              Every artisan and technician is credentialed and vetted by their local guild.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/60 shadow-xs backdrop-blur-xs">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-foreground">
              Direct & Transparent Rates
            </h2>
            <p className="text-xs text-muted-foreground">
              Zero hidden middleman commissions. More earnings reach the service provider.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border/60 shadow-xs backdrop-blur-xs">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Users className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-semibold text-foreground">
              Community-Governed Trust
            </h2>
            <p className="text-xs text-muted-foreground">
              Backed by customer protection agreements and fair arbitration.
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
