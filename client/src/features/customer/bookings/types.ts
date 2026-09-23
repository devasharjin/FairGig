import type { CustomerService } from "../services/types";
import type { Category } from "../categories/types";

export type BookingStatus =
  | "PENDING"
  | "ASSIGNED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type BookingType = "SCHEDULED" | "PREMIUM" | "ON_DEMAND" | "EMERGENCY";

export type UrgencyLevel = "STANDARD" | "HIGH" | "CRITICAL";

export interface EmergencyDetails {
  hazardType?: string;
  severity?: "CRITICAL" | "HIGH" | "MEDIUM";
  immediateContact?: string;
  notes?: string;
}

export interface BookingAddress {
  street: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface BookingWorkerInfo {
  _id: string;
  userId: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profilePicture?: string;
  };
  rating: number;
  totalJobsCompleted: number;
}

export interface BookingRatingInfo {
  _id: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface BookingPricingSnapshot {
  firstHourRate: number;
  additionalHourRate: number;
  transportFee: number;
  cooperativePercentage: number;
  insurancePercentage: number;
  actualDurationMinutes: number;
  billableHours: number;
  firstHourCharge: number;
  additionalHoursCharge: number;
  serviceAmount: number;
  cooperativeShareAmount: number;
  insuranceShareAmount: number;
  workerNetEarnings: number;
  customerTotalAmount: number;
  isFinalized: boolean;
}

export interface CustomerBooking {
  _id: string;
  bookingNumber: string;
  customer: string;
  service: CustomerService;
  category?: Category;
  worker?: BookingWorkerInfo;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  serviceId: string;
  address: string | BookingAddress;
  scheduledDate?: string;
  customerNotes?: string;
  bookingType?: BookingType;
  isEmergency?: boolean;
  urgencyLevel?: UrgencyLevel;
  emergencyDetails?: EmergencyDetails;
  units?: number;
}

export interface RateBookingPayload {
  rating: number;
  review?: string;
}

export interface CustomerBookingFilterParams {
  status?: string;
  type?: string;
  isEmergency?: boolean;
}
