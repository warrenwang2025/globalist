import { AnyBlock } from "./editor";

export interface User {
  isPremium: boolean;
}

export interface ContentGenerationState {
  prompt: string;
  suggestions: string[];
  isGenerating: boolean;
  isSaving: boolean;
}

export interface EditorState {
  title: string;
  blocks: AnyBlock[];
  activeTab: string;
}

export interface PreviewData {
  title: string;
  content: string;
  selectedPlatforms: number[];
  uploadedFiles: SerializableFile[];
  scheduleDate: string;
  scheduleTime: string;
}

export interface SerializableFile {
  name: string;
  type: string;
  size: number;
}