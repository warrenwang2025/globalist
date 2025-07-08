"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useAIContent } from "@/hooks/use-ai-content";
import { StreamlinedEditor } from "@/components/contentEditor/StreamlinedEditor";
import { UpgradeModal } from "@/components/contentEditor/UpgradeModal";
import type { AnyBlock } from "@/types/editor";

export default function ContentEditorPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState({ isPremium: false });

  const router = useRouter();
  const { toast } = useToast();
  const { saveAIContent } = useAIContent();
  const { data: session, status } = useSession();

  // Get user data from session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userData = { 
        isPremium: session.user.userSubscriptionLevel !=='free' || false 
      };
      setUser(userData);
    }
  }, [session, status]);

  const handleSave = async (title: string, blocks: AnyBlock[]) => {
    if (!title.trim()) {
      throw new Error("Title is required");
    }

    try {
      const content = blocks
        .filter(block => block.type === 'text' || block.type === 'heading')
        .map(block => block.content)
        .join('\n\n');

      saveAIContent(title, blocks);

      toast({
        title: "Success",
        description: "Your content has been saved successfully!",
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePreview = (title: string, blocks: AnyBlock[]) => {
    // Create preview data
    const previewData = {
      title,
      blocks,
      timestamp: new Date().toISOString(),
    };

    // Store in sessionStorage for preview page
    sessionStorage.setItem('previewData', JSON.stringify(previewData));
    
    // Open preview in new tab
    window.open('/preview', '_blank');
  };

  const handleUpgradeFromModal = () => {
    setShowUpgradeModal(false);
    router.push("/pricing");
  };

  return (
    <>
      <StreamlinedEditor
        user={user}
        onSave={handleSave}
        onPreview={handlePreview}
      />

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={handleUpgradeFromModal}
      />
    </>
  );
}
