"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Import, X } from "lucide-react";
import { useAIContent } from "@/hooks/use-ai-content";
import { useToast } from "@/hooks/use-toast";

interface AIContentBannerProps {
  onImport?: (title: string, blocks: any[]) => void;
  showDismiss?: boolean;
}

export function AIContentBanner({
  onImport,
  showDismiss = false,
}: AIContentBannerProps) {
  const { hasAIContent, aiContent, importAIContent, clearAIContent } =
    useAIContent();
  const { toast } = useToast();

  if (!hasAIContent || !aiContent) return null;

  const handleImport = () => {
    const content = importAIContent();
    if (content && onImport) {
      onImport(content.title, content.blocks);
      toast({
        title: "AI content imported",
        description:
          "Your AI-generated content has been loaded into the editor",
      });
    }
  };

  const handleDismiss = () => {
    clearAIContent();
    toast({
      title: "AI content dismissed",
      description: "The AI-generated content has been removed",
    });
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-purple-900 dark:text-purple-100">
              AI-Generated Content Available
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {aiContent.title} - Ready to import and publish
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleImport}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Import className="mr-2 h-4 w-4" />
            Import Content
          </Button>
          {showDismiss && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="border-purple-200 hover:bg-purple-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
