/**
 * Schéma de validation Zod pour le formulaire de connexion.
 * Réutilisable pour tout formulaire nécessitant email + mot de passe.
 */
import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est obligatoire")
    .email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * Valide les champs du formulaire de connexion.
 * Retourne les erreurs par champ ou null si valide.
 */
export function validateLoginForm(values: {
  email: string;
  password: string;
}): Partial<Record<keyof LoginFormValues, string>> | null {
  const result = loginFormSchema.safeParse(values);
  if (result.success) return null;
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0] as keyof LoginFormValues;
    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}
