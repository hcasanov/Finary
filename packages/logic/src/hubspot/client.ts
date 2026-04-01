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
      throw new Error(`HubSpot API ${method} ${path} → ${response.status}: ${errorText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json() as T;

    return data;
  }

  return { request };
}
