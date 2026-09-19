import type { Category } from "@/features/customer/categories/types";
import type { CustomerService } from "@/features/customer/services/types";
import type {
  BookingAddress,
  BookingRatingInfo,
  BookingStatus,
  PaymentStatus,
} from "@/features/customer/bookings/types";

export interface WorkerJobCustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export interface WorkerJob {
  _id: string;
  bookingNumber: string;
  customer: WorkerJobCustomer;
  service: CustomerService;
  category?: Category;
  address: BookingAddress;
  scheduledDate: string;
  customerNotes?: string;
  priceType: "hourly" | "meters";
  rate: number;
  units: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string;
  };
  status: BookingStatus;
  isRated: boolean;
  rating?: BookingRatingInfo;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerStats {
  activeJobs: number;
  completedJobs: number;
  availableGigs: number;
  totalEarnings: number;
  rating: number;
  totalJobsCompleted: number;
  verificationStatus: string;
}

export interface WorkerJobsFilterParams {
  status?: string;
}

export interface WorkerProfileUpdatePayload {
  name?: string;
  phone?: string;
  availability?: "Full-Time" | "Part-Time";
  experience?: number;
  isActive?: boolean;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  };
}
