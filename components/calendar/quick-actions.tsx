"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Users,
  FileText,
  Upload,
  Settings,
} from "lucide-react";

export function QuickActions() {
  const { toast } = useToast();
  const router = useRouter();

  const handleDailyStandup = () => {
    // Create a daily standup meeting for today
    const today = new Date();
    const standupTime = new Date(today);
    standupTime.setHours(9, 0, 0, 0); // Set to 9:00 AM

    // Here you would typically call your API to create the event
    // For now, we'll show a toast and potentially navigate
    toast({
      title: "Daily Standup Scheduled",
      description: `Daily standup meeting scheduled for ${standupTime.toLocaleDateString()} at ${standupTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`,
    });

    // Optionally navigate to calendar or refresh the page
    // router.refresh();
  };

  const handleTeamMeeting = () => {
    // Create a team meeting template
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // Set to 2:00 PM

    toast({
      title: "Team Meeting Scheduled",
      description: `Team meeting scheduled for ${tomorrow.toLocaleDateString()} at ${tomorrow.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`,
    });

    // You could also open a pre-filled create event dialog
    // or navigate to a specific meeting creation page
  };

  const handleContentReview = () => {
    // Navigate to content review or create a content review meeting
    toast({
      title: "Content Review Session",
      description: "Setting up content review session...",
    });

    // Navigate to content management or create review meeting
    router.push("/dashboard/content");
  };

  const handleBulkUpload = () => {
    // Navigate to bulk upload functionality
    toast({
      title: "Bulk Upload",
      description: "Opening bulk upload interface...",
    });

    // Navigate to media upload page or open bulk upload modal
    router.push("/dashboard/media");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-blue-50 hover:border-blue-200"
            onClick={handleDailyStandup}
          >
            <CalendarIcon className="h-6 w-6 mb-2 text-blue-600" />
            <span className="text-sm">Daily Standup</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-green-50 hover:border-green-200"
            onClick={handleTeamMeeting}
          >
            <Users className="h-6 w-6 mb-2 text-green-600" />
            <span className="text-sm">Team Meeting</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-purple-50 hover:border-purple-200"
            onClick={handleContentReview}
          >
            <FileText className="h-6 w-6 mb-2 text-purple-600" />
            <span className="text-sm">Content Review</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-orange-50 hover:border-orange-200"
            onClick={handleBulkUpload}
          >
            <Upload className="h-6 w-6 mb-2 text-orange-600" />
            <span className="text-sm">Bulk Upload</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}