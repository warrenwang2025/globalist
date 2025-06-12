"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Block, BlockWrapper } from "./blocks";
import { ActionButtonBlock } from "./blocks/ActionButtonBlock";
import { FullscreenToggle } from "./FullscreenToggle";
import { ActionButtons } from "./ActionButtons";
import { useBlockManager } from "./hooks/useBlockManager";
import { useToast } from "@/hooks/use-toast";
import {
  Type,
  Image as ImageIcon,
  Video,
  Link2,
  Heading1,
  Quote,
  List,
  Plus,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
  Settings,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import type { AnyBlock, ActionButton } from "@/types/editor";

interface EditorCanvasProps {
  initialBlocks?: AnyBlock[];
  onContentChange?: (blocks: AnyBlock[]) => void;
  className?: string;
}

const blockTypes = [
  {
    type: "text" as const,
    icon: Type,
    label: "Text",
    description: "Add a text block",
  },
  {
    type: "heading" as const,
    icon: Heading1,
    label: "Heading",
    description: "Add a heading",
  },
  {
    type: "image" as const,
    icon: ImageIcon,
    label: "Image",
    description: "Add an image",
  },
  {
    type: "video" as const,
    icon: Video,
    label: "Video",
    description: "Embed a video",
  },
  {
    type: "embed" as const,
    icon: Link2,
    label: "Embed",
    description: "Embed content",
  },
  {
    type: "quote" as const,
    icon: Quote,
    label: "Quote",
    description: "Add a quote",
  },
  {
    type: "list" as const,
    icon: List,
    label: "List",
    description: "Add a list",
  },
];

export function EditorCanvas({
  initialBlocks = [],
  onContentChange,
  className,
}: EditorCanvasProps) {
  const { toast } = useToast();
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    editorState,
    updateBlock,
    addBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    toggleFullscreen,
  } = useBlockManager({ initialBlocks, onContentChange });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderBlocks(result.source.index, result.destination.index);
  };

  const handleRemoveActionButton = (buttonId: string) => {
    setActionButtons((prev) => prev.filter((btn) => btn.id !== buttonId));
    toast({
      title: "Action button removed",
      description: "The action button has been removed from your content.",
    });
  };

  const handleClearAllActionButtons = () => {
    setActionButtons([]);
    toast({
      title: "All action buttons cleared",
      description: "All action buttons have been removed from your content.",
    });
  };

  const getBlockIcon = (type: AnyBlock["type"]) => {
    const blockType = blockTypes.find((bt) => bt.type === type);
    return blockType ? blockType.icon : Type;
  };

  const getBlockLabel = (type: AnyBlock["type"]) => {
    const blockType = blockTypes.find((bt) => bt.type === type);
    return blockType ? blockType.label : "Unknown";
  };

  const getBlockPreview = (block: AnyBlock) => {
    switch (block.type) {
      case "text":
        const textContent = (block.content as any).text || "";
        return textContent.length > 30
          ? textContent.substring(0, 30) + "..."
          : textContent || "Empty text block";
      case "heading":
        const headingContent = (block.content as any).text || "";
        const level = (block.content as any).level || 1;
        return `H${level}: ${
          headingContent.length > 25
            ? headingContent.substring(0, 25) + "..."
            : headingContent || "Empty heading"
        }`;
      case "image":
        const imageUrl = (block.content as any).url || "";
        const imageAlt = (block.content as any).alt || "";
        return imageUrl ? imageAlt || "Image" : "No image selected";
      case "video":
        const videoUrl = (block.content as any).url || "";
        return videoUrl ? "Video embedded" : "No video URL";
      case "embed":
        const embedUrl = (block.content as any).url || "";
        return embedUrl ? "Content embedded" : "No embed URL";
      case "quote":
        const quoteText = (block.content as any).text || "";
        return quoteText.length > 30
          ? quoteText.substring(0, 30) + "..."
          : quoteText || "Empty quote";
      case "list":
        const items = (block.content as any).items || [];
        const ordered = (block.content as any).ordered || false;
        return `${ordered ? "Ordered" : "Unordered"} list (${
          items.length
        } items)`;
      default:
        return "Unknown block";
    }
  };

  const BlockAddButton = ({
    type,
    icon: Icon,
    label,
    description,
  }: {
    type: AnyBlock["type"];
    icon: any;
    label: string;
    description: string;
  }) => (
    <Button
      variant="ghost"
      onClick={() => addBlock(type)}
      className="w-full justify-start h-auto p-3 text-left hover:bg-muted/50"
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {description}
          </div>
        </div>
      </div>
    </Button>
  );

  return (
    <div className={cn("relative h-screen", className)}>
      {/* Main Editor Area */}
      <motion.div
        className={cn(
          "flex flex-col h-full",
          editorState.isFullscreen && "fixed inset-0 z-50 bg-background"
        )}
        layout
      >
        {/* Fixed Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Content Editor</h1>
            </div>
            <div className="flex items-center gap-2">
              {!editorState.isFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2"
                >
                  {sidebarOpen ? (
                    <PanelRightClose className="h-4 w-4" />
                  ) : (
                    <PanelRightOpen className="h-4 w-4" />
                  )}
                </Button>
              )}
              <FullscreenToggle
                isFullscreen={editorState.isFullscreen}
                onToggle={toggleFullscreen}
              />
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          <div
            className={cn(
              "p-4 pb-20",
              editorState.isFullscreen && "pt-0 min-h-screen"
            )}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="editor-blocks">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "max-w-4xl mx-auto space-y-4",
                      snapshot.isDraggingOver && "bg-muted/50 rounded-lg p-2"
                    )}
                  >
                    <AnimatePresence>
                      {editorState.blocks.map((block, index) => (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className={cn(
                                "group relative",
                                snapshot.isDragging && "z-50 rotate-2 shadow-lg"
                              )}
                            >
                              <BlockWrapper
                                block={block}
                                isSelected={
                                  editorState.selectedBlockId === block.id
                                }
                                isDragging={snapshot.isDragging}
                                onSelect={() => selectBlock(block.id)}
                                onDelete={() => deleteBlock(block.id)}
                                dragHandleProps={provided.dragHandleProps}
                              >
                                <Block
                                  block={block}
                                  isSelected={
                                    editorState.selectedBlockId === block.id
                                  }
                                  onUpdate={(content) =>
                                    updateBlock(block.id, content)
                                  }
                                />
                              </BlockWrapper>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}

                    {/* Action Buttons in Content */}
                    {actionButtons.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="group relative"
                      >
                        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                          {/* Action Buttons Controls */}
                          <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearAllActionButtons}
                              className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
                              title="Remove all action buttons"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                  Action Buttons
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAllActionButtons}
                                className="text-xs text-muted-foreground hover:text-destructive"
                              >
                                Clear All
                              </Button>
                            </div>
                            <ActionButtonBlock
                              buttons={actionButtons}
                              onRemoveButton={handleRemoveActionButton}
                              showRemoveButtons={true}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {/* Empty State */}
                    {editorState.blocks.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                          <Plus className="h-12 w-12 mx-auto mb-2" />
                          <h3 className="text-lg font-medium">
                            Start creating
                          </h3>
                          <p className="text-sm">
                            Use the sidebar to add your first block
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </motion.div>

      {/* Right Sidebar - Overlay */}
      {!editorState.isFullscreen && sidebarOpen && (
        <>
          {/* Sidebar Overlay for all screen sizes */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-background border-l z-50 flex flex-col shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">Tools</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 h-auto"
                >
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Add Blocks Section */}
                <div>
                  <h3 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                    Add Blocks
                  </h3>
                  <div className="space-y-1">
                    {blockTypes.map(({ type, icon, label, description }) => (
                      <BlockAddButton
                        key={type}
                        type={type}
                        icon={icon}
                        label={label}
                        description={description}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Content Blocks Management */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Content Blocks ({editorState.blocks.length})
                    </h3>
                    {editorState.blocks.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          editorState.blocks.forEach((block) =>
                            deleteBlock(block.id)
                          );
                          toast({ title: "All blocks cleared" });
                        }}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  {editorState.blocks.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <div className="text-xs">No blocks added yet</div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {editorState.blocks.map((block, index) => {
                        const Icon = getBlockIcon(block.type);
                        const isSelected =
                          editorState.selectedBlockId === block.id;

                        return (
                          <Card
                            key={block.id}
                            className={cn(
                              "p-3 cursor-pointer transition-all hover:bg-muted/50",
                              isSelected &&
                                "ring-2 ring-primary ring-offset-1 bg-primary/5"
                            )}
                            onClick={() => selectBlock(block.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <GripVertical className="h-3 w-3 text-muted-foreground" />
                                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {getBlockLabel(block.type)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      #{index + 1}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {getBlockPreview(block)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectBlock(block.id);
                                  }}
                                  className="p-1 h-auto hover:bg-primary/20"
                                  title="Select block"
                                >
                                  {isSelected ? (
                                    <Eye className="h-3 w-3" />
                                  ) : (
                                    <EyeOff className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBlock(block.id);
                                  }}
                                  className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
                                  title="Delete block"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Action Buttons Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Action Buttons ({actionButtons.length})
                    </h3>
                    {actionButtons.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAllActionButtons}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  <ActionButtons
                    buttons={actionButtons}
                    onButtonsChange={setActionButtons}
                  />

                  {/* Action Buttons List */}
                  {actionButtons.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">
                        Current Buttons:
                      </h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {actionButtons.map((button) => (
                          <Card key={button.id} className="p-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Badge variant="outline" className="text-xs">
                                  {button.type.replace("_", " ")}
                                </Badge>
                                <span className="text-xs truncate">
                                  {button.label}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveActionButton(button.id)
                                }
                                className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
                                title="Remove button"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions Section */}
                <div>
                  <h3 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clear all blocks
                        editorState.blocks.forEach((block) =>
                          deleteBlock(block.id)
                        );
                        toast({ title: "All content cleared" });
                      }}
                      className="w-full justify-start"
                      disabled={editorState.blocks.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Blocks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllActionButtons}
                      className="w-full justify-start"
                      disabled={actionButtons.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Action Buttons
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clear everything
                        editorState.blocks.forEach((block) =>
                          deleteBlock(block.id)
                        );
                        setActionButtons([]);
                        toast({ title: "Everything cleared" });
                      }}
                      className="w-full justify-start"
                      disabled={
                        editorState.blocks.length === 0 &&
                        actionButtons.length === 0
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Everything
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Export content
                        const exportData = {
                          blocks: editorState.blocks,
                          actionButtons: actionButtons,
                          timestamp: new Date().toISOString(),
                        };
                        const content = JSON.stringify(exportData, null, 2);
                        navigator.clipboard.writeText(content);
                        toast({ title: "Content copied to clipboard" });
                      }}
                      className="w-full justify-start"
                      disabled={
                        editorState.blocks.length === 0 &&
                        actionButtons.length === 0
                      }
                    >
                      Export JSON
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </div>
  );
}
