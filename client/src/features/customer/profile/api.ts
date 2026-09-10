import { apiGet, apiPatch, apiPost, apiDelete } from "@/lib/api";
import type {
  CustomerProfileData,
  UpdateCustomerProfilePayload,
  CustomerAddress,
  SavedAddress,
  AddressFormData,
  UpdateAddressPayload,
} from "./types";

export async function getCustomerProfile(): Promise<CustomerProfileData> {
  return apiGet<CustomerProfileData>("/api/customer/profile");
}

export async function updateCustomerProfile(
  payload: UpdateCustomerProfilePayload
): Promise<{ user: any }> {
  return apiPatch<{ user: any }, UpdateCustomerProfilePayload>(
    "/api/customer/profile",
    payload
  );
}

export async function updatePrimaryAddress(
  payload: Partial<CustomerAddress>
): Promise<{ address: CustomerAddress; savedAddresses: SavedAddress[] }> {
  return apiPatch<
    { address: CustomerAddress; savedAddresses: SavedAddress[] },
    Partial<CustomerAddress>
  >("/api/customer/profile/address", payload);
}

export async function addSavedAddress(
  payload: AddressFormData
): Promise<{ address: CustomerAddress; savedAddresses: SavedAddress[] }> {
  return apiPost<
    { address: CustomerAddress; savedAddresses: SavedAddress[] },
    AddressFormData
  >("/api/customer/profile/addresses", payload);
}

export async function updateSavedAddress(
  addressId: string,
  payload: UpdateAddressPayload
): Promise<{ address: CustomerAddress; savedAddresses: SavedAddress[] }> {
  return apiPatch<
    { address: CustomerAddress; savedAddresses: SavedAddress[] },
    UpdateAddressPayload
  >(`/api/customer/profile/addresses/${addressId}`, payload);
}

export async function deleteSavedAddress(
  addressId: string
): Promise<{ address: CustomerAddress; savedAddresses: SavedAddress[] }> {
  return apiDelete<{ address: CustomerAddress; savedAddresses: SavedAddress[] }>(
    `/api/customer/profile/addresses/${addressId}`
  );
}

export async function setDefaultAddress(
  addressId: string
): Promise<{ address: CustomerAddress; savedAddresses: SavedAddress[] }> {
  return apiPatch<{ address: CustomerAddress; savedAddresses: SavedAddress[] }>(
    `/api/customer/profile/addresses/${addressId}/default`
  );
}
