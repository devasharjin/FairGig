import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  Receipt,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CustomerBooking } from "@/features/customer/bookings/types";
import {
  useCreatePaymentOrder,
  useVerifyPayment,
} from "@/features/customer/payments/hooks";
import {
  loadRazorpayScript,
  type RazorpayOptions,
  type RazorpayResponsePayload,
} from "@/lib/razorpay";
import toast from "react-hot-toast";

export interface RazorpayPaymentModalProps {
  booking: CustomerBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: (updatedBooking: CustomerBooking) => void;
}

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  booking,
  open,
  onOpenChange,
  onPaymentSuccess,
}) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  if (!booking) return null;

  const handlePayNow = async () => {
    if (!booking) return;
    const targetBooking = booking;

    // Immediately close the payment dialog as requested so it does not block the screen
    onOpenChange(false);
    setIsProcessing(true);

    const toastId = toast.loading(t("bookingDetails.paymentModal.initToast"));

    try {
      // 1. Create order on backend
      const orderData = await createOrderMutation.mutateAsync({
        bookingId: targetBooking._id,
      });

      // 2. Check if running in mock/sandbox development mode
      if (orderData.isMock) {
        toast.loading(t("bookingDetails.paymentModal.testGatewayToast"), { id: toastId });

        // Short simulation delay
        await new Promise((r) => setTimeout(r, 800));

        const mockPayload = {
          bookingId: targetBooking._id,
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          razorpaySignature: "mock_signature_valid",
          paymentMethod: "Razorpay Test Sandbox",
        };

        const result = await verifyPaymentMutation.mutateAsync(mockPayload);
        setIsProcessing(false);
        toast.success(t("bookingDetails.paymentModal.paymentConfirmedToast"), { id: toastId });
        onPaymentSuccess?.(result.booking);
        return;
      }

      // 3. Load official Razorpay Checkout SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error(t("bookingDetails.paymentModal.loadFailedToast"), {
          id: toastId,
        });
        setIsProcessing(false);
        return;
      }

      toast.dismiss(toastId);

      // 4. Initialize and open Razorpay popup
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "Cooperative Gig Services",
        description: `Invoice for ${targetBooking.service?.name || "Service"} (#${targetBooking.bookingNumber})`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName || "",
          email: orderData.customerEmail || "",
          contact: orderData.customerPhone || "",
        },
        theme: {
          color: "#0f766e", // Teal brand color
        },
        handler: async (response: RazorpayResponsePayload) => {
          const verifyToast = toast.loading(t("bookingDetails.paymentModal.bankVerifyingToast"));
          try {
            const verifyPayload = {
              bookingId: targetBooking._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentMethod: "Razorpay Online",
            };

            const result = await verifyPaymentMutation.mutateAsync(verifyPayload);
            setIsProcessing(false);
            toast.success(t("bookingDetails.paymentModal.paymentConfirmedToast"), { id: verifyToast });
            onPaymentSuccess?.(result.booking);
          } catch {
            setIsProcessing(false);
            toast.error(t("bookingDetails.paymentModal.verifyFailedToast"), { id: verifyToast });
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast(t("bookingDetails.paymentModal.windowClosedToast"), { icon: "ℹ️" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setIsProcessing(false);
      toast.dismiss(toastId);
    }
  };

  const isPending =
    isProcessing ||
    createOrderMutation.isPending ||
    verifyPaymentMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 border border-border/80 shadow-2xl bg-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CreditCard className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                  {t("bookingDetails.paymentModal.title")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {t("bookingDetails.paymentModal.subtitle")}
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className="bg-muted/40 text-[10px] font-mono uppercase"
            >
              #{booking.bookingNumber}
            </Badge>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t("bookingDetails.paymentModal.confirmedTitle")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              {t("bookingDetails.paymentModal.confirmedDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Service & Worker Summary Card */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    {t("bookingDetails.paymentModal.tradeGigService")}
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {booking.service?.name
                      ? t("services.trades." + booking.service.name.toLowerCase().replace(/\s+/g, "_"), { defaultValue: booking.service.name })
                      : t("bookingDetails.paymentModal.serviceRequest")}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-lg text-[11px]">
                  {booking.category?.name || "Service"}
                </Badge>
              </div>

              {booking.worker && (
                <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="size-3.5 text-primary shrink-0" />
                  <span>
                    {t("bookingDetails.paymentModal.fulfilledBy")}{" "}
                    <strong className="text-foreground">
                      {booking.worker.userId?.name || t("bookingDetails.paymentModal.verifiedWorker")}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Bill Breakdown */}
            <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground pb-1 border-b border-border/50">
                <Receipt className="size-3.5 text-primary" />
                <span>{t("bookingDetails.paymentModal.invoiceBreakdown")}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>
                  {t("bookingDetails.paymentModal.baseRate", {
                    type: booking.priceType === "hourly"
                      ? t("bookingDetails.paymentModal.perHr")
                      : t("bookingDetails.paymentModal.perMeter")
                  })}
                </span>
                <span className="font-medium text-foreground">₹{booking.rate}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>
                  {t("bookingDetails.paymentModal.units", {
                    count: booking.units,
                    unit: booking.priceType === "hourly"
                      ? t("bookingDetails.paymentModal.hrs")
                      : t("bookingDetails.paymentModal.m")
                  })}
                </span>
                <span className="font-medium text-foreground">× {booking.units}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>{t("bookingDetails.paymentModal.processingFee")}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {t("bookingDetails.paymentModal.freeSubsidized")}
                </span>
              </div>

              <div className="pt-2.5 border-t border-border/60 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {t("bookingDetails.paymentModal.amountPayable")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {t("bookingDetails.paymentModal.taxesIncluded")}
                  </span>
                </div>
                <span className="text-2xl font-black text-primary tracking-tight">
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-2.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block font-semibold">
                  {t("bookingDetails.paymentModal.escrowTitle")}
                </strong>
                {t("bookingDetails.paymentModal.escrowDesc")}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="rounded-xl h-11 px-4 text-xs cursor-pointer"
              >
                {t("bookingDetails.paymentModal.payLater")}
              </Button>

              <Button
                type="button"
                onClick={handlePayNow}
                disabled={isPending}
                className="rounded-xl h-11 px-6 text-xs font-bold gap-2 cursor-pointer shadow-md bg-primary text-primary-foreground hover:opacity-95 flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>{t("bookingDetails.paymentModal.processingPayment")}</span>
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" />
                    <span>{t("bookingDetails.paymentModal.payWithRazorpay", { amount: booking.totalAmount })}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPaymentModal;
