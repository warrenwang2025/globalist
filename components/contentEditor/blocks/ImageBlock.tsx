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
  const [imageSize, setImageSize] = useState(block.content.size || 100);
  const [rotation, setRotation] = useState(block.content.rotation || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSize, setEditedSize] = useState(block.content.size || 100);
  const [editedRotation, setEditedRotation] = useState(block.content.rotation || 0);
  const [cropRect, setCropRect] = useState({ x: 50, y: 50, width: 200, height: 150 });
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const cropBoxRef = useRef<HTMLDivElement>(null);

  const SAFETY_MARGIN = 10;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when editing on mobile
  useEffect(() => {
    if (isEditing && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isEditing, isMobile]);

  useEffect(() => {
    setUrl(block.content.url || "");
    setAlt(block.content.alt || "");
    setImageSize(block.content.size || 100);
    setRotation(block.content.rotation || 0);
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
      console.log("Starting save process...");
      console.log("Current URL:", url);
      console.log("Crop rect:", cropRect);
      
      const croppedImageUrl = await captureCroppedImage();
      console.log("Cropped image URL:", croppedImageUrl);

      // Save new values to component state
      setImageSize(editedSize);
      setRotation(editedRotation);
      setIsEditing(false);

      // Set new cropped image to URL state
      if (croppedImageUrl) {
        console.log("Setting new URL:", croppedImageUrl);
        setUrl(croppedImageUrl);
      }

      const updateData = { 
        url: croppedImageUrl || url, 
        alt, 
        size: editedSize, 
        rotation: editedRotation,
        crop: cropRect
      };
      
      console.log("Calling onUpdate with:", updateData);
      onUpdate(updateData);
      
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error saving image: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const captureCroppedImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imageRef.current || !cropBoxRef.current) {
        reject(new Error("Image or crop box not found"));
        return;
      }

      const img = imageRef.current;
      const cropBox = cropBoxRef.current;
      
      console.log("Image complete:", img.complete);
      console.log("Image natural dimensions:", img.naturalWidth, img.naturalHeight);
      
      if (!img.complete || img.naturalWidth === 0) {
        console.log("Waiting for image to load...");
        img.onload = () => {
          console.log("Image loaded, performing crop");
          try {
            resolve(performCrop(img, cropBox));
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => {
          reject(new Error("Image failed to load"));
        };
      } else {
        console.log("Image already loaded, performing crop");
        try {
          resolve(performCrop(img, cropBox));
        } catch (error) {
          reject(error);
        }
      }
    });
  };

  const performCrop = (img: HTMLImageElement, cropBox: HTMLDivElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    console.log("Crop box dimensions:", cropBox.clientWidth, cropBox.clientHeight);
    
    // Set canvas dimensions to match the crop box
    canvas.width = cropBox.clientWidth;
    canvas.height = cropBox.clientHeight;
    
    // Calculate the position of the crop box relative to the image
    const imgRect = img.getBoundingClientRect();
    const cropRect = cropBox.getBoundingClientRect();
    
    console.log("Image rect:", imgRect);
    console.log("Crop rect:", cropRect);
    
    // Calculate the source rectangle from the original image
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    const sourceX = (cropRect.left - imgRect.left) * scaleX;
    const sourceY = (cropRect.top - imgRect.top) * scaleY;
    const sourceWidth = cropRect.width * scaleX;
    const sourceHeight = cropRect.height * scaleY;
    
    console.log("Source dimensions:", { sourceX, sourceY, sourceWidth, sourceHeight });
    
    try {
      // Draw the cropped portion onto the canvas
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
      );
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      console.log("Generated data URL length:", dataUrl.length);
      return dataUrl;
    } catch (error) {
      console.error("Canvas drawing error:", error);
      throw new Error("Failed to crop image: " + (error as Error).message);
    }
  };

  const handleStartEdit = () => {
    if (editorContainerRef.current) {
      const containerRect = editorContainerRef.current.getBoundingClientRect();
      // Responsive crop box sizing
      const cropWidth = isMobile ? Math.min(200, containerRect.width - 40) : 300;
      const cropHeight = isMobile ? Math.min(150, containerRect.height - 40) : 200;
      const centerX = containerRect.width / 2 - cropWidth / 2;
      const centerY = containerRect.height / 2 - cropHeight / 2;
      
      setCropRect({
        x: Math.max(SAFETY_MARGIN, centerX),
        y: Math.max(SAFETY_MARGIN, centerY),
        width: cropWidth,
        height: cropHeight
      });
    }
    // Initialize edited values with current values
    setEditedSize(imageSize);
    setEditedRotation(rotation);
    setIsEditing(true);
  };

  const handleReset = () => {
    if (editorContainerRef.current) {
      const containerRect = editorContainerRef.current.getBoundingClientRect();
      const cropWidth = isMobile ? Math.min(200, containerRect.width - 40) : 300;
      const cropHeight = isMobile ? Math.min(150, containerRect.height - 40) : 200;
      const centerX = containerRect.width / 2 - cropWidth / 2;
      const centerY = containerRect.height / 2 - cropHeight / 2;
      
      setCropRect({
        x: Math.max(SAFETY_MARGIN, centerX),
        y: Math.max(SAFETY_MARGIN, centerY),
        width: cropWidth,
        height: cropHeight
      });
    }
    setEditedSize(100);
    setEditedRotation(0);
  };

  // Generic event handler for both mouse and touch events
  const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
  };

  const handleResizeStart = (direction: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editorContainerRef.current || !cropBoxRef.current) return;
    
    const editorRect = editorContainerRef.current.getBoundingClientRect();
    const coords = getEventCoordinates(e.nativeEvent);
    const startX = coords.clientX;
    const startY = coords.clientY;
    const startWidth = cropRect.width;
    const startHeight = cropRect.height;
    const startLeft = cropRect.x;
    const startTop = cropRect.y;
    
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      const moveCoords = getEventCoordinates(moveEvent);
      const deltaX = moveCoords.clientX - startX;
      const deltaY = moveCoords.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      const minSize = isMobile ? 30 : 50;
      
      if (direction.includes('right')) {
        newWidth = Math.max(minSize, startWidth + deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(minSize, startHeight + deltaY);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(minSize, startWidth - deltaX);
        newLeft = startLeft + deltaX;
      }
      if (direction.includes('top')) {
        newHeight = Math.max(minSize, startHeight - deltaY);
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
    
    const handleEnd = (endEvent: MouseEvent | TouchEvent) => {
      endEvent.preventDefault();
      endEvent.stopPropagation();
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  const handleCropBoxStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const coords = getEventCoordinates(e.nativeEvent);
    const startX = coords.clientX;
    const startY = coords.clientY;
    const startLeft = cropRect.x;
    const startTop = cropRect.y;
    
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      if (!editorContainerRef.current) return;
      
      const editorRect = editorContainerRef.current.getBoundingClientRect();
      const moveCoords = getEventCoordinates(moveEvent);
      const deltaX = moveCoords.clientX - startX;
      const deltaY = moveCoords.clientY - startY;
      
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
    
    const handleEnd = (endEvent: MouseEvent | TouchEvent) => {
      endEvent.preventDefault();
      endEvent.stopPropagation();
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  const editorHeight = isMobile ? "300px" : "450px";
  const handleSize = isMobile ? "w-4 h-4" : "w-3 h-3";

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
                  size={isMobile ? "sm" : "sm"}
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={handleStartEdit}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Card className="border border-border rounded-lg bg-card" style={{ touchAction: 'none' }}>
              <CardHeader className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row items-center justify-between'} pb-2`}>
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
                <div className="flex items-center gap-2 flex-wrap">
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
                  className="flex items-center justify-center mb-4 overflow-hidden p-3 md:p-6" 
                  style={{ 
                    height: editorHeight,
                    position: "relative",
                    backgroundColor: "#f0f0f0",
                    touchAction: 'none'
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
                      position: "absolute",
                      touchAction: 'none'
                    }}
                    className="absolute inset-0"
                    crossOrigin="anonymous"
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
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                      touchAction: 'none'
                    }}
                    onMouseDown={handleCropBoxStart}
                    onTouchStart={handleCropBoxStart}
                  >
                    {/* Resize handles */}
                    <div 
                      className={`absolute top-0 right-0 ${handleSize} bg-primary cursor-nesw-resize z-10`}
                      style={{ touchAction: 'none' }}
                      onMouseDown={(e) => handleResizeStart('top-right', e)}
                      onTouchStart={(e) => handleResizeStart('top-right', e)}
                    />
                    <div 
                      className={`absolute bottom-0 right-0 ${handleSize} bg-primary cursor-nwse-resize z-10`}
                      style={{ touchAction: 'none' }}
                      onMouseDown={(e) => handleResizeStart('bottom-right', e)}
                      onTouchStart={(e) => handleResizeStart('bottom-right', e)}
                    />
                    <div 
                      className={`absolute bottom-0 left-0 ${handleSize} bg-primary cursor-nesw-resize z-10`}
                      style={{ touchAction: 'none' }}
                      onMouseDown={(e) => handleResizeStart('bottom-left', e)}
                      onTouchStart={(e) => handleResizeStart('bottom-left', e)}
                    />
                    <div 
                      className={`absolute top-0 left-0 ${handleSize} bg-primary cursor-nwse-resize z-10`}
                      style={{ touchAction: 'none' }}
                      onMouseDown={(e) => handleResizeStart('top-left', e)}
                      onTouchStart={(e) => handleResizeStart('top-left', e)}
                    />
                    {!isMobile && (
                      <>
                        <div 
                          className="absolute top-0 w-full h-3 cursor-ns-resize" 
                          style={{ touchAction: 'none' }}
                          onMouseDown={(e) => handleResizeStart('top', e)}
                          onTouchStart={(e) => handleResizeStart('top', e)}
                        />
                        <div 
                          className="absolute right-0 h-full w-3 cursor-ew-resize" 
                          style={{ touchAction: 'none' }}
                          onMouseDown={(e) => handleResizeStart('right', e)}
                          onTouchStart={(e) => handleResizeStart('right', e)}
                        />
                        <div 
                          className="absolute bottom-0 w-full h-3 cursor-ns-resize" 
                          style={{ touchAction: 'none' }}
                          onMouseDown={(e) => handleResizeStart('bottom', e)}
                          onTouchStart={(e) => handleResizeStart('bottom', e)}
                        />
                        <div 
                          className="absolute left-0 h-full w-3 cursor-ew-resize" 
                          style={{ touchAction: 'none' }}
                          onMouseDown={(e) => handleResizeStart('left', e)}
                          onTouchStart={(e) => handleResizeStart('left', e)}
                        />
                      </>
                    )}
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
