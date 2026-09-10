import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCustomerBookings,
  getCustomerBookingById,
  createCustomerBooking,
  cancelCustomerBooking,
  rateCustomerBooking,
} from "./api";
import { useAuthStore } from "@/features/auth/store";
import type {
  CreateBookingPayload,
  CustomerBookingFilterParams,
  RateBookingPayload,
} from "./types";

export const customerBookingKeys = {
  all: ["customer-bookings"] as const,
  lists: () => [...customerBookingKeys.all, "list"] as const,
  list: (filters?: CustomerBookingFilterParams) =>
    [...customerBookingKeys.lists(), filters] as const,
  details: () => [...customerBookingKeys.all, "detail"] as const,
  detail: (id: string) => [...customerBookingKeys.details(), id] as const,
};

export function useCustomerBookings(filters?: CustomerBookingFilterParams) {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: customerBookingKeys.list(filters),
    queryFn: () => getCustomerBookings(filters),
    enabled: Boolean(user),
  });
}

export function useCustomerBooking(id: string) {
  return useQuery({
    queryKey: customerBookingKeys.detail(id),
    queryFn: () => getCustomerBookingById(id),
    enabled: Boolean(id),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createCustomerBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
      toast.success("Gig request submitted! Matching with verified workers.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit booking request");
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelCustomerBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
      toast.success("Booking cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to cancel booking");
    },
  });
}

export function useRateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RateBookingPayload }) =>
      rateCustomerBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
      toast.success("Thank you! Your rating and feedback have been submitted.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit rating");
    },
  });
}
