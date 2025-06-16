"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PlatformSelector } from "@/components/platform-selector";
import { UploadMedia } from "@/components/upload-media";
import { AIContentBanner } from "@/components/ai-content-banner";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Send, 
  Save, 
  Eye, 
  Sparkles, 
  Brain
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);

  const { toast } = useToast();

  const handleImportAIContent = (aiTitle: string, aiBlocks: AnyBlock[]) => {
    setTitle(aiTitle);
    setBlocks(aiBlocks);
  };

  const handlePlatformToggle = (platformId: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleMediaUpload = (files: File[]) => {
    setUploadedFiles(files);
    toast({
      title: "Media uploaded",
      description: `${files.length} file(s) ready for publishing`,
    });
  };





  const handlePreview = () => {
    const contentText = blocks

      .map(block => {
        switch (block.type) {








          case 'text':
            return (block.content as any).text || '';
          case 'heading':
            return (block.content as any).text || '';
          case 'quote':
            return (block.content as any).text || '';
          case 'list':
            return (block.content as any).items?.join(', ') || '';
          default:

            return '';
        }
      })
      .join(' ');

    if (!contentText.trim() && !title.trim()) {
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

    const previewData = {
      title,
      content: contentText,
      selectedPlatforms,

      uploadedFiles: uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
      scheduleDate,
      scheduleTime,
    };

    const previewUrl = `/preview?data=${encodeURIComponent(
      JSON.stringify(previewData)
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
    const contentText = blocks

      .map(block => {
        switch (block.type) {




          case 'text':
            return (block.content as any).text || '';
          case 'heading':
            return (block.content as any).text || '';
          default:

            return '';
        }
      })

      .join(' ');

    if (!title.trim() && !contentText.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please add a title or content before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
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

  const handlePublish = async () => {
    const contentText = blocks

      .map(block => {
        switch (block.type) {




          case 'text':
            return (block.content as any).text || '';
          case 'heading':
            return (block.content as any).text || '';
          default:

            return '';
        }
      })

      .join(' ');

    if (!contentText.trim()) {
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

    setIsPublishing(true);

    try {
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

      if (scheduleDate && scheduleTime) {
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        toast({
          title: "Post scheduled successfully!",
          description: `Your post will be published on ${scheduledDateTime.toLocaleString()} to: ${platformNames}`,
        });
      } else {
        toast({
          title: "Post published successfully!",
          description: `Your post has been published to: ${platformNames}`,
        });
      }

      // Reset form
      setTitle("");
      setBlocks([]);
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

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />

          Content Distribution
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">


          Publish your content across multiple platforms with scheduling and media support
        </p>
      </div>

      {/* AI Content Import Banner */}
      <div className="mb-6">

        <AIContentBanner 
          onImport={handleImportAIContent}
          showDismiss={true}
        />
      </div>





























      <div className="space-y-6">
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
                placeholder="Enter a compelling title for your post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            {blocks.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Need content? Use our{" "}
                  <a 
                    href="/dashboard/ai" 
                    className="text-primary hover:underline font-medium"
                  >
                    AI Assistant
                  </a>{" "}
                  to generate content, then import it here for publishing.
                </span>
              </div>












            )}
            {blocks.length > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Content Ready
                  </span>
                </div>



                <p className="text-sm text-green-700 dark:text-green-300">
                  {blocks.length} content block{blocks.length !== 1 ? 's' : ''} imported and ready for publishing
                </p>
              </div>
            )}
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















        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Media</CardTitle>
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
      </div>

      {/* Action Buttons */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
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

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 sm:flex-none"
              >
                <Send className="mr-2 h-4 w-4" />
                {isPublishing
                  ? "Publishing..."
                  : scheduleDate && scheduleTime
                  ? "Schedule Post"
                  : "Publish Now"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
