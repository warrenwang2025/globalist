"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface AIEnhancementViewerProps {
  originalContent: string;
  enhancedContent: string;
  tool: string;
  isVisible: boolean;
  onAccept: () => void;
  onReject: () => void;
  onCopy?: () => void;
}

export function AIEnhancementViewer({
  originalContent,
  enhancedContent,
  tool,
  isVisible,
  onAccept,
  onReject,
  onCopy,
}: AIEnhancementViewerProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedContent);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case "improve":
        return "✨";
      case "seo":
        return "🔍";
      case "summarize":
        return "📄";
      case "tone":
        return "🎨";
      default:
        return "🤖";
    }
  };

  const getToolLabel = (toolName: string) => {
    switch (toolName) {
      case "improve":
        return "Content Improvement";
      case "seo":
        return "SEO Optimization";
      case "summarize":
        return "Content Summary";
      case "tone":
        return "Tone Enhancement";
      default:
        return "AI Enhancement";
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-4xl max-h-[90vh] bg-card border-2 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getToolIcon(tool)}</span>
                <h3 className="font-semibold text-foreground">
                  {getToolLabel(tool)}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiff(!showDiff)}
              >
                {showDiff ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Diff
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Diff
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {showDiff ? (
                  /* Diff View */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-muted-foreground">Original</span>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-foreground">
                          {originalContent}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-muted-foreground">Enhanced</span>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-foreground">
                          {enhancedContent}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Enhanced Content View */
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-muted-foreground">
                        AI Enhanced Content
                      </span>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {enhancedContent.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onReject}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={onAccept}
                className="bg-primary text-primary-foreground"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept & Replace
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
