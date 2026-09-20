export type WelfareClaimType =
  | "ACCIDENTAL_INJURY"
  | "MEDICAL_HOSPITALIZATION"
  | "EMERGENCY_HARDSHIP"
  | "TOOL_EQUIPMENT_LOSS"
  | "HEALTH_CHECKUP";

export type WelfareClaimStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED";

export type WelfareUrgency = "STANDARD" | "URGENT" | "CRITICAL";

export interface IWelfareDocument {
  title: string;
  url: string;
  uploadedAt?: string;
}

export interface IWelfareAuditEntry {
  action: string;
  performedBy?: any;
  performedByName?: string;
  performedByRole?: string;
  timestamp: string;
  notes?: string;
}

export interface WelfareClaim {
  _id: string;
  claimNumber: string;
  worker?: any;
  workerUser?: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    profilePicture?: string;
  };
  cooperative?: {
    _id: string;
    cooperativeName: string;
    cooperativePhone?: string;
    cooperativeEmail?: string;
  };
  booking?: {
    _id: string;
    bookingNumber: string;
    scheduledDate?: string;
    totalAmount?: number;
  };
  claimType: WelfareClaimType;
  urgency: WelfareUrgency;
  title: string;
  description: string;
  incidentDate: string;
  amountRequested: number;
  amountApproved?: number;
  amountDisbursed?: number;
  status: WelfareClaimStatus;
  reviewNotes?: string;
  rejectionReason?: string;
  documents: IWelfareDocument[];
  disbursedAt?: string;
  disbursementTxnId?: string;
  disbursementMethod?: string;
  auditLog: IWelfareAuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface WelfarePolicyCoverage {
  accidentalInjuryMax: number;
  hospitalizationMax: number;
  emergencyHardshipMax: number;
  toolEquipmentLossMax: number;
  healthCheckupAnnualMax: number;
}

export interface WelfarePolicy {
  policyNumber?: string;
  status?: string;
  tier?: string;
  underwriter: string;
  schemeName: string;
  coverage: WelfarePolicyCoverage;
  features: string[];
}

export interface WorkerWelfareSummary {
  policy: WelfarePolicy;
  contributions: {
    totalInsuranceAccrued: number;
    coveredJobsCompleted: number;
    totalHoursLogged: number;
  };
  claimsOverview: {
    totalClaimsCount: number;
    pendingClaimsCount: number;
    approvedClaimsCount: number;
    totalBenefitsReceived: number;
  };
}

export interface CooperativeWelfareStats {
  totalPoolCollected: number;
  totalDisbursedAmount: number;
  availableFundReserve: number;
  totalCompletedGigs: number;
  totalWorkersCovered: number;
  claimsStats: {
    totalClaimsCount: number;
    pendingReviewCount: number;
    pendingReviewAmount: number;
    approvedPendingDisbursementCount: number;
    rejectedCount: number;
  };
  cooperative?: {
    id: string;
    name: string;
  };
  policy: WelfarePolicy;
}

export interface CooperativeWorkerWelfareItem {
  workerId: string;
  user?: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    profilePicture?: string;
  };
  policyNumber: string;
  category?: string;
  coverageStatus: string;
  experience?: number;
  rating?: number;
  completedJobs: number;
  totalInsuranceContributed: number;
}

export interface PlatformWelfareStats {
  totalInsurancePool: number;
  totalSettledAmount: number;
  availableReserve: number;
  lossRatio: number;
  pendingLiability: number;
  totalCompletedJobs: number;
  totalWorkersEnrolled: number;
  claimsOverview: {
    totalClaimsCount: number;
    pendingClaimsCount: number;
    settledClaimsCount: number;
  };
  policyConfig: WelfarePolicy;
}

export interface CreateClaimPayload {
  claimType: WelfareClaimType;
  urgency?: WelfareUrgency;
  title: string;
  description: string;
  incidentDate?: string;
  amountRequested: number;
  bookingId?: string;
  documents?: IWelfareDocument[];
}
