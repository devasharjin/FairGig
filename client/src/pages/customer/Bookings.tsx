import React, { useState, useMemo } from "react";
import {
  useCustomerBookings,
  useCancelBooking,
  useRateBooking,
} from "@/features/customer/bookings/hooks";
import type { CustomerBooking } from "@/features/customer/bookings/types";
import {
  BookingsHeader,
  BookingsFilters,
  BookingCard,
  BookingDetailsDialog,
  CancelBookingDialog,
  RateBookingDialog,
  BookingsSkeleton,
  BookingsEmptyState,
  type FilterTab,
} from "@/components/customer/booking";

export const CustomerBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [selectedBooking, setSelectedBooking] =
    useState<CustomerBooking | null>(null);
  const [cancellingBooking, setCancellingBooking] =
    useState<CustomerBooking | null>(null);
  const [ratingBooking, setRatingBooking] =
    useState<CustomerBooking | null>(null);

  // Queries & Mutations
  const {
    data: bookings = [],
    isLoading,
    isFetching,
    refetch,
  } = useCustomerBookings();
  const cancelMutation = useCancelBooking();
  const rateMutation = useRateBooking();

  // Tab count metrics
  const tabCounts = useMemo(() => {
    return {
      ALL: bookings.length,
      ACTIVE: bookings.filter(
        (b) =>
          b.status === "PENDING" ||
          b.status === "ASSIGNED" ||
          b.status === "CONFIRMED" ||
          b.status === "IN_PROGRESS"
      ).length,
      COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
      CANCELLED: bookings.filter(
        (b) => b.status === "CANCELLED" || b.status === "REJECTED"
      ).length,
    };
  }, [bookings]);

  // Filter bookings according to active tab and search query
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab === "ACTIVE") {
        if (
          b.status !== "PENDING" &&
          b.status !== "ASSIGNED" &&
          b.status !== "CONFIRMED" &&
          b.status !== "IN_PROGRESS"
        )
          return false;
      } else if (activeTab === "COMPLETED") {
        if (b.status !== "COMPLETED") return false;
      } else if (activeTab === "CANCELLED") {
        if (b.status !== "CANCELLED" && b.status !== "REJECTED") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = b.bookingNumber?.toLowerCase().includes(q);
        const matchServ = b.service?.name?.toLowerCase().includes(q);
        const matchWorker = b.worker?.userId?.name?.toLowerCase().includes(q);
        const matchAddr = b.address?.street?.toLowerCase().includes(q);
        return matchNum || matchServ || matchWorker || matchAddr;
      }

      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  // Mutation handlers
  const handleConfirmCancel = async (bookingId: string, reason: string) => {
    try {
      await cancelMutation.mutateAsync({
        id: bookingId,
        reason,
      });
      setCancellingBooking(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleSubmitRating = async (
    bookingId: string,
    rating: number,
    review: string
  ) => {
    try {
      await rateMutation.mutateAsync({
        id: bookingId,
        payload: {
          rating,
          review,
        },
      });
      setRatingBooking(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <BookingsHeader
        totalCount={bookings.length}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* 2. Filter Tabs & Search Bar */}
      <BookingsFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={tabCounts}
      />

      {/* 3. Loading Skeleton */}
      {isLoading && <BookingsSkeleton count={4} />}

      {/* 4. Empty State */}
      {!isLoading && filteredBookings.length === 0 && (
        <BookingsEmptyState
          activeTab={activeTab}
          hasSearchQuery={Boolean(searchQuery.trim())}
          onClearSearch={() => setSearchQuery("")}
        />
      )}

      {/* 5. Bookings Grid */}
      {!isLoading && filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onViewDetails={(b) => setSelectedBooking(b)}
              onCancel={(b) => setCancellingBooking(b)}
              onRate={(b) => setRatingBooking(b)}
            />
          ))}
        </div>
      )}

      {/* 6. Modals & Dialogs */}
      <BookingDetailsDialog
        booking={selectedBooking}
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
        onCancelBooking={(b) => setCancellingBooking(b)}
        onRateBooking={(b) => setRatingBooking(b)}
      />

      <CancelBookingDialog
        booking={cancellingBooking}
        open={Boolean(cancellingBooking)}
        onOpenChange={(open) => !open && setCancellingBooking(null)}
        onConfirmCancel={handleConfirmCancel}
        isPending={cancelMutation.isPending}
      />

      <RateBookingDialog
        booking={ratingBooking}
        open={Boolean(ratingBooking)}
        onOpenChange={(open) => !open && setRatingBooking(null)}
        onSubmitRating={handleSubmitRating}
        isPending={rateMutation.isPending}
      />
    </div>
  );
};

export default CustomerBookings;
