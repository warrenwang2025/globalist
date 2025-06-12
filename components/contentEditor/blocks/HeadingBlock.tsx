"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heading1 } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface HeadingBlockProps {
  block: Extract<AnyBlock, { type: "heading" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function HeadingBlock({ block, isSelected, onUpdate }: HeadingBlockProps) {
  const [text, setText] = useState(block.content.text || "");
  const [level, setLevel] = useState(block.content.level || 1);

  useEffect(() => {
    setText(block.content.text || "");
    setLevel(block.content.level || 1);
  }, [block.content]);

  const handleTextChange = (value: string) => {
    setText(value);
    onUpdate({ text: value, level });
  };

  const handleLevelChange = (newLevel: string) => {
    const levelNum = parseInt(newLevel) as 1 | 2 | 3 | 4 | 5 | 6;
    setLevel(levelNum);
    onUpdate({ text, level: levelNum });
  };
  // Show input only if selected or has content
  const showInput = isSelected || text.trim().length > 0;

  if (!showInput) {
    return (
      <div className="flex items-center justify-center h-16 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Heading1 className="h-5 w-5" />
          <span className="text-sm">Click to add heading...</span>
        </div>
      </div>
    );
  }

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div className="space-y-2">
      {isSelected && (
        <Select value={level.toString()} onValueChange={handleLevelChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Input
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Heading text..."
        className={`border-none text-${level === 1 ? '4xl' : level === 2 ? '3xl' : level === 3 ? '2xl' : level === 4 ? 'xl' : 'lg'} font-bold focus:ring-0 focus:border-none p-0`}
        autoFocus={isSelected && !text}
      />
    </div>
  );
}