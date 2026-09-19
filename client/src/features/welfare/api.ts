import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type {
  WorkerWelfareSummary,
  WelfareClaim,
  CreateClaimPayload,
  CooperativeWelfareStats,
  CooperativeWorkerWelfareItem,
  PlatformWelfareStats,
  WelfarePolicy,
} from "./types";

// ==========================================
// WORKER WELFARE APIS
// ==========================================

export async function getWorkerWelfareOverview(): Promise<WorkerWelfareSummary> {
  return apiGet<WorkerWelfareSummary>("/api/worker/welfare/overview");
}

export async function getWorkerClaims(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  claims: WelfareClaim[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") query.append("status", params.status);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const queryString = query.toString();
  const url = queryString ? `/api/worker/welfare/claims?${queryString}` : "/api/worker/welfare/claims";
  return apiGet(url);
}

export async function fileWorkerClaim(payload: CreateClaimPayload): Promise<WelfareClaim> {
  return apiPost<WelfareClaim>("/api/worker/welfare/claims", payload);
}

export async function getWorkerClaimById(id: string): Promise<WelfareClaim> {
  return apiGet<WelfareClaim>(`/api/worker/welfare/claims/${id}`);
}

// ==========================================
// COOPERATIVE WELFARE APIS
// ==========================================

export async function getCooperativeWelfareStats(): Promise<CooperativeWelfareStats> {
  return apiGet<CooperativeWelfareStats>("/api/cooperative/welfare/stats");
}

export async function getCooperativeClaims(params?: {
  status?: string;
  claimType?: string;
  urgency?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  claims: WelfareClaim[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") query.append("status", params.status);
  if (params?.claimType && params.claimType !== "ALL") query.append("claimType", params.claimType);
  if (params?.urgency && params.urgency !== "ALL") query.append("urgency", params.urgency);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const queryString = query.toString();
  const url = queryString ? `/api/cooperative/welfare/claims?${queryString}` : "/api/cooperative/welfare/claims";
  return apiGet(url);
}

export async function updateCooperativeClaimStatus(
  id: string,
  payload: {
    status: string;
    amountApproved?: number;
    reviewNotes?: string;
    rejectionReason?: string;
    disbursementTxnId?: string;
  }
): Promise<WelfareClaim> {
  return apiPatch<WelfareClaim>(`/api/cooperative/welfare/claims/${id}/status`, payload);
}

export async function issueEmergencyGrant(payload: {
  workerId: string;
  amount: number;
  reason: string;
  disbursementTxnId?: string;
}): Promise<WelfareClaim> {
  return apiPost<WelfareClaim>("/api/cooperative/welfare/emergency-grant", payload);
}

export async function getCooperativeWorkerWelfareList(): Promise<{
  workers: CooperativeWorkerWelfareItem[];
  total: number;
}> {
  return apiGet("/api/cooperative/welfare/workers");
}

// ==========================================
// SUPER ADMIN WELFARE APIS
// ==========================================

export async function getPlatformWelfareStats(): Promise<PlatformWelfareStats> {
  return apiGet<PlatformWelfareStats>("/api/admin/welfare/stats");
}

export async function getAdminClaims(params?: {
  status?: string;
  claimType?: string;
  cooperativeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  claims: WelfareClaim[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") query.append("status", params.status);
  if (params?.claimType && params.claimType !== "ALL") query.append("claimType", params.claimType);
  if (params?.cooperativeId) query.append("cooperativeId", params.cooperativeId);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const queryString = query.toString();
  const url = queryString ? `/api/admin/welfare/claims?${queryString}` : "/api/admin/welfare/claims";
  return apiGet(url);
}

export async function auditAdminClaim(
  id: string,
  payload: {
    auditAction?: string;
    notes: string;
    newStatus?: string;
    overrideAmountApproved?: number;
  }
): Promise<WelfareClaim> {
  return apiPatch<WelfareClaim>(`/api/admin/welfare/claims/${id}/audit`, payload);
}

export async function getPlatformWelfarePolicyConfig(): Promise<WelfarePolicy> {
  return apiGet<WelfarePolicy>("/api/admin/welfare/policy");
}
