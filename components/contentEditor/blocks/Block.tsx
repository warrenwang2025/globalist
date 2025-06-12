"use client";

import { TextBlock } from "./TextBlock";
import { HeadingBlock } from "./HeadingBlock";
import { ImageBlock } from "./ImageBlock";
import { VideoBlock } from "./VideoBlock";
import { QuoteBlock } from "./QuoteBlock";
import { ListBlock } from "./ListBlock";
import { EmbedBlock } from "./EmbedBlock";
import type { AnyBlock } from "@/types/editor";

interface BlockProps {
  block: AnyBlock;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function Block({ block, isSelected, onUpdate }: BlockProps) {
  switch (block.type) {
    case "text":
      return (
        <TextBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    case "heading":
      return (
        <HeadingBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    case "image":
      return (
        <ImageBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    case "video":
      return (
        <VideoBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    case "quote":
      return (
        <QuoteBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    case "list":
      return (
        <ListBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    case "embed":
      return (
        <EmbedBlock
          block={block}
          isSelected={isSelected}
          onUpdate={onUpdate}
        />
      );
    default:
      return (
        <div className="text-muted-foreground">
          Unknown block type: {(block as any).type}
        </div>
      );
  }
}