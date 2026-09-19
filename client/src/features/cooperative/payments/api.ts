import { apiGet } from "@/lib/api";
import type {
  CooperativePaymentsResponse,
  CooperativePaymentStats,
  GetCooperativePaymentsParams,
} from "./types";

export async function getCooperativePayments(
  params?: GetCooperativePaymentsParams
): Promise<CooperativePaymentsResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "ALL") {
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
    ? `/api/cooperative/payments?${queryString}`
    : "/api/cooperative/payments";

  return apiGet<CooperativePaymentsResponse>(url);
}

export async function getCooperativePaymentStats(): Promise<CooperativePaymentStats> {
  return apiGet<CooperativePaymentStats>("/api/cooperative/payments/stats");
}
