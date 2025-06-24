"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  FileText,
  Share2,
  Edit,
} from "lucide-react";
import type { Event, ScheduledPost } from "@/types/calendar";
import { EditEventDialog } from "./edit-event-dialog";
import { EditPostDialog } from "./edit-post-dialog";

interface CalendarViewProps {
  events: Event[];
  scheduledPosts: ScheduledPost[];
  onUpdateEvent?: (event: Event) => void;
  onUpdatePost?: (post: ScheduledPost) => void;
}

export function CalendarView({
  events,
  scheduledPosts,
  onUpdateEvent,
  onUpdatePost,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [selectedItem, setSelectedItem] = useState<
    Event | ScheduledPost | null
  >(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Add theme detection
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  // Get current month/year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Handle edit item directly
  const handleEditItem = (item: Event | ScheduledPost) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  // Handle update event
  const handleUpdateEvent = (updatedEvent: Event) => {
    if (onUpdateEvent) {
      onUpdateEvent(updatedEvent);
    }
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  // Handle update post
  const handleUpdatePost = (updatedPost: ScheduledPost) => {
    if (onUpdatePost) {
      onUpdatePost(updatedPost);
    }
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  // Check if item is an Event
  const isEvent = (item: Event | ScheduledPost): item is Event => {
    return "type" in item;
  };

  // Get platform names for scheduled posts
  const getPlatformNames = (platformIds: number[]) => {
    const platformMap: { [key: number]: string } = {
      1: "Facebook",
      2: "Twitter",
      3: "LinkedIn",
      4: "Instagram",
      5: "YouTube",
      6: "TikTok",
    };
    return platformIds
      .map((id) => platformMap[id] || `Platform ${id}`)
      .join(", ");
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Get items for a specific date
  const getItemsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    const dayEvents = events.filter(
      (event) => event.date.toDateString() === dateStr
    );
    const dayPosts = scheduledPosts.filter(
      (post) => post.scheduledDate.toDateString() === dateStr
    );
    return [...dayEvents, ...dayPosts];
  };

  // Get week dates
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }

    return week;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={
                    viewMode === "week" ? goToPreviousWeek : goToPreviousMonth
                  }
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <CardTitle className="text-sm sm:text-base md:text-lg font-semibold px-1 whitespace-nowrap">
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={viewMode === "week" ? goToNextWeek : goToNextMonth}
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 " />
                </Button>
              </div>
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="hidden sm:flex"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Month
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="hidden sm:flex"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Week
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">List</span>
              </Button>

              {/* Mobile View Selector */}
              <div className="flex sm:hidden">
                <Button
                  variant={viewMode === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="ml-1"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {viewMode === "month" && (
            <div className="p-4">
              {/* Month View */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground"
                  >
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.charAt(0)}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {getDaysInMonth(currentDate).map((day, index) => (
                  <div
                    key={index}
                    className={`
                      min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-1 sm:p-2 border rounded-lg
                      ${day 
                        ? isDark 
                          ? "bg-[#23272F] hover:bg-[#313846]" 
                          : "bg-white hover:bg-gray-300"
                        : isDark 
                          ? "bg-[#1A1D23]" 
                          : "bg-gray-100"}
                      ${
                        day && day.toDateString() === new Date().toDateString()
                          ? "ring-2 ring-blue-500"
                          : ""
                      }
                    `}
                  >
                    {day && (
                      <>
                        <div className="text-xs sm:text-sm font-medium mb-1">
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getItemsForDate(day)
                            .slice(0, 2)
                            .map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className={`
                                text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 group
                                ${
                                  "type" in item
                                    ? isDark 
                                      ? "bg-blue-900 text-blue-200" 
                                      : "bg-blue-100 text-blue-800"
                                    : isDark 
                                      ? "bg-green-900 text-green-200" 
                                      : "bg-green-100 text-green-800"
                                }
                              `}
                                onClick={() => handleEditItem(item)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate">
                                    {"type" in item ? item.title : item.title}
                                  </span>
                                  <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ))}
                          {getItemsForDate(day).length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{getItemsForDate(day).length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "week" && (
            <div className="p-4">
              {/* Week View */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {getWeekDates(currentDate).map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                        <span className="hidden sm:inline">
                          {dayNames[day.getDay()]}
                        </span>
                        <span className="sm:hidden">
                          {dayNames[day.getDay()].charAt(0)}
                        </span>
                      </div>
                      <div
                        className={`
                          text-lg sm:text-xl font-bold mt-1
                          ${
                            day.toDateString() === new Date().toDateString()
                              ? "text-blue-600"
                              : ""
                          }
                        `}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                    <div className="space-y-1 min-h-[200px] sm:min-h-[300px]">
                      {getItemsForDate(day).map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`
                            text-xs p-2 rounded-lg border-l-4 cursor-pointer hover:opacity-80 group
                            ${
                              "type" in item
                                ? "bg-blue-50 border-blue-400 text-blue-800"
                                : "bg-green-50 border-green-400 text-green-800"
                            }
                          `}
                          onClick={() => handleEditItem(item)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">
                              {"type" in item ? item.title : item.title}
                            </div>
                            <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {"type" in item && item.duration && (
                            <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                              <Clock className="h-3 w-3" />
                              {item.duration}min
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <div className="p-4">
              {/* List View */}
              <div className="space-y-4">
                {[...events, ...scheduledPosts]
                  .sort((a, b) => {
                    const dateA = "type" in a ? a.date : a.scheduledDate;
                    const dateB = "type" in b ? b.date : b.scheduledDate;
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`
                            p-2 rounded-full
                            ${"type" in item ? "bg-blue-100" : "bg-green-100"}
                          `}
                        >
                          {"type" in item ? (
                            item.type === "meeting" ? (
                              <Users className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Calendar className="h-4 w-4 text-blue-600" />
                            )
                          ) : (
                            <Clock className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {"type" in item ? item.title : item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {"type" in item
                            ? item.description
                            : `Scheduled for ${item.platforms.length} platforms`}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {("type" in item
                              ? item.date
                              : item.scheduledDate
                            ).toLocaleDateString()}
                          </Badge>
                          {"type" in item && item.duration && (
                            <Badge variant="outline" className="text-xs">
                              {item.duration} min
                            </Badge>
                          )}
                          {"type" in item && item.attendees && (
                            <Badge variant="outline" className="text-xs">
                              {item.attendees} attendees
                            </Badge>
                          )}
                          {!("type" in item) && (
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}

                {[...events, ...scheduledPosts].length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No items scheduled
                    </h3>
                    <p className="text-muted-foreground">
                      Create your first event or schedule a post to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog - Conditionally render based on item type */}
      {selectedItem && isEvent(selectedItem) && (
        <EditEventDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          event={selectedItem}
          onUpdateEvent={handleUpdateEvent}
        />
      )}

      {selectedItem && !isEvent(selectedItem) && (
        <EditPostDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          post={selectedItem}
          onUpdatePost={handleUpdatePost}
        />
      )}
    </>
  );
}
