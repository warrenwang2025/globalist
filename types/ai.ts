export type AITool = 'ideas' | 'headlines' | 'summarize' | 'improve' | 'seo';

export type AITone = 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative' | 'funny';

export interface ContentBlock {
  type: 'text' | 'heading' | 'quote' | 'list';
  content: string | string[];
  level?: number; // For headings
  author?: string; // For quotes
  ordered?: boolean; // For lists
}

export interface AIRequest {
  toolType: AITool;
  tone: AITone;
  prompt?: string; // For ideas/headlines
  contentBlocks?: ContentBlock[]; // For content-based tools
  rawContent?: string; // Plain text version
}

export interface AIResponse {
  success: boolean;
  error?: string;
  // Simple tools (ideas, headlines, summarize)
  suggestions?: string[];
  // Content enhancement tools (improve, seo)
  enhancedBlocks?: ContentBlock[];
  enhancedContent?: string; // For improved/SEO content
  usageStats?: {
    hourlyRequestsRemaining: number;
    hourlyTokensRemaining: number;
    hourlyTotalRequests: number;
    hourlyTotalTokens: number;
    tokensUsed: number;
    requestsUsed: number;
  };
}

export interface UsageStats {
  hourlyRequestsRemaining: number;
  hourlyTokensRemaining: number;
  hourlyTotalRequests: number;
  hourlyTotalTokens: number;
  tokensUsed: number;
  requestsUsed: number;
  lastReset: Date;
}
