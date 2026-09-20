export interface MemberSkill {
  _id: string;
  name: string;
  description?: string;
  priceType?: string;
  hourlyPrice?: number;
  metersPrice?: number;
}

export interface MemberUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  accountStatus?: string;
  createdAt?: string;
}

export interface MemberCategory {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export interface CooperativeMember {
  _id: string;
  userId: MemberUser;
  category?: MemberCategory | string;
  categories?: (MemberCategory | string)[];
  skills: MemberSkill[];
  availability: "Full-Time" | "Part-Time";
  verificationStatus: "Pending" | "Approved" | "Rejected";
  verificationDocuments?: {
    identity?: {
      url: string;
      status: string;
      rejectionReason?: string;
    };
    certificate?: {
      url: string;
      status: string;
      rejectionReason?: string;
    };
  };
  experience: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  rating: number;
  totalJobsCompleted: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRosterStats {
  totalMembers: number;
  activeOnDuty: number;
  inactiveCount: number;
  fullTimeCount: number;
  partTimeCount: number;
  pendingVerificationCount: number;
  averageRating: number;
  totalJobsCompleted: number;
}

export interface CooperativeMembersResponse {
  members: CooperativeMember[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: MemberRosterStats;
}

export interface MemberDossierResponse {
  member: CooperativeMember;
  recentGigs: any[];
  welfareClaims: any[];
}
