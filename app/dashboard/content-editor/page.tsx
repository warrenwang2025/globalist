"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { StreamlinedEditor } from "@/components/contentEditor/StreamlinedEditor";
import { UpgradeModal } from "@/components/contentEditor/UpgradeModal";
import { PublishingHubModal } from "@/components/PublishingHubModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformSelector } from "@/components/platform-selector";

import {
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

// Platform mapping utility
const platformMapping: Record<number, string> = {
  1: 'Twitter',    // Twitter
  2: 'LinkedIn',   // LinkedIn  
  3: 'Instagram',  // Instagram
  4: 'YouTube',    // YouTube
  5: 'TikTok',     // TikTok
  6: 'Facebook'    // Facebook
};

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
  const [showPublishingHub, setShowPublishingHub] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  // saveAIContent was removed with the old AI Assistant. If you want to save, implement logic here or use another method.
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({ isPremium: session.user.userSubscriptionLevel !== "free" });
    }
  }, [session, status]);

  // Load post from URL parameter if editing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('postId');
      
      if (postId && status === "authenticated") {
        loadPost(postId);
      }
    }
  }, [status]);



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

      // Prepare the save payload
      const savePayload = {
        title: editorTitle,
        blocks: editorBlocks,
        status: 'draft' as const,
        platforms: selectedPlatforms.map(id => platformMapping[id]).filter(Boolean),
        tags: [], // TODO: Add tags functionality later
        isPublic: true,
        ...(currentPostId && { postId: currentPostId }), // Include postId if editing existing post
      };

      // Call the save API
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save content');
      }

      const result = await response.json();
      
      // Update post state management
      if (result.post?.id) {
        setCurrentPostId(result.post.id);
        setIsEditing(true);
      }

      toast({
        title: "Success",
        description: `Content ${isEditing ? 'updated' : 'saved'} successfully!`,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content. Please try again.",
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

  const handlePublish = () => {
    console.log("Publishing with blocks:", blocks);
    console.log("Publishing with title:", title);
    
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

    console.log("Extracted content text:", contentText);
    console.log("Content text length:", contentText.length);

    if (!contentText.trim()) {
      toast({
        title: "Content required",
        description: "Please add content before publishing",
        variant: "destructive",
      });
      return;
    }

    // Allow publishing without platforms (will go to Globalist.live only)
    // The Publishing Hub will handle platform selection if needed

    // Open the Publishing Hub modal
    setShowPublishingHub(true);
  };

  const handlePublishingHubPublish = async (socialContent: Record<string, string>, platformMedia: Record<string, File[]>) => {
    setIsPublishing(true);

    try {
      // TODO: Implement actual publishing logic here
      // This would send the main article content AND the social media posts to the backend
      await new Promise((res) => setTimeout(res, 2000));

      const platformNames = selectedPlatforms
        .map((id) =>
          ["Twitter", "LinkedIn", "Instagram", "YouTube", "TikTok", "Facebook"][
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

  // Function to load existing post
  const loadPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/content/load?postId=${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load post');
      }

      const postData = await response.json();
      
      setTitle(postData.title);
      setBlocks(postData.blocks);
      setCurrentPostId(postData.id);
      setIsEditing(true);
      
      // Map backend platform names back to frontend IDs
      const platformIds = postData.platforms
        ?.map((platformName: string) => {
          const entry = Object.entries(platformMapping).find(([_, name]) => name === platformName);
          return entry ? parseInt(entry[0]) : null;
        })
        .filter((id: number | null) => id !== null) || [];
      
      setSelectedPlatforms(platformIds);
      
      toast({
        title: "Post Loaded",
        description: "Your post has been loaded successfully!",
      });
    } catch (error) {
      console.error('Load error:', error);
      toast({
        title: "Error",
        description: "Failed to load post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background w-full flex flex-col">
      <div className="w-full px-4 md:px-8 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Distribution
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Create, edit, and distribute your content across platforms
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing && currentPostId && (
                <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Editing Post #{currentPostId.slice(-6)}
                </div>
              )}
              {isSaving && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              )}
            </div>
          </div>
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

        {/* Content Editor */}
        <div className="w-full space-y-6">
          <StreamlinedEditor
            key={currentPostId || 'new-post'} // Force re-mount when post changes
            user={user}
            onSave={handleSave}
            onPreview={(title, blocks) => handlePreview(title, blocks)}
            onPublish={handlePublish}
            onContentChange={(newTitle: string, newBlocks: AnyBlock[]) => {
              setTitle(newTitle);
              setBlocks(newBlocks);
            }}
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

      <PublishingHubModal
        open={showPublishingHub}
        onOpenChange={setShowPublishingHub}
        title={title}
        blocks={blocks}
        selectedPlatforms={selectedPlatforms}
        onPublish={handlePublishingHubPublish}
      />
    </div>
  );
}
