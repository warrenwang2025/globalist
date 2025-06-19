import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Lock, Wand2, Edit, Crown } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface User {
  isPremium: boolean;
}

interface SuggestionsSectionProps {
  suggestions: string[];
  user: User;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  setBlocks: (blocks: AnyBlock[]) => void;
  setTitle: (title: string) => void;
  setActiveTab: (tab: string) => void;
  setShowUpgradeModal: (show: boolean) => void;
  toast: any;
}

export function SuggestionsSection({
  suggestions,
  user,
  isGenerating,
  setIsGenerating,
  setBlocks,
  setTitle,
  setActiveTab,
  setShowUpgradeModal,
  toast,
}: SuggestionsSectionProps) {
  const generateContentFromSuggestion = async (suggestion: string) => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    try {
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
        description: "AI has created comprehensive content based on your selection. You can now edit it in the editor.",
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

  return (
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
                  onClick={() => generateContentFromSuggestion(suggestion)}
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
  );
}