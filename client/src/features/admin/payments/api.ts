import { apiGet } from "@/lib/api";
import type {
  AdminPaymentsResponse,
  AdminPaymentStats,
  GetAdminPaymentsParams,
} from "./types";

export async function getAdminPayments(
  params?: GetAdminPaymentsParams
): Promise<AdminPaymentsResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") {
    query.append("status", params.status);
  }
  if (params?.search) {
    query.append("search", params.search);
  }
  if (params?.cooperativeId) {
    query.append("cooperativeId", params.cooperativeId);
  }
  if (params?.page) {
    query.append("page", String(params.page));
  }
  if (params?.limit) {
    query.append("limit", String(params.limit));
  }

  const queryString = query.toString();
  const url = queryString
    ? `/api/admin/payments?${queryString}`
    : "/api/admin/payments";

  return apiGet<AdminPaymentsResponse>(url);
}

export async function getAdminPaymentStats(): Promise<AdminPaymentStats> {
  return apiGet<AdminPaymentStats>("/api/admin/payments/stats");
}
