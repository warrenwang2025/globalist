"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarView } from "@/components/calendar/calendar-view";
import { CreateEventDialog } from "@/components/calendar/create-event-dialog";
import { EditEventDialog } from "@/components/calendar/edit-event-dialog";
import { EditPostDialog } from "@/components/calendar/edit-post-dialog";
import { UpcomingItems } from "@/components/calendar/upcoming-items";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarFilters } from "@/hooks/use-calendar-filters";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  FileText,
  Filter,
  Search,
  Trash2,
} from "lucide-react";

// Import types
import type { Event, ScheduledPost } from "@/types/calendar";

export default function SchedulePage() {
  const router = useRouter();

  const {
    events,
    scheduledPosts,
    selectedItems,
    setSelectedItems,
    handleCreateEvent,
    handleUpdateEvent,
    handleUpdatePost,
    handleBulkDelete,
    handleExportSchedule,
  } = useCalendarData();

  const {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredEvents,
    filteredPosts,
  } = useCalendarFilters(events, scheduledPosts);

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [isEditPostDialogOpen, setIsEditPostDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditEventDialogOpen(true);
  };

  const handleEditPost = (post: ScheduledPost) => {
    setSelectedPost(post);
    setIsEditPostDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <CalendarHeader
        onExportSchedule={handleExportSchedule}
        onOpenEventDialog={() => setIsEventDialogOpen(true)}
        onOpenPostDialog={() => router.push("/dashboard/distribution")}
      />

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-2 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events and posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="posts">Posts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedItems.length} selected
                </Badge>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Views */}
      <CalendarView events={filteredEvents} scheduledPosts={filteredPosts} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter((e) => e.date > new Date()).length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                scheduledPosts.filter((p) => p.scheduledDate > new Date())
                  .length
              }{" "}
              pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const now = new Date();
                const weekStart = new Date(
                  now.setDate(now.getDate() - now.getDay())
                );
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                const thisWeekEvents = events.filter(
                  (e) => e.date >= weekStart && e.date <= weekEnd
                ).length;

                const thisWeekPosts = scheduledPosts.filter(
                  (p) =>
                    p.scheduledDate >= weekStart && p.scheduledDate <= weekEnd
                ).length;

                return thisWeekEvents + thisWeekPosts;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">events & posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredEvents.filter((e) => e.type === "meeting").length}
            </div>
            <p className="text-xs text-muted-foreground">total meetings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Items */}
      <UpcomingItems
        events={filteredEvents}
        scheduledPosts={filteredPosts}
        onEditEvent={handleEditEvent}
        onEditPost={handleEditPost}
      />

      {/* Dialogs */}
      <CreateEventDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        onCreateEvent={handleCreateEvent}
      />

      <EditEventDialog
        open={isEditEventDialogOpen}
        onOpenChange={setIsEditEventDialogOpen}
        event={selectedEvent}
        onUpdateEvent={handleUpdateEvent}
      />

      <EditPostDialog
        open={isEditPostDialogOpen}
        onOpenChange={setIsEditPostDialogOpen}
        post={selectedPost}
        onUpdatePost={handleUpdatePost}
      />
    </div>
  );
}
