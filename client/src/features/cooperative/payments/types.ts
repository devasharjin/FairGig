export interface CooperativePaymentItem {
  _id: string;
  booking: {
    _id: string;
    bookingNumber: string;
    totalAmount: number;
    priceType?: string;
    service?: {
      name: string;
      description?: string;
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

export interface CooperativePaymentsResponse {
  payments: CooperativePaymentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  cooperative?: {
    id: string;
    name: string;
  };
}

export interface CooperativePaymentStats {
  totalGrossRevenue: number;
  totalWorkerPayouts: number;
  totalTransactions: number;
  paidCount: number;
  pendingCount: number;
  pendingAmount: number;
  failedCount: number;
  todayRevenue: number;
  todayCount: number;
  activeWorkersWithPayouts: number;
  societyName?: string;
}

export interface GetCooperativePaymentsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
