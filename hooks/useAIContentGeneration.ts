import { useState } from 'react';
import { aiRequestService } from '@/lib/services/aiRequestService';
import type { AIRequest, AIResponse } from '@/types/ai';

export function useAIContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (request: AIRequest): Promise<AIResponse> => {
    setIsGenerating(true);
    try {
      const response = await aiRequestService.enhanceContent(request);
      return response;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating
  };
}
