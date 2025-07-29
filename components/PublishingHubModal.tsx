"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Send, Edit3, CheckCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AnyBlock } from "@/types/editor";

interface PublishingHubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  blocks: AnyBlock[];
  selectedPlatforms: number[];
  onPublish: (socialContent: Record<string, string>) => void;
}

const platformMap = {
  1: "X (Twitter)",
  2: "LinkedIn", 
  3: "Instagram",
  4: "YouTube",
  5: "TikTok",
  6: "Personal Site / Newsletter"
};

export function PublishingHubModal({
  open,
  onOpenChange,
  title,
  blocks,
  selectedPlatforms,
  onPublish
}: PublishingHubModalProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [socialContent, setSocialContent] = useState<Record<string, string>>({});
  const [hasOptimized, setHasOptimized] = useState(false);
  const { toast } = useToast();

  // Convert blocks to plain text for AI processing
  const getArticleContent = () => {
    return blocks
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
  };

  // Get platform names for selected platforms
  const getSelectedPlatformNames = () => {
    return selectedPlatforms.map(id => platformMap[id as keyof typeof platformMap]).filter(Boolean);
  };

  // Initialize social content with excerpts for selected platforms
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !hasOptimized) {
      const initialContent: Record<string, string> = {};
      const articleContent = getArticleContent();
      const excerpt = articleContent.substring(0, 200) + (articleContent.length > 200 ? "..." : "");
      
      getSelectedPlatformNames().forEach(platform => {
        initialContent[platform] = excerpt;
      });
      
      setSocialContent(initialContent);
    }
  }, [selectedPlatforms, hasOptimized]);

  // Optimize content for social media using AI
  const handleOptimizeForSocial = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to optimize for",
        variant: "destructive",
      });
      return;
    }

    const articleContent = getArticleContent();
    if (!articleContent.trim()) {
      toast({
        title: "No content to optimize",
        description: "Please add content before optimizing for social media",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "contentAtomizer",
          payload: {
            articleContent,
            platforms: getSelectedPlatformNames(),
          },
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to optimize content");
      }

      setSocialContent(data.result);
      setHasOptimized(true);
      
      toast({
        title: "Content optimized!",
        description: "AI has generated platform-specific content for you to review and edit",
      });
    } catch (error: any) {
      console.error("Optimization failed:", error);
      toast({
        title: "Optimization failed",
        description: error.message || "Failed to optimize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Handle content editing for each platform
  const handleContentChange = (platform: string, content: string) => {
    setSocialContent(prev => ({
      ...prev,
      [platform]: content
    }));
  };

  // Handle final publishing
  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish(socialContent);
      onOpenChange(false);
      setSocialContent({});
      setHasOptimized(false);
    } catch (error) {
      console.error("Publishing failed:", error);
      toast({
        title: "Publishing failed",
        description: "Failed to publish content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSocialContent({});
      setHasOptimized(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] max-w-full mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Publishing Hub
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Article Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                  {getArticleContent().substring(0, 200)}...
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {getSelectedPlatformNames().map((platform) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Optimization Button */}
          {selectedPlatforms.length > 0 && (
            <div className="flex justify-center">
                          <Button
              onClick={handleOptimizeForSocial}
              disabled={isOptimizing}
              className="w-full sm:w-auto min-w-[200px]"
            >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Optimize for Social Media
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Platform Selection Prompt */}
          {selectedPlatforms.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Want to share on social media?</h3>
                    <p className="text-sm">
                      Your content will be published to Globalist.live. You can also share it on social platforms for wider reach.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="w-full sm:w-auto"
                    >
                      Publish to Globalist.live Only
                    </Button>
                    <Button
                      onClick={() => onOpenChange(false)}
                      className="w-full sm:w-auto"
                    >
                      Select Platforms & Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Tabs */}
          {selectedPlatforms.length > 0 && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Social Media Content ({selectedPlatforms.length} platforms)
                </h3>
                {selectedPlatforms.length > 3 && (
                  <div className="hidden sm:block text-xs text-muted-foreground">
                    ← Scroll to see all platforms →
                  </div>
                )}
              </div>
              <Tabs defaultValue={getSelectedPlatformNames()[0]} className="w-full">
                <TabsList className="flex w-full overflow-x-auto scrollbar-none">
                  {getSelectedPlatformNames().map((platform) => (
                    <TabsTrigger 
                      key={platform} 
                      value={platform} 
                      className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                    >
                      {platform}
                    </TabsTrigger>
                  ))}
                </TabsList>

              {getSelectedPlatformNames().map((platform) => (
                <TabsContent key={platform} value={platform} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Edit3 className="h-4 w-4" />
                        {platform} Content
                        {hasOptimized && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Optimized
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={socialContent[platform] || ""}
                        onChange={(e) => handleContentChange(platform, e.target.value)}
                        placeholder={`Content for ${platform}...`}
                        className="min-h-[150px] sm:min-h-[200px] resize-none text-sm"
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        {hasOptimized 
                          ? "Edit the AI-generated content to match your voice and style"
                          : "This is an excerpt of your article. Use the 'Optimize for Social Media' button above to generate platform-specific content."
                        }
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
              </Tabs>
            </div>
          )}

          {/* Publishing Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPublishing}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPublish}
              disabled={isPublishing}
              className="w-full sm:w-auto min-w-[150px] order-1 sm:order-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {selectedPlatforms.length > 0 ? "Confirm & Publish" : "Publish to Globalist.live"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 