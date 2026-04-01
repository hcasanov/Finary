"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecapOutputSchema = exports.LlmTaskSchema = exports.EnrichmentOutputSchema = void 0;
const zod_1 = require("zod");
// ─── Enrichment Output ────────────────────────────────────────────────────────
exports.EnrichmentOutputSchema = zod_1.z.object({
    firstname: zod_1.z.string().optional().describe('First name if mentioned in the transcript'),
    lastname: zod_1.z.string().optional().describe('Last name if mentioned in the transcript'),
    age: zod_1.z.number().int().positive().optional().describe('Age in years'),
    financial_situation: zod_1.z
        .string()
        .optional()
        .describe('Summary of the client current financial situation'),
    investment_goals: zod_1.z
        .string()
        .optional()
        .describe('Investment objectives and goals expressed by the client'),
    risk_tolerance: zod_1.z
        .enum(['low', 'medium', 'high'])
        .optional()
        .describe('Risk tolerance level inferred from the conversation'),
    patrimony_estimate: zod_1.z
        .string()
        .optional()
        .describe('Estimated total patrimony (e.g. "250k–500k EUR")'),
    monthly_income: zod_1.z.string().optional().describe('Monthly income estimate'),
    current_investments: zod_1.z
        .string()
        .optional()
        .describe('Description of current investment portfolio'),
    key_concerns: zod_1.z.string().optional().describe('Main concerns or objections raised by the client'),
    additional_notes: zod_1.z
        .string()
        .optional()
        .describe('Any other relevant information for the advisor'),
});
// ─── Recap + Tasks Output ─────────────────────────────────────────────────────
exports.LlmTaskSchema = zod_1.z.object({
    subject: zod_1.z.string().describe('Short, action-oriented task title'),
    body: zod_1.z.string().describe('Detailed description of what needs to be done'),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Task priority'),
    due_in_days: zod_1.z
        .number()
        .int()
        .positive()
        .describe('Number of days from today when this task should be completed'),
});
exports.RecapOutputSchema = zod_1.z.object({
    conversation_summary: zod_1.z
        .string()
        .describe('Comprehensive summary of the call and all context from notes'),
    key_points: zod_1.z.array(zod_1.z.string()).describe('Main bullet points from the conversation'),
    client_concerns: zod_1.z
        .array(zod_1.z.string())
        .describe('Concerns or objections raised by the client'),
    advisor_commitments: zod_1.z
        .array(zod_1.z.string())
        .describe('Commitments the advisor made during the call'),
    next_steps: zod_1.z.array(zod_1.z.string()).describe('Agreed next steps between advisor and client'),
    tasks: zod_1.z
        .array(exports.LlmTaskSchema)
        .describe('HubSpot tasks to create — exclude the mandatory J+3 follow-up, it is added automatically'),
});
//# sourceMappingURL=llm.js.map