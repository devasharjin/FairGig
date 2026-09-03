export type UserRole = "WORKER" | "CUSTOMER" | "COOPERATIVE" | "FEDERATION" | "SUPERADMIN";

export type AppUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole | UserRole[] | string | string[];
  isActive?: boolean;
  isEmailVerified?: boolean;
};

export type ApiEnvelope<T> = {
  success?: boolean;
  status?: number | string;
  data: T;
  message?: string;
  errors?: { message: string }[];
};
