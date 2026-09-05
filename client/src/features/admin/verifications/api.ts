import { apiGet, apiPatch } from "@/lib/api";
import type {
  AdminCooperativesResponse,
  AdminCooperative,
  VerifyCooperativePayload,
  GetAdminCooperativesParams,
} from "./types";

export async function getAdminCooperatives(
  params?: GetAdminCooperativesParams
): Promise<AdminCooperativesResponse> {
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
    ? `/api/admin/verifications/cooperatives?${queryString}`
    : "/api/admin/verifications/cooperatives";

  return apiGet<AdminCooperativesResponse>(url);
}

export async function getAdminCooperativeById(
  id: string
): Promise<AdminCooperative> {
  return apiGet<AdminCooperative>(`/api/admin/verifications/cooperatives/${id}`);
}

export async function verifyAdminCooperative(
  id: string,
  payload: VerifyCooperativePayload
): Promise<AdminCooperative> {
  return apiPatch<AdminCooperative, VerifyCooperativePayload>(
    `/api/admin/verifications/cooperatives/${id}/verify`,
    payload
  );
}
