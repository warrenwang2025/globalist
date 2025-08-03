import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Load prompt.json as the source of truth for all system prompts
const promptFilePath = path.resolve(process.cwd(), "lib/prompts/ai-tools.json");
const promptJson = JSON.parse(fs.readFileSync(promptFilePath, "utf-8"));
const open_ai_model = process.env.OPENAI_MODEL!;

// Allowed block types for validation
const ALLOWED_BLOCK_TYPES = [
  "text",
  "heading",
  "quote",
  "list",
  "image",
  "video",
  "embed",
  "audio",
];

// Private: Map tool names to prompt.json keys
function _getSystemPrompt(tool: string): string {
  const map: Record<string, string> = {
    ideaGeneration: "Idea Generation",
    contentCreation: "Content Creation",
    contentAtomizer: "Content Atomizer",
    contentImprover: "Content Improver",
    seoSupport: "SEO Support",
  };
  const key = map[tool];
  const section = promptJson[key];
  if (!section) return "You are a helpful AI assistant.";
  return `${section.persona}\n\n${section.task}\n\n${section.output_format}`;
}

// Private: Remove markdown code block wrappers and language identifiers
function _extractJsonFromMarkdown(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "");
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/```$/, "");
    }
  }
  return cleaned.trim();
}

// Private: Validate that the parsed AI response is a valid block array (per block type, no id/order required)
function _isValidBlockArray(blocks: any): boolean {
  if (!Array.isArray(blocks)) return false;
  for (const block of blocks) {
    if (typeof block !== "object" || !block.type || !block.content)
      return false;
    if (
      typeof block.type !== "string" ||
      !ALLOWED_BLOCK_TYPES.includes(block.type)
    )
      return false;
    if (typeof block.content !== "object") return false;
    // Per-type validation
    switch (block.type) {
      case "text":
        if (typeof block.content.text !== "string") return false;
        break;
      case "heading":
        if (typeof block.content.text !== "string") return false;
        if (typeof block.content.level !== "number") return false;
        break;
      case "quote":
        if (typeof block.content.text !== "string") return false;
        // author is optional
        break;
      case "list":
        if (!Array.isArray(block.content.items)) return false;
        if (typeof block.content.ordered !== "boolean") return false;
        break;
      // Add more cases for image, video, embed, audio if you want to support them
    }
  }
  return true;
}

export async function handleIdeaGeneration(payload: { topicPrompt: string }) {
  const systemPrompt = _getSystemPrompt("ideaGeneration");
  const userPrompt = `Topic Prompt: ${payload.topicPrompt}`;
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });
  const raw = response.choices[0]?.message?.content?.trim() || "";
  try {
    const jsonStr = _extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    return { success: true, result: parsed, usage: response.usage };
  } catch (err) {
    console.error("Failed to parse AI JSON for Idea Generation:", err, raw);
    return {
      success: false,
      error: "The AI returned an invalid data format. Please try again.",
      usage: response.usage,
    };
  }
}

export async function handleContentCreation(payload: {
  headline: string;
  metaDescription: string;
  tone: string;
}) {
  const systemPrompt = _getSystemPrompt("contentCreation");
  const userPrompt = `Headline: ${payload.headline}\nMeta Description: ${payload.metaDescription}\nTone: ${payload.tone}`;
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1600,
  });
  const raw = response.choices[0]?.message?.content?.trim() || "";
  try {
    const jsonStr = _extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    const blocks = Array.isArray(parsed) ? parsed : parsed.contentBlocks;
    if (!_isValidBlockArray(blocks)) {
      return {
        success: false,
        error: "AI returned invalid block structure.",
        usage: response.usage,
      };
    }
    return {
      success: true,
      result: { contentBlocks: blocks },
      usage: response.usage,
    };
  } catch (err) {
    console.error("Failed to parse AI JSON for Content Creation:", err, raw);
    return {
      success: false,
      error: "The AI returned an invalid data format. Please try again.",
      usage: response.usage,
    };
  }
}

export async function handleContentAtomizer(payload: {
  articleContent: string;
  platforms: string[];
}) {
  const systemPrompt = _getSystemPrompt("contentAtomizer");
  const userPrompt = `Article Content: ${
    payload.articleContent
  }\nPlatforms: ${payload.platforms.join(", ")}`;
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });
  const raw = response.choices[0]?.message?.content?.trim() || "";
  try {
    const jsonStr = _extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    return { success: true, result: parsed, usage: response.usage };
  } catch (err) {
    console.error("Failed to parse AI JSON for Content Atomizer:", err, raw);
    return {
      success: false,
      error: "The AI returned an invalid data format. Please try again.",
      usage: response.usage,
    };
  }
}

export async function handleContentImprover(payload: {
  articleContent: string;
  preferences: string[];
}) {
  const systemPrompt = _getSystemPrompt("contentImprover");
  const userPrompt = `Article Content: ${
    payload.articleContent
  }\nPreferences: ${payload.preferences.join(", ")}`;
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });
  const raw = response.choices[0]?.message?.content?.trim() || "";
  try {
    console.log("AI raw response (Content Improver):", raw);
    const jsonStr = _extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    console.log("AI parsed JSON (Content Improver):", parsed);
    const blocks = Array.isArray(parsed) ? parsed : parsed.contentBlocks;
    if (!_isValidBlockArray(blocks)) {
      console.error("AI block validation failed (Content Improver):", blocks);
      return {
        success: false,
        error: "AI returned invalid block structure.",
        usage: response.usage,
      };
    }
    return {
      success: true,
      result: { contentBlocks: blocks },
      usage: response.usage,
    };
  } catch (err) {
    console.error("Failed to parse AI JSON for Content Improver:", err, raw);
    return {
      success: false,
      error: "The AI returned an invalid data format. Please try again.",
      usage: response.usage,
    };
  }
}

export async function handleSEOSupport(payload: {
  articleContent?: string;
  draftHeadline?: string;
}) {
  const systemPrompt = _getSystemPrompt("seoSupport");
  let userPrompt = "";
  if (payload.articleContent) {
    userPrompt = `Article Content: ${payload.articleContent}`;
  } else if (payload.draftHeadline) {
    userPrompt = `Draft Headline: ${payload.draftHeadline}`;
  } else {
    userPrompt = "No content provided.";
  }
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  const raw = response.choices[0]?.message?.content?.trim() || "";
  try {
    const jsonStr = _extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    return { success: true, result: parsed, usage: response.usage };
  } catch (err) {
    console.error("Failed to parse AI JSON for SEO Support:", err, raw);
    return {
      success: false,
      error: "The AI returned an invalid data format. Please try again.",
      usage: response.usage,
    };
  }
}
