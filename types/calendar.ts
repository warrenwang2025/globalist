export interface Event {
  id: number;
  title: string;
  date: Date;
  type: string;
  duration?: number;
  attendees?: number;
  description: string;
}

export interface ScheduledPost {
  id: number;
  title: string;
  content: string;
  scheduledDate: Date;
  platforms: number[];
  mediaCount: number;
  mediaTypes: string[];
  status: string;
}

export interface NewEvent {
  title: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  attendees: number;
  description: string;
}

export interface NewPost {
  title: string;
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  platforms: number[];
  mediaFiles: File[];
}

export interface PlatformIcon {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  color: string;
}

export interface CalendarProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
}