import { apiGet } from "@/lib/api";
import type { CustomerService, CustomerServiceFilterParams } from "./types";

export async function getCustomerServices(
  params?: CustomerServiceFilterParams
): Promise<CustomerService[]> {
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
  const url = queryString ? `/api/customer/services?${queryString}` : "/api/customer/services";
  return apiGet<CustomerService[]>(url);
}

export async function getCustomerServiceById(id: string): Promise<CustomerService> {
  return apiGet<CustomerService>(`/api/customer/services/${id}`);
}
