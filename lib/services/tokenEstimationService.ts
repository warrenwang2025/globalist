// Token estimation service for AI requests
// Using @dqbd/tiktoken for accurate OpenAI token counting

import { encoding_for_model } from '@dqbd/tiktoken';

export class TokenEstimationService {
  // System prompts by tool type (matching aiService.ts)
  private static readonly SYSTEM_PROMPTS = {
    ideas: 'You are a creative content strategist. Generate original, engaging content ideas.',
    headlines: 'You are a skilled copywriter. Create compelling, attention-grabbing headlines.',
    summarize: 'You are a professional editor. Create clear, concise summaries that capture key points.',
    improve: 'You are a writing coach. Enhance content while maintaining its original structure and meaning.',
    seo: 'You are an SEO specialist. Optimize content for search engines while keeping it readable and engaging.'
  };
  
  // Expected output token estimates by tool type
  private static readonly EXPECTED_OUTPUT_TOKENS = {
    ideas: 200,      // Usually generates multiple ideas
    headlines: 100,  // Usually generates multiple headlines
    summarize: 150,  // Summary length varies
    improve: 300,    // Improved content can be longer
    seo: 250        // SEO improvements with explanations
  };
  
  // Buffer percentage for safety margin
  private static readonly BUFFER_PERCENTAGE = 0.25; // 25% buffer

  /**
   * Accurately count tokens using GPT tokenizer or fallback
   */
  private static countTokens(text: string): number {
    if (!text) return 0;
    
    try {
      // Use tiktoken for accurate token counting
      const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
      const encoding = encoding_for_model(modelName as any);
      const tokens = encoding.encode(text);
      encoding.free(); // Free the encoding to prevent memory leaks
      return tokens.length;
    } catch (error) {
      // Fallback to improved character-based estimation
      // GPT models roughly use 1 token per 4 characters for English text
      // But this varies significantly, so we use a more conservative estimate
      const avgCharsPerToken = 3.5; // Slightly more conservative than 4
      return Math.ceil(text.length / avgCharsPerToken);
    }
  }

  // ===== PUBLIC API - ONLY 5 FUNCTIONS =====

  /**
   * 1. Estimate tokens for user input only (excluding system prompt)
   * Use this when user pays for their own content only
   */
  public static estimateUserTokensOnly(
    toolType: string,
    formattedContent: string
  ): number {
    const userInputTokens = this.countTokens(formattedContent);
    
    // Expected output tokens
    const outputTokens = this.EXPECTED_OUTPUT_TOKENS[toolType as keyof typeof this.EXPECTED_OUTPUT_TOKENS] || 200;
    
    // Total: user input + expected output + buffer
    const totalTokens = userInputTokens + outputTokens;
    const withBuffer = Math.ceil(totalTokens * (1 + this.BUFFER_PERCENTAGE));
    
    return withBuffer;
  }

  /**
   * 2. Estimate total tokens including system prompts
   * Use this when user pays for everything (system prompt + user input + output)
   */
  public static estimateFullTokens(
    toolType: string,
    formattedContent: string
  ): number {
    const userInputTokens = this.countTokens(formattedContent);
    
    // System prompt tokens (calculated dynamically)
    const systemTokens = this.getSystemPromptTokens(toolType);
    
    // Expected output tokens
    const outputTokens = this.EXPECTED_OUTPUT_TOKENS[toolType as keyof typeof this.EXPECTED_OUTPUT_TOKENS] || 200;
    
    // Total: system + user input + expected output + buffer
    const totalTokens = systemTokens + userInputTokens + outputTokens;
    const withBuffer = Math.ceil(totalTokens * (1 + this.BUFFER_PERCENTAGE));
    
    return withBuffer;
  }

  /**
   * 3. Calculate actual user token usage from AI response (excludes system prompt)
   * Use this to calculate what the user actually consumed (subtract system prompt)
   */
  public static calculateUserTokensUsed(
    totalTokensFromAI: number,
    toolType: string
  ): number {
    const systemTokens = this.getSystemPromptTokens(toolType);
    
    // User tokens = Total tokens - System prompt tokens
    const userTokens = Math.max(0, totalTokensFromAI - systemTokens);
    
    return userTokens;
  }

  /**
   * 4. Calculate total tokens used (including system prompt)
   * Use this when user pays for everything and you need the full usage
   */
  public static calculateTotalTokensUsed(
    totalTokensFromAI: number
  ): number {
    // Just return the total as-is since this includes everything
    return totalTokensFromAI;
  }

  /**
   * 5. Get system prompt token count for a tool type
   * Use this for transparency or billing breakdowns
   */
  public static getSystemPromptTokens(toolType: string): number {
    const systemPrompt = this.SYSTEM_PROMPTS[toolType as keyof typeof this.SYSTEM_PROMPTS];
    if (!systemPrompt) {
      // Fallback for unknown tool types
      return this.countTokens('You are a helpful AI assistant.');
    }
    
    return this.countTokens(systemPrompt);
  }
}
