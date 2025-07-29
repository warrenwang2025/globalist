"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Wand2 } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface ToolbarProps {
  selectedBlock?: AnyBlock;
  onImproveWithAI?: (block: AnyBlock) => void;
  className?: string;
}

export function Toolbar({ selectedBlock, onImproveWithAI, className }: ToolbarProps) {
  // Allow toolbar for text-based blocks only
  const textBasedTypes = ['text', 'heading', 'quote', 'list'];
  if (!selectedBlock || !textBasedTypes.includes(selectedBlock.type)) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-2 bg-muted/50 rounded-lg",
        className
      )}
    >
      {/* Improve with AI Only */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Improve with AI"
        onClick={() => selectedBlock && onImproveWithAI?.(selectedBlock)}
      >
        <Wand2 className="h-4 w-4" />
      </Button>
    </div>
  );
}