/**
 * Adaptateur Audit : démo ou API réelle.
 */
import type { ApiClient } from '../api/apiClient';
import type { AuditEvent } from '../../modules/audit/types';

const DEMO_EVENTS: AuditEvent[] = [
  {
    id: 'EVT-001',
    at: '2026-01-18 09:12',
    actor: 'admin-backoffice',
    action: 'Changement de rôle',
    resource: 'USR-003',
    details: 'Rôle mis à jour de agent-agence vers analyste-audit.',
  },
  {
    id: 'EVT-002',
    at: '2026-01-18 10:03',
    actor: 'manager-agence',
    action: 'Export rapport',
    resource: 'RPT-001',
    details: 'Rapport mensuel agence exporté au format PDF.',
  },
  {
    id: 'EVT-003',
    at: '2026-01-18 10:45',
    actor: 'analyste-audit',
    action: 'Consultation compte',
    resource: 'ACC-0003',
    details: 'Consulte le détail du compte client.',
  },
];

export type ListAuditParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function listAuditEvents(
  api: ApiClient | null,
  params: ListAuditParams = {}
): Promise<AuditEvent[]> {
  if (api) {
    const search = new URLSearchParams();
    if (params.search) search.set('search', params.search);
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<AuditEvent[]>(qs ? `/audit/events?${qs}` : '/audit/events');
  }
  await new Promise((r) => setTimeout(r, 150));
  let list = DEMO_EVENTS;
  if (params.search?.trim()) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (e) =>
        e.actor.toLowerCase().includes(s) ||
        e.action.toLowerCase().includes(s) ||
        e.resource.toLowerCase().includes(s) ||
        e.details.toLowerCase().includes(s)
    );
  }
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 50);
  return list.slice((page - 1) * limit, page * limit);
}
