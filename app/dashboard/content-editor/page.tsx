"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAIContent } from "@/hooks/use-ai-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Edit } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

import { ContentEditorHeader } from "@/components/contentEditor/ContentEditorHeader";
import { PremiumBanner } from "@/components/contentEditor/PremiumBanner";
import { AIAssistantTab } from "@/components/contentEditor/AIAssistantTab";
import { ContentEditorTab } from "@/components/contentEditor/ContentEditorTab";
import { UpgradeModal } from "@/components/contentEditor/UpgradeModal";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState({ isPremium: false });
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");

  const router = useRouter();
  const { toast } = useToast();
  const { saveAIContent } = useAIContent();

  // Simulate fetching user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = { isPremium: false };
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleUpgradeFromModal = () => {
    setShowUpgradeModal(false);
    router.push("/pricing");
  };

  const handleGetPlus = () => {
    router.push("/pricing");
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 max-w-7xl">
      <ContentEditorHeader user={user} />
      
      {!user.isPremium && <PremiumBanner onUpgrade={handleGetPlus} />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Content Editor</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-6">
          <AIAssistantTab
            prompt={prompt}
            setPrompt={setPrompt}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            user={user}
            setShowUpgradeModal={setShowUpgradeModal}
            setBlocks={setBlocks}
            setTitle={setTitle}
            setActiveTab={setActiveTab}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <ContentEditorTab
            title={title}
            setTitle={setTitle}
            blocks={blocks}
            setBlocks={setBlocks}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            toast={toast}
            saveAIContent={saveAIContent}
            router={router}
          />
        </TabsContent>
      </Tabs>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={handleUpgradeFromModal}
      />
    </div>
  );
}
