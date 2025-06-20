import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { EditorCanvas } from "@/components/contentEditor/EditorCanvas";
import { EditorActions } from "./EditorActions";
import type { AnyBlock } from "@/types/editor";

interface ContentEditorTabProps {
  title: string;
  setTitle: (title: string) => void;
  blocks: AnyBlock[];
  setBlocks: (blocks: AnyBlock[]) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  toast: any;
  saveAIContent: (title: string, blocks: AnyBlock[]) => void;
  router: any;
}

export function ContentEditorTab({
  title,
  setTitle,
  blocks,
  setBlocks,
  isSaving,
  setIsSaving,
  toast,
  saveAIContent,
  router,
}: ContentEditorTabProps) {
  const handleContentChange = (newBlocks: AnyBlock[]) => {
    setBlocks(newBlocks);
  };

  return (
    <>
      {/* Post Title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your content title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Content Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EditorCanvas
            initialBlocks={blocks}
            onContentChange={handleContentChange}
            className="min-h-[600px]"
          />
        </CardContent>
      </Card>

      {/* Editor Actions */}
      <EditorActions
        title={title}
        blocks={blocks}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        toast={toast}
        saveAIContent={saveAIContent}
        router={router}
      />
    </>
  );
}