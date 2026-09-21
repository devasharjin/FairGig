import React from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScheduleHeaderProps {
  activeTab: "selected" | "upcoming" | "all";
  onSelectToday: () => void;
  onSelectUpcoming: () => void;
  upcomingCount: number;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  activeTab,
  onSelectToday,
  onSelectUpcoming,
  upcomingCount,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold gap-1"
            >
              <CalendarIcon className="size-3.5" />
              Shift & Field Agenda
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Work Schedule
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Track your upcoming appointments, organize your daily field itinerary, and preview guaranteed cooperative earnings.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={activeTab === "selected" ? "default" : "outline"}
            size="sm"
            onClick={onSelectToday}
            className="rounded-lg text-xs font-semibold cursor-pointer"
          >
            Today
          </Button>
          <Button
            variant={activeTab === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={onSelectUpcoming}
            className="rounded-lg text-xs font-semibold cursor-pointer"
          >
            All Upcoming ({upcomingCount})
          </Button>
          <Link to="/worker/jobs">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              Find Gigs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScheduleHeader;
