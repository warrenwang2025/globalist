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
import { PlatformSelector } from "@/components/platform-selector";
import { AIContentBanner } from "@/components/ai-content-banner";
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
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

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({ isPremium: session.user.userSubscriptionLevel !== "free" });
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
    if (!editorTitle.trim()) throw new Error("Title is required");

    try {
      setIsSaving(true);
      setTitle(editorTitle);
      setBlocks(editorBlocks);
      saveAIContent(editorTitle, editorBlocks);

      toast({
        title: "Success",
        description: "Your content has been saved successfully!",
      });
    } catch (error) {
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
      .map((block) => {
        switch (block.type) {
          case "text":
          case "heading":
          case "quote":
            return (block.content as any).text || "";
          case "list":
            return (block.content as any).items?.join(", ") || "";
          default:
            return "";
        }
      })
      .join(" ");

    if (!contentText.trim() && !previewTitle.trim()) {
      toast({
        title: "Nothing to preview",
        description: "Please add content before previewing",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Select platforms",
        description: "Please select at least one platform",
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

    window.open(previewUrl, "_blank", "width=1200,height=800,scrollbars=yes");

    toast({
      title: "Preview opened",
      description: "Check the new tab for your content preview",
    });
  };

  const handlePublish = async () => {
    const contentText = blocks
      .map((block) => {
        switch (block.type) {
          case "text":
          case "heading":
          case "quote":
            return (block.content as any).text || "";
          case "list":
            return (block.content as any).items?.join(", ") || "";
          default:
            return "";
        }
      })
      .join(" ");

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
        description: "Please choose at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      await new Promise((res) => setTimeout(res, 2000));

      const platformNames = selectedPlatforms
        .map((id) =>
          ["X", "LinkedIn", "Instagram", "YouTube", "TikTok", "Personal"][
            id - 1
          ]
        )
        .join(", ");

      const description =
        scheduleDate && scheduleTime
          ? `Scheduled for ${new Date(
              `${scheduleDate}T${scheduleTime}`
            ).toLocaleString()} on ${platformNames}`
          : `Published to: ${platformNames}`;

      toast({ title: "Success", description });

      setSelectedPlatforms([]);
      setScheduleDate("");
      setScheduleTime("");
      setShowScheduling(false);
    } catch {
      toast({
        title: "Publishing failed",
        description: "Please try again later",
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
    <div className="min-h-screen bg-background w-full flex flex-col">
      <div className="w-full px-4 md:px-8 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Distribution
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create, edit, and distribute your content across platforms
          </p>
        </div>

        {/* Platform Selector */}
        <Card className="mb-6">
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

        {/* Scheduling Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Schedule Post</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduling(!showScheduling)}
              >
                {showScheduling ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          {showScheduling && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="schedule-date" className="flex gap-2 items-center font-semibold">
                    <Calendar className="h-4 w-4 text-primary" /> Select Date
                  </Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="mt-2"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-time" className="flex gap-2 items-center font-semibold">
                    <Clock className="h-4 w-4 text-primary" /> Select Time
                  </Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* AI Banner and Content Editor */}
        <div className="w-full space-y-6">
          <AIContentBanner onImport={handleImportAIContent} showDismiss />
          <StreamlinedEditor
            user={user}
            onSave={handleSave}
            onPreview={(title, blocks) => handlePreview(title, blocks)}
            initialTitle={title}
            initialBlocks={blocks}
          />
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
