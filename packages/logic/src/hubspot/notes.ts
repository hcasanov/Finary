import { HubSpotNotesListSchema, HubSpotAssociationResultSchema } from '@finary/types';
import type { FetchNotesOutput } from '@finary/types';
import type { HubSpotClient } from './client';

// Matches both "#TRANSCRIPT" (convention) and "[Transcript" (HubSpot auto-format)
const TRANSCRIPT_MARKERS = ['#TRANSCRIPT', '[Transcript', '[transcript'];

/**
 * HubSpot stores note bodies as HTML. Strip tags before processing so LLMs
 * and prefix checks work on plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isTranscript(plainText: string): boolean {
  const trimmed = plainText.trimStart();
  return TRANSCRIPT_MARKERS.some((marker) => trimmed.startsWith(marker));
}

export async function getContactNotes(
  client: HubSpotClient,
  contactId: string,
): Promise<FetchNotesOutput> {
  // 1. Get associated note IDs for the contact
  const associations = await client.request<unknown>(
    `/crm/v3/objects/contacts/${contactId}/associations/notes`,
  );

  const parsed = HubSpotAssociationResultSchema.safeParse(associations);
  if (!parsed.success || parsed.data.results.length === 0) {
    return { transcript: null, allNotes: [] };
  }

  const noteIds = parsed.data.results.map((r) => r.id);

  // 2. Batch-read the notes
  const batchRaw = await client.request<unknown>('/crm/v3/objects/notes/batch/read', {
    method: 'POST',
    body: {
      properties: ['hs_note_body', 'hs_createdate', 'hubspot_owner_id'],
      inputs: noteIds.map((id) => ({ id })),
    },
  });

  const notesList = HubSpotNotesListSchema.parse(batchRaw);

  // Strip HTML from all note bodies before any processing
  const allNotes = notesList.results.map((note) => ({
    id: note.id,
    body: stripHtml(note.properties.hs_note_body),
    createdAt: note.properties.hs_createdate,
    ownerId: note.properties.hubspot_owner_id,
  }));

  // 3. Separate transcript from regular notes
  const transcriptNote = allNotes.find((n) => isTranscript(n.body));
  const regularNotes = allNotes.filter((n) => !isTranscript(n.body));

  return {
    transcript: transcriptNote?.body ?? null,
    allNotes: regularNotes,
  };
}

export async function createContactNote(
  client: HubSpotClient,
  contactId: string,
  body: string,
  ownerId?: string,
): Promise<string> {
  // 1. Create the note object
  const note = await client.request<{ id: string }>('/crm/v3/objects/notes', {
    method: 'POST',
    body: {
      properties: {
        hs_note_body: body,
        hs_timestamp: new Date().toISOString(),
        ...(ownerId !== undefined ? { hubspot_owner_id: ownerId } : {}),
      },
    },
  });

  // 2. Associate note → contact
  await client.request('/crm/v3/associations/notes/contacts/batch/create', {
    method: 'POST',
    body: {
      inputs: [
        {
          from: { id: note.id },
          to: { id: contactId },
          type: 'note_to_contact',
        },
      ],
    },
  });

  return note.id;
}
