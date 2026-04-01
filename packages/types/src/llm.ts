import { z } from 'zod';

// ─── Enrichment Output ────────────────────────────────────────────────────────

export const EnrichmentOutputSchema = z.object({
  firstname: z.string().optional().describe('First name if mentioned in the transcript'),
  lastname: z.string().optional().describe('Last name if mentioned in the transcript'),
  age: z.number().int().positive().optional().describe('Age in years'),
  financial_situation: z
    .string()
    .optional()
    .describe('Summary of the client current financial situation'),
  investment_goals: z
    .string()
    .optional()
    .describe('Investment objectives and goals expressed by the client'),
  risk_tolerance: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('Risk tolerance level inferred from the conversation'),
  patrimony_estimate: z
    .string()
    .optional()
    .describe('Estimated total patrimony (e.g. "250k–500k EUR")'),
  monthly_income: z.string().optional().describe('Monthly income estimate'),
  current_investments: z
    .string()
    .optional()
    .describe('Description of current investment portfolio'),
  key_concerns: z.string().optional().describe('Main concerns or objections raised by the client'),
  additional_notes: z
    .string()
    .optional()
    .describe('Any other relevant information for the advisor'),
});

export type EnrichmentOutput = z.infer<typeof EnrichmentOutputSchema>;

// ─── Recap + Tasks Output ─────────────────────────────────────────────────────

export const LlmTaskSchema = z.object({
  subject: z.string().describe('Short, action-oriented task title'),
  body: z.string().describe('Detailed description of what needs to be done'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Task priority'),
  due_in_days: z
    .number()
    .int()
    .positive()
    .describe('Number of days from today when this task should be completed'),
});

export type LlmTask = z.infer<typeof LlmTaskSchema>;

export const RecapOutputSchema = z.object({
  conversation_summary: z
    .string()
    .describe('Comprehensive summary of the call and all context from notes'),
  key_points: z.array(z.string()).describe('Main bullet points from the conversation'),
  client_concerns: z
    .array(z.string())
    .describe('Concerns or objections raised by the client'),
  advisor_commitments: z
    .array(z.string())
    .describe('Commitments the advisor made during the call'),
  next_steps: z.array(z.string()).describe('Agreed next steps between advisor and client'),
  tasks: z
    .array(LlmTaskSchema)
    .describe(
      'HubSpot tasks to create — exclude the mandatory J+3 follow-up, it is added automatically',
    ),
});

export type RecapOutput = z.infer<typeof RecapOutputSchema>;
