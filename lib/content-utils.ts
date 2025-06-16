import type { AnyBlock } from '@/types/editor';

export interface ContentData {
  title: string;
  blocks: AnyBlock[];
  plainText: string;
  wordCount: number;
}

export function extractContentText(blocks: AnyBlock[]): string {
  return blocks
    .map(block => {
      switch (block.type) {
        case 'text':
          return (block.content as any).text || '';
        case 'heading':
          return (block.content as any).text || '';
        case 'quote':
          return `"${(block.content as any).text || ''}"${
            (block.content as any).author ? ` - ${(block.content as any).author}` : ''
          }`;
        case 'list':
          return (block.content as any).items?.join('\n• ') || '';
        default:
          return '';
      }
    })
    .filter(text => text.trim())
    .join('\n\n');
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function processContentData(title: string, blocks: AnyBlock[]): ContentData {
  const plainText = extractContentText(blocks);
  const wordCount = getWordCount(plainText);
  
  return {
    title,
    blocks,
    plainText,
    wordCount
  };
}

export function generateContentSummary(blocks: AnyBlock[], maxLength: number = 150): string {
  const text = extractContentText(blocks);
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
}

export function validateContent(title: string, blocks: AnyBlock[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!title.trim() && blocks.length === 0) {
    errors.push('Content must have either a title or body content');
  }
  
  const contentText = extractContentText(blocks);
  if (contentText.length > 10000) {
    errors.push('Content is too long (maximum 10,000 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}