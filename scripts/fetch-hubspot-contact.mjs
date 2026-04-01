import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env file
function loadEnv(envPath) {
  const content = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed
      .slice(eqIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

const env = loadEnv(resolve(__dirname, "../.env"));
const HUBSPOT_API_KEY = env["HUBSPOT_ACCESS_TOKEN"];

if (!HUBSPOT_API_KEY) {
  console.error("Missing HUBSPOT_ACCESS_TOKEN in .env");
  process.exit(1);
}

const CONTACT_ID = "742724066530";
const LOCAL_SERVER = "http://localhost:3000";

// 1. Fetch contact from HubSpot
const hubspotRes = await fetch(
  `https://api.hubapi.com/crm/v3/objects/contacts/${CONTACT_ID}?properties=firstname,lastname,email,phone,company`,
  {
    headers: {
      Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
    },
  },
);

if (!hubspotRes.ok) {
  const error = await hubspotRes.text();
  console.error(`HubSpot API error ${hubspotRes.status}:`, error);
  process.exit(1);
}

const contact = await hubspotRes.json();

// 2. Fetch associated notes
const assocRes = await fetch(
  `https://api.hubapi.com/crm/v3/objects/contacts/${CONTACT_ID}/associations/notes`,
  {
    headers: {
      Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
    },
  },
);

let notes = [];
if (assocRes.ok) {
  const assocData = await assocRes.json();
  const noteIds = assocData.results?.map((r) => r.id) ?? [];

  if (noteIds.length > 0) {
    const batchRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/notes/batch/read",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: ["hs_note_body", "hs_timestamp", "hubspot_owner_id"],
          inputs: noteIds.map((id) => ({ id })),
        }),
      },
    );

    if (batchRes.ok) {
      const batchData = await batchRes.json();
      notes = batchData.results ?? [];
    }
  }
}

// 3. Build the webhook payload — flatten contact properties + add contactId
const payload = {
  contactId: contact.id,
  ...contact.properties,
  notes,
};

console.log("Contact + notes fetched:");
console.log(JSON.stringify(payload, null, 2));

// 4. Send to local webhook endpoint
const webhookUrl = `${LOCAL_SERVER}/webhook/hubspot?isNextClient=true`;
console.log(`\nSending to ${webhookUrl} ...`);

const localRes = await fetch(webhookUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const responseText = await localRes.text();

if (!localRes.ok) {
  console.error(`Local server error ${localRes.status}:`, responseText);
  process.exit(1);
}

console.log(`Response ${localRes.status}:`, responseText);
