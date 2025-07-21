"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Video, Upload, X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface VideoBlockProps {
  block: Extract<AnyBlock, { type: "video" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function VideoBlock({ block, isSelected, onUpdate }: VideoBlockProps) {
  const [url, setUrl] = useState(block.content.url || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setUrl(block.content.url || "");
  }, [block.content.url]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setUploadedFile(null); // Clear uploaded file when URL is manually entered
    onUpdate({ url: value });
  };

  // File upload handlers
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file.');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('File size must be less than 100MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUrl(result);
      setUploadedFile(file);
      onUpdate({ url: result });
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
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileSelect(videoFile);
    }
  };

  const handleRemoveFile = () => {
    setUrl("");
    setUploadedFile(null);
    onUpdate({ url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const isEmbeddedVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const isLocalVideo = (url: string) => {
    return url.startsWith('data:video/') || uploadedFile !== null;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-4">
      {/* Video URL Input */}
      <div className="space-y-2">
        <Label htmlFor="video-url">Video URL</Label>
        <Input
          id="video-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
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
                <Video className="h-5 w-5 text-primary flex-shrink-0" />
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
                <p className="text-sm font-medium">Drop video here or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Supports: MP4, WebM, AVI, MOV (max 100MB)
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
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Video Preview */}
      {url ? (
        <div className="space-y-3">
          <div className="aspect-video relative group">
            {isEmbeddedVideo(url) ? (
              <iframe
                src={getEmbedUrl(url)}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Video content"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : isLocalVideo(url) ? (
              <>
                <video
                  ref={videoRef}
                  src={url}
                  className="w-full h-full rounded-lg object-cover"
                  controls={!isMobile}
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error("Video error:", e);
                    alert("Error loading video file");
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Custom controls for mobile */}
                {isMobile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-white/20 p-2"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20 p-2"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Unsupported video URL format</p>
                  <p className="text-xs">Try YouTube, Vimeo, or upload a file</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Information */}
          {uploadedFile && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>File: {uploadedFile.name}</span>
              <span>•</span>
              <span>Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              <span>•</span>
              <span>Type: {uploadedFile.type}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-2" />
            <p>Add a video URL above or upload a file</p>
            <p className="text-xs mt-1">Supports YouTube, Vimeo, and video files</p>
          </div>
        </div>
      )}
    </div>
  );
}
