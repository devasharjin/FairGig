import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  Sun,
  Sunset,
  Moon,
  Sparkles,
} from "lucide-react";
import { useWorkerJobs } from "@/features/worker/gigs/hooks";
import { Button } from "@/components/ui/button";
import { ScheduleHeader } from "@/components/worker/schedule/ScheduleHeader";
import {
  DateStripCarousel,
  type DateStripDay,
} from "@/components/worker/schedule/DateStripCarousel";
import { DailyWorkloadHud } from "@/components/worker/schedule/DailyWorkloadHud";
import { ScheduleJobCard } from "@/components/worker/schedule/ScheduleJobCard";
import { SmartShiftAdviceCard } from "@/components/worker/schedule/SmartShiftAdviceCard";

// Helper: Format date to YYYY-MM-DD in local time
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: Check if date string matches target YYYY-MM-DD
function isSameDay(dateStr: string, targetDateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return getLocalDateString(d) === targetDateStr;
}

// Helper: Determine time slot
function getTimeSlot(dateStr: string): "morning" | "afternoon" | "evening" {
  const d = new Date(dateStr);
  const hours = d.getHours();
  if (hours < 12) return "morning";
  if (hours < 17) return "afternoon";
  return "evening";
}

export const WorkerSchedule: React.FC = () => {
  const { data: jobs = [], isLoading } = useWorkerJobs();

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => getLocalDateString(today), [today]);

  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [activeFilterTab, setActiveFilterTab] = useState<
    "selected" | "upcoming" | "all"
  >("selected");

  // Generate next 14 days for the horizontal date strip
  const dateStrip = useMemo<DateStripDay[]>(() => {
    const days: DateStripDay[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const str = getLocalDateString(d);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });

      // Count non-cancelled jobs on this day
      const jobCount = jobs.filter(
        (j) => j.status !== "CANCELLED" && isSameDay(j.scheduledDate, str)
      ).length;

      days.push({
        date: d,
        dateStr: str,
        dayName,
        dayNumber,
        monthName,
        jobCount,
        isToday: str === todayStr,
      });
    }
    return days;
  }, [today, todayStr, jobs]);

  // Jobs for the selected day
  const selectedDayJobs = useMemo(() => {
    return jobs
      .filter((j) => isSameDay(j.scheduledDate, selectedDateStr))
      .sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime()
      );
  }, [jobs, selectedDateStr]);

  // All upcoming confirmed or in-progress jobs
  const upcomingJobs = useMemo(() => {
    const now = new Date().getTime();
    return jobs
      .filter((j) => {
        if (j.status === "CANCELLED" || j.status === "COMPLETED") return false;
        const jobTime = new Date(j.scheduledDate).getTime();
        return jobTime >= now - 1000 * 60 * 60 * 12; // Within last 12 hours or future
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime()
      );
  }, [jobs]);

  // Categorize selected day's jobs into time slots
  const morningJobs = useMemo(
    () => selectedDayJobs.filter((j) => getTimeSlot(j.scheduledDate) === "morning"),
    [selectedDayJobs]
  );
  const afternoonJobs = useMemo(
    () => selectedDayJobs.filter((j) => getTimeSlot(j.scheduledDate) === "afternoon"),
    [selectedDayJobs]
  );
  const eveningJobs = useMemo(
    () => selectedDayJobs.filter((j) => getTimeSlot(j.scheduledDate) === "evening"),
    [selectedDayJobs]
  );

  // Daily summary stats for selected date
  const selectedDaySummary = useMemo(() => {
    const activeOnDate = selectedDayJobs.filter((j) => j.status !== "CANCELLED");
    const totalEarnings = activeOnDate.reduce(
      (acc, curr) => acc + (curr.totalAmount || 0),
      0
    );
    const estimatedHours = activeOnDate.reduce((acc, curr) => {
      if (curr.priceType === "hourly") {
        return acc + (curr.units || 1);
      }
      return acc + 1.5; // Average baseline for meter jobs
    }, 0);

    return {
      count: activeOnDate.length,
      totalEarnings,
      estimatedHours,
    };
  }, [selectedDayJobs]);

  const selectedDateFormatted = useMemo(() => {
    const parts = selectedDateStr.split("-");
    if (parts.length !== 3) return selectedDateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDateStr]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <ScheduleHeader
        activeTab={activeFilterTab}
        onSelectToday={() => {
          setActiveFilterTab("selected");
          setSelectedDateStr(todayStr);
        }}
        onSelectUpcoming={() => setActiveFilterTab("upcoming")}
        upcomingCount={upcomingJobs.length}
      />

      {/* AI Optimal Shift Advisor Card */}
      <SmartShiftAdviceCard />

      {/* Date Selector Strip (Next 14 Days) */}
      <DateStripCarousel
        dateStrip={dateStrip}
        selectedDateStr={selectedDateStr}
        selectedDateFormatted={selectedDateFormatted}
        isCalendarActive={activeFilterTab === "selected"}
        onSelectDate={(dateStr) => {
          setSelectedDateStr(dateStr);
          setActiveFilterTab("selected");
        }}
      />

      {/* Daily HUD / Workload Metrics Banner */}
      {activeFilterTab === "selected" && (
        <DailyWorkloadHud
          summary={selectedDaySummary}
          isToday={selectedDateStr === todayStr}
        />
      )}

      {/* Main Agenda Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 rounded-2xl border border-border/50 bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : activeFilterTab === "upcoming" ? (
        /* All Upcoming List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              All Upcoming Bookings ({upcomingJobs.length})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilterTab("selected")}
              className="text-xs text-primary cursor-pointer"
            >
              Back to Daily Calendar
            </Button>
          </div>

          {upcomingJobs.length === 0 ? (
            <div className="rounded-xl border border-border/80 bg-card/50 p-12 text-center space-y-3">
              <Clock className="size-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">
                No upcoming jobs scheduled
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Keep your online toggle active in the portal header to pick up instant cooperative dispatch gigs.
              </p>
              <div className="pt-2">
                <Link to="/worker/jobs">
                  <Button className="rounded-lg text-xs font-semibold gap-2 cursor-pointer">
                    <Sparkles className="size-3.5" />
                    Browse Available Gigs
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingJobs.map((job) => (
                <ScheduleJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      ) : selectedDayJobs.length === 0 ? (
        /* Empty State for Selected Day */
        <div className="rounded-xl border border-border/80 bg-card/40 p-12 text-center space-y-3">
          <CalendarIcon className="size-10 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">
            No Bookings for {selectedDateFormatted}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You have no booked appointments on this date. You can explore available customer requests and accept new gigs for your schedule.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/worker/jobs">
              <Button className="rounded-lg text-xs font-semibold gap-2 cursor-pointer">
                <Briefcase className="size-3.5" />
                Find Available Gigs
              </Button>
            </Link>
            <Link to="/worker/bookings">
              <Button
                variant="outline"
                className="rounded-lg text-xs font-semibold cursor-pointer"
              >
                View All My Bookings
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Chronological Time Slots for Selected Day */
        <div className="space-y-6">
          {/* Morning Slot */}
          {morningJobs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sun className="size-4 text-amber-500" />
                <span>Morning Shift (08:00 AM - 12:00 PM)</span>
                <span className="text-[11px] font-semibold text-primary">
                  ({morningJobs.length} {morningJobs.length === 1 ? "job" : "jobs"})
                </span>
              </div>
              <div className="space-y-3">
                {morningJobs.map((job) => (
                  <ScheduleJobCard key={job._id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* Afternoon Slot */}
          {afternoonJobs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sunset className="size-4 text-orange-500" />
                <span>Afternoon Shift (12:00 PM - 05:00 PM)</span>
                <span className="text-[11px] font-semibold text-primary">
                  ({afternoonJobs.length} {afternoonJobs.length === 1 ? "job" : "jobs"})
                </span>
              </div>
              <div className="space-y-3">
                {afternoonJobs.map((job) => (
                  <ScheduleJobCard key={job._id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* Evening Slot */}
          {eveningJobs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Moon className="size-4 text-indigo-500" />
                <span>Evening Shift (05:00 PM - 09:00 PM)</span>
                <span className="text-[11px] font-semibold text-primary">
                  ({eveningJobs.length} {eveningJobs.length === 1 ? "job" : "jobs"})
                </span>
              </div>
              <div className="space-y-3">
                {eveningJobs.map((job) => (
                  <ScheduleJobCard key={job._id} job={job} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerSchedule;
