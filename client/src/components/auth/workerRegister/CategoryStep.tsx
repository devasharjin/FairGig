import React from "react";
import { Clock, Briefcase, Building2, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelector } from "./CategorySelector";
import type { Category } from "@/features/customer/categories/types";
import type { CooperativeOption } from "@/features/auth/types";
import { cn } from "@/lib/utils";

export interface CategoryStepProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  isLoadingCategories: boolean;
  availability: "Full-Time" | "Part-Time";
  onAvailabilityChange: (val: "Full-Time" | "Part-Time") => void;
  experience: number;
  onExperienceChange: (val: number) => void;
  cooperativesList: CooperativeOption[];
  cooperativeId: string;
  onCooperativeChange: (val: string) => void;
  onNext: () => void;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoadingCategories,
  availability,
  onAvailabilityChange,
  experience,
  onExperienceChange,
  cooperativesList,
  cooperativeId,
  onCooperativeChange,
  onNext,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Category Selector */}
      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
        isLoading={isLoadingCategories}
      />

      {/* 2. Availability & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
        {/* Availability Toggle */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            Availability <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(["Full-Time", "Part-Time"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onAvailabilityChange(mode)}
                className={cn(
                  "h-11 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-center cursor-pointer",
                  availability === mode
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-input/20 border-border/80 text-foreground/80 hover:bg-muted/50"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor="experience"
            className="text-xs font-bold text-foreground flex items-center gap-1.5"
          >
            <Briefcase className="size-3.5 text-muted-foreground" />
            Experience (in Years) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="experience"
            type="number"
            min={0}
            max={50}
            value={experience}
            onChange={(e) => onExperienceChange(Number(e.target.value))}
            required
            className="h-11 rounded-2xl bg-input/20 border-border/80 text-sm"
          />
        </div>
      </div>

      {/* 3. Cooperative Guild Selection (MANDATORY) */}
      <div className="space-y-1.5 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Building2 className="size-3.5 text-primary" />
            Affiliated Cooperative Society <span className="text-destructive">*</span>
          </Label>
          <span className="text-[10px] text-primary font-medium">Mandatory</span>
        </div>

        <Select
          value={cooperativeId}
          onValueChange={(val) => val && onCooperativeChange(val)}
        >
          <SelectTrigger className="h-11 rounded-2xl bg-input/20 border-border/80 text-xs">
            <SelectValue placeholder="Select an affiliated cooperative society..." />
          </SelectTrigger>
          <SelectContent>
            {cooperativesList.length === 0 ? (
              <div className="p-2 text-xs text-muted-foreground text-center">
                Loading cooperatives...
              </div>
            ) : (
              cooperativesList.map((coop) => (
                <SelectItem key={coop._id} value={coop._id}>
                  {coop.cooperativeName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <p className="text-[11px] text-muted-foreground mt-1">
          Every worker must be affiliated with an approved cooperative for wage guarantees,
          collective bargaining, and dispute resolution.
        </p>
      </div>

      {/* Continue Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={onNext}
          className="w-full h-11 rounded-2xl text-sm font-semibold shadow-md shadow-primary/10 gap-2 cursor-pointer"
        >
          Continue to Coverage Area
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
