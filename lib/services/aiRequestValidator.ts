import type { ContentBlock } from "@/types/ai";

// Types for validation
interface AIRequestValidation {
  isValid: boolean;
  error?: string;
  toolType?: string;
  tone?: string;
  contentFromFrontend?: string | ContentBlock[];
}

export class AIRequestValidator {
  /**
   * Validate AI request and extract the appropriate content based on tool type
   */
  static validateAIRequest(request: {
    toolType?: string;
    tone?: string;
    prompt?: string;
    contentBlocks?: ContentBlock[];
    rawContent?: string;
  }): AIRequestValidation {
    const { toolType, tone, prompt, contentBlocks, rawContent } = request;

    // Check if toolType is provided
    if (!toolType) {
      return {
        isValid: false,
        error: 'Tool type is required'
      };
    }

    // Check if toolType is valid
    const validToolTypes = ['ideas', 'headlines', 'summarize', 'improve', 'seo'];
    if (!validToolTypes.includes(toolType)) {
      return {
        isValid: false,
        error: `Invalid tool type. Must be one of: ${validToolTypes.join(', ')}`
      };
    }

    // Validate content based on tool type
    switch (toolType) {
      case 'ideas':
      case 'headlines':
        if (!prompt || !prompt.trim()) {
          return {
            isValid: false,
            error: `Prompt is required for ${toolType} tool`
          };
        }
        return {
          isValid: true,
          toolType,
          tone,
          contentFromFrontend: prompt.trim()
        };

      case 'summarize':
        if (!rawContent || !rawContent.trim()) {
          return {
            isValid: false,
            error: 'Raw content is required for summarize tool'
          };
        }
        return {
          isValid: true,
          toolType,
          tone,
          contentFromFrontend: rawContent.trim()
        };

      case 'improve':
      case 'seo':
        if (!contentBlocks || !Array.isArray(contentBlocks) || contentBlocks.length === 0) {
          return {
            isValid: false,
            error: `Content blocks are required for ${toolType} tool`
          };
        }
        
        // Check if content blocks have actual content
        const hasContent = contentBlocks.some(block => 
          block.content && 
          (typeof block.content === 'string' ? block.content.trim() : 
           Array.isArray(block.content) ? block.content.length > 0 : false)
        );
        
        if (!hasContent) {
          return {
            isValid: false,
            error: `Content blocks must contain actual content for ${toolType} tool`
          };
        }
        
        return {
          isValid: true,
          toolType,
          tone,
          contentFromFrontend: contentBlocks
        };

      default:
        return {
          isValid: false,
          error: `Unsupported tool type: ${toolType}`
        };
    }
  }

  /**
   * Format content for token estimation based on the validated content
   * Converts ContentBlock arrays to JSON strings for accurate token counting
   */
  static formatContentForTokenEstimation(contentFromFrontend: string | ContentBlock[]): string {
    if (typeof contentFromFrontend === 'string') {
      // Already a string (prompt or rawContent)
      return contentFromFrontend;
    } else {
      // ContentBlock array - stringify it since we're sending full structure to AI
      return JSON.stringify(contentFromFrontend);
    }
  }
}
