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

| Variable                    | Description                                  |
|-----------------------------|----------------------------------------------|
| `HUBSPOT_ACCESS_TOKEN`      | Token HubSpot Private App (pat-eu1-...)      |
| `HUBSPOT_WEBHOOK_SECRET`    | Secret pour valider les signatures HubSpot   |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Clé API Google Gemini                     |
| `INNGEST_EVENT_KEY`         | Clé Inngest (prod uniquement)                |
| `INNGEST_SIGNING_KEY`       | Signing key Inngest (prod uniquement)        |

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

Démarre le dev server Inngest et le connecte à `http://localhost:3000/api/inngest`.  
L'UI est disponible sur `http://localhost:8288`.

### 3. Tester le webhook manuellement

Pour simuler un appel HubSpot entrant (contact ID à adapter) :

```bash
node scripts/fetch-hubspot-contact.mjs
```

Récupère le contact et ses notes depuis HubSpot et envoie le payload à `http://localhost:3000`.
