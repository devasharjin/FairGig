import type { AppUser } from "@/lib/types";

// ==========================================
// Enums & Shared Sub-types
// ==========================================

export type WorkerAvailability = "Full-Time" | "Part-Time";

export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPEND";

export interface WorkerAddress {
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
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
  phone?: string;
}

// Alias for Customer registration
export type UserRegisterPayload = CustomerRegisterPayload;

/**
 * Payload for POST /api/auth/register/worker (Requires Authentication)
 */
export interface WorkerRegisterPayload {
  skills: string[];
  cooperativeId?: string;
  federationId?: string;
  availability?: WorkerAvailability;
  yearsOfExperience?: number;
  address?: WorkerAddress;
}

/**
 * Payload for POST /api/auth/register/cooperative (Requires Authentication)
 */
export interface CooperativeRegisterPayload {
  cooperativeName: string;
  cooperativeDescription?: string;
  cooperativeAddress?: string;
  cooperativePhone?: string;
  cooperativeEmail?: string;
  cooperativeLogo?: string;
  federationId?: string;
  members?: string[];
  services?: string[];
}

/**
 * Payload for POST /api/auth/register/federation (Requires Authentication)
 */
export interface FederativeRegisterPayload {
  federativeName: string;
  federativeDescription?: string;
  federativeAddress?: string;
  federativePhone?: string;
  federativeEmail?: string;
  federativeLogo?: string;
  members?: string[];
  services?: string[];
}

// Alias for Federative registration
export type FederationRegisterPayload = FederativeRegisterPayload;

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

export interface WorkerProfile {
  _id: string;
  userId: string;
  cooperativeId?: string | CooperativeProfile;
  federationId?: string | FederativeProfile;
  skills: string[];
  availability: WorkerAvailability;
  yearsOfExperience: number;
  verificationStatus: VerificationStatus;
  rating: number;
  address?: WorkerAddress;
  createdAt?: string;
  updatedAt?: string;
}

export interface CooperativeProfile {
  _id: string;
  userId: string;
  federationId?: string | FederativeProfile;
  cooperativeName: string;
  cooperativeDescription?: string;
  cooperativeAddress?: string;
  cooperativePhone?: string;
  cooperativeEmail?: string;
  cooperativeLogo?: string;
  members?: string[] | WorkerProfile[];
  services?: string[];
  verificationStatus: VerificationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CooperativeOption {
  _id: string;
  cooperativeName: string;
  cooperativeDescription?: string;
  cooperativeAddress?: string;
  services?: string[];
}

export interface FederativeProfile {
  _id: string;
  userId: string;
  federativeName: string;
  federativeDescription?: string;
  federativeAddress?: string;
  federativePhone?: string;
  federativeEmail?: string;
  federativeLogo?: string;
  members?: string[] | CooperativeProfile[];
  services?: string[];
  verificationStatus: VerificationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FederationOption {
  _id: string;
  federativeName: string;
  federativeDescription?: string;
  federativeAddress?: string;
  services?: string[];
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
  federative?: FederativeProfile | null;
  profile?: WorkerProfile | CooperativeProfile | FederativeProfile | null;
};

