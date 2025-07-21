"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Upload, X } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface AudioBlockProps {
  block: Extract<AnyBlock, { type: "audio" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function AudioBlock({ block, isSelected, onUpdate }: AudioBlockProps) {
  const [url, setUrl] = useState(block.content.url || "");
  const [title, setTitle] = useState(block.content.title || "");
  const [artist, setArtist] = useState(block.content.artist || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(block.content.url || "");
    setTitle(block.content.title || "");
    setArtist(block.content.artist || "");
  }, [block.content]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setUploadedFile(null);
    onUpdate({ url: value, title, artist });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    onUpdate({ url, title: value, artist });
  };

  const handleArtistChange = (value: string) => {
    setArtist(value);
    onUpdate({ url, title, artist: value });
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file.');
      return;
    }
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 50MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUrl(result);
      setUploadedFile(file);
      let newTitle = title;
      if (!title) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
        newTitle = fileName;
      }
      onUpdate({ url: result, title: newTitle, artist });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    if (audioFile) {
      handleFileSelect(audioFile);
    }
  };

  const handleRemoveFile = () => {
    setUrl("");
    setUploadedFile(null);
    onUpdate({ url: "", title, artist });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('spotify.com/track/')) {
      const trackId = url.split('track/')[1]?.split('?')[0];
      return `https://open.spotify.com/embed/track/${trackId}`;
    }
    if (url.includes('soundcloud.com/')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const isEmbeddedAudio = (url: string) => {
    return url.includes('spotify.com') || url.includes('soundcloud.com');
  };

  const isLocalAudio = (url: string) => {
    return url.startsWith('data:audio/') || uploadedFile !== null;
  };

  return (
    <div className="space-y-4">
      {/* Audio URL Input */}
      <div className="space-y-2">
        <Label htmlFor="audio-url">Audio URL</Label>
        <Input
          id="audio-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://spotify.com/track/... or https://soundcloud.com/..."
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <Label>Or Upload from Computer</Label>
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploadedFile ? 'bg-muted/50' : 'hover:border-primary hover:bg-primary/5'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Music className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Drop audio file here or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Supports: MP3, WAV, AAC, OGG (max 50MB)
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Audio Preview / Card */}
      <Card className="rounded-lg border bg-card p-4">
        {url ? (
          isEmbeddedAudio(url) ? (
            <iframe
              src={getEmbedUrl(url)}
              className="w-full rounded-lg"
              height={url.includes('spotify') ? 80 : 166}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            />
          ) : isLocalAudio(url) ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Music className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{title || uploadedFile?.name}</h4>
                  {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <audio
                  src={url}
                  className="w-full"
                  controls
                  preload="metadata"
                  onError={(e) => {
                    console.error("Audio error:", e);
                    alert("Error loading audio file");
                  }}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              <Music className="h-12 w-12 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Unsupported audio URL format</p>
              <p className="text-xs text-muted-foreground">Try Spotify, SoundCloud, or upload a file</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <Music className="h-12 w-12 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add an audio URL above or upload a file</p>
            <p className="text-xs text-muted-foreground mt-1">Supports Spotify, SoundCloud, and audio files</p>
          </div>
        )}
        {/* Title/Artist Inputs when selected */}
        {isSelected && url && (
          <div className="space-y-2 mt-4">
            <Input
              id="audio-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter audio title..."
            />
            <Input
              id="audio-artist"
              value={artist}
              onChange={(e) => handleArtistChange(e.target.value)}
              placeholder="Enter artist name..."
            />
          </div>
        )}
        {/* Audio Information */}
        {uploadedFile && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
            <span>File: {uploadedFile.name}</span>
            <span>•</span>
            <span>Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>•</span>
            <span>Type: {uploadedFile.type}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
