/**
 * Adaptateur Approbations : démo ou API réelle.
 */
import type { ApiClient } from '../api/apiClient';
import type { ApprovalRequest } from '../../modules/approvals/types';

const DEMO_APPROVALS: ApprovalRequest[] = [
  {
    id: 'APP-001',
    type: 'Augmentation plafond carte',
    requester: 'Dupont Marie',
    amount: 5000,
    currency: 'EUR',
    status: 'En attente',
  },
  {
    id: 'APP-002',
    type: 'Ouverture compte entreprise',
    requester: 'SAS TechFinance',
    amount: 0,
    currency: 'EUR',
    status: 'En attente',
  },
];

export async function listApprovals(
  api: ApiClient | null
): Promise<ApprovalRequest[]> {
  if (api) return api.get<ApprovalRequest[]>('/approvals');
  await new Promise((r) => setTimeout(r, 250));
  return [...DEMO_APPROVALS];
}

export async function approveApproval(
  api: ApiClient | null,
  id: string,
  _reason?: string
): Promise<void> {
  if (api) {
    await api.post(`/approvals/${id}/approve`, { reason: _reason });
    return;
  }
  await new Promise((r) => setTimeout(r, 400));
}

export async function rejectApproval(
  api: ApiClient | null,
  id: string,
  _reason?: string
): Promise<void> {
  if (api) {
    await api.post(`/approvals/${id}/reject`, { reason: _reason });
    return;
  }
  await new Promise((r) => setTimeout(r, 400));
}
