"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Quote } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface QuoteBlockProps {
  block: Extract<AnyBlock, { type: "quote" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function QuoteBlock({ block, isSelected, onUpdate }: QuoteBlockProps) {
  const [text, setText] = useState(block.content.text || "");

  useEffect(() => {
    setText(block.content.text || "");
  }, [block.content.text]);

  const handleChange = (value: string) => {
    setText(value);
    onUpdate({ text: value });
  };

  // Show textarea only if selected or has content
  const showTextarea = isSelected || text.trim().length > 0;

  if (!showTextarea) {
    return (
      <div className="flex items-center justify-center h-16 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Quote className="h-5 w-5" />
          <span className="text-sm">Click to add quote...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-l-4 border-primary pl-4 py-2">
      <div className="flex items-start gap-3">
        <Quote className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
        <Textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter quote..."
          className="border-none resize-none focus:ring-0 focus:border-none p-0 italic text-lg"
          autoFocus={isSelected && !text}
        />
      </div>
    </div>
  );
}