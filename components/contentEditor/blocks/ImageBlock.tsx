"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Maximize2, RotateCcw, RotateCw, Save, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import type { AnyBlock } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ImageBlockProps {
  block: Extract<AnyBlock, { type: "image" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function ImageBlock({ block, isSelected, onUpdate }: ImageBlockProps) {
  const [url, setUrl] = useState(block.content.url || "");
  const [alt, setAlt] = useState(block.content.alt || "");
  const [imageSize, setImageSize] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSize, setEditedSize] = useState(100);
  const [editedRotation, setEditedRotation] = useState(0);
  const [cropRect, setCropRect] = useState({ x: 100, y: 100, width: 300, height: 200 });
  const [isSaving, setIsSaving] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const cropBoxRef = useRef<HTMLDivElement>(null);

  const SAFETY_MARGIN = 20;

  useEffect(() => {
    setUrl(block.content.url || "");
    setAlt(block.content.alt || "");
  }, [block.content]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onUpdate({ url: value, alt, size: imageSize, rotation });
  };

  const handleAltChange = (value: string) => {
    setAlt(value);
    onUpdate({ url, alt: value, size: imageSize, rotation });
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const croppedImageUrl = await captureCroppedImage();
      setImageSize(editedSize);
      setRotation(editedRotation);
      setIsEditing(false);
      
      onUpdate({ 
        url: croppedImageUrl || url, 
        alt, 
        size: editedSize, 
        rotation: editedRotation,
        crop: cropRect
      });
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const captureCroppedImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imageRef.current || !cropBoxRef.current) {
        reject("Image or crop box not found");
        return;
      }

      const img = imageRef.current;
      const cropBox = cropBoxRef.current;
      
      // Wait for image to load if not already loaded
      if (!img.complete || img.naturalWidth === 0) {
        img.onload = () => {
          resolve(performCrop(img, cropBox));
        };
        img.onerror = () => {
          reject("Image failed to load");
        };
      } else {
        resolve(performCrop(img, cropBox));
      }
    });
  };

  const performCrop = (img: HTMLImageElement, cropBox: HTMLDivElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    // Set canvas dimensions to match the crop box
    canvas.width = cropBox.clientWidth;
    canvas.height = cropBox.clientHeight;
    
    // Calculate the position of the crop box relative to the image
    const imgRect = img.getBoundingClientRect();
    const cropRect = cropBox.getBoundingClientRect();
    
    // Calculate the source rectangle from the original image
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    const sourceX = (cropRect.left - imgRect.left) * scaleX;
    const sourceY = (cropRect.top - imgRect.top) * scaleY;
    const sourceWidth = cropRect.width * scaleX;
    const sourceHeight = cropRect.height * scaleY;
    
    // Draw the cropped portion onto the canvas
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, canvas.width, canvas.height
    );
    
    // Convert canvas to data URL
    return canvas.toDataURL('image/png');
  };

  const handleStartEdit = () => {
    if (editorContainerRef.current) {
      const containerRect = editorContainerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2 - 150;
      const centerY = containerRect.height / 2 - 100;
      
      setCropRect({
        x: centerX,
        y: centerY,
        width: 300,
        height: 200
      });
    }
    setIsEditing(true);
  };

  const handleReset = () => {
    if (editorContainerRef.current) {
      const containerRect = editorContainerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2 - 150;
      const centerY = containerRect.height / 2 - 100;
      
      setCropRect({
        x: centerX,
        y: centerY,
        width: 300,
        height: 200
      });
    }
    setEditedSize(100);
    setEditedRotation(0);
  };

  const handleResizeMouseDown = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editorContainerRef.current || !cropBoxRef.current) return;
    
    const editorRect = editorContainerRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = cropRect.width;
    const startHeight = cropRect.height;
    const startLeft = cropRect.x;
    const startTop = cropRect.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      if (direction.includes('right')) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(50, startHeight + deltaY);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(50, startWidth - deltaX);
        newLeft = startLeft + deltaX;
      }
      if (direction.includes('top')) {
        newHeight = Math.max(50, startHeight - deltaY);
        newTop = startTop + deltaY;
      }
      
      // Check boundaries
      const maxWidth = editorRect.width - newLeft - SAFETY_MARGIN;
      const maxHeight = editorRect.height - newTop - SAFETY_MARGIN;
      const minLeft = SAFETY_MARGIN;
      const minTop = SAFETY_MARGIN;
      
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);
      newLeft = Math.max(minLeft, newLeft);
      newTop = Math.max(minTop, newTop);
      
      setCropRect({
        x: newLeft,
        y: newTop,
        width: newWidth,
        height: newHeight
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCropBoxMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = cropRect.x;
    const startTop = cropRect.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      if (!editorContainerRef.current) return;
      
      const editorRect = editorContainerRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;
      
      // Constrain to container bounds
      newLeft = Math.max(SAFETY_MARGIN, newLeft);
      newTop = Math.max(SAFETY_MARGIN, newTop);
      newLeft = Math.min(editorRect.width - cropRect.width - SAFETY_MARGIN, newLeft);
      newTop = Math.min(editorRect.height - cropRect.height - SAFETY_MARGIN, newTop);
      
      setCropRect(prev => ({
        ...prev,
        x: newLeft,
        y: newTop
      }));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
        <div className="relative">
          {!isEditing ? (
            <>
              <div className="overflow-hidden rounded-lg" ref={imageContainerRef}>
                <img
                  src={url}
                  alt={alt}
                  className="max-w-full h-auto mx-auto"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: `${imageSize}%`,
                    display: "block",
                    margin: "0 auto"
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute bottom-2 right-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={handleStartEdit}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Card className="border border-border rounded-lg bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    title="Reset to original"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <h3 className="font-medium">Edit Image</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditedSize(prev => Math.min(prev + 10, 200))}
                    title="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditedSize(prev => Math.max(prev - 10, 10))}
                    title="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={editorContainerRef}
                  className="flex items-center justify-center mb-4 overflow-hidden p-6" 
                  style={{ 
                    height: "450px",
                    position: "relative",
                    backgroundColor: "#f0f0f0"
                  }}>
                  <img 
                    ref={imageRef}
                    src={url} 
                    alt={alt} 
                    style={{ 
                      transform: `rotate(${editedRotation}deg) scale(${editedSize / 100})`,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease",
                      transformOrigin: "center center",
                      position: "absolute"
                    }}
                    className="absolute inset-0"
                  />
                  
                  {/* Crop box - dotted line */}
                  <div 
                    ref={cropBoxRef}
                    className="absolute border-2 border-dashed border-white shadow-lg"
                    style={{
                      left: `${cropRect.x}px`,
                      top: `${cropRect.y}px`,
                      width: `${cropRect.width}px`,
                      height: `${cropRect.height}px`,
                      cursor: 'move',
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                    }}
                    onMouseDown={handleCropBoxMouseDown}
                  >
                    {/* Resize handles */}
                    <div 
                      className="absolute top-0 right-0 w-3 h-3 bg-primary cursor-nesw-resize z-10" 
                      onMouseDown={(e) => handleResizeMouseDown('top-right', e)}
                    />
                    <div 
                      className="absolute bottom-0 right-0 w-3 h-3 bg-primary cursor-nwse-resize z-10" 
                      onMouseDown={(e) => handleResizeMouseDown('bottom-right', e)}
                    />
                    <div 
                      className="absolute bottom-0 left-0 w-3 h-3 bg-primary cursor-nesw-resize z-10" 
                      onMouseDown={(e) => handleResizeMouseDown('bottom-left', e)}
                    />
                    <div 
                      className="absolute top-0 left-0 w-3 h-3 bg-primary cursor-nwse-resize z-10" 
                      onMouseDown={(e) => handleResizeMouseDown('top-left', e)}
                    />
                    <div 
                      className="absolute top-0 w-full h-3 cursor-ns-resize" 
                      onMouseDown={(e) => handleResizeMouseDown('top', e)}
                    />
                    <div 
                      className="absolute right-0 h-full w-3 cursor-ew-resize" 
                      onMouseDown={(e) => handleResizeMouseDown('right', e)}
                    />
                    <div 
                      className="absolute bottom-0 w-full h-3 cursor-ns-resize" 
                      onMouseDown={(e) => handleResizeMouseDown('bottom', e)}
                    />
                    <div 
                      className="absolute left-0 h-full w-3 cursor-ew-resize" 
                      onMouseDown={(e) => handleResizeMouseDown('left', e)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-rotation">Rotate Image</Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditedRotation((prev) => (prev - 90 + 360) % 360)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-sm font-medium">{editedRotation}°</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditedRotation((prev) => (prev + 90) % 360)}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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