import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useAdminCooperatives,
  useVerifyAdminCooperative,
} from "@/features/admin/verifications/hooks";
import type { AdminCooperative } from "@/features/admin/verifications/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CooperativeVerificationStats } from "@/components/admin/verifications/CooperativeVerificationStats";
import { CooperativeVerificationFilter } from "@/components/admin/verifications/CooperativeVerificationFilter";
import { CooperativeVerificationCard } from "@/components/admin/verifications/CooperativeVerificationCard";
import { CooperativeVerificationModal } from "@/components/admin/verifications/CooperativeVerificationModal";

export default function AdminVerifications() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // TanStack Query hooks
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useAdminCooperatives({
    status: statusFilter,
    search: searchQuery.trim() || undefined,
    page: currentPage,
    limit: 12,
  });

  const verifyMutation = useVerifyAdminCooperative();

  // Modal state
  const [selectedCooperative, setSelectedCooperative] =
    useState<AdminCooperative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cooperatives = data?.cooperatives || [];
  const counts = data?.counts || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  const pagination = data?.pagination || {
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
  };

  const handleApprove = async (id: string) => {
    await verifyMutation.mutateAsync({
      id,
      payload: { action: "APPROVE" },
    });
  };

  const handleReject = async (id: string, reason: string) => {
    await verifyMutation.mutateAsync({
      id,
      payload: { action: "REJECT", rejectionReason: reason },
    });
  };

  const handleRevertToPending = async (id: string) => {
    await verifyMutation.mutateAsync({
      id,
      payload: { action: "PENDING" },
    });
  };

  const handleOpenReview = (cooperative: AdminCooperative) => {
    setSelectedCooperative(cooperative);
    setIsModalOpen(true);
  };

  const handleQuickReject = (cooperative: AdminCooperative) => {
    setSelectedCooperative(cooperative);
    setIsModalOpen(true);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
            >
              <ShieldCheck className="size-3.5 mr-1" />
              Administrative Governance
            </Badge>
            <span className="text-xs text-muted-foreground">• Regulatory Compliance</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Cooperative Verifications
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review state registration certificates, official society logos, and approve or reject cooperative societies for platform onboarding.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <CooperativeVerificationStats counts={counts} />

      {/* Filter and Search Bar */}
      <CooperativeVerificationFilter
        currentStatus={statusFilter}
        onStatusChange={handleStatusChange}
        search={searchQuery}
        onSearchChange={handleSearchChange}
        counts={counts}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">
            Loading cooperative applications...
          </p>
        </div>
      ) : cooperatives.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center gap-3 p-6">
          <div className="size-14 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center">
            <Inbox className="size-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              No cooperatives found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Try adjusting your search query.`
                : statusFilter !== "All"
                ? `There are currently no cooperatives with status "${statusFilter}".`
                : "No cooperative society registrations have been submitted yet."}
            </p>
          </div>
          {(searchQuery || statusFilter !== "All") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              className="mt-2 rounded-xl text-xs cursor-pointer"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Cooperatives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {cooperatives.map((cooperative) => (
              <CooperativeVerificationCard
                key={cooperative._id}
                cooperative={cooperative}
                onReview={handleOpenReview}
                onQuickApprove={handleApprove}
                onQuickReject={handleQuickReject}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground">
              <span>
                Showing Page <strong className="text-foreground">{pagination.page}</strong> of{" "}
                <strong className="text-foreground">{pagination.totalPages}</strong> (
                {pagination.totalItems} total cooperatives)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="rounded-xl text-xs h-8 px-3 border-border/80 cursor-pointer"
                >
                  <ChevronLeft className="size-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-xl text-xs h-8 px-3 border-border/80 cursor-pointer"
                >
                  Next
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Review & Inspection Modal */}
      <CooperativeVerificationModal
        cooperative={selectedCooperative}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCooperative(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onRevertToPending={handleRevertToPending}
      />
    </div>
  );
}
