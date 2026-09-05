import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/features/admin/services/types";
import {
  Briefcase,
  Clock,
  Filter,
  Layers,
  Plus,
  Ruler,
  Search,
  Tag,
  X,
} from "lucide-react";

interface ServiceToolbarProps {
  activeTab: "services" | "categories";
  onTabChange: (tab: "services" | "categories") => void;
  search: string;
  onSearchChange: (search: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  priceType: string;
  onPriceTypeChange: (priceType: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenNewService: () => void;
  onOpenNewCategory: () => void;
  totalServices: number;
  totalCategories: number;
  categories: Category[];
}

export const ServiceToolbar: React.FC<ServiceToolbarProps> = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceType,
  onPriceTypeChange,
  statusFilter,
  onStatusFilterChange,
  onOpenNewService,
  onOpenNewCategory,
  totalServices,
  totalCategories,
  categories,
}) => {
  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "" ||
    priceType !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    onSearchChange("");
    onCategoryChange("");
    onPriceTypeChange("all");
    onStatusFilterChange("all");
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-muted/40 border border-border/80 self-start">
          <button
            type="button"
            onClick={() => onTabChange("services")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "services"
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="size-3.5 text-primary" />
            <span>Services Catalog</span>
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "services"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {totalServices}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "categories"
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tag className="size-3.5 text-emerald-500" />
            <span>Categories</span>
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "categories"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {totalCategories}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onOpenNewCategory}
            className="h-9 px-3 text-xs font-semibold rounded-xl border-border/80 hover:bg-accent cursor-pointer gap-1.5"
          >
            <Tag className="size-3.5 text-emerald-500" />
            <span>New Category</span>
          </Button>

          <Button
            type="button"
            onClick={onOpenNewService}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer gap-1.5"
          >
            <Plus className="size-4" />
            <span>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeTab === "services"
                ? "Search services by name, description..."
                : "Search categories by name, slug..."
            }
            className="pl-8.5 pr-8 h-9 text-xs rounded-xl bg-input/20 border-border/70"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Category Filter (When in Services Tab) */}
        {activeTab === "services" && (
          <div className="min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-border/70 bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Type Filter (When in Services Tab) */}
        {activeTab === "services" && (
          <div className="min-w-[130px]">
            <select
              value={priceType}
              onChange={(e) => onPriceTypeChange(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-border/70 bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Pricing Types</option>
              <option value="hourly">Hourly Rate (₹/hr)</option>
              <option value="meters">Per Meter (₹/m)</option>
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="min-w-[120px]">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-border/70 bg-input/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResetFilters}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-xl cursor-pointer"
          >
            <X className="size-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
