"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Type } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface TextBlockProps {
  block: Extract<AnyBlock, { type: "text" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function TextBlock({ block, isSelected, onUpdate }: TextBlockProps) {
  const [text, setText] = useState(block.content.text || "");

  useEffect(() => {
    setText(block.content.text || "");
  }, [block.content.text]);

  const handleChange = (value: string) => {
    setText(value);
    onUpdate({ text: value, html: value });
  };

  // Show textarea only if selected or has content
  const showTextarea = isSelected || text.trim().length > 0;

  if (!showTextarea) {
    return (
      <div className="flex items-center justify-center h-16 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          <span className="text-sm">Click to add text...</span>
        </div>
      </div>
    );
  }

  return (
    <Textarea
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Start typing..."
      className="min-h-[100px] border-none resize-none focus:ring-0 focus:border-none p-0"
      autoFocus={isSelected && !text}
    />
  );
}