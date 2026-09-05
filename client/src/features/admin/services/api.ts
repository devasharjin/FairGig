import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type {
  Category,
  CategoryFilterParams,
  CreateCategoryPayload,
  CreateServicePayload,
  Service,
  ServiceFilterParams,
  UpdateCategoryPayload,
  UpdateServicePayload,
} from "./types";

// ==========================================
// Category APIs (/api/admin/categories)
// ==========================================

export async function getAdminCategories(params?: CategoryFilterParams): Promise<Category[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.q) query.append("q", params.q);
  if (params?.isActive !== undefined && params.isActive !== "") {
    query.append("isActive", String(params.isActive));
  }
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.order) query.append("order", params.order);

  const queryString = query.toString();
  const url = queryString ? `/api/admin/categories?${queryString}` : "/api/admin/categories";
  return apiGet<Category[]>(url);
}

export async function getAdminCategoryById(id: string): Promise<Category> {
  return apiGet<Category>(`/api/admin/categories/${id}`);
}

export async function createAdminCategory(payload: CreateCategoryPayload): Promise<Category> {
  return apiPost<Category, CreateCategoryPayload>("/api/admin/categories", payload);
}

export async function updateAdminCategory(
  id: string,
  payload: UpdateCategoryPayload
): Promise<Category> {
  return apiPut<Category, UpdateCategoryPayload>(`/api/admin/categories/${id}`, payload);
}

export async function deleteAdminCategory(id: string): Promise<null> {
  return apiDelete<null>(`/api/admin/categories/${id}`);
}

// ==========================================
// Service APIs (/api/admin/services)
// ==========================================

export async function getAdminServices(params?: ServiceFilterParams): Promise<Service[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.q) query.append("q", params.q);
  if (params?.category) query.append("category", params.category);
  if (params?.priceType && params.priceType !== "all") {
    query.append("priceType", params.priceType);
  }
  if (params?.isActive !== undefined && params.isActive !== "") {
    query.append("isActive", String(params.isActive));
  }
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.order) query.append("order", params.order);

  const queryString = query.toString();
  const url = queryString ? `/api/admin/services?${queryString}` : "/api/admin/services";
  return apiGet<Service[]>(url);
}

export async function getAdminServiceById(id: string): Promise<Service> {
  return apiGet<Service>(`/api/admin/services/${id}`);
}

export async function createAdminService(payload: CreateServicePayload): Promise<Service> {
  return apiPost<Service, CreateServicePayload>("/api/admin/services", payload);
}

export async function updateAdminService(
  id: string,
  payload: UpdateServicePayload
): Promise<Service> {
  return apiPut<Service, UpdateServicePayload>(`/api/admin/services/${id}`, payload);
}

export async function deleteAdminService(id: string): Promise<null> {
  return apiDelete<null>(`/api/admin/services/${id}`);
}
