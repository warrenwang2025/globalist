"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Image as ImageIcon, X, FileVideo, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface PlatformMediaUploadProps {
  platform: string;
  onMediaUpload?: (files: File[]) => void;
  uploadedFiles?: File[];
}

interface PlatformCriteria {
  name: string;
  text: {
    maxCharacters: number;
    [key: string]: any;
  };
  image: {
    required: boolean;
    formats?: string[];
    maxFileSize?: string | { images: string; gifs: string };
    dimensions?: any;
    [key: string]: any;
  };
  video: {
    required: boolean;
    formats?: string[];
    maxFileSize?: string;
    duration?: any;
    [key: string]: any;
  };
  mediaLimit: number;
  description: string;
}

export function PlatformMediaUpload({ 
  platform, 
  onMediaUpload, 
  uploadedFiles = [] 
}: PlatformMediaUploadProps) {
  const [files, setFiles] = useState<File[]>(uploadedFiles);
  const [platformCriteria, setPlatformCriteria] = useState<PlatformCriteria | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Load platform criteria
  useEffect(() => {
    const loadPlatformCriteria = async () => {
      try {
        const response = await fetch('/publishing-criteria.json');
        const data = await response.json();
        const criteria = data.platforms[platform];
        if (criteria) {
          setPlatformCriteria(criteria);
        } else {
          console.error('No criteria found for platform:', platform);
        }
      } catch (error) {
        console.error('Failed to load platform criteria:', error);
      }
    };

    if (platform) {
      loadPlatformCriteria();
    }
  }, [platform]);

  // Update parent when files change
  useEffect(() => {
    if (onMediaUpload) {
      onMediaUpload(files);
    }
  }, [files, onMediaUpload]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  // Validate files against platform criteria
  const validateFiles = useCallback((filesToValidate: File[]) => {
    if (!platformCriteria) return [];

    const errors: string[] = [];
    const imageFiles = filesToValidate.filter(f => f.type.startsWith('image/'));
    const videoFiles = filesToValidate.filter(f => f.type.startsWith('video/'));

    // Check if media is required
    if (platformCriteria.image.required && imageFiles.length === 0 && videoFiles.length === 0) {
      errors.push(`${platform} requires at least one image or video`);
    }

    if (platformCriteria.video.required && videoFiles.length === 0) {
      errors.push(`${platform} requires a video`);
    }

    // Check media limit
    if (filesToValidate.length > platformCriteria.mediaLimit) {
      errors.push(`${platform} allows maximum ${platformCriteria.mediaLimit} media files`);
    }

    // Check file sizes
    filesToValidate.forEach(file => {
      let maxSize: string | undefined;
      if (file.type.startsWith('image/')) {
        const imageMaxSize = platformCriteria.image.maxFileSize;
        if (typeof imageMaxSize === 'string') {
          maxSize = imageMaxSize;
        } else if (imageMaxSize) {
          // Handle object case (like Twitter with images/gifs)
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          maxSize = fileExtension === 'gif' ? imageMaxSize.gifs : imageMaxSize.images;
        }
      } else {
        maxSize = platformCriteria.video.maxFileSize;
      }
      
      if (maxSize) {
        const maxSizeBytes = parseFileSize(maxSize);
        if (file.size > maxSizeBytes) {
          errors.push(`${file.name} exceeds maximum file size of ${maxSize}`);
        }
      }
    });

    // Check file formats
    filesToValidate.forEach(file => {
      const allowedFormats = file.type.startsWith('image/') 
        ? platformCriteria.image.formats 
        : platformCriteria.video.formats;
      
      if (allowedFormats) {
        const fileExtension = file.name.split('.').pop()?.toUpperCase();
        if (fileExtension && !allowedFormats.includes(fileExtension)) {
          errors.push(`${file.name} format not supported. Allowed: ${allowedFormats.join(', ')}`);
        }
      }
    });

    return errors;
  }, [platformCriteria, platform]);

  const parseFileSize = (sizeString: string): number => {
    const units: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };
    
    const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (match) {
      const [, size, unit] = match;
      return parseFloat(size) * units[unit.toUpperCase()];
    }
    return 0;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      
      // Generate image previews
      const newPreviews = acceptedFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      setImagePreviews(prev => [...prev, ...newPreviews]);
      
      const errors = validateFiles(newFiles);
      setValidationErrors(errors);
    },
    [files, validateFiles]
  );

  const removeFile = useCallback(
    (indexToRemove: number) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);
      
      // Remove corresponding preview
      const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
      setImagePreviews(updatedPreviews);
      
      const errors = validateFiles(updatedFiles);
      setValidationErrors(errors);
    },
    [files, imagePreviews, validateFiles]
  );

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setImagePreviews([]);
    setValidationErrors([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "video/*": [".mp4", ".mov", ".avi"],
    },
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!platformCriteria) {
    return <div>Loading platform requirements for {platform}...</div>;
  }

  // Safety check for required properties
  if (!platformCriteria.image || !platformCriteria.video) {
    console.error('Invalid platform criteria structure:', platformCriteria);
    return <div>Error: Invalid platform criteria for {platform}</div>;
  }

  const hasRequiredMedia = (platformCriteria.image.required || platformCriteria.video.required) 
    ? files.length > 0 
    : true;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="h-4 w-4" />
          Media for {platform}
          {hasRequiredMedia && (
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Ready
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Requirements */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium">Platform Requirements:</p>
              <ul className="text-muted-foreground space-y-1">
                {platformCriteria.image.required && (
                  <li>• Image required</li>
                )}
                {platformCriteria.video.required && (
                  <li>• Video required</li>
                )}
                <li>• Max {platformCriteria.mediaLimit} file{platformCriteria.mediaLimit > 1 ? 's' : ''}</li>
                <li>• Image formats: {platformCriteria.image.formats?.join(', ') || 'Not specified'}</li>
                <li>• Video formats: {platformCriteria.video.formats?.join(', ') || 'Not specified'}</li>
                <li>• Max file size: {
                  platformCriteria.image.maxFileSize 
                    ? (typeof platformCriteria.image.maxFileSize === 'string' 
                        ? platformCriteria.image.maxFileSize 
                        : `${platformCriteria.image.maxFileSize.images} (images), ${platformCriteria.image.maxFileSize.gifs} (gifs)`)
                    : 'Not specified'
                } (images), {platformCriteria.video.maxFileSize || 'Not specified'} (videos)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Button variant="outline" size="sm" type="button">
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop the files here..."
                : "Drag and drop files here, or click to browse"}
            </p>
          </div>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Uploaded Files ({files.length}/{platformCriteria.mediaLimit})
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            </div>
            
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        imagePreviews[index] ? (
                          <img 
                            src={imagePreviews[index]} 
                            alt={file.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                        )
                      ) : (
                        <FileVideo className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 