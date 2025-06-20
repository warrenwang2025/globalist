import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"

interface NotificationPreferencesProps {
  preferences: {
    notifications: boolean
    emailUpdates: boolean
  }
  updatePreference: (key: string, value: any) => void
}

export function NotificationPreferences({ preferences, updatePreference }: NotificationPreferencesProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center">
        <Bell className="mr-2 h-4 w-4" />
        Notifications
      </h3>
      <div className="space-y-3 pl-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex flex-col space-y-1">
            <span>Push Notifications</span>
            <span className="text-sm text-muted-foreground">
              Get notified about important updates and activities
            </span>
          </Label>
          <Switch
            id="notifications"
            checked={preferences.notifications}
            onCheckedChange={(value) => updatePreference('notifications', value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="emailUpdates" className="flex flex-col space-y-1">
            <span>Email Updates</span>
            <span className="text-sm text-muted-foreground">
              Receive weekly reports and feature updates via email
            </span>
          </Label>
          <Switch
            id="emailUpdates"
            checked={preferences.emailUpdates}
            onCheckedChange={(value) => updatePreference('emailUpdates', value)}
          />
        </div>
      </div>
    </div>
  )
}