/**
 * Adaptateur Users & Roles : démo ou API réelle.
 */
import type { ApiClient } from '../api/apiClient';
import type { UsersRolesUser } from '../../modules/users-roles/types';

const DEMO_USERS: UsersRolesUser[] = [
  {
    id: 'USR-001',
    name: 'Camille Durand',
    email: 'camille.durand@bank.test',
    role: 'agent-agence',
  },
  {
    id: 'USR-002',
    name: 'Nicolas Leroy',
    email: 'nicolas.leroy@bank.test',
    role: 'manager-agence',
  },
  {
    id: 'USR-003',
    name: 'Alice Morel',
    email: 'alice.morel@bank.test',
    role: 'analyste-audit',
  },
  {
    id: 'USR-004',
    name: 'Admin Backoffice',
    email: 'admin@bank.test',
    role: 'admin-backoffice',
  },
];

export type ListUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function listUsers(
  api: ApiClient | null,
  params: ListUsersParams = {}
): Promise<UsersRolesUser[]> {
  if (api) {
    const search = new URLSearchParams();
    if (params.search) search.set('search', params.search);
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    const qs = search.toString();
    return api.get<UsersRolesUser[]>(qs ? `/users?${qs}` : '/users');
  }
  await new Promise((r) => setTimeout(r, 150));
  let list = DEMO_USERS;
  if (params.search?.trim()) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.role.toLowerCase().includes(s) ||
        u.id.toLowerCase().includes(s)
    );
  }
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 50);
  return list.slice((page - 1) * limit, page * limit);
}
