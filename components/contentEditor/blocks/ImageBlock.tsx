"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface ImageBlockProps {
  block: Extract<AnyBlock, { type: "image" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function ImageBlock({ block, isSelected, onUpdate }: ImageBlockProps) {
  const [url, setUrl] = useState(block.content.url || "");
  const [alt, setAlt] = useState(block.content.alt || "");

  useEffect(() => {
    setUrl(block.content.url || "");
    setAlt(block.content.alt || "");
  }, [block.content]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onUpdate({ url: value, alt });
  };

  const handleAltChange = (value: string) => {
    setAlt(value);
    onUpdate({ url, alt: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-url">Image URL</Label>
        <Input
          id="image-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image-alt">Alt text</Label>
        <Input
          id="image-alt"
          value={alt}
          onChange={(e) => handleAltChange(e.target.value)}
          placeholder="Describe the image..."
        />
      </div>
      {url ? (
        <img
          src={url}
          alt={alt}
          className="max-w-full h-auto rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Add an image URL above</p>
          </div>
        </div>
      )}
    </div>
  );
}