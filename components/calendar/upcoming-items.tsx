"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreviewModal } from "@/components/calendar/preview-modal";
import { Calendar as CalendarIcon, FileText, Edit, Copy } from "lucide-react";

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

interface UpcomingItemsProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
  onEditEvent: (event: Event) => void;
  onEditPost: (post: ScheduledPost) => void;
}

export function UpcomingItems({ 
  events, 
  scheduledPosts, 
  onEditEvent, 
  onEditPost 
}: UpcomingItemsProps) {
  const [previewModal, setPreviewModal] = useState({
    open: false,
    event: null as Event | null,
    post: null as ScheduledPost | null,
  });

  const upcomingEvents = events
    .filter((event) => event.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const upcomingPosts = scheduledPosts
    .filter((post) => post.scheduledDate > new Date())
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
    .slice(0, 5);

  // Handle preview modal
  const handleEventClick = (event: Event) => {
    setPreviewModal({
      open: true,
      event,
      post: null,
    });
  };

  const handlePostClick = (post: ScheduledPost) => {
    setPreviewModal({
      open: true,
      event: null,
      post,
    });
  };

  const handleClosePreview = () => {
    setPreviewModal({
      open: false,
      event: null,
      post: null,
    });
  };

  const handleEdit = () => {
    if (previewModal.event) {
      onEditEvent(previewModal.event);
    } else if (previewModal.post) {
      onEditPost(previewModal.post);
    }
    handleClosePreview();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString()} at{" "}
                      {event.date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.type}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming events scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.scheduledDate.toLocaleDateString()} at{" "}
                      {post.scheduledDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {post.platforms.length} platforms
                      </Badge>
                      {post.mediaCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {post.mediaCount} files
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle duplicate
                        console.log("Duplicate post:", post.id);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPost(post);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingPosts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming posts scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={previewModal.open}
        onOpenChange={handleClosePreview}
        event={previewModal.event}
        post={previewModal.post}
        onEdit={handleEdit}
        onDelete={() => {
          // Handle delete action
          console.log("Delete clicked");
          handleClosePreview();
        }}
        onDuplicate={() => {
          // Handle duplicate action
          console.log("Duplicate clicked");
          handleClosePreview();
        }}
      />
    </>
  );
}