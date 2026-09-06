import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminCooperatives,
  getAdminCooperativeById,
  verifyAdminCooperative,
} from "./api";
import type {
  AdminCooperativesResponse,
  AdminCooperative,
  VerifyCooperativePayload,
  GetAdminCooperativesParams,
} from "./types";

// ==========================================
// Query Key Factories
// ==========================================

export const adminVerificationKeys = {
  all: ["admin-cooperative-verifications"] as const,
  lists: () => [...adminVerificationKeys.all, "list"] as const,
  list: (params?: GetAdminCooperativesParams) =>
    [...adminVerificationKeys.lists(), params] as const,
  details: () => [...adminVerificationKeys.all, "detail"] as const,
  detail: (id: string) => [...adminVerificationKeys.details(), id] as const,
};

// ==========================================
// Query Hooks
// ==========================================

/**
 * Fetch all cooperatives for administrative review with optional status/search filters
 */
export function useAdminCooperatives(params?: GetAdminCooperativesParams) {
  return useQuery<AdminCooperativesResponse, Error>({
    queryKey: adminVerificationKeys.list(params),
    queryFn: () => getAdminCooperatives(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch details of a single cooperative for admin review
 */
export function useAdminCooperative(id: string) {
  return useQuery<AdminCooperative, Error>({
    queryKey: adminVerificationKeys.detail(id),
    queryFn: () => getAdminCooperativeById(id),
    enabled: Boolean(id),
  });
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Mutation to approve, reject, or revert cooperative registration
 */
export function useVerifyAdminCooperative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: VerifyCooperativePayload;
    }) => verifyAdminCooperative(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate all cooperative verification queries
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.all });

      if (variables.payload.action === "APPROVE") {
        toast.success(
          `Cooperative "${data.cooperativeName}" has been approved!`
        );
      } else if (variables.payload.action === "REJECT") {
        toast.error(
          `Cooperative "${data.cooperativeName}" registration rejected.`
        );
      } else {
        toast.success(
          `Cooperative "${data.cooperativeName}" status reverted to pending.`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update cooperative verification status."
      );
    },
  });
}
