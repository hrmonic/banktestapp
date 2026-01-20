import { z } from "zod";

/**
 * Schéma de validation pour client.config.json.
 * Ce schéma reste volontairement simple pour ne pas rigidifier
 * la démo, tout en capturant les erreurs les plus fréquentes.
 */
export const brandingSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
});

export const moduleConfigSchema = z.object({
  enabled: z.boolean().optional(),
});

export const modulesSchema = z.record(z.string(), moduleConfigSchema);

export const apiSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().int().positive().optional(),
});

export const authSchema = z.object({
  type: z.string().min(1),
  issuer: z.string().url(),
  clientId: z.string().min(1),
});

export const clientConfigSchema = z.object({
  branding: brandingSchema,
  modules: modulesSchema,
  api: apiSchema,
  auth: authSchema.optional(),
});

export function parseClientConfig(raw) {
  return clientConfigSchema.parse(raw);
}


