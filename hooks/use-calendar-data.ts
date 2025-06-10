import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

interface NewEvent {
  title: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  attendees: number;
  description: string;
}

interface NewPost {
  title: string;
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  platforms: number[];
  mediaFiles: File[];
}

// Sample data - replace with real data from your API
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2025, 1, 15, 10, 0),
    type: "meeting",
    duration: 60,
    attendees: 5,
    description: "Weekly team sync and project updates.",
  },
  {
    id: 2,
    title: "Product Launch Campaign",
    date: new Date(2025, 1, 16, 14, 30),
    type: "event",
    duration: 120,
    attendees: 12,
    description: "Launch event for our new product line.",
  },
];

const initialScheduledPosts: ScheduledPost[] = [
  {
    id: 1,
    title: "Holiday Sale Announcement",
    content: "🎄 Holiday Sale is here! Get 50% off on all products.",
    scheduledDate: new Date(2025, 1, 15, 12, 0),
    platforms: [1, 2, 3],
    mediaCount: 2,
    mediaTypes: ["image"],
    status: "scheduled",
  },
  {
    id: 2,
    title: "Behind the Scenes Video",
    content: "Take a look behind the scenes of our latest project! 🎬",
    scheduledDate: new Date(2025, 1, 16, 16, 0),
    platforms: [4, 5],
    mediaCount: 1,
    mediaTypes: ["video"],
    status: "scheduled",
  },
];

export function useCalendarData() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(
    initialScheduledPosts
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { toast } = useToast();

  const handleCreateEvent = (newEventData: NewEvent) => {
    const eventDate = new Date(`${newEventData.date}T${newEventData.time}`);
    const event: Event = {
      id: Date.now(),
      title: newEventData.title,
      date: eventDate,
      type: newEventData.type,
      duration: newEventData.duration,
      attendees: newEventData.attendees,
      description: newEventData.description,
    };

    setEvents([...events, event]);

    toast({
      title: "Event Created",
      description: `${event.title} has been scheduled successfully.`,
    });
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleCreatePost = (newPostData: NewPost) => {
    const scheduledDate = new Date(
      `${newPostData.scheduledDate}T${newPostData.scheduledTime}`
    );

    const post: ScheduledPost = {
      id: Date.now(),
      title: newPostData.title,
      content: newPostData.content,
      scheduledDate,
      platforms: newPostData.platforms,
      mediaCount: newPostData.mediaFiles.length,
      mediaTypes: newPostData.mediaFiles.map((file) => file.type.split("/")[0]),
      status: "scheduled",
    };

    setScheduledPosts([...scheduledPosts, post]);

    toast({
      title: "Post Scheduled",
      description: `${post.title} has been scheduled successfully.`,
    });
  };

  const handleUpdatePost = (updatedPost: ScheduledPost) => {
    setScheduledPosts(scheduledPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleBulkDelete = () => {
    setEvents(events.filter((event) => !selectedItems.includes(event.id)));
    setScheduledPosts(
      scheduledPosts.filter((post) => !selectedItems.includes(post.id))
    );
    setSelectedItems([]);
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been deleted.`,
    });
  };

  const handleExportSchedule = () => {
    const scheduleData = {
      events,
      scheduledPosts,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(scheduleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `schedule-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    toast({
      title: "Schedule Exported",
      description: "Your schedule has been exported successfully.",
    });
  };

  return {
    events,
    scheduledPosts,
    selectedItems,
    setSelectedItems,
    handleCreateEvent,
    handleUpdateEvent,
    handleCreatePost,
    handleUpdatePost,
    handleBulkDelete,
    handleExportSchedule,
  };
}
