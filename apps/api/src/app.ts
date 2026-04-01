import { Hono } from 'hono';
import { serve } from 'inngest/hono';
import { inngest, contactPipelineFunction } from '@finary/logic';
import { webhookRouter } from './routes/webhook';

const app = new Hono();

// ── Inngest endpoint ──────────────────────────────────────────────────────────
// Local:  http://localhost:3000/inngest
// Vercel: https://<domain>/api/inngest  (basePath added in api/index.ts)
app.use('/inngest', serve({ client: inngest, functions: [contactPipelineFunction] }));

// ── Webhook routes ────────────────────────────────────────────────────────────
// Local:  POST http://localhost:3000/webhook/hubspot
// Vercel: POST https://<domain>/api/webhook/hubspot
app.route('/webhook', webhookRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

export { app };
