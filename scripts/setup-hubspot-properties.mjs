import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const HUBSPOT_API_KEY = env["HUBSPOT_ACCESS_TOKEN"] ?? env["US-API-KEY"];

if (!HUBSPOT_API_KEY) {
  console.error("Missing HUBSPOT_ACCESS_TOKEN in .env");
  process.exit(1);
}

const PROPERTIES = [
  {
    name: "finary_pipeline_started",
    label: "Finary Pipeline Started",
    description: "ISO date of first pipeline run (duplicate guard)",
    fieldType: "text",
    type: "string",
  },
  {
    name: "finary_age",
    label: "Finary Age",
    description: "Client age extracted from call transcript",
    fieldType: "text",
    type: "string",
  },
  {
    name: "finary_financial_situation",
    label: "Finary Financial Situation",
    description: "Client financial situation extracted from call transcript",
    fieldType: "textarea",
    type: "string",
  },
  {
    name: "finary_investment_goals",
    label: "Finary Investment Goals",
    description: "Client investment goals extracted from call transcript",
    fieldType: "textarea",
    type: "string",
  },
  {
    name: "finary_risk_tolerance",
    label: "Finary Risk Tolerance",
    description: "Client risk tolerance extracted from call transcript",
    fieldType: "text",
    type: "string",
  },
  {
    name: "finary_patrimony_estimate",
    label: "Finary Patrimony Estimate",
    description: "Client patrimony estimate extracted from call transcript",
    fieldType: "text",
    type: "string",
  },
  {
    name: "finary_monthly_income",
    label: "Finary Monthly Income",
    description: "Client monthly income extracted from call transcript",
    fieldType: "text",
    type: "string",
  },
];

for (const prop of PROPERTIES) {
  const res = await fetch(
    "https://api.hubapi.com/crm/v3/properties/contacts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: prop.name,
        label: prop.label,
        description: prop.description,
        fieldType: prop.fieldType,
        type: prop.type,
        groupName: "contactinformation",
      }),
    },
  );

  if (res.ok) {
    console.log(`✓ Created: ${prop.name}`);
  } else {
    const body = await res.json();
    if (body.category === "CONFLICT") {
      console.log(`~ Already exists: ${prop.name}`);
    } else {
      console.error(`✗ Failed: ${prop.name} →`, body.message);
    }
  }
}
