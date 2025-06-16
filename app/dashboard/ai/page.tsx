"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditorCanvas } from "@/components/contentEditor/EditorCanvas";
import { useToast } from "@/hooks/use-toast";
import { useAIContent } from "@/hooks/use-ai-content";

import {
  Brain,
  Wand2,
  Crown,
  Lock,
  Edit,
  Settings,
  Sparkles,
  Send,
  Save,
  Eye,
  FileText,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState({
    isPremium: false,
  });
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");

  const router = useRouter();
  const { toast } = useToast();
  const { saveAIContent } = useAIContent();

  // Simulate fetching user data - replace with your actual auth logic
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = {
          isPremium: false, // Set this based on your user's subscription status
        };
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a topic",
        description: "Please describe your content topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newSuggestions = [
        `10 Essential Tips for ${prompt}`,
        `The Ultimate Guide to ${prompt}`,
        `How to Master ${prompt} in 2024`,
        `Common Mistakes to Avoid with ${prompt}`,
        `${prompt}: A Beginner's Complete Guide`,
      ];

      setSuggestions(newSuggestions);
      toast({
        title: "Ideas generated!",
        description: `Generated ${newSuggestions.length} content ideas for your topic`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContentFromSuggestion = async (suggestion: string) => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const generatedBlocks: AnyBlock[] = [
        {
          id: `heading-${Date.now()}`,
          type: "heading",
          content: {
            text: suggestion,
            level: 1,
          },
          order: 0,
        },
        {
          id: `text-${Date.now()}-1`,
          type: "text",
          content: {
            text: `This comprehensive guide will walk you through everything you need to know about ${suggestion.toLowerCase()}. Whether you're a beginner or looking to improve your skills, this content covers the essential strategies and best practices.`,
            html: `<p>This comprehensive guide will walk you through everything you need to know about <strong>${suggestion.toLowerCase()}</strong>. Whether you're a beginner or looking to improve your skills, this content covers the essential strategies and best practices.</p>`,
          },
          order: 1,
        },
        {
          id: `heading-${Date.now()}-2`,
          type: "heading",
          content: {
            text: "Key Benefits",
            level: 2,
          },
          order: 2,
        },
        {
          id: `list-${Date.now()}`,
          type: "list",
          content: {
            items: [
              "Improved understanding of core concepts",
              "Practical strategies you can implement immediately",
              "Expert insights and proven techniques",
              "Step-by-step guidance for success",
            ],
            ordered: false,
          },
          order: 3,
        },
        {
          id: `text-${Date.now()}-2`,
          type: "text",
          content: {
            text: "Ready to get started? Follow these actionable steps to achieve your goals and see real results.",
            html: "<p>Ready to get started? Follow these actionable steps to achieve your goals and see real results.</p>",
          },
          order: 4,
        },
      ];

      setBlocks(generatedBlocks);
      setTitle(suggestion);
      setActiveTab("editor");

      toast({
        title: "Content generated!",
        description:
          "AI has created comprehensive content based on your selection. You can now edit it in the editor.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizeSEO = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    // Premium user functionality
    toast({
      title: "SEO Optimization",
      description:
        "Analyzing and optimizing your content for search engines...",
    });
  };

  const handleContentImprover = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    // Premium user functionality
    toast({
      title: "Content Improvement",
      description: "Enhancing your content with AI suggestions...",
    });
  };

  const handleHeadlineGenerator = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a topic",
        description: "Please describe your content topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const headlines = [
        `${prompt}: The Complete Guide`,
        `Master ${prompt} in 30 Days`,
        `Why ${prompt} Matters More Than Ever`,
        `The Secret to Successful ${prompt}`,
        `${prompt} Mistakes That Cost You Money`,
      ];

      // Add headlines as suggestions
      setSuggestions((prev) => [...headlines, ...prev]);

      toast({
        title: "Headlines generated!",
        description: `Created ${headlines.length} compelling headlines for your topic`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = (newBlocks: AnyBlock[]) => {
    setBlocks(newBlocks);
  };

  const handleSaveDraft = async () => {
    const contentText = blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return (block.content as any).text || "";
          case "heading":
            return (block.content as any).text || "";
          default:
            return "";
        }
      })
      .join(" ");

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
        description: "Your AI-generated content has been saved as a draft",
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

  const handlePreview = () => {
    const contentText = blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return (block.content as any).text || "";
          case "heading":
            return (block.content as any).text || "";
          case "quote":
            return (block.content as any).text || "";
          case "list":
            return (block.content as any).items?.join(", ") || "";
          default:
            return "";
        }
      })
      .join(" ");

    if (!contentText.trim() && !title.trim()) {
      toast({
        title: "Nothing to preview",
        description: "Please generate some content before previewing",
        variant: "destructive",
      });
      return;
    }

    const previewData = {
      title,
      content: contentText,
      selectedPlatforms: [],
      uploadedFiles: [],
      scheduleDate: "",
      scheduleTime: "",
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
      description: "Check the new tab to see your AI-generated content preview",
    });
  };

  const handleSendToDistribution = () => {
    const contentText = blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return (block.content as any).text || "";
          case "heading":
            return (block.content as any).text || "";
          default:
            return "";
        }
      })
      .join(" ");

    if (!title.trim() && !contentText.trim()) {
      toast({
        title: "Nothing to send",
        description:
          "Please generate some content before sending to distribution",
        variant: "destructive",
      });
      return;
    }

    // Save content for distribution page
    saveAIContent(title, blocks);

    toast({
      title: "Content ready for distribution",
      description: "Your AI-generated content is ready to be published",
    });

    // Navigate to distribution page
    router.push("/dashboard/distribution");
  };

  const handleGetPlus = () => {
    router.push("/pricing");
  };

  const handleUpgradeFromModal = () => {
    setShowUpgradeModal(false);
    router.push("/pricing");
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AI Content Assistant
            </h1>
            {user.isPremium && <Crown className="h-6 w-6 text-yellow-500" />}
          </div>
        </div>
        <p className="text-muted-foreground text-sm md:text-base mt-2">
          Generate, edit, and optimize content with AI-powered tools
        </p>
      </div>

      {/* Premium Status Banner for Free Users */}
      {!user.isPremium && (
        <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Crown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Unlock Premium AI Features
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Get access to content generation, SEO optimization, and
                  advanced AI tools
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleGetPlus}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Content Editor</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-6">
          {/* AI Tools Grid */}
          <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr] items-start">
            {/* Left column - Content Generation */}
            <Card className="p-4 md:p-6 h-full">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div>
                  <Label htmlFor="topic">Content Topic</Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe your content topic or idea... (e.g., 'social media marketing for small businesses')"
                    className="mt-2"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1"
                    onClick={generateSuggestions}
                    disabled={isGenerating}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Ideas"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleHeadlineGenerator}
                    disabled={isGenerating}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Headlines
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right column - Quick Tools */}
            <Card className="p-4 md:p-6 h-full">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg">AI Tools</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start relative"
                    onClick={handleOptimizeSEO}
                  >
                    <div className="flex items-center w-full">
                      {!user.isPremium && (
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <Wand2 className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">SEO Optimizer</span>
                      {!user.isPremium && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start relative"
                    onClick={handleContentImprover}
                  >
                    <div className="flex items-center w-full">
                      {!user.isPremium && (
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <Brain className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">Content Improver</span>
                      {!user.isPremium && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Section */}
          {suggestions.length > 0 && (
            <Card className="p-4 md:p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium mb-2">{suggestion}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            generateContentFromSuggestion(suggestion)
                          }
                          disabled={isGenerating}
                          className="relative"
                        >
                          {!user.isPremium && (
                            <Lock className="mr-1 h-3 w-3 text-muted-foreground" />
                          )}
                          <Wand2 className="mr-1 h-3 w-3" />
                          {isGenerating ? "Generating..." : "Generate Content"}
                          {!user.isPremium && (
                            <Crown className="ml-1 h-3 w-3 text-yellow-500" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setTitle(suggestion);
                            setActiveTab("editor");
                          }}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Use as Title
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {/* Post Title */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your content title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Content Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EditorCanvas
                initialBlocks={blocks}
                onContentChange={handleContentChange}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>

          {/* Editor Actions */}
          <Card>
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
                    onClick={handleSendToDistribution}
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Send to Distribution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <DialogTitle>Premium Feature</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              This feature is only available for Premium users. Upgrade your
              plan to unlock:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                AI-powered content generation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Advanced SEO optimization tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                AI-powered content improvement
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Priority AI processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Advanced analytics access
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgradeFromModal}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
