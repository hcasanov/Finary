import { Hono } from 'hono';
import { inngest, createHubSpotClient, getContact } from '@finary/logic';
import { HubSpotWebhookBodySchema, WebhookQuerySchema, PIPELINE_EVENT_NAME } from '@finary/types';

export const webhookRouter = new Hono();

webhookRouter.post('/hubspot', async (c) => {
  // 1. Parse + validate request
  const rawBody = await c.req.json<unknown>();
  const rawQuery = c.req.query();

  const bodyResult = HubSpotWebhookBodySchema.safeParse(rawBody);
  if (!bodyResult.success) {
    return c.json(
      { error: 'Invalid payload', details: bodyResult.error.flatten() },
      400,
    );
  }

  const body = bodyResult.data;
  const query = WebhookQuerySchema.parse(rawQuery);

  // 2. Check isNextClient (query param takes precedence)
  const isNextClientRaw = query.isNextClient ?? undefined;
  const isNextClient = isNextClientRaw === 'true' || isNextClientRaw === '1';

  if (!isNextClient) {
    return c.json({ status: 'skipped', reason: 'isNextClient is not true' });
  }

  // 3. Fetch contact and verify this is the first pipeline run
  const hubspot = createHubSpotClient(process.env['HUBSPOT_ACCESS_TOKEN'] ?? '');
  const contact = await getContact(hubspot, body.contactId);

  if (contact.properties.finary_pipeline_started != null) {
    return c.json({
      status: 'skipped',
      reason: 'pipeline_already_started',
      startedAt: contact.properties.finary_pipeline_started,
    });
  }

  // 4. Trigger the Inngest pipeline
  await inngest.send({
    name: PIPELINE_EVENT_NAME,
    data: {
      contactId: body.contactId,
      portalId: body.portalId ?? '',
      ownerId: body.hubspot_owner_id ?? contact.properties.hubspot_owner_id ?? undefined,
      contactEmail: body.email ?? contact.properties.email,
      contactFirstname: body.firstname ?? contact.properties.firstname,
      contactLastname: body.lastname ?? contact.properties.lastname,
    },
  });

  return c.json({ status: 'triggered', contactId: body.contactId }, 202);
});
