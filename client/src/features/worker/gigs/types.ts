import type { Category } from "@/features/customer/categories/types";
import type { CustomerService } from "@/features/customer/services/types";
import type {
  BookingAddress,
  BookingPricingSnapshot,
  BookingRatingInfo,
  BookingStatus,
  BookingType,
  EmergencyDetails,
  PaymentStatus,
  UrgencyLevel,
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
  bookingType?: BookingType;
  isEmergency?: boolean;
  urgencyLevel?: UrgencyLevel;
  emergencyDetails?: EmergencyDetails;
  priceType: "hourly" | "meters";
  rate: number;
  units: number;
  totalAmount: number;
  pricing?: BookingPricingSnapshot;
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
  distanceKm?: number;
  distanceText?: string;
  transportFee?: number;
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
  cancellationsToday?: number;
  cancellationLimit?: number;
  canCancelToday?: boolean;
  weeklyServiceLimit?: number;
  weeklyAcceptedCount?: number;
  weeklyServicesRemaining?: number;
  canAcceptWeeklyService?: boolean;
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
