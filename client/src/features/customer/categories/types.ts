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

export interface CategoryFilterParams {
  search?: string;
  q?: string;
  isActive?: boolean | string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}
