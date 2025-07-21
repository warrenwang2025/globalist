import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Load prompt.json as the source of truth for all system prompts
const promptFilePath = path.resolve(process.cwd(), "lib/prompts/ai-tools.json");
const promptJson = JSON.parse(fs.readFileSync(promptFilePath, "utf-8"));
const open_ai_model = process.env.OPENAI_MODEL!;

function getSystemPrompt(tool: string): string {
  // Map tool names to prompt.json keys
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

function extractJsonFromMarkdown(raw: string): string {
  // Remove markdown code block wrappers and language identifiers
  let cleaned = raw.trim();
  // Remove triple backticks and optional language (e.g., ```json)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/```$/, '');
    }
  }
  // Remove any leading/trailing whitespace/newlines
  return cleaned.trim();
}

export async function handleIdeaGeneration(payload: { topicPrompt: string }) {
  const systemPrompt = getSystemPrompt("ideaGeneration");
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
  const raw = response.choices[0]?.message?.content?.trim() || '';
  try {
    const jsonStr = extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    return { success: true, result: parsed, usage: response.usage };
  } catch (err) {
    console.error('Failed to parse AI JSON for Idea Generation:', err, raw);
    return { success: false, error: "The AI returned an invalid data format. Please try again.", usage: response.usage };
  }
}

export async function handleContentCreation(payload: { headline: string; metaDescription: string; tone: string }) {
  const systemPrompt = getSystemPrompt("contentCreation");
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
  return { success: true, result: response.choices[0]?.message?.content?.trim(), usage: response.usage };
}

export async function handleContentAtomizer(payload: { articleContent: string; platforms: string[] }) {
  const systemPrompt = getSystemPrompt("contentAtomizer");
  const userPrompt = `Article Content: ${payload.articleContent}\nPlatforms: ${payload.platforms.join(", ")}`;
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });
  const raw = response.choices[0]?.message?.content?.trim() || '';
  try {
    const jsonStr = extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    return { success: true, result: parsed, usage: response.usage };
  } catch (err) {
    console.error('Failed to parse AI JSON for Content Atomizer:', err, raw);
    return { success: false, error: "The AI returned an invalid data format. Please try again.", usage: response.usage };
  }
}

export async function handleContentImprover(payload: { articleContent: string; preferences: string[] }) {
  const systemPrompt = getSystemPrompt("contentImprover");
  const userPrompt = `Article Content: ${payload.articleContent}\nPreferences: ${payload.preferences.join(", ")}`;
  const response = await openai.chat.completions.create({
    model: open_ai_model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });
  return { success: true, result: response.choices[0]?.message?.content?.trim(), usage: response.usage };
}

export async function handleSEOSupport(payload: { articleContent?: string; draftHeadline?: string }) {
  const systemPrompt = getSystemPrompt("seoSupport");
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
  const raw = response.choices[0]?.message?.content?.trim() || '';
  try {
    const jsonStr = extractJsonFromMarkdown(raw);
    const parsed = JSON.parse(jsonStr);
    return { success: true, result: parsed, usage: response.usage };
  } catch (err) {
    console.error('Failed to parse AI JSON for SEO Support:', err, raw);
    return { success: false, error: "The AI returned an invalid data format. Please try again.", usage: response.usage };
  }
}
