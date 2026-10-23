/**
 * Adaptateur de démo pour la liste et le détail des comptes.
 * En production, utiliser createApiClient pour appeler l’API.
 */
import type { ApiClient } from '../api/apiClient';
import type { Account } from '../../modules/accounts/types';

const DEMO_ACCOUNTS: Account[] = [
  {
    id: 'ACC-0001',
    holder: 'Dupont Marie',
    iban: 'FR76 3000 6000 0112 3456 7890 189',
    type: 'Courant',
    status: 'Actif',
    balance: 3540.75,
    currency: 'EUR',
  },
  {
    id: 'ACC-0002',
    holder: 'SAS TechFinance',
    iban: 'FR76 3000 6000 0223 4567 8901 234',
    type: 'Entreprise',
    status: 'Actif',
    balance: 987654.12,
    currency: 'EUR',
  },
  {
    id: 'ACC-0003',
    holder: 'Martin Paul',
    iban: 'FR76 1027 8060 9912 3456 7890 123',
    type: 'Épargne',
    status: 'Suspendu',
    balance: 12000.0,
    currency: 'EUR',
  },
  {
    id: 'ACC-0004',
    holder: 'Martin Sophie',
    iban: 'FR76 3000 6000 0334 5678 9012 345',
    type: 'Courant',
    status: 'Actif',
    balance: 2450.5,
    currency: 'EUR',
  },
];

export type ListAccountsParams = {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export async function listAccounts(
  api: ApiClient | null = null,
  params: ListAccountsParams = {}
): Promise<Account[]> {
  if (api) {
    const search = new URLSearchParams();
    if (params.status) search.set('status', params.status);
    if (params.search) search.set('search', params.search);
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<Account[]>(qs ? `/accounts?${qs}` : '/accounts');
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  let list = DEMO_ACCOUNTS;
  if (params.status) {
    list = list.filter((a) => a.status === params.status);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.holder.toLowerCase().includes(s) ||
        a.iban.replace(/\s/g, '').toLowerCase().includes(s) ||
        a.id.toLowerCase().includes(s)
    );
  }
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 50);
  const start = (page - 1) * limit;
  return list.slice(start, start + limit);
}

export async function getAccountById(
  id: string,
  api: ApiClient | null = null
): Promise<Account | null> {
  if (api) {
    try {
      return await api.get<Account>(`/accounts/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DEMO_ACCOUNTS.find((acc) => acc.id === id) ?? null;
}
