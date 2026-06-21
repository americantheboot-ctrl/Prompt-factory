/**
 * Types & Contracts for Engineered Prompt Factory
 */

export interface PromptRequest {
  subject: string;
  style: string;
  lighting: string;
  mood: string;
  camera: string;
  cameraAngle?: string;
  zoomLevel?: string;
  lensType?: string;
  aspect: string;
  artist: string;
  octane: string;
  type?: "image" | "video" | "text";
}

export interface StyleVariation {
  styleNameFa: string;
  styleNameEn: string;
  prompt: string;
}

export interface PromptResult {
  translatedSubject: string;
  optimizedPrompt: string;
  negativePrompt?: string;
  variations: StyleVariation[];
  engineeringExplanation: string;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: string;
  request: PromptRequest;
  result: PromptResult;
}
