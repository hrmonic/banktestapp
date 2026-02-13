/**
 * Contexte de configuration client (chargée une fois au démarrage).
 * Permet de choisir le provider d'auth (démo vs OIDC) selon la config.
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateClientConfig } from './clientConfig';
import type { ClientConfig } from './clientConfig';

export type ConfigContextValue = {
  config: ClientConfig | null;
  isLoading: boolean;
  error: Error | null;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

export type ConfigProviderProps = {
  children: React.ReactNode;
  /** Config injectée (tests) : skip fetch, utilise cette config. */
  initialConfig?: ClientConfig | null;
};

export function ConfigProvider({
  children,
  initialConfig,
}: ConfigProviderProps): React.ReactElement {
  const [config, setConfig] = useState<ClientConfig | null>(
    initialConfig ?? null
  );
  const [isLoading, setLoading] = useState(initialConfig === undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialConfig !== undefined) return;
    async function fetchConfig() {
      try {
        const res = await fetch('/client.config.json');
        if (!res.ok)
          throw new Error('Erreur lors du chargement de la configuration');
        const data = await res.json();
        const parsed = validateClientConfig(data);
        setConfig(parsed);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    void fetchConfig();
  }, [initialConfig]);

  const value: ConfigContextValue = { config, isLoading, error };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfigContext(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx)
    throw new Error('useConfigContext must be used within ConfigProvider');
  return ctx;
}
