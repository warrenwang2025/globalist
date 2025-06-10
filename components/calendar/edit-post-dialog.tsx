import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlatformSelector } from "@/components/platform-selector";
import { ContentEditor } from "@/components/content-editor";
import { UploadMedia } from "@/components/upload-media";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface ScheduledPost {
  id: number;
  title: string;
  content: string;
  scheduledDate: Date;
  platforms: number[];
  mediaCount: number;
  mediaTypes: string[];
  status: string;
}

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: ScheduledPost | null;
  onUpdatePost: (post: ScheduledPost) => void;
}

export function EditPostDialog({
  open,
  onOpenChange,
  post,
  onUpdatePost,
}: EditPostDialogProps) {
  const { toast } = useToast();
  const [editedPost, setEditedPost] = useState({
    title: "",
    content: "",
    scheduledDate: "",
    scheduledTime: "",
    platforms: [] as number[],
    mediaFiles: [] as File[],
  });

  useEffect(() => {
    if (post) {
      const postDate = new Date(post.scheduledDate);
      setEditedPost({
        title: post.title,
        content: post.content,
        scheduledDate: postDate.toISOString().split('T')[0],
        scheduledTime: postDate.toTimeString().slice(0, 5),
        platforms: post.platforms,
        mediaFiles: [], // Note: We can't restore actual files, only show count
      });
    }
  }, [post]);

  const handleUpdatePost = () => {
    if (
      !editedPost.title ||
      !editedPost.content ||
      !editedPost.scheduledDate ||
      !editedPost.scheduledTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editedPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    const scheduledDate = new Date(
      `${editedPost.scheduledDate}T${editedPost.scheduledTime}`
    );

    const updatedPost: ScheduledPost = {
      ...post,
      title: editedPost.title,
      content: editedPost.content,
      scheduledDate,
      platforms: editedPost.platforms,
      mediaCount: editedPost.mediaFiles.length > 0 ? editedPost.mediaFiles.length : post.mediaCount,
      mediaTypes: editedPost.mediaFiles.length > 0 
        ? editedPost.mediaFiles.map((file) => file.type.split("/")[0])
        : post.mediaTypes,
    };

    onUpdatePost(updatedPost);
    onOpenChange(false);

    toast({
      title: "Post Updated",
      description: `${updatedPost.title} has been updated successfully.`,
    });
  };

  const handleMediaUpload = (files: File[]) => {
    setEditedPost({ ...editedPost, mediaFiles: [...editedPost.mediaFiles, ...files] });
  };

  const handlePlatformToggle = (platformId: number) => {
    const updatedPlatforms = editedPost.platforms.includes(platformId)
      ? editedPost.platforms.filter((id) => id !== platformId)
      : [...editedPost.platforms, platformId];
    setEditedPost({ ...editedPost, platforms: updatedPlatforms });
  };

  const handleContentChange = (content: string) => {
    setEditedPost({ ...editedPost, content });
  };

  const removeMediaFile = (index: number) => {
    const updatedFiles = editedPost.mediaFiles.filter((_, i) => i !== index);
    setEditedPost({ ...editedPost, mediaFiles: updatedFiles });
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Post</DialogTitle>
          <DialogDescription>
            Update your scheduled content for social media platforms
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Input
            placeholder="Post title"
            value={editedPost.title}
            onChange={(e) =>
              setEditedPost({ ...editedPost, title: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={editedPost.scheduledDate}
              onChange={(e) =>
                setEditedPost({ ...editedPost, scheduledDate: e.target.value })
              }
            />
            <Input
              type="time"
              value={editedPost.scheduledTime}
              onChange={(e) =>
                setEditedPost({ ...editedPost, scheduledTime: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Content
            </label>
            <ContentEditor
              content={editedPost.content}
              onContentChange={handleContentChange}
              selectedPlatforms={editedPost.platforms}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Platforms
            </label>
            <PlatformSelector
              selectedPlatforms={editedPost.platforms}
              onPlatformToggle={handlePlatformToggle}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Media Files
            </label>
            {post.mediaCount > 0 && editedPost.mediaFiles.length === 0 && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                Current post has {post.mediaCount} media file(s). Upload new files to replace them.
              </div>
            )}
            <UploadMedia onMediaUpload={handleMediaUpload} />
            {editedPost.mediaFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {editedPost.mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                  >
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMediaFile(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdatePost}>Update Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}