"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, FileVideo } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface UploadMediaProps {
  onMediaUpload?: (files: File[]) => void;
}

export function UploadMedia({ onMediaUpload }: UploadMediaProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      if (onMediaUpload) {
        onMediaUpload(newFiles);
      }
    },
    [files, onMediaUpload]
  );

  const removeFile = useCallback(
    (indexToRemove: number) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);

      if (onMediaUpload) {
        onMediaUpload(updatedFiles);
      }
    },
    [files, onMediaUpload]
  );

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    if (onMediaUpload) {
      onMediaUpload([]);
    }
  }, [onMediaUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "video/*": [".mp4", ".avi", ".mpeg"],
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

  return (
    <div>
      <label className="text-sm font-medium">Media</label>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`mt-2 border-2 border-dashed rounded-lg p-4 md:p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button">
              <ImageIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Upload Media</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the files here..."
              : "Drag and drop files here, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: Images (PNG, JPG, JPEG, GIF) and Videos (MP4, AVI, MPEG)
          </p>
        </div>
      </div>

      {/* Uploaded Files Display */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Uploaded Files ({files.length})
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFiles}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
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
                      <ImageIcon className="h-5 w-5 text-blue-500" />
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

      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Total: {files.length} file{files.length > 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  );
}