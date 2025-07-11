import type { AIRequest, AIResponse } from '@/types/ai';

export class AIRequestService {
  private static readonly API_ENDPOINT = '/api/ai/enhance';

  static async enhanceContent(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('AI Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
        usageStats: {
          hourlyRequestsRemaining: 0,
          hourlyTotalRequests: 0,
          hourlyTokensRemaining: 0,
          hourlyTotalTokens: 0,
          tokensUsed: 0,
          requestsUsed: 0,
        }
      };
    }
  }
}

export const aiRequestService = AIRequestService;
