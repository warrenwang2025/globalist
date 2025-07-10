import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Lock, Wand2, Edit, Crown } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <Card className="p-3 sm:p-4 md:p-6 w-full max-w-full">
      <CardHeader className="px-0 pt-0 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="break-words">AI Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-3 sm:space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors w-full"
            >
              <p className="font-medium mb-2 sm:mb-3 text-sm sm:text-base break-words leading-relaxed">
                {suggestion}
              </p>
              
              {/* Responsive Button Layout */}
              <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
                <Button
                  size={isMobile ? "default" : "sm"}
                  variant="outline"
                  onClick={() => generateContentFromSuggestion(suggestion)}
                  disabled={isGenerating}
                  className={`relative ${isMobile ? 'w-full justify-center' : 'flex-shrink-0'} min-h-[44px] sm:min-h-[36px]`}
                >
                  {!user.isPremium && (
                    <Lock className="mr-1 h-3 w-3 sm:h-3 sm:w-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <Wand2 className="mr-1 h-3 w-3 sm:h-3 sm:w-3 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {isGenerating ? "Generating..." : "Generate Content"}
                  </span>
                  {!user.isPremium && (
                    <Crown className="ml-1 h-3 w-3 sm:h-3 sm:w-3 text-yellow-500 flex-shrink-0" />
                  )}
                </Button>
                
                <Button
                  size={isMobile ? "default" : "sm"}
                  variant="outline"
                  onClick={() => {
                    setTitle(suggestion);
                    setActiveTab("editor");
                  }}
                  className={`${isMobile ? 'w-full justify-center' : 'flex-shrink-0'} min-h-[44px] sm:min-h-[36px]`}
                >
                  <Edit className="mr-1 h-3 w-3 sm:h-3 sm:w-3 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Use as Title</span>
                </Button>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {suggestions.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No suggestions available yet</p>
              <p className="text-xs sm:text-sm mt-1 opacity-75">
                Generate some ideas to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
