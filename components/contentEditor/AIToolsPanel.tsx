import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Wand2, Brain, Crown } from "lucide-react";

interface User {
  isPremium: boolean;
}

interface AIToolsPanelProps {
  user: User;
  setShowUpgradeModal: (show: boolean) => void;
  toast: any;
}

export function AIToolsPanel({ user, setShowUpgradeModal, toast }: AIToolsPanelProps) {
  const handleOptimizeSEO = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    toast({
      title: "SEO Optimization",
      description: "Analyzing and optimizing your content for search engines...",
    });
  };

  const handleContentImprover = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    toast({
      title: "Content Improvement",
      description: "Enhancing your content with AI suggestions...",
    });
  };

  return (
    <Card className="p-4 md:p-6 h-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg">AI Tools</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start relative"
            onClick={handleOptimizeSEO}
          >
            <div className="flex items-center w-full">
              {!user.isPremium && (
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <Wand2 className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">SEO Optimizer</span>
              {!user.isPremium && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start relative"
            onClick={handleContentImprover}
          >
            <div className="flex items-center w-full">
              {!user.isPremium && (
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <Brain className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">Content Improver</span>
              {!user.isPremium && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}