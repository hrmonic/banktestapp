/**
 * Adaptateur Transactions : démo ou API réelle.
 */
import type { ApiClient } from '../api/apiClient';

export type TransactionRow = {
  id: string;
  date: string;
  accountId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
};

const DEMO_TRANSACTIONS: TransactionRow[] = [
  {
    id: 'TRX-001',
    date: '2026-01-18 10:32',
    accountId: 'ACC-0001',
    type: 'Carte',
    amount: -54.9,
    currency: 'EUR',
    status: 'Confirmée',
  },
  {
    id: 'TRX-002',
    date: '2026-01-18 11:05',
    accountId: 'ACC-0002',
    type: 'Virement sortant',
    amount: -12500,
    currency: 'EUR',
    status: 'En attente',
  },
  {
    id: 'TRX-003',
    date: '2026-01-18 11:47',
    accountId: 'ACC-0003',
    type: 'Virement entrant',
    amount: 3200,
    currency: 'EUR',
    status: 'Confirmée',
  },
];

export type ListTransactionsParams = {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export async function listTransactions(
  api: ApiClient | null,
  params: ListTransactionsParams = {}
): Promise<TransactionRow[]> {
  if (api) {
    const search = new URLSearchParams();
    if (params.status) search.set('status', params.status);
    if (params.search) search.set('search', params.search);
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<TransactionRow[]>(
      qs ? `/transactions?${qs}` : '/transactions'
    );
  }
  await new Promise((r) => setTimeout(r, 250));
  let list = DEMO_TRANSACTIONS;
  if (params.status) list = list.filter((t) => t.status === params.status);
  if (params.search?.trim()) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.id.toLowerCase().includes(s) ||
        t.accountId.toLowerCase().includes(s) ||
        t.type.toLowerCase().includes(s)
    );
  }
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 50);
  return list.slice((page - 1) * limit, page * limit);
}
