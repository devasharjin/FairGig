export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export interface AdminCooperativeUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  accountStatus?: string;
  createdAt?: string;
}

export interface AdminCooperative {
  _id: string;
  userId: AdminCooperativeUser;
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
  createdAt: string;
  updatedAt: string;
}

export interface AdminCooperativesResponse {
  cooperatives: AdminCooperative[];
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

export interface VerifyCooperativePayload {
  action: "APPROVE" | "REJECT" | "PENDING";
  rejectionReason?: string;
}

export interface GetAdminCooperativesParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
