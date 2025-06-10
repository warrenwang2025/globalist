"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  FileText,
  Video,
  Image as ImageIcon,
  CalendarIcon,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";

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

interface MonthlyCalendarProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
}

const platformIcons = {
  1: { icon: Twitter, name: "X", color: "bg-black" },
  2: { icon: Linkedin, name: "LinkedIn", color: "bg-blue-600" },
  3: { icon: Instagram, name: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  4: { icon: Youtube, name: "YouTube", color: "bg-red-600" },
  5: { icon: SiTiktok, name: "TikTok", color: "bg-black" },
  6: { icon: Globe, name: "Personal", color: "bg-gray-600" }
};

export function MonthlyCalendar({ events, scheduledPosts }: MonthlyCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedPost(null);
    setShowDetails(true);
  };

  const handlePostClick = (post: ScheduledPost) => {
    setSelectedPost(post);
    setSelectedEvent(null);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
    setSelectedPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* Calendar */}
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>

        {/* Daily Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {date
              ? `Events for ${date.toLocaleDateString()}`
              : "Select a date"}
          </h2>

          {date && (
            <>
              {/* Events for selected date */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Events</h3>
                {getEventsForDate(date).map((event) => (
                  <Card 
                    key={event.id} 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.date)}
                          </span>
                          {event.attendees && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees}
                            </span>
                          )}
                          {event.duration && (
                            <span>{event.duration} min</span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          event.type === "meeting" ? "default" : "secondary"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Scheduled posts for selected date */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Scheduled Posts</h3>
                {getScheduledPostsForDate(date).map((post) => (
                  <Card 
                    key={post.id} 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {formatTime(post.scheduledDate)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {post.platforms.map((platformId) => {
                            const platform =
                              platformIcons[
                                platformId as keyof typeof platformIcons
                              ];
                            if (!platform) return null;
                            const IconComponent = platform.icon;
                            return (
                              <div
                                key={platformId}
                                className={`p-1 rounded text-white ${platform.color}`}
                                title={platform.name}
                              >
                                <IconComponent className="h-3 w-3" />
                              </div>
                            );
                          })}
                        </div>

                        {post.mediaCount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {post.mediaTypes.includes("image") && (
                              <ImageIcon className="h-3 w-3" />
                            )}
                            {post.mediaTypes.includes("video") && (
                              <Video className="h-3 w-3" />
                            )}
                            <span>{post.mediaCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {getEventsForDate(date).length === 0 &&
                getScheduledPostsForDate(date).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No events or scheduled posts for this date</p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (selectedEvent || selectedPost) && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {selectedEvent ? "Event Details" : "Post Details"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDetails}
              >
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedEvent.date.toLocaleDateString()} at {formatTime(selectedEvent.date)}
                    </span>
                    {selectedEvent.duration && (
                      <span className="flex items-center gap-1">
                        Duration: {selectedEvent.duration} minutes
                      </span>
                    )}
                    {selectedEvent.attendees && (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {selectedEvent.attendees} attendees
                      </span>
                    )}
                  </div>
                  <Badge variant={selectedEvent.type === "meeting" ? "default" : "secondary"}>
                    {selectedEvent.type}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>
              </div>
            )}

            {selectedPost && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedPost.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedPost.scheduledDate.toLocaleDateString()} at {formatTime(selectedPost.scheduledDate)}
                    </span>
                    <Badge variant="outline">{selectedPost.status}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedPost.content}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Platforms ({selectedPost.platforms.length})</h4>
                  <div className="flex items-center gap-3">
                    {selectedPost.platforms.map((platformId) => {
                      const platform = platformIcons[platformId as keyof typeof platformIcons];
                      if (!platform) return null;
                      const IconComponent = platform.icon;
                      return (
                        <div
                          key={platformId}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white ${platform.color}`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedPost.mediaCount > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Media Files ({selectedPost.mediaCount})</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {selectedPost.mediaTypes.includes("image") && (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>Images</span>
                        </div>
                      )}
                      {selectedPost.mediaTypes.includes("video") && (
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          <span>Videos</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 