/**
 * Hook de chargement et de validation de la configuration client.
 * Lit la config depuis ConfigContext (fourni par ConfigProvider au root).
 */
import { useConfigContext } from './config/ConfigContext';

export type UseClientConfigResult = ReturnType<typeof useConfigContext>;

/**
 * Expose la config client (chargée par ConfigProvider au démarrage).
 */
export function useClientConfig(): UseClientConfigResult {
  return useConfigContext();
}

export default useClientConfig;
