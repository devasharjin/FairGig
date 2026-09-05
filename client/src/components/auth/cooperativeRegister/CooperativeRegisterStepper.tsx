import React from "react";
import { Building2, ShieldCheck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CooperativeRegisterStepperProps {
  currentStep: 1 | 2;
  onStepClick: (step: 1 | 2) => void;
}

export const CooperativeRegisterStepper: React.FC<CooperativeRegisterStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    { step: 1 as const, label: "Society Details", icon: Building2 },
    { step: 2 as const, label: "Verification Documents", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider gap-1.5 bg-primary/10 text-primary border border-primary/20"
        >
          <Building2 className="size-3.5 text-primary" />
          Cooperative Onboarding
        </Badge>
        <span className="text-xs font-semibold text-muted-foreground">
          Step {currentStep} of 2
        </span>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {currentStep === 1 && "Society Profile & Contact Details"}
          {currentStep === 2 && "Official Verification & Logo"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          {currentStep === 1 &&
            "Provide the registered legal name, official contacts, and headquarters location for your cooperative society."}
          {currentStep === 2 &&
            "Upload your official society logo and state registration certificate to complete verification."}
        </p>
      </div>

      {/* 2-Step Interactive Navigator */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {steps.map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => onStepClick(item.step)}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                  : isDone
                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                  : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted/60"
              )}
            >
              {isDone ? (
                <Check className="size-4 shrink-0 text-primary font-bold" />
              ) : (
                <Icon className="size-4 shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
