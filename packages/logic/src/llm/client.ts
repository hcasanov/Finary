import { google } from '@ai-sdk/google';

/**
 * Gemini 2.0 Flash via Vercel AI SDK.
 * GOOGLE_GENERATIVE_AI_API_KEY must be set in env.
 */
export const GEMINI = google('gemini-2.0-flash-001');
