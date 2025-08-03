// Token estimation service for AI requests
// Using js-tiktoken for accurate OpenAI token counting

import { encodingForModel } from 'js-tiktoken';

class TokenEstimationService {
  private SYSTEM_PROMPTS: Record<string, string>;
  private EXPECTED_OUTPUT_TOKENS: Record<string, number>;
  private BUFFER_PERCENTAGE: number;

  constructor() {
    this.SYSTEM_PROMPTS = {
      ideas: 'You are a creative content strategist. Generate original, engaging content ideas.',
      headlines: 'You are a skilled copywriter. Create compelling, attention-grabbing headlines.',
      summarize: 'You are a professional editor. Create clear, concise summaries that capture key points.',
      improve: 'You are a writing coach. Enhance content while maintaining its original structure and meaning.',
      seo: 'You are an SEO specialist. Optimize content for search engines while keeping it readable and engaging.'
    };
    this.EXPECTED_OUTPUT_TOKENS = {
      ideas: 200,      // Usually generates multiple ideas
      headlines: 100,  // Usually generates multiple headlines
      summarize: 150,  // Summary length varies
      improve: 300,    // Improved content can be longer
      seo: 250        // SEO improvements with explanations
    };
    this.BUFFER_PERCENTAGE = 0.25; // 25% buffer
  }

  /**
   * Accurately count tokens using GPT tokenizer or fallback
   */
  private countTokens(text: string): number {
    if (!text) return 0;
    try {
      // Use js-tiktoken for accurate token counting
      const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
      const encoding = encodingForModel(modelName as any);
      const tokens = encoding.encode(text);
      return tokens.length;
    } catch (error) {
      const avgCharsPerToken = 3.5;
      return Math.ceil(text.length / avgCharsPerToken);
    }
  }

  /**
   * 1. Estimate tokens for user input only (excluding system prompt)
   * Use this when user pays for their own content only
   */
  public estimateUserTokensOnly(toolType: string, formattedContent: string): number {
    const userInputTokens = this.countTokens(formattedContent);
    const outputTokens = this.EXPECTED_OUTPUT_TOKENS[toolType as keyof typeof this.EXPECTED_OUTPUT_TOKENS] || 200;
    const totalTokens = userInputTokens + outputTokens;
    const withBuffer = Math.ceil(totalTokens * (1 + this.BUFFER_PERCENTAGE));
    return withBuffer;
  }

  /**
   * 2. Estimate total tokens including system prompts
   * Use this when user pays for everything (system prompt + user input + output)
   */
  public estimateFullTokens(toolType: string, formattedContent: string): number {
    const userInputTokens = this.countTokens(formattedContent);
    const systemTokens = this.getSystemPromptTokens(toolType);
    const outputTokens = this.EXPECTED_OUTPUT_TOKENS[toolType as keyof typeof this.EXPECTED_OUTPUT_TOKENS] || 200;
    const totalTokens = systemTokens + userInputTokens + outputTokens;
    const withBuffer = Math.ceil(totalTokens * (1 + this.BUFFER_PERCENTAGE));
    return withBuffer;
  }

  /**
   * 3. Calculate actual user token usage from AI response (excludes system prompt)
   * Use this to calculate what the user actually consumed (subtract system prompt)
   */
  public calculateUserTokensUsed(totalTokensFromAI: number, toolType: string): number {
    const systemTokens = this.getSystemPromptTokens(toolType);
    const userTokens = Math.max(0, totalTokensFromAI - systemTokens);
    return userTokens;
  }

  /**
   * 4. Calculate total tokens used (including system prompt)
   * Use this when user pays for everything and you need the full usage
   */
  public calculateTotalTokensUsed(totalTokensFromAI: number): number {
    return totalTokensFromAI;
  }

  /**
   * 5. Get system prompt token count for a tool type
   * Use this for transparency or billing breakdowns
   */
  public getSystemPromptTokens(toolType: string): number {
    const systemPrompt = this.SYSTEM_PROMPTS[toolType as keyof typeof this.SYSTEM_PROMPTS];
    if (!systemPrompt) {
      return this.countTokens('You are a helpful AI assistant.');
    }
    return this.countTokens(systemPrompt);
  }
}

export default new TokenEstimationService();
