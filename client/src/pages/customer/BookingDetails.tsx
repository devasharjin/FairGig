import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle, RotateCcw } from "lucide-react";
import {
  useCustomerBooking,
  useCancelBooking,
  useRateBooking,
} from "@/features/customer/bookings/hooks";
import {
  BookingDetailsView,
  CancelBookingDialog,
  RateBookingDialog,
} from "@/components/customer/booking";
import { RazorpayPaymentModal } from "@/components/customer/payment";
import { Button } from "@/components/ui/button";

export const CustomerBookingDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useCustomerBooking(id || "");

  const cancelMutation = useCancelBooking();
  const rateMutation = useRateBooking();

  const handleConfirmCancel = async (bookingId: string, reason: string) => {
    try {
      await cancelMutation.mutateAsync({
        id: bookingId,
        reason,
      });
      setIsCancelDialogOpen(false);
    } catch {
      // Handled by toast
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
      setIsRateDialogOpen(false);
    } catch {
      // Handled by toast
    }
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="h-9 w-40 bg-muted/60 rounded-xl animate-pulse" />
        <div className="p-6 rounded-3xl border border-border/60 bg-card/40 animate-pulse space-y-4">
          <div className="h-6 bg-muted/60 rounded-lg w-1/4" />
          <div className="h-8 bg-muted/40 rounded-xl w-1/2" />
        </div>
        <div className="p-6 rounded-3xl border border-border/60 bg-card/40 animate-pulse h-28" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-72 rounded-3xl border border-border/60 bg-card/40 animate-pulse" />
          <div className="lg:col-span-5 h-72 rounded-3xl border border-border/60 bg-card/40 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error / Not Found state
  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-background/50 py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto text-center space-y-5">
        <div className="size-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            {t("bookingDetails.errorTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {(error as any)?.message || t("bookingDetails.errorDesc")}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl h-10 px-4 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>{t("bookingDetails.tryAgain")}</span>
          </Button>

          <Link to="/bookings">
            <Button className="rounded-xl h-10 px-5 text-xs font-semibold cursor-pointer shadow-xs">
              <span>{t("bookingDetails.backToAll")}</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer bg-card/80 hover:bg-card border border-border/70 py-2 px-3.5 rounded-xl shadow-xs"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("bookingDetails.backToAll")}</span>
        </button>

        <div className="text-xs text-muted-foreground hidden sm:block">
          {t("bookingDetails.portalSubtitle", { number: booking.bookingNumber })}
        </div>
      </div>

      {/* Main Details View */}
      <BookingDetailsView
        booking={booking}
        onCancel={() => setIsCancelDialogOpen(true)}
        onRate={() => setIsRateDialogOpen(true)}
        onPay={() => setIsPaymentModalOpen(true)}
      />

      {/* Cancel Dialog */}
      <CancelBookingDialog
        booking={booking}
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirmCancel={handleConfirmCancel}
        isPending={cancelMutation.isPending}
      />

      {/* Rate Dialog */}
      <RateBookingDialog
        booking={booking}
        open={isRateDialogOpen}
        onOpenChange={setIsRateDialogOpen}
        onSubmitRating={handleSubmitRating}
        onRequestPay={() => setIsPaymentModalOpen(true)}
        isPending={rateMutation.isPending}
      />

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        booking={booking}
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onPaymentSuccess={() => {
          setIsPaymentModalOpen(false);
          // Auto-prompt rating dialog once invoice is settled
          setIsRateDialogOpen(true);
        }}
      />
    </div>
  );
};

export default CustomerBookingDetails;
