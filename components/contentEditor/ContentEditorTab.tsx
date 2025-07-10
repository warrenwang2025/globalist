import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, GitBranch } from "lucide-react";
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
    <div className="relative w-full max-w-full">
      {/* First Header - Content Details (Highest Priority Sticky) */}
      <div className="sticky top-0 z-[100] bg-background border-b shadow-sm">
        <div className="px-2 sm:px-4 md:px-6 py-4">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 py-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Content Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter your content title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Header - Content Editor (Lower Priority Sticky) */}
      <div className="sticky top-[120px] z-[90] bg-background border-b shadow-sm">
        <div className="px-2 sm:px-4 md:px-6 py-3">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Content Editor</h2>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="px-2 sm:px-4 md:px-6">
        {/* Content Editor Canvas */}
        <div className="py-4">
          <Card className="w-full overflow-hidden border-0 shadow-none">
            <CardContent className="p-0">
              <EditorCanvas
                initialBlocks={blocks}
                onContentChange={handleContentChange}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Editor Actions */}
        <div className="py-4 border-t bg-background">
          <EditorActions
            title={title}
            blocks={blocks}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            toast={toast}
            saveAIContent={saveAIContent}
            router={router}
          />
        </div>
      </div>
    </div>
  );
}
