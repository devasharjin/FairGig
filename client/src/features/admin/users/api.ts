import { apiGet, apiPatch } from "@/lib/api";
import type {
  AdminUser,
  AdminUserDetailResponse,
  AdminUserStats,
  PaginatedUsersResponse,
  UserFilterParams,
  UserRole,
  AccountStatus,
} from "./types";

export async function getAdminUsers(
  params: UserFilterParams = {}
): Promise<PaginatedUsersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.role && params.role !== "ALL") query.append("role", params.role);
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.search && params.search.trim()) query.append("search", params.search.trim());

  const queryString = query.toString();
  const url = `/api/admin/users${queryString ? `?${queryString}` : ""}`;
  return apiGet<PaginatedUsersResponse>(url);
}

export async function getAdminUserStats(): Promise<AdminUserStats> {
  return apiGet<AdminUserStats>("/api/admin/users/stats");
}

export async function getAdminUserById(id: string): Promise<AdminUserDetailResponse> {
  return apiGet<AdminUserDetailResponse>(`/api/admin/users/${id}`);
}

export async function updateAdminUserStatus(
  id: string,
  status: AccountStatus,
  reason?: string
): Promise<{ user: AdminUser; message: string }> {
  return apiPatch<{ user: AdminUser; message: string }, { status: AccountStatus; reason?: string }>(
    `/api/admin/users/${id}/status`,
    { status, reason }
  );
}

export async function updateAdminUserRoles(
  id: string,
  roles: UserRole[]
): Promise<{ user: AdminUser; message: string }> {
  return apiPatch<{ user: AdminUser; message: string }, { roles: UserRole[] }>(
    `/api/admin/users/${id}/roles`,
    { roles }
  );
}
