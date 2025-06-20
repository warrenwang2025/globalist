"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Edit,
  Trash2,
  ChevronRight,
} from "lucide-react";
import type { Event, ScheduledPost } from "@/types/calendar";

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
  onEditPost,
}: UpcomingItemsProps) {
  // Get upcoming items (next 7 days)
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const upcomingEvents = events
    .filter((event) => event.date >= now && event.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const upcomingPosts = scheduledPosts
    .filter((post) => post.scheduledDate >= now && post.scheduledDate <= nextWeek)
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  const allUpcomingItems = [
    ...upcomingEvents.map(event => ({ ...event, itemType: 'event' as const })),
    ...upcomingPosts.map(post => ({ ...post, itemType: 'post' as const }))
  ].sort((a, b) => {
    const dateA = a.itemType === 'event' ? a.date : a.scheduledDate;
    const dateB = b.itemType === 'event' ? b.date : b.scheduledDate;
    return dateA.getTime() - dateB.getTime();
  });

  if (allUpcomingItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Upcoming Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 sm:py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming items</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              You have no events or posts scheduled for the next 7 days.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Upcoming Items</CardTitle>
          <Badge variant="outline" className="text-xs sm:text-sm">
            Next 7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {allUpcomingItems.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`
                      p-2 rounded-full
                      ${item.itemType === 'event' 
                        ? 'bg-blue-100' 
                        : 'bg-green-100'
                      }
                    `}
                  >
                    {item.itemType === 'event' ? (
                      'type' in item && item.type === 'meeting' ? (
                        <Users className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <FileText className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.itemType === 'event' 
                          ? ('description' in item ? item.description : '')
                          : `Scheduled for ${item.platforms.length} platform${item.platforms.length !== 1 ? 's' : ''}`
                        }
                      </p>

                      {/* Date and Time */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {(item.itemType === 'event' ? item.date : item.scheduledDate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {(item.itemType === 'event' ? item.date : item.scheduledDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        {item.itemType === 'event' && 'duration' in item && item.duration && (
                          <Badge variant="outline" className="text-xs">
                            {item.duration} min
                          </Badge>
                        )}

                        {item.itemType === 'event' && 'attendees' in item && item.attendees && (
                          <Badge variant="outline" className="text-xs">
                            {item.attendees} attendees
                          </Badge>
                        )}

                        {item.itemType === 'post' && (
                          <Badge 
                            variant={item.status === 'scheduled' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (item.itemType === 'event') {
                            onEditEvent(item as Event);
                          } else {
                            onEditPost(item as ScheduledPost);
                          }
                        }}
                        className="h-8 px-2 sm:px-3"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Edit</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 sm:px-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {allUpcomingItems.length > 10 && (
          <div className="p-4 border-t bg-gray-50">
            <Button variant="outline" className="w-full">
              <span>View All {allUpcomingItems.length} Items</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
