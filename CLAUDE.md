# Finary — Automation Pipeline

Turborepo monorepo. Hono API deployed on Vercel. Inngest for durable pipeline steps. Vercel AI SDK with Claude for LLM calls.

## Structure

```
apps/
  api/               → Hono HTTP server (Vercel serverless)
packages/
  types/             → Zod schemas — single source of truth for all types
  logic/             → Business logic: HubSpot client, LLM calls, Inngest function
```

## Key Conventions

- **Zod is the only source of truth.** All types are `z.infer<typeof Schema>`. Never write manual `interface` or `type` outside of Zod.
- **No `any`.** TypeScript strict mode is enforced.
- **`@finary/types`** is a pure data-types package — no runtime logic, no side effects. Only Zod schemas and their inferred types.
- **`@finary/logic`** owns all business logic. The API layer only orchestrates: parse → validate → delegate to logic.
- **Imports across packages** use workspace aliases (`@finary/types`, `@finary/logic`). Path mappings in each `tsconfig.json` resolve to source files for dev.

## Pipeline Flow

```
POST /api/webhook/hubspot
  ├── Validate HubSpot signature (X-HubSpot-Signature-v3)
  ├── Parse + validate body with Zod
  ├── Check ?isNextClient=true query param
  ├── Fetch contact from HubSpot
  ├── Check finary_pipeline_started is empty (first run guard)
  └── inngest.send("hubspot/call.ended") → pipeline starts

Inngest: contactPipelineFunction
  ├── step: mark-pipeline-started        → sets finary_pipeline_started on contact
  ├── step: fetch-contact-notes          → finds #TRANSCRIPT note + all other notes
  ├── step (parallel):
  │   ├── llm-data-enrich                → Claude extracts financial profile from transcript
  │   └── llm-recap-tasks               → Claude generates recap + task list from transcript + notes
  ├── step: update-contact-enriched-data → PATCH contact with extracted profile data
  └── step (parallel):
      ├── create-recap-note              → POST note with formatted recap
      └── create-hubspot-tasks          → POST all LLM tasks + mandatory J+3 follow-up
```

## HubSpot Custom Properties

These must be created in HubSpot before use (Settings → Properties → Contact properties):

| Property name                  | Type   | Description                              |
|-------------------------------|--------|------------------------------------------|
| `finary_pipeline_started`     | string | ISO date of first pipeline run (guard)   |
| `finary_age`                  | string | Age extracted from transcript            |
| `finary_financial_situation`  | string | Financial situation summary              |
| `finary_investment_goals`     | string | Investment objectives                    |
| `finary_risk_tolerance`       | string | low / medium / high                      |
| `finary_patrimony_estimate`   | string | Patrimony range (e.g. "250k-500k EUR")   |
| `finary_monthly_income`       | string | Monthly income estimate                  |

## HubSpot Workflow Setup

1. Trigger: Call completed (or custom trigger "Alexis raccroche")
2. Action: **Send a webhook**
   - URL: `https://<your-domain>/api/webhook/hubspot?isNextClient=true`
   - Method: POST
   - Include properties: `contactId`, `email`, `firstname`, `lastname`, `hubspot_owner_id`, `finary_pipeline_started`

## Environment Variables

See `.env.example`. All vars are required in production.

## Commands

```bash
npm install          # Install all workspace deps
npm run dev          # Start all apps in watch mode
npm run build        # Build all packages + apps
npm run typecheck    # Type check all packages
npm run test         # Run all tests
```

## Adding a New Pipeline Step

1. Add a Zod schema for its output in `packages/types/src/`
2. Add the implementation in `packages/logic/src/`
3. Add `step.run(...)` call in `packages/logic/src/pipeline/automation.ts`
4. Export from `packages/logic/src/index.ts` if needed externally
