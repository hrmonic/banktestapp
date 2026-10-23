/**
 * Événement d'audit de démo.
 */
export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  action: string;
  resource: string;
  details: string;
};
