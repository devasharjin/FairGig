import type { AppUser } from "@/lib/types";

// ==========================================
// Enums & Shared Sub-types
// ==========================================

export type WorkerAvailability = "Full-Time" | "Part-Time";

export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPEND";

export interface WorkerAddress {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface WorkerLocation {
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface VerificationDocumentItem {
  url: string;
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface WorkerVerificationDocuments {
  identity: VerificationDocumentItem;
  certificate: VerificationDocumentItem;
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  landmark?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ==========================================
// Request Payloads (Backend Auth Routes)
// ==========================================

/**
 * Payload for POST /api/auth/login
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Payload for POST /api/auth/register/customer
 */
export interface CustomerRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

// Alias for Customer registration
export type UserRegisterPayload = CustomerRegisterPayload;

/**
 * Payload for POST /api/auth/register/worker (Requires Authentication)
 */
export interface WorkerRegisterPayload {
  category?: string;
  categoryId?: string;
  categories?: string[];
  categoryIds?: string[];
  skills?: string[];
  cooperativeId: string;
  availability?: WorkerAvailability;
  experience: number;
  yearsOfExperience?: number;
  location: WorkerLocation;
  address?: WorkerAddress;
  identityFile?: File;
  certificateFile?: File;
  identityUrl?: string;
  certificateUrl?: string;
}

/**
 * Payload for POST /api/auth/register/cooperative (Requires Authentication)
 */
export interface CooperativeRegisterPayload {
  cooperativeName: string;
  cooperativeAddress: string;
  cooperativePhone: string;
  cooperativeEmail: string;
  cooperativeLogoFile?: File;
  verificationCertificateFile?: File;
  cooperativeLogo?: {
    url: string;
    publicId: string;
  };
  verificationCertificate?: {
    url: string;
    publicId: string;
  };
}

/**
 * Payload for POST /api/auth/refresh-token
 * (Optional in body if sent via HTTP-only cookie)
 */
export interface RefreshTokenPayload {
  refreshToken?: string;
}

// ==========================================
// Profile & Entity Models
// ==========================================

export interface WorkerCategoryItem {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export interface WorkerSkillItem {
  _id: string;
  name: string;
  description?: string;
  category?: any;
  priceType?: "hourly" | "meters";
  hourlyPrice?: number;
  metersPrice?: number;
}

export interface WorkerProfile {
  _id: string;
  userId: string;
  cooperativeId: string | CooperativeProfile;
  category?: string | WorkerCategoryItem;
  categories?: (string | WorkerCategoryItem)[];
  skills: (string | WorkerSkillItem)[];
  availability: WorkerAvailability;
  experience: number;
  yearsOfExperience?: number;
  verificationStatus: VerificationStatus;
  verificationDocuments?: WorkerVerificationDocuments;
  location?: WorkerLocation;
  address?: WorkerAddress;
  rating: number;
  totalJobsCompleted: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CooperativeProfile {
  _id: string;
  userId: string;
  cooperativeName: string;
  cooperativeAddress: string;
  cooperativePhone: string;
  cooperativeEmail: string;
  cooperativeLogo: {
    url: string;
    publicId: string;
  };
  verificationCertificate: {
    url: string;
    publicId: string;
  };
  verificationStatus: VerificationStatus;
  rejectedReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CooperativeOption {
  _id: string;
  cooperativeName: string;
  cooperativeAddress?: string;
}

// ==========================================
// Response Payloads
// ==========================================

export interface LoginResponseData {
  user: AppUser;
  tokens: AuthTokens;
}

export interface RefreshTokenResponseData {
  tokens: AuthTokens;
}

/**
 * Return type for GET /api/auth/me
 */
export type MeResponse = AppUser & {
  user?: AppUser;
  worker?: WorkerProfile | null;
  cooperative?: CooperativeProfile | null;
  profile?: WorkerProfile | CooperativeProfile | null;
};

