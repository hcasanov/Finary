import { z } from 'zod';

// ─── Inngest Event ─────────────────────────────────────────────────────────────

export const PIPELINE_EVENT_NAME = 'hubspot/call.ended' as const;

export const PipelineEventDataSchema = z.object({
  contactId: z.string(),
  portalId: z.string(),
  ownerId: z.string().nullish(),
  contactEmail: z.string().optional(),
  contactFirstname: z.string().optional(),
  contactLastname: z.string().optional(),
});

export type PipelineEventData = z.infer<typeof PipelineEventDataSchema>;

// ─── Step Outputs ─────────────────────────────────────────────────────────────

export const NoteItemSchema = z.object({
  id: z.string(),
  body: z.string(),
  createdAt: z.string().optional(),
  ownerId: z.string().optional(),
});

export type NoteItem = z.infer<typeof NoteItemSchema>;

export const FetchNotesOutputSchema = z.object({
  transcript: z.string().nullable(),
  allNotes: z.array(NoteItemSchema),
});

export type FetchNotesOutput = z.infer<typeof FetchNotesOutputSchema>;
