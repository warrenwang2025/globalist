"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2 } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface BlockWrapperProps {
  block: AnyBlock;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDelete: () => void;
  dragHandleProps: any;
  children: ReactNode;
}

export function BlockWrapper({
  block,
  isSelected,
  isDragging,
  onSelect,
  onDelete,
  dragHandleProps,
  children,
}: BlockWrapperProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isDragging && "shadow-xl"
      )}
    >
      {/* Block Controls */}
      <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
        <div
          {...dragHandleProps}
          className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Block Content */}
      <div className="p-4" onClick={onSelect}>
        {children}
      </div>
    </Card>
  );
}
