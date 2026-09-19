import type { BookingPricingSnapshot } from "@/features/customer/bookings/types";

export interface AdminPaymentItem {
  _id: string;
  booking: {
    _id: string;
    bookingNumber: string;
    totalAmount: number;
    priceType?: string;
    pricing?: BookingPricingSnapshot;
    service?: {
      name: string;
      description?: string;
      firstHourRate?: number;
      additionalHourRate?: number;
      transportFee?: number;
      cooperativeShare?: number;
      insuranceShare?: number;
      hourlyPrice?: number;
      metersPrice?: number;
    };
    category?: {
      name: string;
      icon?: string;
      slug?: string;
    };
  };
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
  };
  worker?: {
    _id: string;
    userId?: {
      name: string;
      phone?: string;
      email?: string;
      profilePicture?: string;
    };
  };
  cooperative?: {
    _id: string;
    cooperativeName: string;
    cooperativeEmail?: string;
    cooperativePhone?: string;
  };
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: "CREATED" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod?: string;
  receipt?: string;
  errorDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentsResponse {
  payments: AdminPaymentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminPaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  paidCount: number;
  pendingCount: number;
  pendingAmount: number;
  failedCount: number;
  todayRevenue: number;
  todayCount: number;
  activeCooperativesCount: number;
  avgOrderValue: number;
}

export interface GetAdminPaymentsParams {
  status?: string;
  search?: string;
  cooperativeId?: string;
  page?: number;
  limit?: number;
}
