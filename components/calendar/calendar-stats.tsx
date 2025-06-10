import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, FileText, Clock, Users } from "lucide-react";

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

interface CalendarStatsProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
  allEvents: Event[];
  allScheduledPosts: ScheduledPost[];
}

export function CalendarStats({
  events,
  scheduledPosts,
  allEvents,
  allScheduledPosts,
}: CalendarStatsProps) {
  const getThisWeekCount = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const thisWeekEvents = allEvents.filter(
      (e) => e.date >= weekStart && e.date <= weekEnd
    ).length;

    const thisWeekPosts = allScheduledPosts.filter(
      (p) => p.scheduledDate >= weekStart && p.scheduledDate <= weekEnd
    ).length;

    return thisWeekEvents + thisWeekPosts;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{events.length}</div>
          <p className="text-xs text-muted-foreground">
            {allEvents.filter((e) => e.date > new Date()).length} upcoming
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scheduledPosts.length}</div>
          <p className="text-xs text-muted-foreground">
            {allScheduledPosts.filter((p) => p.scheduledDate > new Date()).length} pending
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getThisWeekCount()}</div>
          <p className="text-xs text-muted-foreground">events & posts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meetings</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {events.filter((e) => e.type === "meeting").length}
          </div>
          <p className="text-xs text-muted-foreground">total meetings</p>
        </CardContent>
      </Card>
    </div>
  );
}