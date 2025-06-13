import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface CalendarPreferencesProps {
  weekStart: string
  updatePreference: (key: string, value: any) => void
}

export function CalendarPreferences({ weekStart, updatePreference }: CalendarPreferencesProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center">
        <Calendar className="mr-2 h-4 w-4" />
        Calendar
      </h3>
      <div className="pl-6">
        <div className="space-y-2">
          <Label>Week starts on</Label>
          <Select
            value={weekStart}
            onValueChange={(value) => updatePreference('weekStart', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunday">Sunday</SelectItem>
              <SelectItem value="monday">Monday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}