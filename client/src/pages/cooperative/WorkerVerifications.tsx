import React, { useState } from "react";
import {
  Search,
  X,
  RotateCcw,
  UserCheck,
  Loader2,
  Users,
} from "lucide-react";
import {
  useCooperativeWorkers,
  useVerifyCooperativeWorker,
} from "@/features/cooperative/verifications/hooks";
import type { CooperativeWorker } from "@/features/cooperative/verifications/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { WorkerVerificationStats } from "@/components/cooperative/verifications/WorkerVerificationStats";
import { WorkerVerificationCard } from "@/components/cooperative/verifications/WorkerVerificationCard";
import { WorkerVerificationModal } from "@/components/cooperative/verifications/WorkerVerificationModal";

export default function WorkerVerifications() {
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // TanStack Query hooks
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useCooperativeWorkers({
    status: statusFilter,
    search: searchQuery.trim() || undefined,
  });

  const verifyMutation = useVerifyCooperativeWorker();

  // Modal review state
  const [selectedWorker, setSelectedWorker] = useState<CooperativeWorker | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const workers = data?.workers || [];
  const counts = data?.counts || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  const cooperativeName = data?.cooperative?.cooperativeName || "";

  // Handle Approve action
  const handleApprove = async (workerId: string) => {
    await verifyMutation.mutateAsync({
      id: workerId,
      payload: { action: "APPROVE" },
    });
  };

  // Handle Reject action
  const handleReject = async (workerId: string, reason: string) => {
    await verifyMutation.mutateAsync({
      id: workerId,
      payload: { action: "REJECT", rejectionReason: reason },
    });
  };

  const handleOpenReview = (worker: CooperativeWorker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleQuickReject = (worker: CooperativeWorker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const filterTabs = [
    { key: "All", label: "All Applicants", count: counts.total },
    { key: "Pending", label: "Needs Approval", count: counts.pending },
    { key: "Approved", label: "Approved Members", count: counts.approved },
    { key: "Rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="secondary"
              className="rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-accent/10 text-accent border-accent/20"
            >
              <UserCheck className="size-3.5 mr-1" />
              Cooperative Onboarding
            </Badge>
            {cooperativeName && (
              <span className="text-xs text-muted-foreground font-medium">
                {cooperativeName}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Worker Verification & Approval
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review worker applications, inspect identity proofs and trade certificates,
            and enroll verified tradespeople into your cooperative guild.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg text-xs h-9 gap-1.5 border-border/80 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <RotateCcw
            className={`size-3.5 ${isFetching ? "animate-spin text-accent" : ""}`}
          />
          {isFetching ? "Updating..." : "Refresh"}
        </Button>
      </div>

      {/* Summary Statistics */}
      <WorkerVerificationStats counts={counts} />

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/70 overflow-x-auto">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-card text-foreground shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-8 text-xs rounded-lg bg-card border-border/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workers List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-accent" />
          <p className="text-xs font-medium">
            Fetching worker registration records...
          </p>
        </div>
      ) : workers.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border/80 bg-muted/10 p-8">
          <div className="size-12 rounded-lg bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-3">
            <Users className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            No Worker Applications Found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "All"
              ? `No workers match the filter "${statusFilter}"${
                  searchQuery ? ` and query "${searchQuery}"` : ""
                }. Try resetting your filters.`
              : "No workers have registered under your cooperative society yet."}
          </p>
          {(searchQuery || statusFilter !== "All") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter("All");
                setSearchQuery("");
              }}
              className="mt-4 rounded-lg text-xs h-8 shadow-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map((worker) => (
            <WorkerVerificationCard
              key={worker._id}
              worker={worker}
              onReview={handleOpenReview}
              onQuickApprove={handleApprove}
              onQuickReject={handleQuickReject}
            />
          ))}
        </div>
      )}

      {/* Document Review & Action Modal */}
      <WorkerVerificationModal
        worker={selectedWorker}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorker(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
