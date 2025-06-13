import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon } from "lucide-react"

interface DarkModePreferencesProps {
  darkMode: boolean
  updatePreference: (key: string, value: any) => void
}

export function DarkModePreferences({ darkMode, updatePreference }: DarkModePreferencesProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center">
        <Moon className="mr-2 h-4 w-4" />
        Appearance
      </h3>
      <div className="pl-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode" className="flex flex-col space-y-1">
            <span>Dark Mode</span>
            <span className="text-sm text-muted-foreground">
              Use dark theme for better viewing in low light
            </span>
          </Label>
          <Switch
            id="darkMode"
            checked={darkMode}
            onCheckedChange={(value) => updatePreference('darkMode', value)}
          />
        </div>
      </div>
    </div>
  )
}