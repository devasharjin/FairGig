import { apiGet, apiPatch } from "@/lib/api";
import type {
  CooperativeWorkersResponse,
  CooperativeWorker,
  VerifyWorkerPayload,
} from "./types";

export interface GetWorkersParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getCooperativeWorkers(
  params?: GetWorkersParams
): Promise<CooperativeWorkersResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "All") {
    query.append("status", params.status);
  }
  if (params?.search) {
    query.append("search", params.search);
  }
  if (params?.page) {
    query.append("page", String(params.page));
  }
  if (params?.limit) {
    query.append("limit", String(params.limit));
  }

  const queryString = query.toString();
  const url = queryString
    ? `/api/cooperative/workers?${queryString}`
    : "/api/cooperative/workers";

  return apiGet<CooperativeWorkersResponse>(url);
}

export async function getCooperativeWorkerById(
  id: string
): Promise<CooperativeWorker> {
  return apiGet<CooperativeWorker>(`/api/cooperative/workers/${id}`);
}

export async function verifyCooperativeWorker(
  id: string,
  payload: VerifyWorkerPayload
): Promise<CooperativeWorker> {
  return apiPatch<CooperativeWorker, VerifyWorkerPayload>(
    `/api/cooperative/workers/${id}/verify`,
    payload
  );
}
