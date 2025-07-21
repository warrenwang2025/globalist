"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { AnyBlock, EditorState } from "@/types/editor";

interface UseBlockManagerProps {
  initialBlocks?: AnyBlock[];
  onContentChange?: (blocks: AnyBlock[]) => void;
}

export function useBlockManager({ initialBlocks = [], onContentChange }: UseBlockManagerProps) {
  function createTextBlock(): AnyBlock {
    return {
      id: uuidv4(),
      type: "text",
      content: { text: "", html: "" },
      order: 0,
    };
  }

  // Helper: deep compare blocks
  function areBlocksEqual(a: AnyBlock[], b: AnyBlock[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }
    return true;
  }

  const [editorState, setEditorState] = useState<EditorState>({
    blocks: initialBlocks.length > 0 ? initialBlocks : [], // Don't create default block
    selectedBlockId: null,
    isFullscreen: false,
  });

  // Sync editorState.blocks with initialBlocks prop after mount, only if different
  useEffect(() => {
    setEditorState((prev) => {
      if (areBlocksEqual(prev.blocks, initialBlocks)) return prev;
      return {
        ...prev,
        blocks: initialBlocks.length > 0 ? initialBlocks : [],
      };
    });
  }, [initialBlocks]);

  const createBlock = useCallback((type: AnyBlock["type"]): AnyBlock => {
    const baseBlock = {
      id: uuidv4(),
      order: editorState.blocks.length,
    };

    switch (type) {
      case "text":
        return { ...baseBlock, type: "text", content: { text: "", html: "" } };
      case "heading":
        return {
          ...baseBlock,
          type: "heading",
          content: { text: "", level: 1 },
        };
      case "image":
        return { ...baseBlock, type: "image", content: { url: "", alt: "" } };
      case "video":
        return { ...baseBlock, type: "video", content: { url: "" } };
      case "audio":
        return { ...baseBlock, type: "audio", content: { url: "", title: "", artist: "" } };
      case "embed":
        return { ...baseBlock, type: "embed", content: { url: "" } };
      case "quote":
        return { ...baseBlock, type: "quote", content: { text: "" } };
      case "list":
        return {
          ...baseBlock,
          type: "list",
          content: { items: [""], ordered: false },
        };
      default:
        return createTextBlock();
    }
  }, [editorState.blocks.length]);

  const updateBlock = useCallback(
    (blockId: string, content: any) => {
      setEditorState((prev) => {
        const newBlocks = prev.blocks.map((block) =>
          block.id === blockId ? { ...block, content } : block
        );
        onContentChange?.(newBlocks);
        return { ...prev, blocks: newBlocks };
      });
    },
    [onContentChange]
  );

  const addBlock = useCallback(
    (type: AnyBlock["type"], afterBlockId?: string) => {
      const newBlock = createBlock(type);

      setEditorState((prev) => {
        let newBlocks;
        if (afterBlockId) {
          const index = prev.blocks.findIndex((b) => b.id === afterBlockId);
          newBlocks = [
            ...prev.blocks.slice(0, index + 1),
            newBlock,
            ...prev.blocks.slice(index + 1),
          ];
        } else {
          newBlocks = [...prev.blocks, newBlock];
        }

        // Update order
        newBlocks = newBlocks.map((block, index) => ({
          ...block,
          order: index,
        }));
        onContentChange?.(newBlocks);

        return {
          ...prev,
          blocks: newBlocks,
          selectedBlockId: newBlock.id,
        };
      });
    },
    [onContentChange, createBlock]
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      setEditorState((prev) => {
        const newBlocks = prev.blocks.filter((b) => b.id !== blockId);

        // Update order (removed the "ensure at least one block" logic)
        const reorderedBlocks = newBlocks.map((block, index) => ({
          ...block,
          order: index,
        }));
        onContentChange?.(reorderedBlocks);

        return {
          ...prev,
          blocks: reorderedBlocks,
          selectedBlockId: null,
        };
      });
    },
    [onContentChange]
  );

  const reorderBlocks = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      setEditorState((prev) => {
        const newBlocks = Array.from(prev.blocks);
        const [reorderedBlock] = newBlocks.splice(sourceIndex, 1);
        newBlocks.splice(destinationIndex, 0, reorderedBlock);

        // Update order
        const reorderedBlocks = newBlocks.map((block, index) => ({
          ...block,
          order: index,
        }));
        onContentChange?.(reorderedBlocks);

        return { ...prev, blocks: reorderedBlocks };
      });
    },
    [onContentChange]
  );

  const selectBlock = useCallback((blockId: string | null) => {
    setEditorState((prev) => ({ ...prev, selectedBlockId: blockId }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setEditorState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  return {
    editorState,
    setEditorState,
    updateBlock,
    addBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    toggleFullscreen,
  };
}