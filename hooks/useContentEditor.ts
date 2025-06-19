import { useState } from "react";
import type { AnyBlock } from "@/types/editor";

export function useContentEditor() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");

  const resetEditor = () => {
    setPrompt("");
    setSuggestions([]);
    setBlocks([]);
    setTitle("");
    setIsGenerating(false);
    setIsSaving(false);
    setActiveTab("assistant");
  };

  return {
    prompt,
    setPrompt,
    suggestions,
    setSuggestions,
    blocks,
    setBlocks,
    title,
    setTitle,
    isGenerating,
    setIsGenerating,
    isSaving,
    setIsSaving,
    activeTab,
    setActiveTab,
    resetEditor,
  };
}