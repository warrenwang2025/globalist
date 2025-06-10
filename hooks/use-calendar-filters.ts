import { useState, useMemo } from "react";

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

export function useCalendarFilters(
  events: Event[],
  scheduledPosts: ScheduledPost[]
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" || event.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [events, searchQuery, filterType]);

  const filteredPosts = useMemo(() => {
    return scheduledPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" || filterType === "posts";
      return matchesSearch && matchesFilter;
    });
  }, [scheduledPosts, searchQuery, filterType]);

  return {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredEvents,
    filteredPosts,
  };
}