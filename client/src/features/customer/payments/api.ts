import { apiGet, apiPost } from "@/lib/api";
import type {
  CreatePaymentOrderPayload,
  CreatePaymentOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
  PaymentRecord,
  RazorpayConfigResponse,
} from "./types";

export async function createPaymentOrder(
  payload: CreatePaymentOrderPayload
): Promise<CreatePaymentOrderResponse> {
  return apiPost<CreatePaymentOrderResponse, CreatePaymentOrderPayload>(
    "/api/customer/payments/create-order",
    payload
  );
}

export async function verifyPayment(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> {
  return apiPost<VerifyPaymentResponse, VerifyPaymentPayload>(
    "/api/customer/payments/verify",
    payload
  );
}

export async function getPaymentByBooking(
  bookingId: string
): Promise<PaymentRecord | null> {
  return apiGet<PaymentRecord | null>(
    `/api/customer/payments/booking/${bookingId}`
  );
}

export async function getRazorpayConfig(): Promise<RazorpayConfigResponse> {
  return apiGet<RazorpayConfigResponse>("/api/customer/payments/config");
}
