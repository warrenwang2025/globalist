"use client";

import { useState } from "react";
import type { Event, ScheduledPost } from "@/types/calendar";

export function useCalendarData() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Team Meeting",
      description: "Weekly team sync",
      date: new Date(2024, 2, 20, 10, 0),
      type: "meeting",
      duration: 60,
      attendees: 8,
    },
    {
      id: 2,
      title: "Product Launch",
      description: "Launch event for new product",
      date: new Date(2024, 2, 25, 14, 0),
      type: "event",
      duration: 120,
    },
  ]);

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 1,
      title: "Weekly Newsletter",
      content: "This week's social media insights and trends",
      scheduledDate: new Date(2024, 2, 18, 9, 0),
      platforms: [1, 2, 3],
      mediaCount: 2,
      mediaTypes: ["image"],
      status: "scheduled",
    },
    {
      id: 2,
      title: "Product Announcement",
      content: "Excited to announce our new AI-powered features!",
      scheduledDate: new Date(2024, 2, 22, 15, 30),
      platforms: [1, 2, 4],
      mediaCount: 1,
      mediaTypes: ["video"],
      status: "scheduled",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleUpdatePost = (updatedPost: ScheduledPost) => {
    setScheduledPosts(prev => 
      prev.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handleBulkDelete = () => {
    setEvents(prev => prev.filter(event => !selectedItems.includes(event.id)));
    setScheduledPosts(prev => prev.filter(post => !selectedItems.includes(post.id)));
    setSelectedItems([]);
  };

  const handleExportSchedule = () => {
    const allItems = [
      ...events.map(event => ({
        type: 'Event',
        title: event.title,
        description: event.description,
        date: event.date.toISOString(),
        duration: event.duration,
        attendees: event.attendees,
      })),
      ...scheduledPosts.map(post => ({
        type: 'Post',
        title: post.title,
        content: post.content,
        date: post.scheduledDate.toISOString(),
        platforms: post.platforms.length,
        status: post.status,
      }))
    ];

    const csvContent = [
      ['Type', 'Title', 'Description/Content', 'Date', 'Duration/Platforms', 'Attendees/Status'],
      ...allItems.map(item => [
        item.type,
        item.title,
        'description' in item ? item.description : item.content,
        new Date(item.date).toLocaleString(),
        'duration' in item ? `${item.duration} min` : `${item.platforms} platforms`,
        'attendees' in item ? `${item.attendees} people` : item.status,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    events,
    scheduledPosts,
    selectedItems,
    setSelectedItems,
    handleCreateEvent,
    handleUpdateEvent,
    handleUpdatePost,
    handleBulkDelete,
    handleExportSchedule
  };
}
