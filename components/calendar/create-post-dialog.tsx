"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Calendar,
  Clock,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  Upload,
  X,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { ScheduledPost } from "@/types/calendar";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: (post: Omit<ScheduledPost, "id">) => void;
}
const platforms = [
  { id: 1, name: "X", icon: Twitter, color: "bg-black text-white" },
  { id: 2, name: "LinkedIn", icon: Linkedin, color: "bg-blue-600 text-white" },
  {
    id: 3,
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  },
  { id: 4, name: "YouTube", icon: Youtube, color: "bg-red-600 text-white" },
  { id: 5, name: "TikTok", icon: SiTiktok, color: "bg-blue-300 text-white" },
  { id: 6, name: "Personal", icon: Globe, color: "bg-gray-600 text-white" },
];

export function CreatePostDialog({
  open,
  onOpenChange,
  onCreatePost,
}: CreatePostDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    time: "",
    platforms: [] as number[],
    status: "scheduled" as "scheduled" | "draft",
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.content ||
      !formData.date ||
      !formData.time ||
      formData.platforms.length === 0
    ) {
      return;
    }

    const scheduledDate = new Date(`${formData.date}T${formData.time}`);

    const newPost: Omit<ScheduledPost, "id"> = {
      title: formData.title,
      content: formData.content,
      scheduledDate,
      platforms: formData.platforms,
      mediaCount: mediaFiles.length,
      mediaTypes: mediaFiles.map((file) => file.type.split("/")[0]),
      status: formData.status,
    };

    onCreatePost(newPost);

    // Reset form
    setFormData({
      title: "",
      content: "",
      date: "",
      time: "",
      platforms: [],
      status: "scheduled",
    });
    setMediaFiles([]);

    onOpenChange(false);
  };

  const togglePlatform = (platformId: number) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((id) => id !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter post title"
              className="w-full"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Enter post content"
              rows={4}
              className="w-full resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.content.length} characters
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Platforms <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);

                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }
                    `}
                  >
                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {platform.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {formData.platforms.length === 0 && (
              <p className="text-xs text-red-500">
                Please select at least one platform
              </p>
            )}
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Media Files</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload media files</p>
                  <p className="text-xs text-muted-foreground">
                    Images and videos supported
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded Files */}
            {mediaFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {mediaFiles.length} file(s) uploaded
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mediaFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(1)}MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: "scheduled" | "draft") =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Save as Draft</SelectItem>
                <SelectItem value="scheduled">
                  Schedule for Publishing
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Post Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {formData.title || "Untitled Post"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {formData.content || "No content"}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {formData.platforms.map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId);
                  return platform ? (
                    <Badge
                      key={platformId}
                      variant="outline"
                      className="text-xs"
                    >
                      {platform.name}
                    </Badge>
                  ) : null;
                })}
              </div>
              {mediaFiles.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  📎 {mediaFiles.length} media file(s) attached
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title ||
                !formData.content ||
                !formData.date ||
                !formData.time ||
                formData.platforms.length === 0
              }
              className="w-full sm:w-auto sm:flex-1 order-1 sm:order-2"
            >
              {formData.status === "draft" ? "Save Draft" : "Schedule Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
