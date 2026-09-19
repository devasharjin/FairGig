import type { CustomerBooking } from "../bookings/types";

export type PaymentRecordStatus = "CREATED" | "PAID" | "FAILED" | "REFUNDED";

export interface PaymentRecord {
  _id: string;
  booking: string;
  customer: string;
  worker?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  paymentMethod?: string;
  receipt?: string;
  errorDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentOrderPayload {
  bookingId: string;
}

export interface CreatePaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  bookingNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  isMock: boolean;
}

export interface VerifyPaymentPayload {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  paymentMethod?: string;
}

export interface VerifyPaymentResponse {
  booking: CustomerBooking;
  payment: PaymentRecord;
}

export interface RazorpayConfigResponse {
  keyId: string;
  isConfigured: boolean;
  currency: string;
}
