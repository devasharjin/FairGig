import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAvailableGigs,
  getWorkerJobs,
  getWorkerJobById,
  getWorkerStats,
  acceptGig,
  updateJobStatus,
  getWorkerProfile,
  updateWorkerProfile,
} from "./api";
import type { WorkerJobsFilterParams, WorkerProfileUpdatePayload } from "./types";
import type { BookingStatus } from "@/features/customer/bookings/types";

export const workerGigKeys = {
  all: ["worker-gigs"] as const,
  available: () => [...workerGigKeys.all, "available"] as const,
  jobs: (filters?: WorkerJobsFilterParams) => [...workerGigKeys.all, "jobs", filters] as const,
  job: (id: string) => [...workerGigKeys.all, "job", id] as const,
  stats: () => [...workerGigKeys.all, "stats"] as const,
  profile: () => [...workerGigKeys.all, "profile"] as const,
};

export function useAvailableGigs(params?: { type?: string }) {
  return useQuery({
    queryKey: [...workerGigKeys.available(), params],
    queryFn: () => getAvailableGigs(params),
    refetchInterval: 15000, // Refresh every 15 seconds to catch live emergency & on-demand dispatch requests
  });
}

export function useWorkerJobs(filters?: WorkerJobsFilterParams) {
  return useQuery({
    queryKey: workerGigKeys.jobs(filters),
    queryFn: () => getWorkerJobs(filters),
  });
}

export function useWorkerJob(id: string) {
  return useQuery({
    queryKey: workerGigKeys.job(id),
    queryFn: () => getWorkerJobById(id),
    enabled: Boolean(id),
  });
}

export function useWorkerStats() {
  return useQuery({
    queryKey: workerGigKeys.stats(),
    queryFn: getWorkerStats,
  });
}

export function useAcceptGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptGig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerGigKeys.all });
      toast.success("Gig accepted! Moved to your Active Jobs.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to accept gig");
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: BookingStatus;
      reason?: string;
    }) => updateJobStatus(id, status, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: workerGigKeys.all });
      toast.success(`Job marked as ${updated.status.toLowerCase().replace("_", " ")}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update job status");
    },
  });
}

export function useWorkerProfile() {
  return useQuery({
    queryKey: workerGigKeys.profile(),
    queryFn: getWorkerProfile,
  });
}

export function useUpdateWorkerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkerProfileUpdatePayload) =>
      updateWorkerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerGigKeys.profile() });
      queryClient.invalidateQueries({ queryKey: workerGigKeys.stats() });
      toast.success("Worker profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
}

