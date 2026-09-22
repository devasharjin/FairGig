import React from "react";
import { Wrench, MapPin, ShieldCheck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkerRegisterStepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
}

export const WorkerRegisterStepper: React.FC<WorkerRegisterStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    { step: 1 as const, label: "Trade & Society", icon: Wrench },
    { step: 2 as const, label: "Coverage Area", icon: MapPin },
    { step: 3 as const, label: "Verification", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-primary/10 text-primary border-primary/20"
        >
          Worker Application
        </Badge>
        <span className="text-xs font-medium text-muted-foreground">
          Step {currentStep} of 3
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {currentStep === 1 && "Trade Service & Cooperative"}
          {currentStep === 2 && "Coverage Area & Location"}
          {currentStep === 3 && "Document Verification"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {currentStep === 1 &&
            "Select your skilled trade service (e.g. Plumber, Electrician, Gardener) and affiliated cooperative society."}
          {currentStep === 2 &&
            "Specify the geographic operational area where you will fulfill customer work requests."}
          {currentStep === 3 &&
            "Upload government ID and trade certification to activate your verified badge."}
        </p>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-3 gap-2 pt-2">
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
                "flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : isDone
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              {isDone ? (
                <Check className="size-3.5" />
              ) : (
                <Icon className="size-3.5" />
              )}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
