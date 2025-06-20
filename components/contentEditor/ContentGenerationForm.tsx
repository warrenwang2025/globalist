import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Lightbulb, FileText } from "lucide-react";

interface ContentGenerationFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  toast: any;
}

export function ContentGenerationForm({
  prompt,
  setPrompt,
  setSuggestions,
  isGenerating,
  setIsGenerating,
  toast,
}: ContentGenerationFormProps) {
  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a topic",
        description: "Please describe your content topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newSuggestions = [
        `10 Essential Tips for ${prompt}`,
        `The Ultimate Guide to ${prompt}`,
        `How to Master ${prompt} in 2024`,
        `Common Mistakes to Avoid with ${prompt}`,
        `${prompt}: A Beginner's Complete Guide`,
      ];

      setSuggestions(newSuggestions);
      toast({
        title: "Ideas generated!",
        description: `Generated ${newSuggestions.length} content ideas for your topic`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHeadlineGenerator = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a topic",
        description: "Please describe your content topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const headlines = [
        `${prompt}: The Complete Guide`,
        `Master ${prompt} in 30 Days`,
        `Why ${prompt} Matters More Than Ever`,
        `The Secret to Successful ${prompt}`,
        `${prompt} Mistakes That Cost You Money`,
      ];


      setSuggestions([...headlines]);
      toast({
        title: "Headlines generated!",
        description: `Created ${headlines.length} compelling headlines for your topic`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 h-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Content Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div>
          <Label htmlFor="topic">Content Topic</Label>
          <Textarea
            id="topic"
            placeholder="Describe your content topic or idea... (e.g., 'social media marketing for small businesses')"
            className="mt-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1"
            onClick={generateSuggestions}
            disabled={isGenerating}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Ideas"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleHeadlineGenerator}
            disabled={isGenerating}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Headlines
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}