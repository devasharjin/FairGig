import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, RotateCcw, Briefcase, ArrowRight, AlertTriangle } from "lucide-react";
import {
  useAvailableGigs,
  useAcceptGig,
  useWorkerStats,
  useWorkerProfile,
} from "@/features/worker/gigs/hooks";
import type { WorkerJob } from "@/features/worker/gigs/types";
import { Button } from "@/components/ui/button";
import { GigRadarHeader } from "@/components/worker/jobs/GigRadarHeader";
import { GigFilters, type QuickFilterType } from "@/components/worker/jobs/GigFilters";
import { GigCard } from "@/components/worker/jobs/GigCard";
import { GigDetailsDialog } from "@/components/worker/jobs/GigDetailsDialog";
import { AiDemandHotspotsWidget } from "@/components/worker/jobs/AiDemandHotspotsWidget";

export const WorkerJobs: React.FC = () => {
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGig, setSelectedGig] = useState<WorkerJob | null>(null);

  const {
    data: availableGigs = [],
    isLoading,
    isRefetching,
    refetch,
  } = useAvailableGigs();

  const { data: stats } = useWorkerStats();
  const { data: profile } = useWorkerProfile();
  const acceptGigMutation = useAcceptGig();

  const registeredSkills = (profile?.skills || profile?.worker?.skills || []) as any[];
  const registeredSkillIds = registeredSkills
    .map((s) => (typeof s === "object" ? s?._id : s))
    .filter(Boolean)
    .map((id) => id.toString());

  const registeredSkillNames = registeredSkills
    .map((s) => (typeof s === "object" ? s?.name : null))
    .filter(Boolean);

  const workerCategory = profile?.category || profile?.categories?.[0] || profile?.worker?.category;
  const categoryName = typeof workerCategory === "object" ? workerCategory?.name : undefined;
  const displayTradeName = registeredSkillNames.length > 0 ? registeredSkillNames.join(", ") : categoryName;

  const workerRating = Number(profile?.rating ?? profile?.worker?.rating ?? 0);

  // Filter and search logic
  const filteredGigs = availableGigs.filter((gig) => {
    // Premium gigs only visible to workers with rating > 4.5
    if (gig.bookingType === "PREMIUM" && workerRating <= 4.5) {
      return false;
    }

    // Only display services that the worker registered
    if (registeredSkillIds.length > 0) {
      const gigServiceId = (gig.service?._id || gig.service)?.toString();
      if (gigServiceId && !registeredSkillIds.includes(gigServiceId)) {
        return false;
      }
    }

    // Quick filter
    if (quickFilter === "EMERGENCY" && !gig.isEmergency) return false;
    if (
      (quickFilter === "PREMIUM" || (quickFilter as string) === "ON_DEMAND") &&
      ((gig.bookingType !== "PREMIUM" && gig.bookingType !== "ON_DEMAND") || gig.isEmergency)
    ) {
      return false;
    }
    if (quickFilter === "HOURLY" && gig.priceType !== "hourly") return false;
    if (quickFilter === "METERS" && gig.priceType !== "meters") return false;
    if (quickFilter === "TODAY") {
      if (!gig.scheduledDate) return false;
      const todayStr = new Date().toISOString().slice(0, 10);
      const gigDateStr = new Date(gig.scheduledDate).toISOString().slice(0, 10);
      if (todayStr !== gigDateStr) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = gig.bookingNumber?.toLowerCase().includes(q);
      const matchService = gig.service?.name?.toLowerCase().includes(q);
      const matchCategory = gig.category?.name?.toLowerCase().includes(q);
      const matchAddress = gig.address?.street?.toLowerCase().includes(q);
      const matchNotes = gig.customerNotes?.toLowerCase().includes(q);
      return matchNum || matchService || matchCategory || matchAddress || matchNotes;
    }

    return true;
  });

  const emergencyCount = filteredGigs.filter((g) => g.isEmergency).length;

  const handleAccept = async (gigId: string) => {
    try {
      await acceptGigMutation.mutateAsync(gigId);
      if (selectedGig?._id === gigId) {
        setSelectedGig(null);
      }
    } catch {
      // Handled by mutation toast
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Immediate Dispatch";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Radar Live Status Header */}
      <GigRadarHeader
        totalAvailable={filteredGigs.length}
        isRefetching={isRefetching}
        onRefresh={() => refetch()}
        categoryName={displayTradeName}
      />

      {/* Emergency SOS Radar Notification Banner */}
      {emergencyCount > 0 && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="size-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="size-5 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <span>🚨 {emergencyCount} Critical Emergency SOS Request{emergencyCount > 1 ? "s" : ""} in Radar!</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Urgent hazard requires immediate response. Top-of-queue priority dispatch.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setQuickFilter("EMERGENCY")}
            className="rounded-lg h-9 px-4 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            Review Emergency Gigs
          </Button>
        </div>
      )}

      {/* Weekly Capacity Warning Banner */}
      {stats?.canAcceptWeeklyService === false && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="size-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Briefcase className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <span>Weekly Workload Limit Reached ({stats?.activeJobs ?? 6}/{stats?.weeklyServiceLimit ?? 6} Active)</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cooperative policy limits active accepted services to protect workload quality. Complete an active job to decrease your count and unlock capacity for more services.
              </p>
            </div>
          </div>

          <Link to="/worker/bookings" className="shrink-0 self-start sm:self-auto">
            <Button
              size="sm"
              className="rounded-lg h-9 px-4 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
            >
              Manage Active Jobs
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Navigation to Bookings */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Showing <strong>{filteredGigs.length}</strong> matching assignments in your service area
        </p>

        <Link to="/worker/bookings">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-9 px-3.5 gap-2 text-xs font-semibold border-border/80 hover:bg-muted cursor-pointer shadow-xs"
          >
            <Briefcase className="size-3.5 text-primary" />
            <span>My Bookings ({stats?.activeJobs ?? 0})</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </Button>
        </Link>
      </div>

      {/* AI Real-time Demand Hotspots & Surge Radar */}
      <AiDemandHotspotsWidget />

      {/* Filter & Search Bar */}
      <GigFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={quickFilter}
        onFilterChange={setQuickFilter}
        filteredCount={filteredGigs.length}
        emergencyCount={emergencyCount}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border/60 bg-card/40 animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 bg-muted/60 rounded-lg w-1/3" />
                <div className="h-5 bg-muted/40 rounded-lg w-1/4" />
              </div>
              <div className="h-8 bg-muted/50 rounded-lg w-2/3" />
              <div className="h-16 bg-muted/30 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty Radar State */}
      {!isLoading && filteredGigs.length === 0 && (
        <div className="p-10 sm:p-12 text-center rounded-xl border border-dashed border-border/80 bg-card max-w-md mx-auto my-10 space-y-4 shadow-xs">
          <div className="relative size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Compass className="size-6 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">Radar Clear • No Gigs in Queue</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "No available gigs matched your search criteria."
                : "There are no pending customer requests waiting right now. Keep your Online toggle on; new requests notify automatically."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-lg h-8 text-xs cursor-pointer shadow-xs"
              >
                Clear Search
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg h-8 text-xs cursor-pointer gap-1.5 shadow-xs"
            >
              <RotateCcw className="size-3.5" />
              Scan Again
            </Button>
          </div>
        </div>
      )}

      {/* Available Gigs Grid */}
      {!isLoading && filteredGigs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredGigs.map((gig) => (
            <GigCard
              key={gig._id}
              gig={gig}
              isAccepting={acceptGigMutation.isPending}
              canAccept={stats?.canAcceptWeeklyService !== false}
              onInspect={(g) => setSelectedGig(g)}
              onAccept={handleAccept}
            />
          ))}
        </div>
      )}

      {/* Gig Inspection & Preview Dialog */}
      <GigDetailsDialog
        selectedGig={selectedGig}
        onClose={() => setSelectedGig(null)}
        onAccept={handleAccept}
        isAccepting={acceptGigMutation.isPending}
        canAccept={stats?.canAcceptWeeklyService !== false}
        formatDate={formatDate}
      />
    </div>
  );
};

export default WorkerJobs;
