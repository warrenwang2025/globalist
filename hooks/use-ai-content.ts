import { useState, useEffect } from 'react';
import type { AnyBlock } from '@/types/editor';

interface AIGeneratedContent {
  title: string;
  blocks: AnyBlock[];
  timestamp: number;
}

export function useAIContent() {
  const [hasAIContent, setHasAIContent] = useState(false);
  const [aiContent, setAIContent] = useState<AIGeneratedContent | null>(null);

  useEffect(() => {
    checkForAIContent();
  }, []);

  const checkForAIContent = () => {
    const stored = localStorage.getItem('ai-generated-content');
    if (stored) {
      try {
        const content: AIGeneratedContent = JSON.parse(stored);
        setAIContent(content);
        setHasAIContent(true);
      } catch (error) {
        console.error('Failed to parse AI content:', error);
        localStorage.removeItem('ai-generated-content');
      }
    }
  };

  const saveAIContent = (title: string, blocks: AnyBlock[]) => {
    const content: AIGeneratedContent = {
      title,
      blocks,
      timestamp: Date.now()
    };
    
    localStorage.setItem('ai-generated-content', JSON.stringify(content));
    setAIContent(content);
    setHasAIContent(true);
  };

  const importAIContent = () => {
    if (aiContent) {
      localStorage.removeItem('ai-generated-content');
      setHasAIContent(false);
      setAIContent(null);
      return aiContent;
    }
    return null;
  };

  const clearAIContent = () => {
    localStorage.removeItem('ai-generated-content');
    setHasAIContent(false);
    setAIContent(null);
  };

  return {
    hasAIContent,
    aiContent,
    saveAIContent,
    importAIContent,
    clearAIContent,
    checkForAIContent
  };
}