/**
 * Demande d'approbation de démo.
 */
export type ApprovalRequest = {
  id: string;
  type: string;
  requester: string;
  amount: number;
  currency: string;
  status: string;
};
