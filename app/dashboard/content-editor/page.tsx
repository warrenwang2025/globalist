
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useAIContent } from "@/hooks/use-ai-content";
import { StreamlinedEditor } from "@/components/contentEditor/StreamlinedEditor";
import { UpgradeModal } from "@/components/contentEditor/UpgradeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PlatformSelector } from "@/components/platform-selector";
import { AIContentBanner } from "@/components/ai-content-banner";
import { 
  Calendar, 
  Clock, 
  Send, 
  Save, 
  Eye, 
  Sparkles, 
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

export default function DistributionPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState({ isPremium: false });
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { saveAIContent } = useAIContent();
  const { data: session, status } = useSession();

  // Get user data from session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userData = { 
        isPremium: session.user.userSubscriptionLevel !== 'free' || false 
      };
      setUser(userData);
    }
  }, [session, status]);

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

  const handleSave = async (editorTitle: string, editorBlocks: AnyBlock[]) => {
    if (!editorTitle.trim()) {
      throw new Error("Title is required");
    }

    try {
      setIsSaving(true);
      
      // Update local state
      setTitle(editorTitle);
      setBlocks(editorBlocks);
      
      // Save to AI content store
      saveAIContent(editorTitle, editorBlocks);

      toast({
        title: "Success",
        description: "Your content has been saved successfully!",
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = (previewTitle: string, previewBlocks: AnyBlock[]) => {
    const contentText = previewBlocks
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

    if (!contentText.trim() && !previewTitle.trim()) {
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
      title: previewTitle,
      content: contentText,
      blocks: previewBlocks,
      selectedPlatforms,
      scheduleDate,
      scheduleTime,
      timestamp: new Date().toISOString(),
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

  const handlePublish = async () => {
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

      // Reset distribution settings
      setSelectedPlatforms([]);
      setScheduleDate("");
      setScheduleTime("");
      setShowScheduling(false);
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

  const handleUpgradeFromModal = () => {
    setShowUpgradeModal(false);
    router.push("/pricing");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 md:py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Distribution
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
            Create, edit, and distribute your content across multiple platforms
          </p>
        </div>

        {/* Publishing Platforms - Always on top, horizontal layout */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg">Publishing Platforms</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full overflow-x-auto">
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={handlePlatformToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* AI Content Import Banner */}
            <div className="w-full">
              <AIContentBanner 
                onImport={handleImportAIContent}
                showDismiss={true}
              />
            </div>

            {/* Content Editor */}
            <div className="w-full">
              <StreamlinedEditor
                user={user}
                onSave={handleSave}
                onPreview={(title, blocks) => handlePreview(title, blocks)}
                initialTitle={title}
                initialBlocks={blocks}
              />
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Schedule Post Toggle */}
            <Card className="w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex items-center justify-between">
                  <span>Schedule Post</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScheduling(!showScheduling)}
                    className="h-8 w-8 p-0 shrink-0"
                  >
                    {showScheduling ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showScheduling && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="schedule-toggle"
                        checked={showScheduling}
                        onCheckedChange={setShowScheduling}
                      />
                      <Label htmlFor="schedule-toggle" className="text-sm">
                        Enable scheduling
                      </Label>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="w-full">
                        <Label htmlFor="schedule-date" className="text-sm font-medium">
                          Date
                        </Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                          <Input
                            id="schedule-date"
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="pl-10 w-full"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                      
                      <div className="w-full">
                        <Label htmlFor="schedule-time" className="text-sm font-medium">
                          Time
                        </Label>
                        <div className="relative mt-1">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                          <Input
                            id="schedule-time"
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Action Buttons */}
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => handlePreview(title, blocks)}
                    className="w-full justify-center"
                    disabled={!title.trim() || blocks.length === 0}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing || selectedPlatforms.length === 0}
                    className="w-full justify-center"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isPublishing
                      ? "Publishing..."
                      : scheduleDate && scheduleTime
                      ? "Schedule Post"
                      : "Publish Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={handleUpgradeFromModal}
      />
    </div>
  );
}
