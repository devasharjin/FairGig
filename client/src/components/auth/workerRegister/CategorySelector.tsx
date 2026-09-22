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

// Helper to map trade name/slug to a representative Lucide icon
function getTradeIcon(name: string) {
  const text = name.toLowerCase();
  if (text.includes("electr") || text.includes("power") || text.includes("wir")) return Zap;
  if (text.includes("plumb") || text.includes("water") || text.includes("pipe") || text.includes("drain")) return Droplets;
  if (text.includes("carpent") || text.includes("wood") || text.includes("furnit")) return Hammer;
  if (text.includes("paint") || text.includes("decor") || text.includes("renovat")) return Paintbrush;
  if (text.includes("ac") || text.includes("hvac") || text.includes("cool") || text.includes("air")) return Fan;
  if (text.includes("appliance") || text.includes("tech") || text.includes("fridge")) return Tv;
  if (text.includes("garden") || text.includes("lawn") || text.includes("plant")) return Sparkles;
  if (text.includes("construct") || text.includes("mason") || text.includes("build") || text.includes("civil")) return HardHat;
  if (text.includes("clean") || text.includes("sanit") || text.includes("wash")) return Sparkles;
  if (text.includes("salon") || text.includes("beauty") || text.includes("barber")) return Scissors;
  if (text.includes("transport") || text.includes("shift") || text.includes("mov")) return Truck;
  if (text.includes("gas") || text.includes("weld") || text.includes("fire")) return Flame;
  return Wrench;
}

interface CategorySelectorProps {
  categories: any[];
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

  const selectedTrade = categories.find((c) => c._id === selectedCategoryId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Wrench className="size-3.5 text-primary" />
          Primary Trade Service <span className="text-destructive">*</span>
        </Label>
        {selectedTrade && (
          <span className="text-xs text-primary font-semibold flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            <Check className="size-3" />
            {selectedTrade.name}
          </span>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Select your skilled trade service (e.g. Plumber, Electrician, Gardener). Your profile and assigned customer gigs will be matched to this trade.
      </p>

      {/* Search Input */}
      {categories.length > 4 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trade services (e.g. Plumber, Electrician, Gardener)..."
            className="pl-9 h-10 rounded-2xl bg-input/20 border-border/70 text-xs"
          />
        </div>
      )}

      {/* Trades Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-muted/40 border border-border/70 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center rounded-2xl bg-card border border-dashed border-border/80 text-muted-foreground text-xs space-y-1">
          <p className="font-semibold text-foreground">No matching trades found</p>
          <p>Try searching for another service like Plumber, Electrician, or Gardener.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filtered.map((cat) => {
            const isSelected = selectedCategoryId === cat._id;
            const Icon = getTradeIcon(cat.name);

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => onSelectCategory(cat._id)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer relative",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/40"
                    : "bg-card border-border/70 hover:border-primary/40 hover:bg-muted/40 text-foreground"
                )}
              >
                <div
                  className={cn(
                    "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors text-base",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {cat.icon ? (
                    <span>{cat.icon}</span>
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold block truncate">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">
                    {cat.description || "Certified trade service"}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="size-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
