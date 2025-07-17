"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
import { useRouter } from "next/navigation";
import ContentPreview from "@/components/distribution/content-preview";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // Load content from sessionStorage if returning from editor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const editorData = sessionStorage.getItem('editorContent');
      if (editorData) {
        try {
          const { title: editorTitle, blocks: editorBlocks } = JSON.parse(editorData);
          if (editorTitle) setTitle(editorTitle);
          if (editorBlocks) setBlocks(editorBlocks);
          sessionStorage.removeItem('editorContent');
        } catch {}
      }
    }
  }, []);

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

  // Sample data for preview if no content is present
  const sampleTitle = "Sample Post Title";
  const sampleBlocks = [
    { id: "1", type: "heading", content: { text: "Welcome to the Content Preview!", level: 2 } },
    { id: "2", type: "text", content: { text: "This is a sample block of text. You can edit or add your own content using the editor." } }
  ];
  const hasContent = title.trim() || (blocks && blocks.length > 0);

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

      {/* Content Editor Block or Preview */}
      {hasContent ? (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold"
              onClick={() => router.push('/dashboard/content-editor')}
            >
              Edit Content
            </Button>
          </div>
          <ContentPreview title={title || sampleTitle} blocks={blocks.length > 0 ? blocks : sampleBlocks} />
        </div>
      ) : (
        <Card className="mb-6 cursor-pointer hover:shadow-lg transition" onClick={() => router.push('/dashboard/content-editor')}>
          <CardContent className="flex items-center justify-center py-8">
            <Button variant="outline" size="lg" className="text-lg font-semibold">
              + Add Content
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Platform Selection - Moved to top */}
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

        {/* Scheduling Toggle in Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl lg:text-2xl flex items-center justify-between w-full">
              <span className="font-semibold">Schedule Post (Optional)</span>
              <Switch
                id="schedule-toggle"
                checked={showSchedule}
                onCheckedChange={setShowSchedule}
              />
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Scheduling Section (conditionally rendered) */}
        {showSchedule && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date & Time</CardTitle>
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
        )}
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
