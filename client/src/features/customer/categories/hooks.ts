import { useQuery } from "@tanstack/react-query";
import { getCustomerCategories, getCustomerCategoryById } from "./api";
import type { CategoryFilterParams } from "./types";

export const customerCategoryKeys = {
  all: ["customer-categories"] as const,
  lists: () => [...customerCategoryKeys.all, "list"] as const,
  list: (filters?: CategoryFilterParams) => [...customerCategoryKeys.lists(), filters] as const,
  details: () => [...customerCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...customerCategoryKeys.details(), id] as const,
};

export function useCustomerCategories(filters?: CategoryFilterParams) {
  return useQuery({
    queryKey: customerCategoryKeys.list(filters),
    queryFn: () => getCustomerCategories(filters),
  });
}

export function useCustomerCategory(id: string) {
  return useQuery({
    queryKey: customerCategoryKeys.detail(id),
    queryFn: () => getCustomerCategoryById(id),
    enabled: Boolean(id),
  });
}
