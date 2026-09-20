export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export interface CooperativeWorkerUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  accountStatus: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CooperativeWorkerSkill {
  _id: string;
  name: string;
  description?: string;
  category?: any;
  priceType?: string;
  hourlyPrice?: number;
  metersPrice?: number;
}

export interface CooperativeWorkerCategory {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export interface VerificationDocument {
  url: string;
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface CooperativeWorker {
  _id: string;
  userId: CooperativeWorkerUser;
  cooperativeId: string;
  category?: CooperativeWorkerCategory | string;
  categories?: (CooperativeWorkerCategory | string)[];
  skills: CooperativeWorkerSkill[];
  availability: "Full-Time" | "Part-Time";
  verificationStatus: VerificationStatus;
  verificationDocuments: {
    identity: VerificationDocument;
    certificate: VerificationDocument;
  };
  experience: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  rating: number;
  totalJobsCompleted: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CooperativeWorkersResponse {
  cooperative: {
    _id: string;
    cooperativeName: string;
  };
  workers: CooperativeWorker[];
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface VerifyWorkerPayload {
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
}
