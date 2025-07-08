"use client";

import { useState } from "react";
import { EditorCanvas } from "./EditorCanvas";
import { FloatingAIAssistant } from "./FloatingAIAssistant";
import { AIEnhancementViewer } from "./AIEnhancementViewer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Eye,
  FileText,
  Sparkles,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface User {
  isPremium: boolean;
}

interface StreamlinedEditorProps {
  user: User;
  onSave?: (title: string, blocks: AnyBlock[]) => Promise<void>;
  onPreview?: (title: string, blocks: AnyBlock[]) => void;
  initialTitle?: string;
  initialBlocks?: AnyBlock[];
}

interface AIEnhancement {
  originalContent: string;
  enhancedContent: string;
  tool: string;
  blockIndex?: number;
  enhancedBlocks?: AnyBlock[];
}

export function StreamlinedEditor({
  user,
  onSave,
  onPreview,
  initialTitle = "",
  initialBlocks = [],
}: StreamlinedEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<AnyBlock[]>(initialBlocks);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [aiEnhancement, setAIEnhancement] = useState<AIEnhancement | null>(null);
  const [showEnhancementView, setShowEnhancementView] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(title, blocks);
      setLastSaved(new Date());
      toast({
        title: "Saved",
        description: "Your content has been saved successfully",
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title to preview your content",
        variant: "destructive",
      });
      return;
    }
    onPreview?.(title, blocks);
  };

  const getWordCount = () => {
    return blocks
      .filter(block => block.type === 'text' || block.type === 'heading')
      .reduce((count, block) => {
        let text = '';
        if (block.type === 'text' && block.content?.text) {
          text = block.content.text;
        } else if (block.type === 'heading' && block.content?.text) {
          text = block.content.text;
        }
        
        if (text.trim()) {
          const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
          return count + words.length;
        }
        return count;
      }, 0);
  };

  const handleAIEnhancement = (originalContent: string, enhancedContent: string, tool: string, enhancedBlocks?: AnyBlock[]) => {
    setAIEnhancement({
      originalContent,
      enhancedContent,
      tool,
      enhancedBlocks,
    });
    setShowEnhancementView(true);
  };

  const handleAcceptEnhancement = (enhancedContent: string) => {
    if (aiEnhancement && aiEnhancement.enhancedBlocks && aiEnhancement.enhancedBlocks.length > 0) {
      setBlocks(aiEnhancement.enhancedBlocks);
      setAIEnhancement(null);
      setShowEnhancementView(false);
      toast({
        title: "Enhancement Applied",
        description: "AI enhancement has been applied to your content",
      });
      return;
    }
    // fallback: old logic (should not be used for block-based enhancements)
    if (aiEnhancement) {
      const updatedBlocks = blocks.map(block => {
        if (block.type === 'text' && 
            block.content?.text && 
            block.content.text.includes(aiEnhancement.originalContent)) {
          return {
            ...block,
            content: {
              ...block.content,
              text: block.content.text.replace(aiEnhancement.originalContent, enhancedContent),
              html: block.content.html?.replace(aiEnhancement.originalContent, enhancedContent) || enhancedContent
            }
          };
        } else if (block.type === 'heading' && 
                   block.content?.text && 
                   block.content.text.includes(aiEnhancement.originalContent)) {
          return {
            ...block,
            content: {
              ...block.content,
              text: block.content.text.replace(aiEnhancement.originalContent, enhancedContent)
            }
          };
        }
        return block;
      });
      setBlocks(updatedBlocks);
      setAIEnhancement(null);
      setShowEnhancementView(false);
      toast({
        title: "Enhancement Applied",
        description: "AI enhancement has been applied to your content",
      });
    }
  };

  const handleRejectEnhancement = () => {
    setAIEnhancement(null);
    toast({
      title: "Enhancement Rejected",
      description: "Original content kept unchanged",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold">Content Editor</h1>
              </div>
              {user.isPremium && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{getWordCount()} words</span>
                </div>
                {lastSaved && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={!title.trim()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !title.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Input */}
          <Card className="p-6 mb-6">
            <Input
              placeholder="Enter your title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-none bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </Card>

          {/* Editor Canvas */}
          <Card className="p-6 min-h-[500px]">
            <EditorCanvas
              initialBlocks={blocks}
              onContentChange={setBlocks}
              className="focus-within:ring-2 focus-within:ring-primary/20 rounded-lg"
            />
          </Card>

          {/* Empty State */}
          {blocks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Writing</h3>
                <p className="text-sm">
                  Click anywhere to add your first block, or use the AI assistant to generate content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant
        blocks={blocks}
        onContentUpdate={setBlocks}
        onTitleUpdate={setTitle}
        onAIEnhancement={handleAIEnhancement}
        user={user}
        position="bottom-right"
      />

      {/* AI Enhancement Viewer */}
      {aiEnhancement && (
        <AIEnhancementViewer
          originalContent={aiEnhancement.originalContent}
          enhancedContent={aiEnhancement.enhancedContent}
          tool={aiEnhancement.tool}
          isVisible={showEnhancementView}
          onAccept={() => handleAcceptEnhancement(aiEnhancement.enhancedContent)}
          onReject={handleRejectEnhancement}
          onCopy={() => {
            toast({
              title: "Copied",
              description: "Enhanced content copied to clipboard",
            });
          }}
        />
      )}
    </div>
  );
}
