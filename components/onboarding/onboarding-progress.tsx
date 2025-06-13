import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  const steps = [
    "Welcome",
    "User Type",
    "Interests",
    "Goals",
    "Experience",
    "Preferences",
    "Complete",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <Progress value={progress} className="h-2 mb-4" />

      <div className="hidden md:flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 ${
                index <= currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                index <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
