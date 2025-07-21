export interface Event {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  startDateTime: Date;
  duration: number; // in minutes
  eventType: 'event' | 'meeting' | 'scheduled_post';
  
  // Meeting-specific fields
  attendees?: number;
  location?: string;
  
  // Post reference (only for scheduled_post type)
  sourcePostId?: string;
  sourcePost?: Post;
  
  // Recurring support
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  
  // Status tracking
  status: 'scheduled' | 'completed' | 'cancelled';
  notificationSent: boolean;
  
  // Virtual fields
  endDateTime?: Date;
  isPast?: boolean;
  isToday?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: string;
  userId: string;
  title: string;
  blocks: any[]; // Content blocks from editor
  contentText?: string; // Virtual field for plain text
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate?: Date;
  publishedDate?: Date;
  platforms: string[];
  mediaFiles: {
    url: string;
    type: string;
    name: string;
    size: number;
  }[];
  publishAttempts: number;
  lastPublishAttempt?: Date;
  errorMessage?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  platforms: number[];
  mediaFiles: File[];
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'event_reminder' | 'post_scheduled' | 'post_published' | 'post_failed' | 'meeting_reminder';
  title: string;
  message: string;
  relatedEventId?: string;
  relatedPostId?: string;
  scheduledFor: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  emailSent: boolean;
  pushSent: boolean;
  read: boolean;
  isOverdue?: boolean; // Virtual field
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
}

export interface NotificationPreferences {
  events: {
    emailReminder: boolean;
    reminderTime: number; // minutes before event
    pushNotification: boolean;
  };
  meetings: {
    emailReminder: boolean;
    reminderTime: number; // minutes before meeting
    pushNotification: boolean;
  };
  scheduledPosts: {
    emailReminder: boolean;
    reminderTime: number; // minutes before post
    pushNotification: boolean;
  };
}