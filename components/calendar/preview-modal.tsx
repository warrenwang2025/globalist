"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  FileText,
  Trash2,
  Copy,
  MapPin,
  Video,
  Image as ImageIcon,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
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

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  post?: ScheduledPost | null;
  onEdit?: (item: Event | ScheduledPost) => void;
  onDelete?: (item: Event | ScheduledPost) => void;
  onDuplicate?: (item: Event | ScheduledPost) => void;
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

export function PreviewModal({
  open,
  onOpenChange,
  event,
  post,
  onEdit,
  onDelete,
  onDuplicate,
}: PreviewModalProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isEvent = !!event;
  const item = event || post;

  // Handle Delete Function
  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);

    try {
      // Show confirmation toast first
      const confirmed = window.confirm(
        `Are you sure you want to delete this ${
          isEvent ? "event" : "post"
        }? This action cannot be undone.`
      );

      if (!confirmed) {
        setIsDeleting(false);
        return;
      }

      if (onDelete) {
        await onDelete(item);
        toast({
          title: `${isEvent ? "Event" : "Post"} Deleted`,
          description: `"${item.title}" has been successfully deleted.`,
        });
      } else {
        // Default delete behavior - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
          title: `${isEvent ? "Event" : "Post"} Deleted`,
          description: `"${item.title}" has been deleted successfully.`,
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: `Failed to delete ${
          isEvent ? "event" : "post"
        }. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Duplicate/Copy Function
  const handleDuplicate = async () => {
    if (!item) return;

    setIsDuplicating(true);

    try {
      if (isEvent) {
        const eventItem = item as Event;
        const duplicatedEvent = {
          ...eventItem,
          id: Date.now(), // Generate new ID
          title: `${eventItem.title} (Copy)`,
          date: new Date(eventItem.date.getTime() + 24 * 60 * 60 * 1000), // Next day
        };

        if (onDuplicate) {
          await onDuplicate(duplicatedEvent);
        } else {
          // Default duplicate behavior
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        toast({
          title: "Event Duplicated",
          description: `"${
            duplicatedEvent.title
          }" has been created for ${formatDate(duplicatedEvent.date)}.`,
        });
      } else {
        const postItem = item as ScheduledPost;
        const duplicatedPost = {
          ...postItem,
          id: Date.now(), // Generate new ID
          title: `${postItem.title} (Copy)`,
          scheduledDate: new Date(
            postItem.scheduledDate.getTime() + 24 * 60 * 60 * 1000
          ), // Next day
          status: "draft", // Reset status for duplicated post
        };

        if (onDuplicate) {
          await onDuplicate(duplicatedPost);
        } else {
          // Default duplicate behavior
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        toast({
          title: "Post Duplicated",
          description: `"${
            duplicatedPost.title
          }" has been created and scheduled for ${formatDate(
            duplicatedPost.scheduledDate
          )}.`,
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Duplication Failed",
        description: `Failed to duplicate ${
          isEvent ? "event" : "post"
        }. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  // Handle Copy to Clipboard
  const handleCopyToClipboard = async () => {
    if (!item) return;

    try {
      let textToCopy = "";

      if (isEvent) {
        const eventItem = item as Event;
        textToCopy = `Event: ${eventItem.title}
Date: ${formatDate(eventItem.date)}
Time: ${formatTime(eventItem.date)}
Type: ${eventItem.type}
${eventItem.duration ? `Duration: ${eventItem.duration} minutes` : ""}
${eventItem.attendees ? `Attendees: ${eventItem.attendees}` : ""}
${eventItem.description ? `Description: ${eventItem.description}` : ""}`;
      } else {
        const postItem = item as ScheduledPost;
        const platformNames = postItem.platforms
          .map((id) => platformIcons[id as keyof typeof platformIcons]?.name)
          .filter(Boolean)
          .join(", ");

        textToCopy = `Post: ${postItem.title}
Content: ${postItem.content}
Scheduled: ${formatDate(postItem.scheduledDate)} at ${formatTime(
          postItem.scheduledDate
        )}
Platforms: ${platformNames}
Status: ${postItem.status}
${postItem.mediaCount > 0 ? `Media Files: ${postItem.mediaCount}` : ""}`;
      }

      await navigator.clipboard.writeText(textToCopy);

      toast({
        title: "Copied to Clipboard",
        description: `${
          isEvent ? "Event" : "Post"
        } details have been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle Share Function
  const handleShare = async () => {
    if (!item) return;

    try {
      const shareData = {
        title: `${isEvent ? "Event" : "Post"}: ${item.title}`,
        text: isEvent
          ? `Check out this event: ${item.title} on ${formatDate(
              (item as Event).date
            )}`
          : `Check out this post: ${item.title} scheduled for ${formatDate(
              (item as ScheduledPost).scheduledDate
            )}`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: `${isEvent ? "Event" : "Post"} has been shared.`,
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Link has been copied to your clipboard for sharing.",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">
                {item.title || (isEvent ? "Event Details" : "Post Details")}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-2">
                {isEvent ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {(item as Event).type}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {(item as ScheduledPost).status}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2"></div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium">
                {formatDate(
                  isEvent
                    ? (item as Event).date
                    : (item as ScheduledPost).scheduledDate
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTime(
                  isEvent
                    ? (item as Event).date
                    : (item as ScheduledPost).scheduledDate
                )}
                {isEvent && (item as Event).duration && (
                  <span className="ml-2">
                    • Duration: {(item as Event).duration} minutes
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Event-specific details */}
          {isEvent && (
            <>
              {(item as Event).attendees && (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">
                      {(item as Event).attendees} people invited
                    </p>
                  </div>
                </div>
              )}

              {(item as Event).description && (
                <div className="space-y-2">
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {(item as Event).description}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Post-specific details */}
          {!isEvent && (
            <>
              <div className="space-y-2">
                <h3 className="font-medium">Content</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {(item as ScheduledPost).content}
                  </p>
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-3">
                <h3 className="font-medium">Publishing Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {(item as ScheduledPost).platforms.map((platformId) => {
                    const platform =
                      platformIcons[platformId as keyof typeof platformIcons];
                    if (!platform) return null;
                    const IconComponent = platform.icon;
                    return (
                      <div
                        key={platformId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm ${platform.color}`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{platform.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Media */}
              {(item as ScheduledPost).mediaCount > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Media Files</h3>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex gap-2">
                      {(item as ScheduledPost).mediaTypes.includes("image") && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm">Images</span>
                        </div>
                      )}
                      {(item as ScheduledPost).mediaTypes.includes("video") && (
                        <div className="flex items-center gap-1 text-purple-600">
                          <Video className="h-4 w-4" />
                          <span className="text-sm">Videos</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {(item as ScheduledPost).mediaCount} files
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 sm:flex-none"
              >
                <FileText className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Additional Actions Section */}
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2 justify-center">
              {isEvent && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Add to calendar functionality
                      const event = item as Event;
                      const startDate =
                        event.date
                          .toISOString()
                          .replace(/[-:]/g, "")
                          .split(".")[0] + "Z";
                      const endDate =
                        new Date(
                          event.date.getTime() + (event.duration || 60) * 60000
                        )
                          .toISOString()
                          .replace(/[-:]/g, "")
                          .split(".")[0] + "Z";

                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        event.title
                      )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
                        event.description || ""
                      )}&location=`;

                      window.open(googleCalendarUrl, "_blank");

                      toast({
                        title: "Opening Calendar",
                        description:
                          "Opening Google Calendar to add this event.",
                      });
                    }}
                    className="text-xs"
                  >
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Add to Calendar
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Export to ICS functionality
                      const event = item as Event;
                      const startDate =
                        event.date
                          .toISOString()
                          .replace(/[-:]/g, "")
                          .split(".")[0] + "Z";
                      const endDate =
                        new Date(
                          event.date.getTime() + (event.duration || 60) * 60000
                        )
                          .toISOString()
                          .replace(/[-:]/g, "")
                          .split(".")[0] + "Z";

                      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App//EN
BEGIN:VEVENT
UID:${event.id}@yourapp.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
END:VEVENT
END:VCALENDAR`;

                      const blob = new Blob([icsContent], {
                        type: "text/calendar",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${event.title
                        .replace(/[^a-z0-9]/gi, "_")
                        .toLowerCase()}.ics`;
                      link.click();
                      URL.revokeObjectURL(url);

                      toast({
                        title: "Event Exported",
                        description: "Event has been exported as ICS file.",
                      });
                    }}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Export ICS
                  </Button>
                </>
              )}

              {!isEvent && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Preview post functionality
                      const post = item as ScheduledPost;
                      const previewWindow = window.open(
                        "",
                        "_blank",
                        "width=400,height=600"
                      );
                      if (previewWindow) {
                        previewWindow.document.write(`
                          <html>
                            <head>
                              <title>Post Preview - ${post.title}</title>
                              <style>
                                body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                                .post { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                                .content { line-height: 1.6; margin-bottom: 15px; }
                                .meta { color: #666; font-size: 14px; }
                                .platforms { margin-top: 10px; }
                                .platform { display: inline-block; padding: 4px 8px; margin: 2px; background: #007bff; color: white; border-radius: 4px; font-size: 12px; }
                              </style>
                            </head>
                            <body>
                              <div class="post">
                                <div class="title">${post.title}</div>
                                <div class="content">${post.content}</div>
                                <div class="meta">
                                  Scheduled: ${formatDate(
                                    post.scheduledDate
                                  )} at ${formatTime(post.scheduledDate)}<br>
                                  Status: ${post.status}
                                </div>
                                <div class="platforms">
                                  ${post.platforms
                                    .map((id) => {
                                      const platform =
                                        platformIcons[
                                          id as keyof typeof platformIcons
                                        ];
                                      return platform
                                        ? `<span class="platform">${platform.name}</span>`
                                        : "";
                                    })
                                    .join("")}
                                </div>
                              </div>
                            </body>
                          </html>
                        `);
                        previewWindow.document.close();
                      }

                      toast({
                        title: "Post Preview",
                        description: "Opening post preview in new window.",
                      });
                    }}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Preview Post
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Reschedule functionality
                      toast({
                        title: "Reschedule Post",
                        description: "Opening reschedule dialog...",
                      });
                      // You can implement a reschedule modal here
                    }}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Reschedule
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
