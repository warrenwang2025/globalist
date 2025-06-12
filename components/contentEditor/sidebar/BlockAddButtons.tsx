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

const blockTypes = [
  {
    type: "text" as const,
    icon: Type,
    label: "Text",
    description: "Add a text block",
  },
  {
    type: "heading" as const,
    icon: Heading1,
    label: "Heading",
    description: "Add a heading",
  },
  {
    type: "image" as const,
    icon: ImageIcon,
    label: "Image",
    description: "Add an image",
  },
  {
    type: "video" as const,
    icon: Video,
    label: "Video",
    description: "Embed a video",
  },
  {
    type: "embed" as const,
    icon: Link2,
    label: "Embed",
    description: "Embed content",
  },
  {
    type: "quote" as const,
    icon: Quote,
    label: "Quote",
    description: "Add a quote",
  },
  {
    type: "list" as const,
    icon: List,
    label: "List",
    description: "Add a list",
  },
];

interface BlockAddButtonsProps {
  onAddBlock: (type: AnyBlock["type"]) => void;
}

const BlockAddButton = ({
  type,
  icon: Icon,
  label,
  description,
  onClick,
}: {
  type: AnyBlock["type"];
  icon: any;
  label: string;
  description: string;
  onClick: () => void;
}) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="w-full justify-start h-auto p-3 text-left hover:bg-muted/50"
  >
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {description}
        </div>
      </div>
    </div>
  </Button>
);

export function BlockAddButtons({ onAddBlock }: BlockAddButtonsProps) {
  return (
    <div>
      <h3 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
        Add Blocks
      </h3>
      <div className="space-y-1">
        {blockTypes.map(({ type, icon, label, description }) => (
          <BlockAddButton
            key={type}
            type={type}
            icon={icon}
            label={label}
            description={description}
            onClick={() => onAddBlock(type)}
          />
        ))}
      </div>
    </div>
  );
}