import { apiGet, apiPatch } from "@/lib/api";
import type {
  WorkerJob,
  WorkerStats,
  WorkerJobsFilterParams,
  WorkerProfileUpdatePayload,
} from "./types";
import type { BookingStatus } from "@/features/customer/bookings/types";

export async function getAvailableGigs(params?: { type?: string }): Promise<WorkerJob[]> {
  const query = new URLSearchParams();
  if (params?.type && params.type !== "all") {
    query.append("type", params.type);
  }
  const queryString = query.toString();
  const url = queryString ? `/api/worker/gigs/available?${queryString}` : "/api/worker/gigs/available";
  return apiGet<WorkerJob[]>(url);
}

export async function getWorkerJobs(
  params?: WorkerJobsFilterParams
): Promise<WorkerJob[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") {
    query.append("status", params.status);
  }
  const queryString = query.toString();
  const url = queryString ? `/api/worker/gigs/my-jobs?${queryString}` : "/api/worker/gigs/my-jobs";
  return apiGet<WorkerJob[]>(url);
}

export async function getWorkerStats(): Promise<WorkerStats> {
  return apiGet<WorkerStats>("/api/worker/gigs/stats");
}

export async function getWorkerJobById(id: string): Promise<WorkerJob> {
  return apiGet<WorkerJob>(`/api/worker/gigs/jobs/${id}`);
}

export async function acceptGig(id: string): Promise<WorkerJob> {
  return apiPatch<WorkerJob>(`/api/worker/gigs/${id}/accept`);
}

export async function updateJobStatus(
  id: string,
  status: BookingStatus,
  reason?: string
): Promise<WorkerJob> {
  return apiPatch<WorkerJob, { status: BookingStatus; reason?: string }>(
    `/api/worker/gigs/${id}/status`,
    { status, reason }
  );
}

export async function getWorkerProfile(): Promise<any> {
  return apiGet<any>("/api/auth/me");
}

export async function updateWorkerProfile(
  payload: WorkerProfileUpdatePayload
): Promise<any> {
  return apiPatch<any, WorkerProfileUpdatePayload>(
    "/api/worker/gigs/profile",
    payload
  );
}

