"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Plus,
  Download,
  FileText,
  Users
} from "lucide-react";

  interface CalendarHeaderProps {
    onExportSchedule: () => void;
    onOpenEventDialog: () => void;
    onOpenPostDialog: () => void;
  }

export function CalendarHeader({
  onExportSchedule,
  onOpenEventDialog,
  onOpenPostDialog,
}: CalendarHeaderProps) {
  return (
    <Card>
      <CardHeader className="px-4 pb-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-start">
          {/* Left Section */}
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg md:text-xl lg:text-3xl font-bold flex items-center gap-3 whitespace-nowrap">

              <div className="p-2 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
                Schedule & Calendar
            </CardTitle>
            <p className="text-muted-foreground mt-2 hidden md:block">
              Manage your events, meetings, and scheduled posts
            </p>
          </div>

          {/* Right Section (Buttons) */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-2 w-full lg:w-auto pr-1">
            <Button
              onClick={onOpenEventDialog}
              className="w-auto lg:w-[250px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              <Users className="mr-1 h-4 w-4" />
              New Event
            </Button>

            <Button
              onClick={onOpenPostDialog}
              variant="outline"
              className="w-full lg:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              <FileText className="mr-1 h-4 w-4" />
              New Post
            </Button>

            <Button
                onClick={onExportSchedule}
                variant="outline"
                className="w-full lg:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }
