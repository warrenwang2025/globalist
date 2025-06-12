"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2 } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface EmbedBlockProps {
  block: Extract<AnyBlock, { type: "embed" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function EmbedBlock({ block, isSelected, onUpdate }: EmbedBlockProps) {
  const [url, setUrl] = useState(block.content.url || "");

  useEffect(() => {
    setUrl(block.content.url || "");
  }, [block.content.url]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onUpdate({ url: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="embed-url">Embed URL</Label>
        <Input
          id="embed-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/embed"
        />
      </div>
      {url ? (
        <div className="aspect-video">
          <iframe
            src={url}
            className="w-full h-full rounded-lg border"
            title="Embedded content"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <Link2 className="h-12 w-12 mx-auto mb-2" />
            <p>Add an embed URL above</p>
          </div>
        </div>
      )}
    </div>
  );
}