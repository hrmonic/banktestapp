import type { z } from "zod";
import { clientConfigSchema, parseClientConfig } from "../configSchema.js";

/**
 * Type fort pour la configuration client, dérivé du schéma zod.
 */
export type ClientConfig = z.infer<typeof clientConfigSchema>;

/**
 * Valide une configuration brute au regard du schéma partagé.
 * À utiliser côté client pour s'assurer que la config chargée est cohérente.
 */
export function validateClientConfig(raw: unknown): ClientConfig {
  return parseClientConfig(raw);
}

