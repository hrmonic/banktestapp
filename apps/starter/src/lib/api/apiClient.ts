import type { ClientConfig } from "../config/clientConfig";

export interface ApiRequestOptions extends RequestInit {
  /**
   * Timeout en millisecondes pour la requête.
   * Si non fourni, on utilise le timeout défini dans la config API.
   */
  timeoutMs?: number;
}

export interface ApiClient {
  get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse>;
  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions,
  ): Promise<TResponse>;
  delete<TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse>;
}

async function requestJson<TResponse>(
  method: string,
  url: string,
  body?: unknown,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 10_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      // On jette une erreur explicite, exploitable par les appels d'adaptateurs.
      throw new Error(`API error ${response.status} for ${url}`);
    }

    // On suppose du JSON pour simplifier la démo.
    return (await response.json()) as TResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fabrique un client API simple à partir de la config client.
 * Ce wrapper est volontairement minimaliste pour rester pédagogique.
 */
export function createApiClient(config: ClientConfig): ApiClient {
  const baseUrl = config.api.baseUrl.replace(/\/+$/, "");
  const defaultTimeout = config.api.timeout ?? 10_000;

  const buildUrl = (path: string) => {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  return {
    get: (path, options) =>
      requestJson("GET", buildUrl(path), undefined, {
        timeoutMs: defaultTimeout,
        ...options,
      }),
    post: (path, body, options) =>
      requestJson("POST", buildUrl(path), body, {
        timeoutMs: defaultTimeout,
        ...options,
      }),
    put: (path, body, options) =>
      requestJson("PUT", buildUrl(path), body, {
        timeoutMs: defaultTimeout,
        ...options,
      }),
    delete: (path, options) =>
      requestJson("DELETE", buildUrl(path), undefined, {
        timeoutMs: defaultTimeout,
        ...options,
      }),
  };
}

