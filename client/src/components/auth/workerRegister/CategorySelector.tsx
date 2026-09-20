import React, { useState } from "react";
import {
  Wrench,
  Search,
  Check,
  Sparkles,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Fan,
  Tv,
  HardHat,
  Scissors,
  Truck,
  Flame,
  Layers,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Category } from "@/features/customer/categories/types";

// Helper to map category name/slug to a representative Lucide icon
function getCategoryIcon(name: string, slug?: string) {
  const text = `${name} ${slug || ""}`.toLowerCase();
  if (text.includes("electr") || text.includes("power") || text.includes("wir")) return Zap;
  if (text.includes("plumb") || text.includes("water") || text.includes("pipe") || text.includes("drain")) return Droplets;
  if (text.includes("carpent") || text.includes("wood") || text.includes("furnit")) return Hammer;
  if (text.includes("paint") || text.includes("decor") || text.includes("renovat")) return Paintbrush;
  if (text.includes("ac") || text.includes("hvac") || text.includes("cool") || text.includes("air")) return Fan;
  if (text.includes("appliance") || text.includes("tv") || text.includes("fridge")) return Tv;
  if (text.includes("construct") || text.includes("mason") || text.includes("build") || text.includes("civil")) return HardHat;
  if (text.includes("clean") || text.includes("sanit") || text.includes("wash")) return Sparkles;
  if (text.includes("salon") || text.includes("beauty") || text.includes("barber")) return Scissors;
  if (text.includes("transport") || text.includes("shift") || text.includes("mov")) return Truck;
  if (text.includes("gas") || text.includes("weld") || text.includes("fire")) return Flame;
  return Layers;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  isLoading?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Wrench className="size-3.5 text-primary" />
          Primary Trade Category <span className="text-destructive">*</span>
        </Label>
        {selectedCategory && (
          <span className="text-xs text-primary font-semibold flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            <Check className="size-3" />
            {selectedCategory.name}
          </span>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Select your core trade. All services and gigs under this category will automatically be enabled for your profile.
      </p>

      {/* Search Input if more than 4 categories */}
      {categories.length > 4 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trade categories (e.g. Electrical, Plumbing, Carpentry)..."
            className="pl-9 h-10 rounded-2xl bg-input/20 border-border/70 text-xs"
          />
        </div>
      )}

      {/* Categories Grid */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-border/80 rounded-2xl bg-muted/10">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading trade categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10">
          <p className="text-xs text-muted-foreground">
            {searchQuery ? "No matching trade categories found." : "No trade categories available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
          {filtered.map((cat) => {
            const isSelected = selectedCategoryId === cat._id;
            const Icon = getCategoryIcon(cat.name, cat.slug);

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => onSelectCategory(cat._id)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex items-start gap-3 group",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm shadow-primary/15 ring-1 ring-primary/40"
                    : "bg-background/80 border-border/70 hover:border-primary/40 hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}
                >
                  <Icon className="size-4.5" />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-xs font-semibold truncate",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {cat.name}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div
                  className={cn(
                    "size-4 rounded-full border flex items-center justify-center shrink-0 absolute top-3 right-3 transition-all",
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 group-hover:border-primary/50"
                  )}
                >
                  {isSelected && <Check className="size-2.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
