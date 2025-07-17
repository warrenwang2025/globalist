"use client";

import { useState } from "react";
import type { Event, ScheduledPost } from "@/types/calendar";

export function useCalendarData() {
  const [events, setEvents] = useState<Event[]>([
    {
      _id: "1",
      userId: "user1",
      title: "Team Meeting",
      description: "Weekly team sync",
      startDateTime: new Date(2024, 2, 20, 10, 0),
      duration: 60,
      eventType: "meeting",
      attendees: 8,
      isRecurring: false,
      status: "scheduled",
      notificationSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "2",
      userId: "user1",
      title: "Product Launch",
      description: "Launch event for new product",
      startDateTime: new Date(2024, 2, 25, 14, 0),
      duration: 120,
      eventType: "event",
      isRecurring: false,
      status: "scheduled",
      notificationSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
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

  const handleCreateEvent = (eventData: Omit<Event, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      _id: Date.now().toString(),
      userId: "user1", // This should come from auth context
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => 
      prev.map(event => 
        event._id === updatedEvent._id ? { ...updatedEvent, updatedAt: new Date() } : event
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
    setEvents(prev => prev.filter(event => !selectedItems.includes(parseInt(event._id))));
    setScheduledPosts(prev => prev.filter(post => !selectedItems.includes(post.id)));
    setSelectedItems([]);
  };

  const handleExportSchedule = () => {
    const allItems = [
      ...events.map(event => ({
        type: 'Event',
        title: event.title,
        description: event.description,
        date: event.startDateTime.toISOString(),
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
