import React, { useState, useRef, useEffect } from "react";
import {
  Wrench,
  Search,
  ChevronDown,
  Check,
  X,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ServiceOption {
  _id: string;
  name: string;
  category: string;
}

interface ServiceSelectorProps {
  services: ServiceOption[];
  selectedIds: string[];
  onToggleSkill: (id: string) => void;
  isLoading?: boolean;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedIds,
  onToggleSkill,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Wrench className="size-3.5 text-primary" />
          Select Trade Services <span className="text-destructive">*</span>
        </Label>
        <span className="text-xs text-muted-foreground font-medium">
          {selectedIds.length} selected
        </span>
      </div>

      {/* Searchable Multi-Select Trigger & Dropdown */}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "w-full h-12 px-4 rounded-2xl bg-background border border-border/80 text-left text-sm flex items-center justify-between transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer",
            selectedIds.length === 0
              ? "text-muted-foreground"
              : "text-foreground font-medium"
          )}
        >
          <span className="truncate">
            {isLoading ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                Loading trade services...
              </span>
            ) : selectedIds.length === 0 ? (
              "Search and select your skills..."
            ) : (
              `${selectedIds.length} service${selectedIds.length > 1 ? "s" : ""} selected`
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200 shrink-0",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover text-popover-foreground border border-border/80 shadow-2xl rounded-2xl p-2.5 space-y-2 animate-in fade-in-0 zoom-in-95">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Type to filter trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-9 pl-9 pr-3 text-xs rounded-xl bg-muted/40 border-border/60"
              />
            </div>

            {/* Filtered Services List */}
            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No matching services found.
                </p>
              ) : (
                filtered.map((service) => {
                  const isSelected = selectedIds.includes(service._id);
                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => onToggleSkill(service._id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary/15 text-primary font-semibold"
                          : "hover:bg-muted/60 text-foreground"
                      )}
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {service.category}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Skill Badges */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedIds.map((id) => {
            const service = services.find((s) => s._id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-primary/10 text-primary border border-primary/20 shadow-2xs"
              >
                {service?.name || "Trade Skill"}
                <button
                  type="button"
                  onClick={() => onToggleSkill(id)}
                  className="size-3.5 rounded-full flex items-center justify-center hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Popular Trade Quick Chips */}
      <div className="pt-2">
        <p className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1 font-medium">
          <Sparkles className="size-3 text-amber-500" /> Quick Add Popular:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {services.slice(0, 5).map((service) => {
            const isSelected = selectedIds.includes(service._id);
            return (
              <button
                key={service._id}
                type="button"
                onClick={() => onToggleSkill(service._id)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border/60"
                )}
              >
                {isSelected ? (
                  <Check className="size-3" />
                ) : (
                  <Plus className="size-3" />
                )}
                {service.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
