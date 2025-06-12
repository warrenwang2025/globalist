"use client";

import { Button } from "@/components/ui/button";
import {
  Type,
  Image as ImageIcon,
  Video,
  Link2,
  Heading1,
  Quote,
  List,
} from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface BlockAddButtonsProps {
  onAddBlock: (type: AnyBlock["type"], afterBlockId?: string) => void;
  afterBlockId?: string;
}

const blockTypes = [
  { type: "text" as const, icon: Type, label: "Text" },
  { type: "heading" as const, icon: Heading1, label: "Heading" },
  { type: "image" as const, icon: ImageIcon, label: "Image" },
  { type: "video" as const, icon: Video, label: "Video" },
  { type: "embed" as const, icon: Link2, label: "Embed" },
  { type: "quote" as const, icon: Quote, label: "Quote" },
  { type: "list" as const, icon: List, label: "List" },
];

export function BlockAddButtons({ onAddBlock, afterBlockId }: BlockAddButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {blockTypes.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          onClick={() => onAddBlock(type, afterBlockId)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}