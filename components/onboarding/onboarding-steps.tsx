import { UserTypeStep } from "./steps/user-type-step"
import { InterestsStep } from "./steps/interests-step"
import { GoalsStep } from "./steps/goals-step"
import { ExperienceStep } from "./steps/experience-step"
import { PreferencesStep } from "./steps/preferences-step"
import { CompletionStep } from "./steps/completion-step"

interface OnboardingStepsProps {
  currentStep: number
  onStepComplete: (data: any) => void
  onPrevious: () => void
  data: any
}

export function OnboardingSteps({ 
  currentStep, 
  onStepComplete, 
  onPrevious, 
  data 
}: OnboardingStepsProps) {
  const handleComplete = () => {
    // Handle final completion
    console.log("Setup completed!")
    // Redirect to main app
    window.location.href = "/dashboard"
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserTypeStep
            onNext={onStepComplete}
            onPrevious={onPrevious}
            initialValue={data.userType}
          />
        )
      case 2:
        return (
          <InterestsStep
            onNext={onStepComplete}
            onPrevious={onPrevious}
            initialValue={data.interests}
          />
        )
      case 3:
        return (
          <GoalsStep
            onNext={onStepComplete}
            onPrevious={onPrevious}
            initialValue={data.goals}
          />
        )
      case 4:
        return (
          <ExperienceStep
            onNext={onStepComplete}
            onPrevious={onPrevious}
            initialValue={data.experience}
          />
        )
      case 5:
        return (
          <PreferencesStep
            onNext={onStepComplete}
            onPrevious={onPrevious}
            initialValue={data.preferences}
          />
        )
      case 6:
        return (
          <CompletionStep
            onComplete={handleComplete}
            userData={data}
          />
        )
      default:
        return null
    }
  }
  return <div className="max-w-2xl mx-auto">{renderStep()}</div>
}