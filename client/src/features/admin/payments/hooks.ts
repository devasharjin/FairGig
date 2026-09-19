import { useQuery } from "@tanstack/react-query";
import { getAdminPayments, getAdminPaymentStats } from "./api";
import type {
  AdminPaymentsResponse,
  AdminPaymentStats,
  GetAdminPaymentsParams,
} from "./types";

export const adminPaymentKeys = {
  all: ["admin-payments"] as const,
  lists: () => [...adminPaymentKeys.all, "list"] as const,
  list: (params?: GetAdminPaymentsParams) =>
    [...adminPaymentKeys.lists(), params] as const,
  stats: () => [...adminPaymentKeys.all, "stats"] as const,
};

export function useAdminPayments(params?: GetAdminPaymentsParams) {
  return useQuery<AdminPaymentsResponse, Error>({
    queryKey: adminPaymentKeys.list(params),
    queryFn: () => getAdminPayments(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
}

export function useAdminPaymentStats() {
  return useQuery<AdminPaymentStats, Error>({
    queryKey: adminPaymentKeys.stats(),
    queryFn: () => getAdminPaymentStats(),
    staleTime: 60 * 1000,
  });
}
