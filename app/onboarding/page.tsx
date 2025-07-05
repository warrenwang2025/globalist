"use client";

import { useState, useEffect } from "react";
import { OnboardingWelcome } from "@/components/onboarding/onboarding-welcome";
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { OnboardingCompletion } from "@/components/onboarding/onboarding-completion";
import { OnboardingData } from "@/types/onboarding";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: "content creator",
    interests: [],
    goals: [],
    experience: "beginner",
    preferences: {},
    integrations: [],
  });

  const totalSteps = 7;

  // Load existing preferences on mount
  useEffect(() => {
    loadExistingPreferences();
  }, []);

  const loadExistingPreferences = async () => {
    try {
      const response = await axios.get('/api/onboarding/preferences');
      
      if (response.data.success && response.data.data) {
        // User has existing preferences, populate the form
        const data = response.data.data;
        setOnboardingData({
          userType: data.userType,
          interests: data.interests || [],
          goals: data.goals || [],
          experience: data.experience,
          preferences: {
            notifications: data.preferences?.notifications,
            emailUpdates: data.preferences?.emailUpdates,
            darkMode: data.preferences?.darkMode,
            timezone: data.preferences?.timezone,
            language: data.preferences?.language,
            weekStart: data.preferences?.weekStart,
          },
          integrations: data.integrations || [],
        });
        
        // Set current step based on what data exists
        let step = 0;
        if (data.userType) step = Math.max(step, 1);
        if (data.interests?.length) step = Math.max(step, 2);
        if (data.goals?.length) step = Math.max(step, 3);
        if (data.experience) step = Math.max(step, 4);
        if (data.preferences && Object.keys(data.preferences).length > 0) step = Math.max(step, 5);
        
        setCurrentStep(step);
      }
    } catch (error: any) {
      // If it's a 404 error, that's expected for new users
      if (error.response?.status !== 404) {
        console.error('Error loading preferences:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepComplete = async (stepData: any) => {
    const updatedData = { ...onboardingData, ...stepData };
    setOnboardingData(updatedData);
    
    // Save to database
    try {
      const response = await axios.post('/api/onboarding/preferences', updatedData, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Check if the response indicates success
      if (!response.data.success) {
        console.error('Error saving:', response.data.error);
        alert('Error saving preferences. Please try again.');
        return;
      }
    } catch (error: any) {
      console.error('Error saving step data:', error);
      const errorMessage = error.response?.data?.error || 'Error saving preferences. Please try again.';
      alert(errorMessage);
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Final save with complete data
      const response = await axios.post('/api/onboarding/preferences', onboardingData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        console.error('Error completing onboarding:', response.data.error);
        alert('Error completing onboarding. Please try again.');
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      const errorMessage = error.response?.data?.error || 'Error completing onboarding. Please try again.';
      alert(errorMessage);
    }
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentStep === totalSteps) {
    return <OnboardingCompletion data={onboardingData} onComplete={handleOnboardingComplete} />;
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
