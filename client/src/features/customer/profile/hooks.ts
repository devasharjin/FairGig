import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/features/auth/store";
import {
  getCustomerProfile,
  updateCustomerProfile,
  updatePrimaryAddress,
  addSavedAddress,
  updateSavedAddress,
  deleteSavedAddress,
  setDefaultAddress,
} from "./api";
import type {
  UpdateCustomerProfilePayload,
  CustomerAddress,
  AddressFormData,
  UpdateAddressPayload,
} from "./types";

export const customerProfileKeys = {
  all: ["customer-profile"] as const,
  profile: () => [...customerProfileKeys.all, "detail"] as const,
};

export function useCustomerProfile() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: customerProfileKeys.profile(),
    queryFn: getCustomerProfile,
    enabled: Boolean(user),
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (payload: UpdateCustomerProfilePayload) =>
      updateCustomerProfile(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      if (res?.user && currentUser) {
        setUser({ ...currentUser, ...res.user });
      }
      toast.success("Profile details updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile details");
    },
  });
}

export function useUpdateCustomerAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CustomerAddress>) =>
      updatePrimaryAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
      toast.success("Primary address updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update primary address");
    },
  });
}

export function useAddSavedAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressFormData) => addSavedAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
      toast.success("New address added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add address");
    },
  });
}

export function useUpdateSavedAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      payload,
    }: {
      addressId: string;
      payload: UpdateAddressPayload;
    }) => updateSavedAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
      toast.success("Address updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update address");
    },
  });
}

export function useDeleteSavedAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteSavedAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
      toast.success("Address removed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove address");
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
      toast.success("Default address updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to set default address");
    },
  });
}
