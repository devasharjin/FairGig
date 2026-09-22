import type { Category } from "../categories/types";

export type ServicePriceType = "hourly" | "meters";

export interface CustomerService {
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
  emergencyAvailable?: boolean;
  emergencyFee?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerServiceFilterParams {
  search?: string;
  q?: string;
  category?: string;
  priceType?: ServicePriceType | "all";
  isActive?: boolean | string;
  sortBy?: string;
  order?: "asc" | "desc";
}
