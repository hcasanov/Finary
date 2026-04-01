"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHubSpotTaskSchema = exports.TaskPrioritySchema = exports.HubSpotAssociationResultSchema = exports.HubSpotNotesListSchema = exports.HubSpotNoteSchema = exports.HubSpotNotePropertiesSchema = exports.WebhookQuerySchema = exports.HubSpotWebhookBodySchema = exports.HubSpotContactSchema = exports.HubSpotContactPropertiesSchema = void 0;
const zod_1 = require("zod");
// ─── Contact ──────────────────────────────────────────────────────────────────
exports.HubSpotContactPropertiesSchema = zod_1.z.object({
    firstname: zod_1.z.string().optional(),
    lastname: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    jobtitle: zod_1.z.string().optional(),
    lifecyclestage: zod_1.z.string().optional(),
    hs_lead_status: zod_1.z.string().optional(),
    hs_object_id: zod_1.z.string().optional(),
    hubspot_owner_id: zod_1.z.string().optional(),
    // Custom Finary properties — must be created in HubSpot first
    finary_pipeline_started: zod_1.z.string().optional(),
    finary_age: zod_1.z.string().optional(),
    finary_financial_situation: zod_1.z.string().optional(),
    finary_investment_goals: zod_1.z.string().optional(),
    finary_risk_tolerance: zod_1.z.string().optional(),
    finary_patrimony_estimate: zod_1.z.string().optional(),
    finary_monthly_income: zod_1.z.string().optional(),
});
exports.HubSpotContactSchema = zod_1.z.object({
    id: zod_1.z.string(),
    properties: exports.HubSpotContactPropertiesSchema,
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
});
// ─── Webhook ──────────────────────────────────────────────────────────────────
/**
 * Payload sent by a HubSpot Workflow "Send webhook" action.
 * The workflow is configured to include relevant contact properties as flat fields.
 */
exports.HubSpotWebhookBodySchema = zod_1.z
    .object({
    contactId: zod_1.z.coerce.string(),
    portalId: zod_1.z.coerce.string().optional(),
    email: zod_1.z.string().optional(),
    firstname: zod_1.z.string().optional(),
    lastname: zod_1.z.string().optional(),
    hubspot_owner_id: zod_1.z.string().optional(),
    finary_pipeline_started: zod_1.z.string().optional(),
})
    .passthrough();
exports.WebhookQuerySchema = zod_1.z.object({
    isNextClient: zod_1.z.string().optional(),
});
// ─── Notes ────────────────────────────────────────────────────────────────────
exports.HubSpotNotePropertiesSchema = zod_1.z.object({
    hs_note_body: zod_1.z.string(),
    hs_createdate: zod_1.z.string().optional(),
    hubspot_owner_id: zod_1.z.string().optional(),
});
exports.HubSpotNoteSchema = zod_1.z.object({
    id: zod_1.z.string(),
    properties: exports.HubSpotNotePropertiesSchema,
});
exports.HubSpotNotesListSchema = zod_1.z.object({
    results: zod_1.z.array(exports.HubSpotNoteSchema),
    paging: zod_1.z
        .object({
        next: zod_1.z.object({ after: zod_1.z.string() }).optional(),
    })
        .optional(),
});
exports.HubSpotAssociationResultSchema = zod_1.z.object({
    results: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.string(),
    })),
});
// ─── Tasks ────────────────────────────────────────────────────────────────────
exports.TaskPrioritySchema = zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']);
exports.CreateHubSpotTaskSchema = zod_1.z.object({
    subject: zod_1.z.string().min(1),
    body: zod_1.z.string().optional(),
    priority: exports.TaskPrioritySchema.default('MEDIUM'),
    dueDate: zod_1.z.string(), // ISO datetime
    contactId: zod_1.z.string(),
    ownerId: zod_1.z.string().optional(),
});
//# sourceMappingURL=hubspot.js.map