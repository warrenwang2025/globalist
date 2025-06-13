"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Block, BlockWrapper } from "./blocks";
import { ActionButtonBlock } from "./blocks/ActionButtonBlock";
import { FullscreenToggle } from "./FullscreenToggle";
import { EditorSidebar } from "./EditorSidebar";
import { useBlockManager } from "./hooks/useBlockManager";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import type { AnyBlock, ActionButton } from "@/types/editor";

interface EditorCanvasProps {
  initialBlocks?: AnyBlock[];
  onContentChange?: (blocks: AnyBlock[]) => void;
  className?: string;
}

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
    
    const { source, destination } = result;
    
    // Handle block reordering
    if (source.droppableId === "editor-blocks" && destination.droppableId === "editor-blocks") {
      reorderBlocks(source.index, destination.index);
    }
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

  const handleReorderActionButtons = (startIndex: number, endIndex: number) => {
    const result = Array.from(actionButtons);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setActionButtons(result);
  };

  const handleMoveBlockUp = (blockId: string) => {
    const currentIndex = editorState.blocks.findIndex(block => block.id === blockId);
    if (currentIndex > 0) {
      reorderBlocks(currentIndex, currentIndex - 1);
      toast({ title: "Block moved up" });
    }
  };

  const handleMoveBlockDown = (blockId: string) => {
    const currentIndex = editorState.blocks.findIndex(block => block.id === blockId);
    if (currentIndex < editorState.blocks.length - 1) {
      reorderBlocks(currentIndex, currentIndex + 1);
      toast({ title: "Block moved down" });
    }
  };

  const handleMoveActionButtonUp = (buttonId: string) => {
    const currentIndex = actionButtons.findIndex(button => button.id === buttonId);
    if (currentIndex > 0) {
      handleReorderActionButtons(currentIndex, currentIndex - 1);
      toast({ title: "Action button moved up" });
    }
  };

  const handleMoveActionButtonDown = (buttonId: string) => {
    const currentIndex = actionButtons.findIndex(button => button.id === buttonId);
    if (currentIndex < actionButtons.length - 1) {
      handleReorderActionButtons(currentIndex, currentIndex + 1);
      toast({ title: "Action button moved down" });
    }
  };

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

                    {/* Action Buttons - Simple Display */}
                    {actionButtons.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6"
                      >
                        <ActionButtonBlock
                          buttons={actionButtons}
                          onRemoveButton={() => {}} // No remove functionality in content area
                          showRemoveButtons={false} // Hide remove buttons in content area
                        />
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

      {/* Right Sidebar Component */}
      {!editorState.isFullscreen && (
        <EditorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          editorState={editorState}
          actionButtons={actionButtons}
          onActionButtonsChange={setActionButtons}
          onAddBlock={addBlock}
          onDeleteBlock={deleteBlock}
          onSelectBlock={selectBlock}
          onRemoveActionButton={handleRemoveActionButton}
          onClearAllActionButtons={handleClearAllActionButtons}
          onReorderActionButtons={handleReorderActionButtons}
          onMoveBlockUp={handleMoveBlockUp}
          onMoveBlockDown={handleMoveBlockDown}
          onMoveActionButtonUp={handleMoveActionButtonUp}
          onMoveActionButtonDown={handleMoveActionButtonDown}
        />
      )}
    </div>
  );
}
