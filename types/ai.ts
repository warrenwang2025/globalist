// Re-export AnyBlock from editor types for AI-related functionality
export type ContentBlock = import('@/types/editor').AnyBlock;

export interface AIRequest {
  tool: string;
  payload: any;
}

export interface AIResponse {
  success: boolean;
  result?: any;
  error?: string;
  usage?: any;
} 