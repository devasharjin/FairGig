import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createAdminCategory,
  createAdminService,
  deleteAdminCategory,
  deleteAdminService,
  getAdminCategories,
  getAdminCategoryById,
  getAdminServiceById,
  getAdminServices,
  updateAdminCategory,
  updateAdminService,
} from "./api";
import type {
  CategoryFilterParams,
  CreateCategoryPayload,
  CreateServicePayload,
  ServiceFilterParams,
  UpdateCategoryPayload,
  UpdateServicePayload,
} from "./types";

// ==========================================
// Query Key Factories
// ==========================================

export const adminCategoryKeys = {
  all: ["admin-categories"] as const,
  lists: () => [...adminCategoryKeys.all, "list"] as const,
  list: (filters?: CategoryFilterParams) => [...adminCategoryKeys.lists(), filters] as const,
  details: () => [...adminCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...adminCategoryKeys.details(), id] as const,
};

export const adminServiceKeys = {
  all: ["admin-services"] as const,
  lists: () => [...adminServiceKeys.all, "list"] as const,
  list: (filters?: ServiceFilterParams) => [...adminServiceKeys.lists(), filters] as const,
  details: () => [...adminServiceKeys.all, "detail"] as const,
  detail: (id: string) => [...adminServiceKeys.details(), id] as const,
};

// ==========================================
// Category Hooks
// ==========================================

export function useAdminCategories(filters?: CategoryFilterParams) {
  return useQuery({
    queryKey: adminCategoryKeys.list(filters),
    queryFn: () => getAdminCategories(filters),
  });
}

export function useAdminCategory(id: string) {
  return useQuery({
    queryKey: adminCategoryKeys.detail(id),
    queryFn: () => getAdminCategoryById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createAdminCategory(payload),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      toast.success(`Category "${category.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      updateAdminCategory(id, payload),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.all });
      toast.success(`Category "${category.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.all });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

// ==========================================
// Service Hooks
// ==========================================

export function useAdminServices(filters?: ServiceFilterParams) {
  return useQuery({
    queryKey: adminServiceKeys.list(filters),
    queryFn: () => getAdminServices(filters),
  });
}

export function useAdminService(id: string) {
  return useQuery({
    queryKey: adminServiceKeys.detail(id),
    queryFn: () => getAdminServiceById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAdminService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => createAdminService(payload),
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.all });
      toast.success(`Service "${service.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create service");
    },
  });
}

export function useUpdateAdminService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServicePayload }) =>
      updateAdminService(id, payload),
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.all });
      toast.success(`Service "${service.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service");
    },
  });
}

export function useDeleteAdminService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.all });
      toast.success("Service deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete service");
    },
  });
}
