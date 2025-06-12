"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Type,
  Image as ImageIcon,
  Video,
  Link2,
  Heading1,
  Quote,
  List,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { AnyBlock, EditorState } from "@/types/editor";

interface BlockManagerProps {
  editorState: EditorState;
  onDeleteBlock: (blockId: string) => void;
  onSelectBlock: (blockId: string) => void;
  onMoveBlockUp: (blockId: string) => void;
  onMoveBlockDown: (blockId: string) => void;
}

const getBlockIcon = (type: AnyBlock["type"]) => {
  const iconMap = {
    text: Type,
    heading: Heading1,
    image: ImageIcon,
    video: Video,
    embed: Link2,
    quote: Quote,
    list: List,
  };
  return iconMap[type] || Type;
};

const getBlockLabel = (type: AnyBlock["type"]) => {
  const labelMap = {
    text: "Text",
    heading: "Heading",
    image: "Image",
    video: "Video",
    embed: "Embed",
    quote: "Quote",
    list: "List",
  };
  return labelMap[type] || "Unknown";
};

const getBlockPreview = (block: AnyBlock) => {
  switch (block.type) {
    case "text":
      const textContent = (block.content as any).text || "";
      return textContent.length > 30
        ? textContent.substring(0, 30) + "..."
        : textContent || "Empty text block";
    case "heading":
      const headingContent = (block.content as any).text || "";
      const level = (block.content as any).level || 1;
      return `H${level}: ${
        headingContent.length > 25
          ? headingContent.substring(0, 25) + "..."
          : headingContent || "Empty heading"
      }`;
    case "image":
      const imageUrl = (block.content as any).url || "";
      const imageAlt = (block.content as any).alt || "";
      return imageUrl ? imageAlt || "Image" : "No image selected";
    case "video":
      const videoUrl = (block.content as any).url || "";
      return videoUrl ? "Video embedded" : "No video URL";
    case "embed":
      const embedUrl = (block.content as any).url || "";
      return embedUrl ? "Content embedded" : "No embed URL";
    case "quote":
      const quoteText = (block.content as any).text || "";
      return quoteText.length > 30
        ? quoteText.substring(0, 30) + "..."
        : quoteText || "Empty quote";
    case "list":
      const items = (block.content as any).items || [];
      const ordered = (block.content as any).ordered || false;
      return `${ordered ? "Ordered" : "Unordered"} list (${
        items.length
      } items)`;
    default:
      return "Unknown block";
  }
};

export function BlockManager({
  editorState,
  onDeleteBlock,
  onSelectBlock,
  onMoveBlockUp,
  onMoveBlockDown,
}: BlockManagerProps) {
  const { toast } = useToast();

  const handleClearAll = () => {
    editorState.blocks.forEach((block) => onDeleteBlock(block.id));
    toast({ title: "All blocks cleared" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Content Blocks ({editorState.blocks.length})
        </h3>
        {editorState.blocks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-destructive hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      {editorState.blocks.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          <div className="text-xs">No blocks added yet</div>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {editorState.blocks.map((block, index) => {
            const Icon = getBlockIcon(block.type);
            const isSelected = editorState.selectedBlockId === block.id;
            const isFirst = index === 0;
            const isLast = index === editorState.blocks.length - 1;

            return (
              <Card
                key={block.id}
                className={cn(
                  "p-3 cursor-pointer transition-all hover:bg-muted/50",
                  isSelected && "ring-2 ring-primary ring-offset-1 bg-primary/5"
                )}
                onClick={() => onSelectBlock(block.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {getBlockLabel(block.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {getBlockPreview(block)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlockUp(block.id);
                      }}
                      disabled={isFirst}
                      className="p-1 h-auto hover:bg-primary/20"
                      title="Move up"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>

                    {/* Move Down Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlockDown(block.id);
                      }}
                      disabled={isLast}
                      className="p-1 h-auto hover:bg-primary/20"
                      title="Move down"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>

                    {/* Select Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBlock(block.id);
                      }}
                      className="p-1 h-auto hover:bg-primary/20"
                      title="Select block"
                    >
                      {isSelected ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(block.id);
                      }}
                      className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete block"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
