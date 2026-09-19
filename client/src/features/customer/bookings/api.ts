import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type {
  CustomerBooking,
  CreateBookingPayload,
  RateBookingPayload,
  CustomerBookingFilterParams,
} from "./types";

export async function getCustomerBookings(
  params?: CustomerBookingFilterParams
): Promise<CustomerBooking[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") {
    query.append("status", params.status);
  }
  if (params?.type && params.type !== "all") {
    query.append("type", params.type);
  }
  if (params?.isEmergency !== undefined) {
    query.append("isEmergency", String(params.isEmergency));
  }
  const queryString = query.toString();
  const url = queryString
    ? `/api/customer/bookings?${queryString}`
    : "/api/customer/bookings";
  return apiGet<CustomerBooking[]>(url);
}

export async function getCustomerBookingById(id: string): Promise<CustomerBooking> {
  return apiGet<CustomerBooking>(`/api/customer/bookings/${id}`);
}

export async function createCustomerBooking(
  payload: CreateBookingPayload
): Promise<CustomerBooking> {
  return apiPost<CustomerBooking, CreateBookingPayload>(
    "/api/customer/bookings",
    payload
  );
}

export async function cancelCustomerBooking(
  id: string,
  reason?: string
): Promise<CustomerBooking> {
  return apiPatch<CustomerBooking, { reason?: string }>(
    `/api/customer/bookings/${id}/cancel`,
    { reason }
  );
}

export async function rateCustomerBooking(
  id: string,
  payload: RateBookingPayload
): Promise<any> {
  return apiPost<any, RateBookingPayload>(
    `/api/customer/bookings/${id}/rate`,
    payload
  );
}
