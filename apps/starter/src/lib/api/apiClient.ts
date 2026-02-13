import type { ClientConfig } from '../config/clientConfig';
import { logApiError } from '../monitoring/logger';
import { handleApiError, ApiError } from './apiErrors';

export { ApiError } from './apiErrors';

/**
 * Client API : chemins relatifs uniquement (pas d'URL absolue).
 * Les adaptateurs (dashboardAdapter, accountsAdapter, etc.) doivent utiliser
 * createApiClient(config) en production pour tous les appels réseau.
 * En cas d'erreur HTTP, une ApiError (status, message, retryable) est levée.
 */

export interface ApiRequestOptions extends RequestInit {
  /**
   * Timeout en millisecondes pour la requête.
   * Si non fourni, on utilise le timeout défini dans la config API.
   */
  timeoutMs?: number;
}

export interface ApiClient {
  get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse>;
  /** GET binaire (ex. téléchargement rapport). En cas d'erreur HTTP, lance ApiError. */
  getBlob(path: string, options?: ApiRequestOptions): Promise<Blob>;
  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions
  ): Promise<TResponse>;
  delete<TResponse>(
    path: string,
    options?: ApiRequestOptions
  ): Promise<TResponse>;
}

type RetryConfig = { count: number; delayMs: number };

async function requestJsonOnce<TResponse>(
  method: string,
  url: string,
  body?: unknown,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 10_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    if (!response.ok) {
      let parsedBody: unknown;
      try {
        parsedBody = text ? JSON.parse(text) : undefined;
      } catch {
        parsedBody = undefined;
      }
      const path = (() => {
        try {
          return new URL(url).pathname;
        } catch {
          return url;
        }
      })();
      logApiError(response.status, path);
      const { message, retryable } = handleApiError(
        response.status,
        parsedBody
      );
      throw new ApiError(response.status, message, retryable, url);
    }

    return (text ? JSON.parse(text) : ({} as TResponse)) as TResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson<TResponse>(
  method: string,
  url: string,
  body?: unknown,
  options: ApiRequestOptions = {},
  retryConfig?: RetryConfig | null
): Promise<TResponse> {
  const maxAttempts =
    retryConfig && retryConfig.count > 0 ? retryConfig.count + 1 : 1;
  const delayMs = retryConfig?.delayMs ?? 1000;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestJsonOnce<TResponse>(method, url, body, options);
    } catch (err) {
      lastError = err;
      const isRetryable = err instanceof ApiError && err.retryable;
      const isNetworkError =
        err instanceof TypeError ||
        (err && (err as Error).name === 'AbortError');
      if ((isRetryable || isNetworkError) && attempt < maxAttempts) {
        await delay(delayMs);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

/**
 * Fabrique un client API simple à partir de la config client.
 * Ce wrapper est volontairement minimaliste.
 */
export function createApiClient(config: ClientConfig): ApiClient {
  const baseUrl = config.api.baseUrl.replace(/\/+$/, '');
  const defaultTimeout = config.api.timeout ?? 10_000;
  const retryConfig: RetryConfig | null =
    config.api.retry &&
    config.api.retry.count != null &&
    config.api.retry.count > 0
      ? {
          count: config.api.retry.count,
          delayMs: config.api.retry.delayMs ?? 1000,
        }
      : null;

  const buildUrl = (path: string) => {
    // Par sécurité, on n'autorise pas les URLs absolues ni les schémas dangereux.
    const trimmed = path.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      throw new Error(
        'Absolute URLs are not allowed in apiClient. Use relative paths instead.'
      );
    }
    if (trimmed.startsWith('//')) {
      throw new Error(
        'Protocol-relative URLs are not allowed in apiClient. Use relative paths instead.'
      );
    }
    // Rejet de tout schéma dangereux (javascript, data, vbscript, file, blob, etc.).
    if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) {
      throw new Error(
        'Dangerous URL schemes are not allowed in apiClient. Use relative paths instead.'
      );
    }
    // Liste blanche : seuls les chemins relatifs sont autorisés (pas de ':').
    if (trimmed.includes(':')) {
      throw new Error(
        'Only relative paths are allowed in apiClient. Path must not contain a scheme.'
      );
    }
    const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${baseUrl}${normalizedPath}`;
  };

  async function getBlob(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<Blob> {
    const url = buildUrl(path);
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const pathForLog = (() => {
          try {
            return new URL(url).pathname;
          } catch {
            return url;
          }
        })();
        logApiError(response.status, pathForLog);
        const { message, retryable } = handleApiError(
          response.status,
          undefined
        );
        throw new ApiError(response.status, message, retryable, url);
      }
      return response.blob();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  return {
    get: (path, options) =>
      requestJson(
        'GET',
        buildUrl(path),
        undefined,
        { timeoutMs: defaultTimeout, ...options },
        retryConfig
      ),
    getBlob,
    post: (path, body, options) =>
      requestJson(
        'POST',
        buildUrl(path),
        body,
        { timeoutMs: defaultTimeout, ...options },
        retryConfig
      ),
    put: (path, body, options) =>
      requestJson(
        'PUT',
        buildUrl(path),
        body,
        { timeoutMs: defaultTimeout, ...options },
        retryConfig
      ),
    delete: (path, options) =>
      requestJson(
        'DELETE',
        buildUrl(path),
        undefined,
        { timeoutMs: defaultTimeout, ...options },
        retryConfig
      ),
  };
}
