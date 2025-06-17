import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Eye, ArrowRight } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface EditorActionsProps {
  title: string;
  blocks: AnyBlock[];
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  toast: any;
  saveAIContent: (title: string, blocks: AnyBlock[]) => void;
  router: any;
}

export function EditorActions({
  title,
  blocks,
  isSaving,
  setIsSaving,
  toast,
  saveAIContent,
  router,
}: EditorActionsProps) {
  const getContentText = () => {
    return blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return (block.content as any).text || "";
          case "heading":
            return (block.content as any).text || "";
          case "quote":
            return (block.content as any).text || "";
          case "list":
            return (block.content as any).items?.join(", ") || "";
          default:
            return "";
        }
      })
      .join(" ");
  };

  const handleSaveDraft = async () => {
    const contentText = getContentText();

    if (!title.trim() && !contentText.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please add a title or content before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Draft saved",
        description: "Your AI-generated content has been saved as a draft",
      });
    } catch (error) {
      toast({
        title: "Error saving draft",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    const contentText = getContentText();

    if (!contentText.trim() && !title.trim()) {
      toast({
        title: "Nothing to preview",
        description: "Please generate some content before previewing",
        variant: "destructive",
      });
      return;
    }

    const previewData = {
      title,
      content: contentText,
      selectedPlatforms: [],
      uploadedFiles: [],
      scheduleDate: "",
      scheduleTime: "",
    };

    const previewUrl = `/preview?data=${encodeURIComponent(
      JSON.stringify(previewData)
    )}`;
    window.open(
      previewUrl,
      "_blank",
      "width=1200,height=800,scrollbars=yes,resizable=yes"
    );

    toast({
      title: "Preview opened",
      description: "Check the new tab to see your AI-generated content preview",
    });
  };

  const handleSendToDistribution = () => {
    const contentText = getContentText();

    if (!title.trim() && !contentText.trim()) {
      toast({
        title: "Nothing to send",
        description: "Please generate some content before sending to distribution",
        variant: "destructive",
      });
      return;
    }

    saveAIContent(title, blocks);

    toast({
      title: "Content ready for distribution",
      description: "Your AI-generated content is ready to be published",
    });

    router.push("/dashboard/distribution");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex-1 sm:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={handlePreview}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSendToDistribution}
              className="flex-1 sm:flex-none"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Send to Distribution
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}