import { ContentGenerationForm } from "./ContentGenerationForm";
import { AIToolsPanel } from "./AIToolsPanel";
import { SuggestionsSection } from "./SuggestionsSection";
import type { AnyBlock } from "@/types/editor";

interface User {
  isPremium: boolean;
}

interface AIAssistantTabProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  user: User;
  setShowUpgradeModal: (show: boolean) => void;
  setBlocks: (blocks: AnyBlock[]) => void;
  setTitle: (title: string) => void;
  setActiveTab: (tab: string) => void;
  toast: any;
}

export function AIAssistantTab({
  prompt,
  setPrompt,
  suggestions,
  setSuggestions,
  isGenerating,
  setIsGenerating,
  user,
  setShowUpgradeModal,
  setBlocks,
  setTitle,
  setActiveTab,
  toast,
}: AIAssistantTabProps) {
  return (
    <>
      <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr] items-start">
        <ContentGenerationForm
          prompt={prompt}
          setPrompt={setPrompt}
          setSuggestions={setSuggestions}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          toast={toast}
        />

        <AIToolsPanel
          user={user}
          setShowUpgradeModal={setShowUpgradeModal}
          toast={toast}
        />
      </div>

      {suggestions.length > 0 && (
        <SuggestionsSection
          suggestions={suggestions}
          user={user}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          setBlocks={setBlocks}
          setTitle={setTitle}
          setActiveTab={setActiveTab}
          setShowUpgradeModal={setShowUpgradeModal}
          toast={toast}
        />
      )}
    </>
  );
}
