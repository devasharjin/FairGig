import { useQuery } from "@tanstack/react-query";
import { getCooperativePayments, getCooperativePaymentStats } from "./api";
import type {
  CooperativePaymentsResponse,
  CooperativePaymentStats,
  GetCooperativePaymentsParams,
} from "./types";

export const cooperativePaymentKeys = {
  all: ["cooperative-payments"] as const,
  lists: () => [...cooperativePaymentKeys.all, "list"] as const,
  list: (params?: GetCooperativePaymentsParams) =>
    [...cooperativePaymentKeys.lists(), params] as const,
  stats: () => [...cooperativePaymentKeys.all, "stats"] as const,
};

export function useCooperativePayments(params?: GetCooperativePaymentsParams) {
  return useQuery<CooperativePaymentsResponse, Error>({
    queryKey: cooperativePaymentKeys.list(params),
    queryFn: () => getCooperativePayments(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
}

export function useCooperativePaymentStats() {
  return useQuery<CooperativePaymentStats, Error>({
    queryKey: cooperativePaymentKeys.stats(),
    queryFn: () => getCooperativePaymentStats(),
    staleTime: 60 * 1000,
  });
}
