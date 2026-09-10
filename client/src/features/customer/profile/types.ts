import type { AppUser } from "@/lib/types";

export interface CustomerAddress {
  street: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  landmark?: string;
}

export interface SavedAddress {
  _id: string;
  title: string;
  street: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  landmark?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerProfileStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSavedAddresses: number;
}

export interface CustomerProfileData {
  user: AppUser & {
    createdAt?: string;
    accountStatus?: string;
    profilePicture?: string;
  };
  address: CustomerAddress | null;
  savedAddresses: SavedAddress[];
  stats: CustomerProfileStats;
}

export interface UpdateCustomerProfilePayload {
  name?: string;
  phone?: string;
  profilePicture?: string;
}

export interface AddressFormData {
  title: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload extends Partial<AddressFormData> {}
