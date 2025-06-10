import { useState } from "react";
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

interface NewPost {
  title: string;
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  platforms: number[];
  mediaFiles: File[];
}

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: (post: NewPost) => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onCreatePost,
}: CreatePostDialogProps) {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    scheduledDate: "",
    scheduledTime: "",
    platforms: [],
    mediaFiles: [],
  });

  const handleCreatePost = () => {
    if (
      !newPost.title ||
      !newPost.content ||
      !newPost.scheduledDate ||
      !newPost.scheduledTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    onCreatePost(newPost);
    setNewPost({
      title: "",
      content: "",
      scheduledDate: "",
      scheduledTime: "",
      platforms: [],
      mediaFiles: [],
    });
    onOpenChange(false);
  };

  const handleMediaUpload = (files: File[]) => {
    setNewPost({ ...newPost, mediaFiles: [...newPost.mediaFiles, ...files] });
  };

  const handlePlatformToggle = (platformId: number) => {
    const updatedPlatforms = newPost.platforms.includes(platformId)
      ? newPost.platforms.filter((id) => id !== platformId)
      : [...newPost.platforms, platformId];
    setNewPost({ ...newPost, platforms: updatedPlatforms });
  };

  const handleContentChange = (content: string) => {
    setNewPost({ ...newPost, content });
  };

  const removeMediaFile = (index: number) => {
    const updatedFiles = newPost.mediaFiles.filter((_, i) => i !== index);
    setNewPost({ ...newPost, mediaFiles: updatedFiles });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Post</DialogTitle>
          <DialogDescription>
            Create and schedule content for your social media platforms
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Input
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost({ ...newPost, title: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={newPost.scheduledDate}
              onChange={(e) =>
                setNewPost({ ...newPost, scheduledDate: e.target.value })
              }
            />
            <Input
              type="time"
              value={newPost.scheduledTime}
              onChange={(e) =>
                setNewPost({ ...newPost, scheduledTime: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Content
            </label>
            <ContentEditor
              content={newPost.content}
              onContentChange={handleContentChange}
              selectedPlatforms={newPost.platforms}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Platforms
            </label>
            <PlatformSelector
              selectedPlatforms={newPost.platforms}
              onPlatformToggle={handlePlatformToggle}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Media Files
            </label>
            <UploadMedia onMediaUpload={handleMediaUpload} />
            {newPost.mediaFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {newPost.mediaFiles.map((file, index) => (
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
          <Button onClick={handleCreatePost}>Schedule Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}