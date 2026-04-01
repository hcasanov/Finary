import { HubSpotContactSchema, HubSpotContactPropertiesSchema } from '@finary/types';
import type { HubSpotContact } from '@finary/types';
import type { HubSpotClient } from './client';
import type { z } from 'zod';

const CONTACT_PROPERTIES = [
  'firstname',
  'lastname',
  'email',
  'phone',
  'company',
  'jobtitle',
  'lifecyclestage',
  'hs_lead_status',
  'hubspot_owner_id',
  'finary_pipeline_started',
  'finary_age',
  'finary_financial_situation',
  'finary_investment_goals',
  'finary_risk_tolerance',
  'finary_patrimony_estimate',
  'finary_monthly_income',
].join(',');

export async function getContact(
  client: HubSpotClient,
  contactId: string,
): Promise<HubSpotContact> {
  const raw = await client.request<unknown>(`/crm/v3/objects/contacts/${contactId}`, {
    params: { properties: CONTACT_PROPERTIES },
  });
  return HubSpotContactSchema.parse(raw);
}

export async function updateContact(
  client: HubSpotClient,
  contactId: string,
  properties: Partial<z.infer<typeof HubSpotContactPropertiesSchema>>,
): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([, v]) => v !== undefined && v !== null),
  );
  if (Object.keys(clean).length === 0) return;

  await client.request(`/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    body: { properties: clean },
  });
}

export async function markPipelineStarted(
  client: HubSpotClient,
  contactId: string,
): Promise<void> {
  await updateContact(client, contactId, {
    finary_pipeline_started: new Date().toISOString(),
  });
}
