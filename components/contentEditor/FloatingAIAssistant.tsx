
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Brain,
  Sparkles,
  FileText,
  Search,
  Zap,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Loader2,
  X,
  Wand2,
  Lightbulb,
  Target,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Settings,
  Palette,
  Shirt,
  Handshake,
  Smile,
  Briefcase,
  Laugh
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAIContentGeneration } from "../../hooks/useAIContentGeneration";
import type { AnyBlock } from "@/types/editor";
import type { AITool, AITone, ContentBlock, AIRequest } from "@/types/ai";

interface FloatingAIAssistantProps {
  blocks: AnyBlock[];
  onContentUpdate: (blocks: AnyBlock[]) => void;
  onTitleUpdate: (title: string) => void;
  onAIEnhancement?: (originalContent: string, enhancedContent: string, tool: AITool, enhancedBlocks?: ContentBlock[]) => void;
  position?: "bottom-right" | "bottom-left";
  user: { isPremium: boolean };
}

interface AIToolConfig {
  id: AITool;
  label: string;
  icon: React.ElementType;
  description: string;
  requiresContent?: boolean;
  premium?: boolean;
}

const AI_TOOLS: AIToolConfig[] = [
  {
    id: "improve",
    label: "Content Improver",
    icon: TrendingUp,
    description: "Enhance existing content quality",
    requiresContent: true,
    premium: true,
  },
  {
    id: "seo",
    label: "SEO support",
    icon: Search,
    description: "Optimize for search engines",
    requiresContent: true,
    premium: true,
  },
  {
    id: "ideas",
    label: "Idea Generation",
    icon: Lightbulb,
    description: "Generate content ideas",
    requiresContent: false,
  },
  {
    id: "headlines",
    label: "Content Creation",
    icon: Target,
    description: "Create catchy headlines",
    requiresContent: false,
  },
  {
    id: "summarize",
    label: "Content Atomizer",
    icon: FileText,
    description: "Create a summary of your written content",
    requiresContent: true,
  },
];

const TONE_OPTIONS: { value: AITone; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'professional', label: 'Professional', icon: Briefcase, color: 'bg-slate-600' },
  { value: 'casual', label: 'Casual', icon: Smile, color: 'bg-blue-600' },
  { value: 'friendly', label: 'Friendly', icon: Handshake, color: 'bg-green-600' },
  { value: 'authoritative', label: 'Authoritative', icon: Target, color: 'bg-red-600' },
  { value: 'creative', label: 'Creative', icon: Palette, color: 'bg-purple-600' },
  { value: 'funny', label: 'Funny', icon: Laugh, color: 'bg-yellow-600' },
];

export function FloatingAIAssistant({
  blocks,
  onContentUpdate,
  onTitleUpdate,
  onAIEnhancement,
  position = "bottom-right",
  user
}: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'settings'>('tools');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [selectedTone, setSelectedTone] = useState<AITone>('professional');
  const [customPrompt, setCustomPrompt] = useState("");
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [usageStats, setUsageStats] = useState({
    hourlyRequestsRemaining: 20,
    totalRequests: 0,
  });
  
  const { toast } = useToast();
  const { generateContent, isGenerating } = useAIContentGeneration();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close tone selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowToneSelector(false);
      }
    };

    if (showToneSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToneSelector]);

  // Load usage stats
  useEffect(() => {
    const loadUsageStats = async () => {
      try {
        const response = await fetch('/api/ai/usage-stats');
        if (response.ok) {
          const stats = await response.json();
          setUsageStats({
            hourlyRequestsRemaining: stats.hourlyRequestsRemaining || 20,
            totalRequests: stats.totalRequests || 0,
          });
        }
      } catch (error) {
        console.error('Failed to load usage stats:', error);
      }
    };
    loadUsageStats();
  }, []);

  // Get current content with full context for AI
  const getCurrentContent = () => {
    console.log('Blocks received:', blocks);
    return blocks
      .filter(block => block.type === 'text' || block.type === 'heading' || block.type === 'quote' || block.type === 'list')
      .map(block => {
        console.log('Processing block:', block);
        let content = '';
        
        switch (block.type) {
          case 'text':
            content = block.content?.text || '';
            break;
          case 'heading':
            content = block.content?.text || '';
            break;
          case 'quote':
            content = block.content?.text || '';
            break;
          case 'list':
            content = block.content?.items?.join('\n') || '';
            break;
          default:
            content = '';
        }
        
        return content;
      })
      .join('\n\n');
  };

  // Get content with full block context for AI processing
  const getContentWithContext = () => {
    return blocks
      .filter(block => block.type === 'text' || block.type === 'heading' || block.type === 'quote' || block.type === 'list')
      .map(block => {
        switch (block.type) {
          case 'text':
            return {
              type: 'text',
              content: block.content?.text || '',
              context: 'paragraph'
            };
          case 'heading':
            return {
              type: 'heading',
              content: block.content?.text || '',
              level: block.content?.level || 1,
              context: `heading level ${block.content?.level || 1}`
            };
          case 'quote':
            return {
              type: 'quote',
              content: block.content?.text || '',
              author: block.content?.author,
              context: 'quote block'
            };
          case 'list':
            return {
              type: 'list',
              content: block.content?.items || [],
              ordered: block.content?.ordered || false,
              context: block.content?.ordered ? 'ordered list' : 'unordered list'
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

  // Handle AI tool execution
  const handleToolExecution = async (tool: AITool) => {
    // Check if content is required for this tool
    if (tool !== "ideas" && tool !== "headlines") {
      const currentContent = getCurrentContent();
      if (!currentContent.trim()) {
        let toolDescription = "";
        switch (tool) {
          case "summarize":
            toolDescription = "summarize your written content";
            break;
          case "improve":
            toolDescription = "enhance your content";
            break;
          case "seo":
            toolDescription = "optimize your content for SEO";
            break;
        }
        toast({
          title: "No Content to Enhance",
          description: `Please write some content in the editor first to ${toolDescription}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Check if premium feature
    const toolConfig = AI_TOOLS.find(t => t.id === tool);
    if (toolConfig?.premium && !user.isPremium) {
      toast({
        title: "Premium Feature",
        description: "This feature is available for premium users only",
        variant: "destructive",
      });
      return;
    }

    try {
      // Build AI request according to backend structure
      const request: AIRequest = {
        toolType: tool,
        tone: selectedTone,
      };

      // For simple tools (ideas, headlines), use prompt
      if (tool === "ideas" || tool === "headlines") {
        if (!customPrompt.trim()) {
          toast({
            title: "Prompt Required",
            description: `Please enter a prompt for ${tool}`,
            variant: "destructive",
          });
          return;
        }
        request.prompt = customPrompt.trim();
      } else {
        // For enhancement tools (improve, seo), use contentBlocks
        // For summarize, use rawContent
        if (tool === "summarize") {
          request.rawContent = getCurrentContent();
        } else {
          // For improve and seo, use contentBlocks
          const contentBlocks: ContentBlock[] = [];
          
          blocks
            .filter(block => block.type === 'text' || block.type === 'heading' || block.type === 'quote' || block.type === 'list')
            .forEach(block => {
              switch (block.type) {
                case 'text':
                  contentBlocks.push({
                    type: 'text',
                    content: block.content?.text || ''
                  });
                  break;
                case 'heading':
                  contentBlocks.push({
                    type: 'heading',
                    content: block.content?.text || '',
                    level: block.content?.level || 1
                  });
                  break;
                case 'quote':
                  contentBlocks.push({
                    type: 'quote',
                    content: block.content?.text || '',
                    author: block.content?.author || ''
                  });
                  break;
                case 'list':
                  contentBlocks.push({
                    type: 'list',
                    content: block.content?.items || [],
                    ordered: block.content?.ordered || false
                  });
                  break;
              }
            });
          
          request.contentBlocks = contentBlocks;
        }
      }

      const result = await generateContent(request);

      if (result.success) {
        // Handle suggestions (ideas, headlines, summarize)
        if (result.suggestions && result.suggestions.length > 0) {
          if (tool === "ideas" || tool === "headlines") {
            setSuggestions(result.suggestions);
            setShowSuggestions(true);
            toast({
              title: "Suggestions Generated",
              description: `Generated ${result.suggestions.length} ${tool}`,
            });
          } else if (tool === "summarize") {
            const summary = result.suggestions[0];
            const originalContent = getCurrentContent();
            onAIEnhancement?.(originalContent, summary, tool);
            
            toast({
              title: "Content Summarized",
              description: "Your content has been summarized",
            });
          }
        }

        // Handle enhanced blocks (improve, seo)
        if (result.enhancedBlocks && result.enhancedBlocks.length > 0) {
          // Convert enhanced blocks back to editor format
          const enhancedEditorBlocks: AnyBlock[] = [];
          result.enhancedBlocks.forEach((block: ContentBlock, index: number) => {
            const originalBlock = blocks[index];
            const baseBlock = {
              id: originalBlock?.id || Math.random().toString(36).substr(2, 9),
              order: originalBlock?.order || index,
            };
            switch (block.type) {
              case 'text':
                enhancedEditorBlocks.push({
                  ...baseBlock,
                  type: 'text' as const,
                  content: {
                    text: block.content as string,
                    html: block.content as string
                  }
                });
                break;
              case 'heading':
                enhancedEditorBlocks.push({
                  ...baseBlock,
                  type: 'heading' as const,
                  content: {
                    text: block.content as string,
                    level: (block.level || 1) as 1 | 2 | 3 | 4 | 5 | 6
                  }
                });
                break;
              case 'quote':
                enhancedEditorBlocks.push({
                  ...baseBlock,
                  type: 'quote' as const,
                  content: {
                    text: block.content as string,
                    author: block.author || ''
                  }
                });
                break;
              case 'list':
                enhancedEditorBlocks.push({
                  ...baseBlock,
                  type: 'list' as const,
                  content: {
                    items: Array.isArray(block.content) ? block.content : [block.content as string],
                    ordered: block.ordered || false
                  }
                });
                break;
            }
          });

          // Instead of updating blocks directly, show enhancement preview if possible
          if (onAIEnhancement) {
            // Join all original content for preview (for now, as a simple string)
            const originalContent = blocks
              .filter(block => block.type === 'text' || block.type === 'heading' || block.type === 'quote' || block.type === 'list')
              .map(block => {
                switch (block.type) {
                  case 'text':
                  case 'heading':
                  case 'quote':
                    return block.content?.text || '';
                  case 'list':
                    return (block.content?.items || []).join('\n');
                  default:
                    return '';
                }
              })
              .join('\n\n');
            // Join all enhanced content for preview
            const enhancedContent = enhancedEditorBlocks
              .map(block => {
                switch (block.type) {
                  case 'text':
                  case 'heading':
                  case 'quote':
                    return block.content?.text || '';
                  case 'list':
                    return (block.content?.items || []).join('\n');
                  default:
                    return '';
                }
              })
              .join('\n\n');
            // Convert enhancedEditorBlocks (AnyBlock[]) to ContentBlock[]
            const enhancedContentBlocks = enhancedEditorBlocks
              .filter(block => block.type === 'text' || block.type === 'heading' || block.type === 'quote' || block.type === 'list')
              .map(block => {
                switch (block.type) {
                  case 'text':
                    return {
                      type: 'text',
                      content: block.content.text,
                    };
                  case 'heading':
                    return {
                      type: 'heading',
                      content: block.content.text,
                      level: block.content.level,
                    };
                  case 'quote':
                    return {
                      type: 'quote',
                      content: block.content.text,
                      author: block.content.author,
                    };
                  case 'list':
                    return {
                      type: 'list',
                      content: block.content.items,
                      ordered: block.content.ordered,
                    };
                  default:
                    return null;
                }
              })
              .filter(Boolean);
            // Pass enhancedContentBlocks as the 4th argument
            onAIEnhancement(originalContent, enhancedContent, tool, enhancedContentBlocks as ContentBlock[]);
          } else {
            // Fallback: update the blocks directly
            onContentUpdate(enhancedEditorBlocks);
          }

          toast({
            title: "Content Enhanced",
            description: `Content has been enhanced with ${tool} improvements`,
          });
        }
        
        // Update usage stats
        if (result.usageStats) {
          setUsageStats({
            hourlyRequestsRemaining: result.usageStats.hourlyRequestsRemaining || 0,
            totalRequests: result.usageStats.hourlyTotalRequests || 0,
          });
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to enhance content. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('AI tool execution failed:', error);
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Responsive positioning classes
  const positionClasses = {
    "bottom-right": isMobile ? "bottom-4 right-4" : "bottom-6 right-6",
    "bottom-left": isMobile ? "bottom-4 left-4" : "bottom-6 left-6",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`} ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className={`${isMobile ? 'w-[calc(100vw-2rem)]' : 'w-96'} max-w-[96vw] p-3 sm:p-4 shadow-xl border-2 bg-card/95 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">AI Assistant</h3>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('settings')}
                    className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
                  >
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-border mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('tools')}
                  className={`flex-1 rounded-none border-b-2 transition-colors text-xs sm:text-sm ${
                    activeTab === 'tools'
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Tools
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 rounded-none border-b-2 transition-colors text-xs sm:text-sm ${
                    activeTab === 'settings'
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Settings
                </Button>
              </div>

              {/* Tab Content */}
              {activeTab === 'tools' ? (
                <>
                  {/* AI Tools Grid - Responsive */}
                  <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mb-4`}>
                    {AI_TOOLS.map((tool) => {
                      const hasContent = getCurrentContent().trim().length > 0;
                      
                      // Determine if button should be disabled
                      let isDisabled = false;
                      let disabledReason = "";
                      
                      if (isGenerating) {
                        isDisabled = true;
                        disabledReason = "AI is currently processing...";
                      } else if (tool.premium && !user.isPremium) {
                        isDisabled = true;
                        disabledReason = "Requires premium subscription";
                      } else if (tool.requiresContent && !hasContent) {
                        isDisabled = true;
                        disabledReason = "Write some content first to use this tool";
                      }
                      
                      return (
                        <Button
                          key={tool.id}
                          variant={selectedTool === tool.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTool(tool.id)}
                          disabled={isDisabled}
                          className={`h-auto ${isMobile ? 'p-2' : 'p-2'} flex flex-col items-center gap-1 w-full min-h-[60px] sm:min-h-[70px]`}
                          title={isDisabled ? disabledReason : tool.description}
                        >
                          <tool.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs leading-tight text-center">{tool.label}</span>
                          {tool.premium && (
                            <Badge variant={user.isPremium ? "default" : "secondary"} className="text-xs px-1 py-0">
                              Pro
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                    
                    {/* Tone Selector Button */}
                    <div className="relative">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setShowToneSelector(!showToneSelector)}
                        disabled={isGenerating}
                        className={`h-auto ${isMobile ? 'p-2' : 'p-2'} flex flex-col items-center gap-1 w-full relative min-h-[60px] sm:min-h-[70px]`}
                        title="Select writing tone"
                      >
                        <div className="flex items-center gap-1">
                          {(() => {
                            const selectedToneData = TONE_OPTIONS.find(t => t.value === selectedTone);
                            const IconComponent = selectedToneData?.icon || Palette;
                            return <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />;
                          })()}
                          {showToneSelector && <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3" />}
                          {!showToneSelector && <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />}
                        </div>
                        <span className="text-xs leading-tight">Tone</span>
                        <span className="text-xs font-medium capitalize bg-primary/10 px-1 rounded leading-tight">
                          {selectedTone}
                        </span>
                      </Button>

                      {/* Responsive Tone Selector */}
                      <AnimatePresence>
                        {showToneSelector && (
                          <>
                            {/* Backdrop blur */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="fixed inset-0 bg-black/25 backdrop-blur-md z-40"
                              onClick={() => setShowToneSelector(false)}
                            />
                            
                            {/* Mobile: Simple Grid Layout */}
                            {isMobile ? (
                              <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-card/95 backdrop-blur-sm rounded-lg border shadow-xl p-3"
                                >
                                  <div className="grid grid-cols-3 gap-2">
                                    {TONE_OPTIONS.map((tone) => (
                                      <Button
                                        key={tone.value}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedTone(tone.value);
                                          setShowToneSelector(false);
                                        }}
                                        className={`h-12 flex flex-col items-center gap-1 transition-all duration-200 ${
                                          selectedTone === tone.value 
                                            ? 'bg-blue-600 text-white border-blue-500 shadow-lg' 
                                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                                        }`}
                                        title={tone.label}
                                      >
                                        <tone.icon className="h-3 w-3" />
                                        <span className="text-xs">{tone.label.slice(0, 4)}</span>
                                      </Button>
                                    ))}
                                  </div>
                                </motion.div>
                              </div>
                            ) : (
                              /* Desktop: L-Shape Container */
                              <div className="absolute bottom-0 right-0 z-50">
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  className="relative"
                                >
                                  {/* Grid-based L-shape layout: 3 vertical + 3 horizontal (excluding corner) */}
                                  {TONE_OPTIONS.map((tone, index) => {
                                    // Define L-shape positions for 6 buttons:
                                    // Vertical column: positions 0, 1, 2 (bottom to top)
                                    // Horizontal row: positions 3, 4, 5 (right to left from corner)
                                    // Position 0 is the corner (shared reference point)
                                    
                                    const gridSize = 44; // Button size + gap
                                    const buttonSize = 40; // Actual button size
                                    
                                    let x = 0;
                                    let y = 0;
                                    
                                    switch (index) {
                                      case 0: // Corner position (bottom-right of L)
                                        x = 0;
                                        y = 0;
                                        break;
                                      case 1: // Above corner
                                        x = 0;
                                        y = -gridSize;
                                        break;
                                      case 2: // Top of vertical column
                                        x = 0;
                                        y = -gridSize * 2;
                                        break;
                                      case 3: // Left of corner
                                        x = -gridSize;
                                        y = 0;
                                        break;
                                      case 4: // Middle of horizontal row
                                        x = -gridSize * 2;
                                        y = 0;
                                        break;
                                      case 5: // Far left of horizontal row
                                        x = -gridSize * 3;
                                        y = 0;
                                        break;
                                      default:
                                        x = 0;
                                        y = 0;
                                    }
                                    
                                    return (
                                      <motion.div
                                        key={tone.value}
                                        initial={{ 
                                          scale: 0, 
                                          opacity: 0,
                                          x: 0,
                                          y: 0
                                        }}
                                        animate={{ 
                                          scale: 1, 
                                          opacity: 1,
                                          x: x,
                                          y: y
                                        }}
                                        exit={{ 
                                          scale: 0, 
                                          opacity: 0,
                                          x: 0,
                                          y: 0
                                        }}
                                        transition={{ 
                                          duration: 0.2,
                                          delay: index * 0.03,
                                          ease: "easeOut"
                                        }}
                                        className="absolute"
                                        style={{
                                          transformOrigin: 'center center',
                                          width: `${buttonSize}px`,
                                          height: `${buttonSize}px`
                                        }}
                                      >
                                        {/* Perfect Square Grid Button - High Fidelity */}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedTone(tone.value);
                                            setShowToneSelector(false);
                                          }}
                                          className={`
                                            w-full h-full rounded-md transition-all duration-200 border p-0 flex items-center justify-center
                                            ${selectedTone === tone.value 
                                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/50' 
                                              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white'
                                            }
                                          `}
                                          title={tone.label}
                                        >
                                          <tone.icon className="h-4 w-4" />
                                        </Button>
                                      </motion.div>
                                    );
                                  })}
                                </motion.div>
                              </div>
                            )}
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Tool Description */}
                  {selectedTool && (
                    <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        <strong>{AI_TOOLS.find(t => t.id === selectedTool)?.label}:</strong>{' '}
                        {AI_TOOLS.find(t => t.id === selectedTool)?.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        Tone: <span className="font-medium text-primary capitalize">{selectedTone}</span>
                      </div>
                    </div>
                  )}

                  {/* Custom Prompt for Ideas/Headlines */}
                  {selectedTool && (selectedTool === "ideas" || selectedTool === "headlines") && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Enter your {selectedTool} prompt:
                      </div>
                      <Textarea
                        placeholder={`What would you like ${selectedTool} about?`}
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="min-h-[80px] resize-none text-sm"
                      />
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        Will generate {selectedTool} with a <span className="font-medium text-primary capitalize">{selectedTone}</span> tone
                      </div>
                    </div>
                  )}

                  {/* Execute Button */}
                  {selectedTool && (
                    <Button
                      onClick={() => handleToolExecution(selectedTool)}
                      disabled={isGenerating || usageStats.hourlyRequestsRemaining <= 0}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? "Enhancing..." : "Enhance with AI"}
                    </Button>
                  )}

                  {usageStats.hourlyRequestsRemaining <= 0 && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        You&apos;ve reached your hourly limit. Please wait or upgrade.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Settings Tab Content */
                <div className="space-y-4">
                  {/* Usage Stats */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Usage Statistics</h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Requests left:</span>
                        <Badge variant="outline">
                          {usageStats.hourlyRequestsRemaining}/20
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content Stats */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Words written:</span>
                        <Badge variant="secondary">
                          {getCurrentContent().trim().split(/\s+/).filter(word => word.length > 0).length} words
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Content length: {getCurrentContent().length} characters
                      </div>
                      {getCurrentContent().trim().length === 0 ? (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ No content detected - write some content to enable AI tools
                        </p>
                      ) : (
                        <p className="text-xs text-green-500 mt-1">
                          ✅ Content detected - AI tools are available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI Preferences */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">AI Preferences</h4>
                    
                    {/* Default Tone Setting */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Default Tone</div>
                          <div className="text-xs text-muted-foreground">Set your preferred writing tone</div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {selectedTone}
                        </Badge>
                      </div>
                    </div>

                    {/* Smart Suggestions Toggle */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Smart Suggestions</div>
                          <div className="text-xs text-muted-foreground">Auto-suggest improvements while typing</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Output Language */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Output Language</div>
                          <div className="text-xs text-muted-foreground">Language for AI-generated content</div>
                        </div>
                        <Badge variant="outline">
                          English
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Account</h4>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Subscription</div>
                          <div className="text-xs text-muted-foreground">Current plan status</div>
                        </div>
                        <Badge variant={user.isPremium ? "default" : "secondary"}>
                          {user.isPremium ? "Premium" : "Free"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Floating Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full shadow-lg`}
          size="icon"
        >
          {isOpen ? (
            <ChevronDown className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          ) : (
            <Brain className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          )}
        </Button>
      </motion.div>
      
      {/* Responsive Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute ${isMobile ? 'bottom-12 left-0 right-0' : 'bottom-16 right-0'} ${isMobile ? 'w-full' : 'w-80'} bg-card/95 backdrop-blur-sm rounded-lg border shadow-xl p-4 z-40`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">AI Suggestions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                  onClick={() => {
                    // Insert suggestion as a new text block
                    const newBlock: AnyBlock = {
                      id: Math.random().toString(36).substr(2, 9),
                      type: "text",
                      content: { text: suggestion, html: suggestion },
                      order: blocks.length,
                    };
                    onContentUpdate([...blocks, newBlock]);
                    
                    toast({
                      title: "Suggestion Added",
                      description: "The suggestion has been added to your content",
                    });
                  }}
                >
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
