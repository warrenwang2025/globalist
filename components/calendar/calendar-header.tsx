"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Download, 
  FileText,
  Users,
  Clock
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
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              Schedule & Calendar
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Manage your events, meetings, and scheduled posts
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={onOpenEventDialog}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              <Users className="mr-1 h-4 w-4" />
              New Event
            </Button>
            
            <Button
              onClick={onOpenPostDialog}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              <FileText className="mr-1 h-4 w-4" />
              New Post
            </Button>
            
            <Button
              onClick={onExportSchedule}
              variant="outline"
              className="w-full sm:w-auto"
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
