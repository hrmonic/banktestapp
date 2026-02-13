/**
 * Hook exposant les options / feature flags d'un module (config.modules[moduleId]).
 * Permet d'afficher ou masquer des sous-fonctionnalités (ex: export CSV).
 */
import { useClientConfig } from './useClientConfig';

export type ModuleOptions = Record<string, unknown> & {
  enabled?: boolean;
  exportEnabled?: boolean;
};

export function useFeatureFlags(moduleId: string): ModuleOptions {
  const { config } = useClientConfig();
  const moduleConfig = config?.modules?.[moduleId];
  if (!moduleConfig || typeof moduleConfig !== 'object') return {};
  return moduleConfig as ModuleOptions;
}
