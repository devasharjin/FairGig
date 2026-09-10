export type UserRole = "WORKER" | "CUSTOMER" | "COOPERATIVE" | "SUPERADMIN";

export interface AppAddress {
  street: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  landmark?: string;
}

export interface AppSavedAddress extends AppAddress {
  _id: string;
  title: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AppUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole | UserRole[] | string | string[];
  profilePicture?: string;
  address?: AppAddress;
  savedAddresses?: AppSavedAddress[];
  accountStatus?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiEnvelope<T> = {
  success?: boolean;
  status?: number | string;
  data: T;
  message?: string;
  errors?: { message: string }[];
};
