import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkerWelcomeBannerProps {
  workerName: string;
}

export const WorkerWelcomeBanner: React.FC<WorkerWelcomeBannerProps> = ({
  workerName,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold gap-1"
            >
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Verified Cooperative Gig Worker
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome back, {workerName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Here is your daily dispatch summary. Keep your online toggle active to automatically receive nearby cooperative gig requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link to="/worker/jobs">
            <Button className="rounded-2xl h-10 px-4 text-xs font-semibold shadow-xs gap-1.5 cursor-pointer bg-primary text-primary-foreground">
              <Briefcase className="size-3.5" />
              <span>Available Gigs</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
          <Link to="/worker/bookings">
            <Button
              variant="outline"
              className="rounded-2xl h-10 px-4 text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Mission Control</span>
            </Button>
          </Link>
          <Link to="/worker/schedule">
            <Button
              variant="outline"
              className="rounded-2xl h-10 px-4 text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
            >
              <Calendar className="size-3.5 text-primary" />
              <span>Schedule</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerWelcomeBanner;
