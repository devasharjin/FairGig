import { apiGet } from "@/lib/api";
import type { Category, CategoryFilterParams } from "./types";

export async function getCustomerCategories(
  params?: CategoryFilterParams
): Promise<Category[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.q) query.append("q", params.q);
  if (params?.isActive !== undefined && params.isActive !== "") {
    query.append("isActive", String(params.isActive));
  }
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.order) query.append("order", params.order);

  const queryString = query.toString();
  const url = queryString ? `/api/customer/categories?${queryString}` : "/api/customer/categories";
  return apiGet<Category[]>(url);
}

export async function getCustomerCategoryById(id: string): Promise<Category> {
  return apiGet<Category>(`/api/customer/categories/${id}`);
}
