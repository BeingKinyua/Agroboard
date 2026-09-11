import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

/**
 * Lazy initialization of Google Gen AI client.
 * Strictly server-side to protect API credentials.
 */
export function getGoogleGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[AI Service] GEMINI_API_KEY is not set. Intelligent AI suggestions will fall back to rule-based algorithms.');
    return null;
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }

  return aiInstance;
}
