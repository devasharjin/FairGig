import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCooperativeWorkers,
  getCooperativeWorkerById,
  verifyCooperativeWorker,
  type GetWorkersParams,
} from "./api";
import type {
  CooperativeWorkersResponse,
  CooperativeWorker,
  VerifyWorkerPayload,
} from "./types";

// ==========================================
// Query Key Factories
// ==========================================

export const cooperativeWorkerKeys = {
  all: ["cooperative-workers"] as const,
  lists: () => [...cooperativeWorkerKeys.all, "list"] as const,
  list: (params?: GetWorkersParams) =>
    [...cooperativeWorkerKeys.lists(), params] as const,
  details: () => [...cooperativeWorkerKeys.all, "detail"] as const,
  detail: (id: string) => [...cooperativeWorkerKeys.details(), id] as const,
};

// ==========================================
// Query Hooks
// ==========================================

/**
 * Fetch all workers belonging to the authenticated cooperative with optional filters
 */
export function useCooperativeWorkers(params?: GetWorkersParams) {
  return useQuery<CooperativeWorkersResponse, Error>({
    queryKey: cooperativeWorkerKeys.list(params),
    queryFn: () => getCooperativeWorkers(params),
  });
}

/**
 * Fetch details of a single worker
 */
export function useCooperativeWorker(id: string) {
  return useQuery<CooperativeWorker, Error>({
    queryKey: cooperativeWorkerKeys.detail(id),
    queryFn: () => getCooperativeWorkerById(id),
    enabled: Boolean(id),
  });
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Mutation to approve or reject a worker application
 */
export function useVerifyCooperativeWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: VerifyWorkerPayload;
    }) => verifyCooperativeWorker(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate both lists and specific worker details
      queryClient.invalidateQueries({ queryKey: cooperativeWorkerKeys.all });

      if (variables.payload.action === "APPROVE") {
        toast.success(
          `Worker "${data.userId?.name || "Applicant"}" approved and enrolled into cooperative!`
        );
      } else {
        toast.error(
          `Worker "${data.userId?.name || "Applicant"}" application rejected.`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update worker verification status."
      );
    },
  });
}
