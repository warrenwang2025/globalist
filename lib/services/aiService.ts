import OpenAI from "openai";
import type {
  AIRequest,
  AIResponse,
  ContentBlock,
  AITool,
  AITone,
} from "@/types/ai";

export class AIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processRequest(request: AIRequest): Promise<{
    success: boolean;
    suggestions?: string[];
    enhancedBlocks?: ContentBlock[];
    error?: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> {
    try {
      const prompt = this.buildPrompt(request);

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(request.toolType),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: this.getMaxTokens(request.toolType),
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        return { success: false, error: "No content generated" };
      }

      const result = this.parseResponse(
        content,
        request.toolType,
        request.contentBlocks
      );

      return {
        success: true,
        ...result,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error("AI Service Error:", error);

      // Handle parsing errors specifically
      if (error.message?.includes("not in valid JSON")) {
        return { success: false, error: "AI response format is invalid. Please try again." };
      }

      if (error.status === 429) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        };
      }
      if (error.status === 401) {
        return { success: false, error: "Invalid API key configuration." };
      }
      if (error.status === 402) {
        return {
          success: false,
          error: "Quota exceeded. Please check your OpenAI billing.",
        };
      }

      return {
        success: false,
        error: "Failed to process request. Please try again.",
      };
    }
  }

  private getSystemPrompt(toolType: AITool): string {
    const prompts = {
      ideas:
        "You are a creative content strategist. Generate original, engaging content ideas.",
      headlines:
        "You are a skilled copywriter. Create compelling, attention-grabbing headlines.",
      summarize:
        "You are a professional editor. Create clear, concise summaries that capture key points.",
      improve:
        "You are a writing coach. Enhance content while maintaining its original structure and meaning.",
      seo: "You are an SEO specialist. Optimize content for search engines while keeping it readable and engaging.",
    };
    return prompts[toolType];
  }

  private buildPrompt(request: AIRequest): string {
    const { toolType, tone, prompt, contentBlocks, rawContent } = request;
    const toneContext = tone ? ` with a ${tone} tone` : "";

    // Simple tools: Use rawContent or prompt
    if (toolType === "ideas" || toolType === "headlines") {
      return this.buildSimpleToolPrompt(toolType, prompt || "", toneContext);
    }

    if (toolType === "summarize") {
      return this.buildSummarizePrompt(rawContent || "", toneContext);
    }

    // Enhancement tools: Use contentBlocks as JSON
    if (toolType === "improve" || toolType === "seo") {
      return this.buildEnhancementPrompt(
        toolType,
        contentBlocks || [],
        toneContext
      );
    }

    return prompt || "Please provide content enhancement.";
  }

  private buildSimpleToolPrompt(
    toolType: "ideas" | "headlines",
    prompt: string,
    toneContext: string
  ): string {
    if (toolType === "ideas") {
      return `Generate 5 creative content ideas about: "${prompt}"${toneContext}

Return ONLY a valid JSON array of strings:
["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"]`;
    }

    if (toolType === "headlines") {
      return `Create 8 compelling headlines about: "${prompt}"${toneContext}

Return ONLY a valid JSON array of strings:
["headline 1", "headline 2", "headline 3", "headline 4", "headline 5", "headline 6", "headline 7", "headline 8"]`;
    }

    return prompt;
  }

  private buildSummarizePrompt(
    rawContent: string,
    toneContext: string
  ): string {
    return `Summarize the following content${toneContext}:

${rawContent}

Return ONLY a JSON array with a single summary string:
["Your comprehensive summary here"]`;
  }

  private buildEnhancementPrompt(
    toolType: "improve" | "seo",
    contentBlocks: ContentBlock[],
    toneContext: string
  ): string {
    const action =
      toolType === "improve" ? "Improve and enhance" : "Optimize for SEO";

    return `${action} the following content${toneContext}. 

You can restructure, combine, split, or reorganize the content as needed for better readability and impact.
You may change the number of blocks and their types to improve the content structure.

Input content:
${JSON.stringify(contentBlocks, null, 2)}

Return ONLY a valid JSON array of content blocks. Each block must have:
- type: "heading" | "text" | "quote" | "list"
- content: string (or array of strings for lists)
- level: number (1-6, only for headings)
- author: string (only for quotes)
- ordered: boolean (only for lists)

Example valid block types:
{"type": "heading", "content": "Enhanced Title", "level": 2}
{"type": "text", "content": "Enhanced paragraph text"}
{"type": "quote", "content": "Enhanced quote", "author": "Author Name"}
{"type": "list", "content": ["Item 1", "Item 2"], "ordered": false}

Return the enhanced content as a valid JSON array:`;
  }

  private parseResponse(
    content: string,
    toolType: AITool,
    originalBlocks?: ContentBlock[]
  ): {
    suggestions?: string[];
    enhancedBlocks?: ContentBlock[];
  } {
    // Simple tools return suggestions (all use JSON arrays now)
    if (toolType === "ideas" || toolType === "headlines" || toolType === "summarize") {
      return this.parseSimpleToolResponse(content);
    }

    // Enhancement tools return enhanced blocks
    if (toolType === "improve" || toolType === "seo") {
      return this.parseEnhancementResponse(content, originalBlocks);
    }

    return { suggestions: [content] };
  }

  private parseSimpleToolResponse(content: string): { suggestions: string[] } {
    // Try to parse JSON array
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedArray = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsedArray)) {
          // Validate that all items are strings and not empty
          const validSuggestions = parsedArray
            .filter(item => typeof item === 'string' && item.trim())
            .map(item => item.trim());
          
          if (validSuggestions.length > 0) {
            return { suggestions: validSuggestions };
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse JSON array response:", error);
    }

    // No fallback - throw error for invalid format
    throw new Error("AI response is not in valid JSON array format");
  }

  private parseEnhancementResponse(
    content: string,
    originalBlocks?: ContentBlock[]
  ): {
    suggestions?: string[];
    enhancedBlocks?: ContentBlock[];
  } {
    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedBlocks = JSON.parse(jsonMatch[0]) as any[];
        // Validate each block individually
        const validBlocks = this.validateAndSanitizeBlocks(parsedBlocks);
        if (validBlocks.length > 0) {
          return { enhancedBlocks: validBlocks };
        }
      }
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
    }

    // No fallback - throw error for invalid format
    throw new Error("AI response is not in valid JSON array format for content blocks");
  }

  private validateAndSanitizeBlocks(blocks: any[]): ContentBlock[] {
    const validBlocks: ContentBlock[] = [];

    for (const block of blocks) {
      if (!block || typeof block !== 'object') continue;

      // Validate block type
      if (!['heading', 'text', 'quote', 'list'].includes(block.type)) {
        continue;
      }

      // Validate and sanitize each block type
      switch (block.type) {
        case 'heading':
          if (typeof block.content === 'string' && block.content.trim()) {
            validBlocks.push({
              type: 'heading',
              content: block.content.trim(),
              level: typeof block.level === 'number' && block.level >= 1 && block.level <= 6 
                ? block.level 
                : 2
            });
          }
          break;

        case 'text':
          if (typeof block.content === 'string' && block.content.trim()) {
            validBlocks.push({
              type: 'text',
              content: block.content.trim()
            });
          }
          break;

        case 'quote':
          if (typeof block.content === 'string' && block.content.trim()) {
            validBlocks.push({
              type: 'quote',
              content: block.content.trim(),
              author: typeof block.author === 'string' ? block.author.trim() : undefined
            });
          }
          break;

        case 'list':
          if (Array.isArray(block.content) && block.content.length > 0) {
            const listItems = block.content
              .filter((item: any) => typeof item === 'string' && item.trim())
              .map((item: string) => item.trim());
            
            if (listItems.length > 0) {
              validBlocks.push({
                type: 'list',
                content: listItems,
                ordered: typeof block.ordered === 'boolean' ? block.ordered : false
              });
            }
          }
          break;
      }
    }

    return validBlocks;
  }

  private getMaxTokens(toolType: AITool): number {
    const tokenLimits = {
      ideas: 300,
      headlines: 400,
      summarize: 500,
      improve: 1000,
      seo: 1000,
    };
    return tokenLimits[toolType];
  }
}

export const aiService = new AIService();
