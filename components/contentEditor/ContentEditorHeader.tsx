import { Brain, Crown } from "lucide-react";

interface User {
  isPremium: boolean;
}

interface ContentEditorHeaderProps {
  user: User;
}

export function ContentEditorHeader({ user }: ContentEditorHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Content Assistant
          </h1>
          {user.isPremium && <Crown className="h-6 w-6 text-yellow-500" />}
        </div>
      </div>
      <p className="text-muted-foreground text-sm md:text-base mt-2">
        Generate, edit, and optimize content with AI-powered tools
      </p>
    </div>
  );
}