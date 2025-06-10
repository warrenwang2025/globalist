"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  FileText,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import {
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

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

interface WeeklyCalendarProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
}

const platformIcons = {
  1: { icon: Twitter, name: "X", color: "bg-black" },
  2: { icon: Linkedin, name: "LinkedIn", color: "bg-blue-600" },
  3: {
    icon: Instagram,
    name: "Instagram",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  4: { icon: Youtube, name: "YouTube", color: "bg-red-600" },
  5: { icon: SiTiktok, name: "TikTok", color: "bg-black" },
  6: { icon: Globe, name: "Personal", color: "bg-gray-600" },
};

export function WeeklyCalendar({
  events,
  scheduledPosts,
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get start of week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get week days
  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Navigate weeks
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Get events for a specific date
  const getEventsForDate = (targetDate: Date) => {
    return events.filter(
      (event) => event.date.toDateString() === targetDate.toDateString()
    );
  };

  // Get scheduled posts for a specific date
  const getScheduledPostsForDate = (targetDate: Date) => {
    return scheduledPosts.filter(
      (post) => post.scheduledDate.toDateString() === targetDate.toDateString()
    );
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = getWeekDays(weekStart);

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {weekStart.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const dayPosts = getScheduledPostsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected = date && day.toDateString() === date.toDateString();

          return (
            <Card
              key={index}
              className={`min-h-[400px] cursor-pointer transition-colors ${
                isSelected ? "ring-2 ring-primary" : ""
              } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
              onClick={() => setDate(day)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {day.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        isToday ? "text-blue-600" : ""
                      }`}
                    >
                      {day.getDate()}
                    </p>
                  </div>
                  {(dayEvents.length > 0 || dayPosts.length > 0) && (
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length + dayPosts.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Events */}
                {dayEvents.map((event) => (
                  <div
                    key={`event-${event.id}`}
                    className="p-2 bg-blue-100 border-l-4 border-blue-500 rounded text-xs"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {event.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(event.date)}</span>
                      {event.duration && (
                        <span className="text-blue-500">
                          ({event.duration}min)
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Scheduled Posts */}
                {dayPosts.map((post) => (
                  <div
                    key={`post-${post.id}`}
                    className="p-2 bg-green-100 border-l-4 border-green-500 rounded text-xs"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <FileText className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-800 truncate">
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(post.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {post.platforms.slice(0, 3).map((platformId) => {
                          const platform =
                            platformIcons[
                              platformId as keyof typeof platformIcons
                            ];
                          if (!platform) return null;
                          const IconComponent = platform.icon;
                          return (
                            <div
                              key={platformId}
                              className="w-4 h-4 rounded-full bg-white flex items-center justify-center"
                              title={platform.name}
                            >
                              <IconComponent className="h-2 w-2" />
                            </div>
                          );
                        })}
                        {post.platforms.length > 3 && (
                          <span className="text-xs text-green-600">
                            +{post.platforms.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    {post.mediaCount > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-green-600">
                        {post.mediaTypes.includes("image") && (
                          <ImageIcon className="h-3 w-3" />
                        )}
                        {post.mediaTypes.includes("video") && (
                          <Video className="h-3 w-3" />
                        )}
                        <span className="text-xs">{post.mediaCount} files</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty state for days with no content */}
                {dayEvents.length === 0 && dayPosts.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <CalendarIcon className="h-6 w-6 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No events</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}