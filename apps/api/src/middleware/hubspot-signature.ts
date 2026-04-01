import crypto from 'crypto';

const MAX_REQUEST_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Validates a HubSpot webhook request using signature v3.
 * https://developers.hubspot.com/docs/api/webhooks/validating-requests
 *
 * Signature is computed as HMAC-SHA256 of: METHOD + URI + body + timestamp
 */
export async function validateHubSpotSignature(request: Request): Promise<boolean> {
  const secret = process.env['HUBSPOT_WEBHOOK_SECRET'];

  if (!secret) {
    if (process.env['NODE_ENV'] !== 'production') {
      // Allow unsigned requests in dev when secret is not configured
      return true;
    }
    console.error('[HubSpot] HUBSPOT_WEBHOOK_SECRET is not set');
    return false;
  }

  const signature = request.headers.get('X-HubSpot-Signature-v3');
  const timestamp = request.headers.get('X-HubSpot-Request-Timestamp');

  if (!signature || !timestamp) {
    return false;
  }

  const requestAge = Date.now() - parseInt(timestamp, 10);
  if (requestAge > MAX_REQUEST_AGE_MS) {
    return false;
  }

  const body = await request.clone().text();
  const sourceString = `POST${request.url}${body}${timestamp}`;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(sourceString)
    .digest('base64');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    // timingSafeEqual throws if buffers have different lengths
    return false;
  }
}
