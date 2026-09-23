import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn, Grid, Briefcase } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
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
import { RazorpayPaymentModal } from "@/components/customer/payment";

export const CustomerBookings: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [selectedBooking, setSelectedBooking] =
    useState<CustomerBooking | null>(null);
  const [cancellingBooking, setCancellingBooking] =
    useState<CustomerBooking | null>(null);
  const [ratingBooking, setRatingBooking] =
    useState<CustomerBooking | null>(null);
  const [payingBooking, setPayingBooking] =
    useState<CustomerBooking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  const user = useAuthStore((state) => state.user);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  // If user is not authenticated, show friendly sign-in prompt
  if (isBootstrapped && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-border/80 bg-card shadow-xs">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Briefcase className="size-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {t("bookings.unauthTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t("bookings.unauthDesc")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-xl px-5 gap-2 text-xs font-semibold shadow-xs bg-primary text-primary-foreground">
                <LogIn className="size-3.5" />
                <span>{t("bookings.signInBtn")}</span>
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl px-5 gap-2 text-xs font-semibold">
                <Grid className="size-3.5" />
                <span>{t("bookings.browseBtn")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              onPay={(b) => {
                setPayingBooking(b);
                setIsPaymentModalOpen(true);
              }}
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
        onPayBooking={(b) => {
          setSelectedBooking(null);
          setPayingBooking(b);
          setIsPaymentModalOpen(true);
        }}
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
        onRequestPay={(b) => {
          setRatingBooking(null);
          setPayingBooking(b);
          setIsPaymentModalOpen(true);
        }}
        isPending={rateMutation.isPending}
      />

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        booking={payingBooking}
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onPaymentSuccess={(updatedBooking) => {
          setIsPaymentModalOpen(false);
          setPayingBooking(null);
          // Unlocked! Automatically prompt rating and review after successful payment
          setRatingBooking(updatedBooking);
        }}
      />
    </div>
  );
};

export default CustomerBookings;
