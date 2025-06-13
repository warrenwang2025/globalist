"use client";

import { useState } from "react";
import { OnboardingWelcome } from "@/components/onboarding/onboarding-welcome";
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { OnboardingCompletion } from "@/components/onboarding/onboarding-completion";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    userType: "",
    interests: [],
    goals: [],
    experience: "",
    preferences: {},
    integrations: [],
  });

  const totalSteps = 7;

  const handleStepComplete = (stepData: any) => {
    setOnboardingData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (currentStep === totalSteps) {
    return <OnboardingCompletion data={onboardingData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Globalist Media Suite
            </h1>
            <p className="text-muted-foreground text-lg">
              Let&#39;s set up your media management experience
            </p>
          </div>

          {/* Progress Bar */}
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          {/* Welcome Screen */}
          {currentStep === 0 && (
            <OnboardingWelcome onNext={() => setCurrentStep(1)} />
          )}

          {/* Onboarding Steps */}
          {currentStep > 0 && currentStep < totalSteps && (
            <OnboardingSteps
              currentStep={currentStep}
              onStepComplete={handleStepComplete}
              onPrevious={handlePrevious}
              data={onboardingData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
