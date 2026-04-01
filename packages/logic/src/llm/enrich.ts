import { generateObject } from 'ai';
import { EnrichmentOutputSchema } from '@finary/types';
import type { EnrichmentOutput } from '@finary/types';
import { GEMINI } from './client';

/**
 * Uses Claude to extract a structured financial profile from a call transcript.
 * Only includes fields explicitly mentioned or clearly implied — never hallucinates.
 */
export async function enrichContactFromTranscript(
  transcript: string,
): Promise<EnrichmentOutput> {
  const { object } = await generateObject({
    model: GEMINI,
    schema: EnrichmentOutputSchema,
    system: `You are an expert financial advisor assistant.
Extract structured information about a client from a call transcript.
Only include information explicitly mentioned or clearly implied.
Never invent or assume data not present in the transcript.
Respond in the same language as the transcript.`,
    prompt: `Extract the client's financial profile from the following call transcript:\n\n${transcript}`,
  });

  return object;
}
