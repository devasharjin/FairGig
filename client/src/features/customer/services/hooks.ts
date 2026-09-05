import { useQuery } from "@tanstack/react-query";
import { getCustomerServiceById, getCustomerServices } from "./api";
import type { CustomerServiceFilterParams } from "./types";

export const customerServiceKeys = {
  all: ["customer-services"] as const,
  lists: () => [...customerServiceKeys.all, "list"] as const,
  list: (filters?: CustomerServiceFilterParams) => [...customerServiceKeys.lists(), filters] as const,
  details: () => [...customerServiceKeys.all, "detail"] as const,
  detail: (id: string) => [...customerServiceKeys.details(), id] as const,
};

export function useCustomerServices(filters?: CustomerServiceFilterParams) {
  return useQuery({
    queryKey: customerServiceKeys.list(filters),
    queryFn: () => getCustomerServices(filters),
  });
}

export function useCustomerService(id: string) {
  return useQuery({
    queryKey: customerServiceKeys.detail(id),
    queryFn: () => getCustomerServiceById(id),
    enabled: Boolean(id),
  });
}
