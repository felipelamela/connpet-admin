"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperContextValue {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
);

function useStepper() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
}

interface StepperProps {
  children: React.ReactNode;
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export function Stepper({
  children,
  currentStep,
  onStepChange,
  className,
}: StepperProps) {
  const totalSteps = React.Children.count(children);

  const setCurrentStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        onStepChange?.(step);
      }
    },
    [totalSteps, onStepChange]
  );

  return (
    <StepperContext.Provider value={{ currentStep, setCurrentStep, totalSteps }}>
      <div className={cn("w-full", className)}>{children}</div>
    </StepperContext.Provider>
  );
}

interface StepperHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function StepperHeader({ children, className }: StepperHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">{children}</div>
    </div>
  );
}

interface StepProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  index: number;
  className?: string;
}

export function Step({ children, title, description, index }: StepProps) {
  const { currentStep } = useStepper();
  const isActive = currentStep === index;

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface StepIndicatorProps {
  index: number;
  title: string;
  className?: string;
}

export function StepIndicator({ index, title, className }: StepIndicatorProps) {
  const { currentStep, totalSteps } = useStepper();
  const isCompleted = currentStep > index;
  const isActive = currentStep === index;
  const isLast = index === totalSteps - 1;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
            isCompleted &&
              "border-primary bg-primary text-primary-foreground",
            isActive &&
              !isCompleted &&
              "border-primary bg-background text-primary",
            !isActive &&
              !isCompleted &&
              "border-muted bg-background text-muted-foreground"
          )}
        >
          {isCompleted ? (
            <Check className="h-5 w-5" />
          ) : (
            <span className="text-sm font-semibold">{index + 1}</span>
          )}
        </div>
        <span
          className={cn(
            "mt-2 hidden text-sm font-medium md:block",
            isActive && "text-primary",
            !isActive && "text-muted-foreground"
          )}
        >
          {title}
        </span>
      </div>
      {!isLast && (
        <div
          className={cn(
            "mx-2 h-0.5 w-12 transition-colors md:w-24",
            isCompleted ? "bg-primary" : "bg-muted"
          )}
        />
      )}
    </div>
  );
}

interface StepperFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function StepperFooter({ children, className }: StepperFooterProps) {
  return (
    <div className={cn("mt-8 flex justify-between gap-4", className)}>
      {children}
    </div>
  );
}

