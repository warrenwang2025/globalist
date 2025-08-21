"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Block, BlockWrapper } from "./blocks";
import { Toolbar } from "./Toolbar";
import type { AnyBlock } from "@/types/editor";

interface SortableBlockProps {
  block: AnyBlock;
  index: number;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onUpdate: (content: any) => void;
  onImproveWithAI: (block: AnyBlock) => void;
}

export function SortableBlock({
  block,
  index,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  onImproveWithAI,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group relative w-full ${isDragging ? "z-50 rotate-2 shadow-lg" : ""}`}
    >
      <BlockWrapper
        block={block}
        isSelected={isSelected}
        isDragging={isDragging}
        onSelect={onSelect}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {/* Render toolbar if selected (single or multi) */}
        {(() => {
          const textBasedTypes = ['text', 'heading', 'quote', 'list'];
          return isSelected && textBasedTypes.includes(block.type);
        })() && (
          <Toolbar
            selectedBlock={block}
            onImproveWithAI={onImproveWithAI}
          />
        )}
        <Block
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      </BlockWrapper>
    </motion.div>
  );
}