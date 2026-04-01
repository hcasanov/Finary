import { PIPELINE_EVENT_NAME, PipelineEventDataSchema } from '@finary/types';
import type { RecapOutput } from '@finary/types';
import { inngest } from './client';
import { createHubSpotClient } from '../hubspot/client';
import { getContactNotes, createContactNote } from '../hubspot/notes';
import { updateContact, markPipelineStarted } from '../hubspot/contacts';
import { createContactTasks } from '../hubspot/tasks';
import { enrichContactFromTranscript } from '../llm/enrich';
import { recapConversation } from '../llm/recap';
import { addDays } from '../utils/date';

export const contactPipelineFunction = inngest.createFunction(
  {
    id: 'contact-pipeline',
    name: 'Contact Call Pipeline',
    retries: 3,
  },
  { event: PIPELINE_EVENT_NAME },
  async ({ event, step }) => {
    const eventData = PipelineEventDataSchema.parse(event.data);
    const { contactId, ownerId } = eventData;

    const hubspot = createHubSpotClient(process.env['HUBSPOT_ACCESS_TOKEN'] ?? '');

    // ── Step 1: Mark pipeline as started ──────────────────────────────────────
    // Must run first to prevent concurrent duplicate executions.
    await step.run('mark-pipeline-started', () => markPipelineStarted(hubspot, contactId));

    // ── Step 2: Fetch transcript + notes ──────────────────────────────────────
    const { transcript, allNotes } = await step.run('fetch-contact-notes', () =>
      getContactNotes(hubspot, contactId),
    );

    if (transcript === null) {
      return { status: 'skipped', reason: 'no_transcript', contactId };
    }

    // ── Step 3: LLM in parallel ───────────────────────────────────────────────
    const [enrichedData, recapData] = await Promise.all([
      step.run('llm-data-enrich', () => enrichContactFromTranscript(transcript)),
      step.run('llm-recap-tasks', () => recapConversation(transcript, allNotes)),
    ]);

    // ── Step 4: Update contact with enriched data ─────────────────────────────
    await step.run('update-contact-enriched-data', () =>
      updateContact(hubspot, contactId, {
        ...(enrichedData.firstname !== undefined && { firstname: enrichedData.firstname }),
        ...(enrichedData.lastname !== undefined && { lastname: enrichedData.lastname }),
        ...(enrichedData.age !== undefined && { finary_age: String(enrichedData.age) }),
        ...(enrichedData.financial_situation !== undefined && {
          finary_financial_situation: enrichedData.financial_situation,
        }),
        ...(enrichedData.investment_goals !== undefined && {
          finary_investment_goals: enrichedData.investment_goals,
        }),
        ...(enrichedData.risk_tolerance !== undefined && {
          finary_risk_tolerance: enrichedData.risk_tolerance,
        }),
        ...(enrichedData.patrimony_estimate !== undefined && {
          finary_patrimony_estimate: enrichedData.patrimony_estimate,
        }),
        ...(enrichedData.monthly_income !== undefined && {
          finary_monthly_income: enrichedData.monthly_income,
        }),
      }),
    );

    // ── Step 5: Create note + tasks in parallel ───────────────────────────────
    const today = new Date();

    const llmTasks = recapData.tasks.map((t) => ({
      subject: t.subject,
      body: t.body,
      priority: t.priority,
      dueDate: addDays(today, t.due_in_days).toISOString(),
      contactId,
      ...(ownerId != null ? { ownerId } : {}),
    }));

    const mandatoryFollowUp = {
      subject: 'Suivi automatique — Relance client (J+3)',
      body: buildFollowUpBody(recapData),
      priority: 'MEDIUM' as const,
      dueDate: addDays(today, 3).toISOString(),
      contactId,
      ...(ownerId != null ? { ownerId } : {}),
    };

    const [noteId, taskIds] = await Promise.all([
      step.run('create-recap-note', () =>
        createContactNote(hubspot, contactId, buildNoteBody(recapData), ownerId ?? undefined),
      ),
      step.run('create-hubspot-tasks', () =>
        createContactTasks(hubspot, [...llmTasks, mandatoryFollowUp]),
      ),
    ]);

    return {
      status: 'completed',
      contactId,
      noteId,
      taskIds,
      tasksCreated: llmTasks.length + 1,
    };
  },
);

// ─── Formatters ───────────────────────────────────────────────────────────────

function buildNoteBody(recap: RecapOutput): string {
  const lines: string[] = [
    `## Récapitulatif d'appel — ${new Date().toLocaleDateString('fr-FR')}`,
    '',
    '### Résumé',
    recap.conversation_summary,
    '',
  ];

  if (recap.key_points.length > 0) {
    lines.push('### Points clés');
    recap.key_points.forEach((p) => lines.push(`• ${p}`));
    lines.push('');
  }

  if (recap.client_concerns.length > 0) {
    lines.push('### Préoccupations du client');
    recap.client_concerns.forEach((c) => lines.push(`• ${c}`));
    lines.push('');
  }

  if (recap.advisor_commitments.length > 0) {
    lines.push("### Engagements de l'advisor");
    recap.advisor_commitments.forEach((c) => lines.push(`• ${c}`));
    lines.push('');
  }

  if (recap.next_steps.length > 0) {
    lines.push('### Prochaines étapes');
    recap.next_steps.forEach((s) => lines.push(`• ${s}`));
  }

  return lines.join('\n');
}

function buildFollowUpBody(recap: RecapOutput): string {
  const summary = recap.conversation_summary.slice(0, 300);
  return `Suivi automatique généré après l'appel.\n\nRésumé : ${summary}${recap.conversation_summary.length > 300 ? '...' : ''}`;
}
