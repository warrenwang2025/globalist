import { AnyBlock } from "@/types/editor";

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

export function parseAIBlocks(rawBlocks: any[]): AnyBlock[] {
  if (!Array.isArray(rawBlocks)) return [];
  return rawBlocks.map((block, idx) => ({
    id: generateUniqueId(),
    type: block.type,
    content: block.content,
    order: idx,
  }));
}

export function previewTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks.map(block => {
    switch (block.type) {
      case "heading":
        return `${"#".repeat(block.content.level || 1)} ${block.content.text}`;
      case "text":
        return block.content.text;
      case "list":
        return block.content.items
          .map((item: string, i: number) =>
            block.content.ordered ? `${i + 1}. ${item}` : `- ${item}`
          )
          .join("\n");
      case "quote":
        return `> ${block.content.text}${block.content.author ? `\n> — ${block.content.author}` : ""}`;
      default:
        return "";
    }
  }).join("\n\n");
} 