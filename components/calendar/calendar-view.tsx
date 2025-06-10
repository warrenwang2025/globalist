import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyCalendar } from "@/components/calendar/weekly-calendar";

interface Event {
  id: number;
  title: string;
  date: Date;
  type: string;
  duration?: number;
  attendees?: number;
  description: string;
}

interface ScheduledPost {
  id: number;
  title: string;
  content: string;
  scheduledDate: Date;
  platforms: number[];
  mediaCount: number;
  mediaTypes: string[];
  status: string;
}

interface CalendarViewProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
}

export function CalendarView({
  events,
  scheduledPosts,
}: CalendarViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <WeeklyCalendar events={events} scheduledPosts={scheduledPosts} />
      </CardContent>
    </Card>
  );
}