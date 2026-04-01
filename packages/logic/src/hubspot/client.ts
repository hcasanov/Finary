type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string>;
}

export interface HubSpotClient {
  request: <T>(path: string, options?: RequestOptions) => Promise<T>;
}

export function createHubSpotClient(accessToken: string): HubSpotClient {
  const BASE_URL = 'https://api.hubapi.com';

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options;

    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
    }

    // Log outgoing request
    console.log(`[HubSpot] → ${method} ${path}`, {
      params: params ?? {},
      body: body ?? null,
    });

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[HubSpot] ✗ ${method} ${path} → ${response.status}`, errorText);
      throw new Error(`HubSpot API ${method} ${path} → ${response.status}: ${errorText}`);
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) {
      console.log(`[HubSpot] ← ${response.status} ${method} ${path} (no content)`);
      return undefined as T;
    }

    const data = await response.json() as T;

    // Log response — truncate arrays to avoid flooding the console
    console.log(`[HubSpot] ← ${response.status} ${method} ${path}`, JSON.stringify(data, null, 2));

    return data;
  }

  return { request };
}
