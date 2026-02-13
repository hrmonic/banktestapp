/**
 * Hook exposant l'ApiClient quand la config est en mode API réelle (pas démo).
 * En mode démo, retourne null : les adaptateurs utilisent alors les mocks.
 */
import { useMemo } from 'react';
import { useClientConfig } from '../useClientConfig';
import { isDemoAuth } from '../config/clientConfig';
import { createApiClient, type ApiClient } from './apiClient';

export function useApiClient(): ApiClient | null {
  const { config } = useClientConfig();
  return useMemo(() => {
    if (!config || isDemoAuth(config)) return null;
    return createApiClient(config);
  }, [config]);
}
