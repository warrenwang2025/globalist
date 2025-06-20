import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { NotificationPreferences } from "./preferences/notification-preferences"
import { DarkModePreferences } from "./preferences/dark-mode-preferences"
import { LocalizationPreferences } from "./preferences/localization-preferences"
import { CalendarPreferences } from "./preferences/calendar-preferences"

interface PreferencesStepProps {
  onNext: (data: { preferences: any }) => void
  onPrevious: () => void
  initialValue: any
}

export function PreferencesStep({ onNext, onPrevious, initialValue }: PreferencesStepProps) {
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    timezone: "UTC",
    language: "en",
    weekStart: "monday",
    ...initialValue
  })

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev: typeof preferences) => ({ ...prev, [key]: value }))
  }

  const handleCompleteSetup = () => {
    // Save preferences and move to completion step
    onNext({ preferences })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Customize Your Preferences</CardTitle>
        <CardDescription>
          Set up your workspace preferences for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationPreferences 
          preferences={{
            notifications: preferences.notifications,
            emailUpdates: preferences.emailUpdates
          }}
          updatePreference={updatePreference}
        />

        <DarkModePreferences 
          darkMode={preferences.darkMode}
          updatePreference={updatePreference}
        />

        <LocalizationPreferences 
          preferences={{
            language: preferences.language,
            timezone: preferences.timezone
          }}
          updatePreference={updatePreference}
        />

        <CalendarPreferences 
          weekStart={preferences.weekStart}
          updatePreference={updatePreference}
        />

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleCompleteSetup}>
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}