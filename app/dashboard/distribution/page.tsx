"use client";

import { useState } from "react";
import { ContentEditor } from "@/components/content-editor";
import { UploadMedia } from "@/components/upload-media";
import { PlatformSelector } from "@/components/platform-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Send, Save, Eye } from "lucide-react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const { toast } = useToast();

  const handlePlatformToggle = (platformId: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleMediaUpload = (files: File[]) => {
    setUploadedFiles(files);
    toast({
      title: "Media uploaded",
      description: `${files.length} file(s) ready for publishing`,
    });
  };

  const handlePreview = () => {
    if (!content.trim() && !title.trim()) {
      toast({
        title: "Nothing to preview",
        description: "Please add some content before previewing",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Select platforms",
        description: "Please select at least one platform to preview",
        variant: "destructive",
      });
      return;
    }

    // Prepare preview data
    const previewData = {
      title,
      content,
      selectedPlatforms,
      uploadedFiles,
      scheduleDate,
      scheduleTime,
    };

    // Convert files to a serializable format for preview
    const serializableFiles = uploadedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    const previewDataForUrl = {
      ...previewData,
      uploadedFiles: serializableFiles,
    };

    // Open preview in new window
    const previewUrl = `/preview?data=${encodeURIComponent(
      JSON.stringify(previewDataForUrl)
    )}`;
    window.open(
      previewUrl,
      "_blank",
      "width=1200,height=800,scrollbars=yes,resizable=yes"
    );

    toast({
      title: "Preview opened",
      description: "Check the new tab to see your post preview",
    });
  };

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please add a title or content before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Draft saved",
        description: "Your post has been saved as a draft",
      });
    } catch (error) {
      toast({
        title: "Error saving draft",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishClick = () => {
    console.log("handle publish click")
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add content before publishing",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Select platforms",
        description: "Please select at least one platform to publish to",
        variant: "destructive",
      });
      return;
    }

    // Check if date and time are not selected
    if (!scheduleDate || !scheduleTime) {
      setShowPublishConfirm(true);
    } else {
      handleSchedule();
    }
  };

  const handlePublishNow = async () => {
    setShowPublishConfirm(false);
    setIsPublishing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const platformNames = selectedPlatforms
        .map((id) => {
          const platforms = [
            "X",
            "LinkedIn",
            "Instagram",
            "YouTube",
            "TikTok",
            "Personal",
          ];
          return platforms[id - 1];
        })
        .join(", ");

      toast({
        title: "Post published successfully!",
        description: `Your post has been published to: ${platformNames}`,
      });

      // Reset form
      setTitle("");
      setContent("");
      setSelectedPlatforms([]);
      setUploadedFiles([]);
      setScheduleDate("");
      setScheduleTime("");
    } catch (error) {
      toast({
        title: "Publishing failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedule = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add content before scheduling",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Select platforms",
        description: "Please select at least one platform to schedule for",
        variant: "destructive",
      });
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Schedule time required",
        description: "Please select both date and time for scheduling",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

      toast({
        title: "Post scheduled successfully!",
        description: `Your post will be published on ${scheduledDateTime.toLocaleString()}`,
      });

      // Reset form
      setTitle("");
      setContent("");
      setSelectedPlatforms([]);
      setUploadedFiles([]);
      setScheduleDate("");
      setScheduleTime("");
    } catch (error) {
      toast({
        title: "Scheduling failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-muted-foreground">
          Create and publish content across multiple social media platforms
        </p>
      </div>

      <div className="grid gap-6">
        {/* Post Title */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter a title for your post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publishing Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onPlatformToggle={handlePlatformToggle}
            />
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentEditor
              content={content}
              onContentChange={handleContentChange}
              selectedPlatforms={selectedPlatforms}
            />
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Media Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadMedia onMediaUpload={handleMediaUpload} />
          </CardContent>
        </Card>

        {/* Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule Post (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-date">Date</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="schedule-time">Time</Label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handlePreview}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>

              <div className="flex gap-3">
                {scheduleDate && scheduleTime && (
                  <Button
                    variant="secondary"
                    onClick={handleSchedule}
                    disabled={isPublishing}
                    className="flex-1 sm:flex-none"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {isPublishing ? "Scheduling..." : "Schedule Post"}
                  </Button>
                )}
                <Button
                  onClick={handlePublishClick}
                  disabled={isPublishing}
                  className="flex-1 sm:flex-none"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isPublishing ? "Publishing..." : "Publish Now"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Publish Confirmation Dialog */}
      <AlertDialog
        open={showPublishConfirm}
        onOpenChange={setShowPublishConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Content Now?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to publish this content right now? Your post will be
              immediately published to the selected platforms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishNow}>
              Yes, Publish Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
