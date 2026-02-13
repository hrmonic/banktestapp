/**
 * Schéma de validation pour client.config.json (Zod).
 * Reste volontairement simple pour la démo tout en capturant les erreurs fréquentes.
 */
import { z } from 'zod';

export const brandingSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
});

export const moduleConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    /** Sous-fonctionnalités (ex: export CSV, approbation en masse) */
    exportEnabled: z.boolean().optional(),
  })
  .passthrough();

export const modulesSchema = z.record(z.string(), moduleConfigSchema);

export const apiRetrySchema = z.object({
  count: z.number().int().min(0).optional(),
  delayMs: z.number().int().min(0).optional(),
});

export const apiSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().int().positive().optional(),
  retry: apiRetrySchema.optional(),
});

export const authSchema = z.object({
  type: z.string().min(1),
  issuer: z.string().url(),
  clientId: z.string().min(1),
  /** "demo" = profil localStorage, pas de token ; "oidc" = redirect IDP, tokens en mémoire */
  mode: z.enum(['demo', 'oidc']).optional(),
});

export const sessionSchema = z.object({
  /** Timeout d'inactivité en minutes avant avertissement de déconnexion */
  idleTimeoutMinutes: z.number().int().positive().optional(),
  /** Secondes d'avertissement avant déconnexion automatique (countdown dans la modal) */
  warningBeforeLogoutSeconds: z.number().int().min(0).optional(),
});

export const clientConfigSchema = z.object({
  branding: brandingSchema,
  themeKey: z.string().optional(),
  modules: modulesSchema,
  api: apiSchema,
  auth: authSchema.optional(),
  session: sessionSchema.optional(),
});

export type ClientConfigRaw = z.infer<typeof clientConfigSchema>;

/**
 * Parse et valide une configuration brute. Lance en cas d'erreur.
 */
export function parseClientConfig(
  raw: unknown
): z.infer<typeof clientConfigSchema> {
  return clientConfigSchema.parse(raw);
}
