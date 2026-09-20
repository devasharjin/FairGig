export type UserRole = "CUSTOMER" | "WORKER" | "COOPERATIVE" | "SUPERADMIN";
export type AccountStatus = "ACTIVE" | "SUSPEND" | "INACTIVE";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole[];
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  byRole: {
    customers: number;
    workers: number;
    cooperatives: number;
    superadmins: number;
  };
}

export interface UserFilterParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface PaginatedUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUserDetailResponse {
  user: AdminUser;
  workerProfile?: any;
  cooperativeProfile?: any;
  activity?: {
    customerBookingsCount: number;
  };
}
