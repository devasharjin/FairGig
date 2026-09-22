export type ServicePriceType = "hourly" | "meters";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoryFilterParams {
  search?: string;
  q?: string;
  isActive?: boolean | string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category?: Category | string;
  icon?: string;
  priceType: ServicePriceType;
  firstHourRate?: number;
  additionalHourRate?: number;
  transportFee?: number;
  cooperativeShare?: number;
  insuranceShare?: number;
  hourlyPrice?: number;
  metersPrice?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  category?: string;
  icon?: string;
  priceType?: ServicePriceType;
  firstHourRate: number;
  additionalHourRate: number;
  transportFee?: number;
  cooperativeShare?: number;
  insuranceShare?: number;
  hourlyPrice?: number;
  metersPrice?: number;
  isActive?: boolean;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  priceType?: ServicePriceType;
  firstHourRate?: number;
  additionalHourRate?: number;
  transportFee?: number;
  cooperativeShare?: number;
  insuranceShare?: number;
  hourlyPrice?: number;
  metersPrice?: number;
  isActive?: boolean;
}

export interface ServiceFilterParams {
  search?: string;
  q?: string;
  category?: string;
  priceType?: ServicePriceType | "all";
  isActive?: boolean | string;
  sortBy?: string;
  order?: "asc" | "desc";
}
