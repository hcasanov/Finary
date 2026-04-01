import { generateObject } from 'ai';
import { RecapOutputSchema } from '@finary/types';
import type { RecapOutput, NoteItem } from '@finary/types';
import { GEMINI } from './client';

/**
 * Uses Claude to generate a conversation recap and action tasks
 * from the call transcript and all previous advisor notes.
 */
export async function recapConversation(
  transcript: string,
  notes: NoteItem[],
): Promise<RecapOutput> {
  const notesSection =
    notes.length > 0
      ? `\n\n## Previous advisor notes\n${notes
          .map(
            (n, i) =>
              `### Note ${i + 1}${n.createdAt !== undefined ? ` (${n.createdAt})` : ''}\n${n.body}`,
          )
          .join('\n\n')}`
      : '';

  const { object } = await generateObject({
    model: GEMINI,
    schema: RecapOutputSchema,
    system: `You are an expert financial advisor assistant.
Analyze a call transcript and advisor notes to produce a comprehensive recap and action plan.
Be concise but thorough. Focus on actionable insights.
For tasks, be specific about what needs to be done and when.
Do NOT include a J+3 follow-up task — it is added automatically by the system.
Respond in the same language as the transcript.`,
    prompt: `## Call transcript\n${transcript}${notesSection}

Based on the above:
1. Write a comprehensive conversation summary
2. Extract key discussion points
3. List client concerns and objections
4. List commitments made by the advisor
5. Define concrete agreed next steps
6. Generate actionable HubSpot tasks (do not include a generic 3-day follow-up)`,
  });

  return object;
}
