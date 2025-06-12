"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface VideoBlockProps {
  block: Extract<AnyBlock, { type: "video" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function VideoBlock({ block, isSelected, onUpdate }: VideoBlockProps) {
  const [url, setUrl] = useState(block.content.url || "");

  useEffect(() => {
    setUrl(block.content.url || "");
  }, [block.content.url]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onUpdate({ url: value });
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video-url">Video URL</Label>
        <Input
          id="video-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      {url ? (
        <div className="aspect-video">
          <iframe
            src={getEmbedUrl(url)}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title="Video content"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-2" />
            <p>Add a video URL above</p>
          </div>
        </div>
      )}
    </div>
  );
}