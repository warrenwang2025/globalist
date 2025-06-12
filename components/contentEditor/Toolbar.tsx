"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Type,
  Palette,
  Code,
  Quote,
  List,
  ListOrdered,
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface ToolbarProps {
  selectedBlock?: AnyBlock;
  onBlockUpdate?: (blockId: string, content: any) => void;
  className?: string;
}

export function Toolbar({ selectedBlock, onBlockUpdate, className }: ToolbarProps) {
  const isTextBlock = selectedBlock?.type === 'text';

  if (!selectedBlock || !isTextBlock) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="text-sm text-muted-foreground">
          Select a text block to see formatting options
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-2 bg-muted/50 rounded-lg",
        className
      )}
    >
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Additional Tools */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Link2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}