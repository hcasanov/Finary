import { z } from 'zod';

// ─── Contact ──────────────────────────────────────────────────────────────────

// HubSpot returns null for unset properties — nullish() accepts both null and undefined
const hs = z.string().nullish();

export const HubSpotContactPropertiesSchema = z.object({
  // Standard HubSpot contact fields
  firstname: hs,
  lastname: hs,
  email: hs,
  phone: hs,
  company: hs,
  jobtitle: hs,
  lifecyclestage: hs,
  hs_lead_status: hs,
  hs_object_id: hs,
  hubspot_owner_id: hs,
  createdate: hs,
  lastmodifieddate: hs,
  // Custom Finary properties — must be created in HubSpot first
  finary_pipeline_started: hs,
  finary_age: hs,
  finary_financial_situation: hs,
  finary_investment_goals: hs,
  finary_risk_tolerance: hs,
  finary_patrimony_estimate: hs,
  finary_monthly_income: hs,
});

export type HubSpotContactProperties = z.infer<typeof HubSpotContactPropertiesSchema>;

export const HubSpotContactSchema = z.object({
  id: z.string(),
  properties: HubSpotContactPropertiesSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type HubSpotContact = z.infer<typeof HubSpotContactSchema>;

// ─── Webhook ──────────────────────────────────────────────────────────────────

/**
 * Payload sent by a HubSpot Workflow "Send webhook" action.
 * The workflow is configured to include relevant contact properties as flat fields.
 */
export const HubSpotWebhookBodySchema = z
  .object({
    contactId: z.coerce.string(),
    portalId: z.coerce.string().optional(),
    email: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    hubspot_owner_id: z.string().optional(),
    finary_pipeline_started: z.string().optional(),
  })
  .passthrough();

export type HubSpotWebhookBody = z.infer<typeof HubSpotWebhookBodySchema>;

export const WebhookQuerySchema = z.object({
  isNextClient: z.string().optional(),
});

export type WebhookQuery = z.infer<typeof WebhookQuerySchema>;

// ─── Notes ────────────────────────────────────────────────────────────────────

export const HubSpotNotePropertiesSchema = z.object({
  hs_note_body: z.string(),
  hs_createdate: z.string().optional(),
  hubspot_owner_id: z.string().optional(),
});

export type HubSpotNoteProperties = z.infer<typeof HubSpotNotePropertiesSchema>;

export const HubSpotNoteSchema = z.object({
  id: z.string(),
  properties: HubSpotNotePropertiesSchema,
});

export type HubSpotNote = z.infer<typeof HubSpotNoteSchema>;

export const HubSpotNotesListSchema = z.object({
  results: z.array(HubSpotNoteSchema),
  paging: z
    .object({
      next: z.object({ after: z.string() }).optional(),
    })
    .optional(),
});

export const HubSpotAssociationResultSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
    }),
  ),
});

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const CreateHubSpotTaskSchema = z.object({
  subject: z.string().min(1),
  body: z.string().optional(),
  priority: TaskPrioritySchema.default('MEDIUM'),
  dueDate: z.string(), // ISO datetime
  contactId: z.string(),
  ownerId: z.string().optional(),
});

export type CreateHubSpotTask = z.infer<typeof CreateHubSpotTaskSchema>;
