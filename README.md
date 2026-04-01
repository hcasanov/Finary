# Finary — Automation Pipeline

## Prérequis

- Node.js >= 22
- pnpm

```bash
npm install -g pnpm
```

## Installation

```bash
pnpm install
```

## Configuration

Copie `.env.example` en `.env` et remplis les variables :

```bash
cp .env.example .env
```

Deux variables sont obligatoires pour faire tourner l'app :

- `HUBSPOT_ACCESS_TOKEN` — Token HubSpot Private App (`pat-eu1-...`), disponible dans HubSpot → Settings → Integrations → Private Apps
- `GOOGLE_GENERATIVE_AI_API_KEY` — Clé API Google Gemini, disponible sur [Google AI Studio](https://aistudio.google.com/app/apikey)

Variables optionnelles (prod uniquement) :

| Variable                    | Description                                  |
|-----------------------------|----------------------------------------------|
| `HUBSPOT_WEBHOOK_SECRET`    | Secret pour valider les signatures HubSpot   |
| `INNGEST_EVENT_KEY`         | Clé Inngest                                  |
| `INNGEST_SIGNING_KEY`       | Signing key Inngest                          |

## Setup HubSpot

Crée les propriétés custom sur le compte HubSpot (à faire une seule fois) :

```bash
node scripts/setup-hubspot-properties.mjs
```

## Lancer l'app en local

### 1. Serveur API

```bash
npm run dev
```

Démarre le serveur Hono sur `http://localhost:3000`.

### 2. Serveur Inngest

Dans un second terminal :

```bash
npm run inngest
```

Démarre le dev server Inngest et le connecte à `http://localhost:3000/inngest`.  
L'UI est disponible sur `http://localhost:8288`.

### 3. Tester le webhook manuellement

S'assurer que le serveur API (étape 1) et le serveur Inngest (étape 2) tournent, puis :

```bash
node scripts/fetch-hubspot-contact.mjs
```

Le script :
1. Récupère le contact et ses notes depuis HubSpot
2. Affiche le payload JSON dans la console
3. Envoie le payload en POST à `http://localhost:3000`

Le pipeline Inngest se déclenche automatiquement — suivre l'exécution sur `http://localhost:8288`.
