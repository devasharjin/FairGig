import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentByBooking,
  getRazorpayConfig,
} from "./api";
import type {
  CreatePaymentOrderPayload,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "./types";

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (payload: CreatePaymentOrderPayload) =>
      createPaymentOrder(payload),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to initialize payment gateway.";
      toast.error(msg);
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => verifyPayment(payload),
    onSuccess: (data: VerifyPaymentResponse) => {
      // Invalidate customer bookings cache so the new PAID status is immediately reflected
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      if (data?.booking?._id) {
        queryClient.invalidateQueries({
          queryKey: ["customer-booking", data.booking._id],
        });
      }
      toast.success("Payment successful! Service invoice settled.");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payment verification failed. Please contact support.";
      toast.error(msg);
    },
  });
}

export function useRazorpayConfig() {
  return useQuery({
    queryKey: ["razorpay-config"],
    queryFn: getRazorpayConfig,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useBookingPayment(bookingId: string) {
  return useQuery({
    queryKey: ["customer-booking-payment", bookingId],
    queryFn: () => getPaymentByBooking(bookingId),
    enabled: Boolean(bookingId),
  });
}
