/**
 * Module Users & Roles : gestion des utilisateurs et profils (démo ou API).
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { ModuleLoadingFallback } from '../../components/ModuleLoadingFallback';
import { EmptyState } from '../../components/EmptyState';
import type { UsersRolesUser } from './types';
import type { BankModule } from '../../core/types';
import { useApiClient } from '../../lib/api/useApiClient';
import { useFeatureFlags } from '../../lib/useFeatureFlags';
import { listUsers } from '../../lib/adapters/usersRolesAdapter';
import { csvLine, downloadBlob } from '../../lib/export/csvExport';

function UsersRolesHome(): React.ReactElement {
  const { t } = useTranslation();
  const api = useApiClient();
  const featureFlags = useFeatureFlags('users-roles');
  const [users, setUsers] = useState<UsersRolesUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await listUsers(api);
      setUsers(list);
    } catch {
      setLoadError(t('usersRoles.loadError', 'Error loading users'));
    } finally {
      setLoading(false);
    }
  }, [api, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const exportCsv = () => {
    const header = [
      t('usersRoles.colId'),
      t('usersRoles.colName'),
      t('usersRoles.colEmail'),
      t('usersRoles.colRole'),
    ];
    const rows = users.map((u) => [u.id, u.name, u.email, u.role]);
    const content = [csvLine(header), ...rows.map((r) => csvLine(r))].join(
      '\n'
    );
    downloadBlob('users-roles.csv', content);
  };

  return (
    <div className="space-y-4">
      <header>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{t('usersRoles.title')}</h1>
            <p className="text-sm text-slate-600">{t('usersRoles.subtitle')}</p>
          </div>
          <div className="flex gap-2 items-center">
            {featureFlags.exportEnabled !== false && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={exportCsv}
                disabled={loading || users.length === 0}
              >
                {t('usersRoles.exportCsv')}
              </Button>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
              {t('usersRoles.adminOnly')}
            </span>
          </div>
        </div>
      </header>

      {loadError ? (
        <Card
          variant="error"
          title={t('common.loadErrorTitle', 'Erreur de chargement')}
          description={loadError}
        >
          <Button type="button" variant="primary" onClick={() => loadData()}>
            {t('common.retry', 'Réessayer')}
          </Button>
        </Card>
      ) : (
        <Card>
          {loading ? (
            <ModuleLoadingFallback
              message={t('usersRoles.loading', 'Loading users…')}
            />
          ) : users.length === 0 ? (
            <EmptyState
              message={t(
                'usersRoles.emptyMessage',
                'Aucun utilisateur enregistré.'
              )}
              actionLabel={t(
                'usersRoles.viewDashboard',
                'Voir le tableau de bord'
              )}
              actionTo="/dashboard"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:bg-[var(--dm-thead)] dark:border-[var(--dm-border)]">
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('usersRoles.colId')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('usersRoles.colName')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('usersRoles.colEmail')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('usersRoles.colRole')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-[var(--dm-border)] dark:hover:bg-[var(--dm-surface-hover)] transition-colors"
                    >
                      <td
                        data-table-cell
                        className="px-3 py-2.5 font-mono text-xs text-slate-700"
                      >
                        {user.id}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-900"
                      >
                        {user.name}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-xs text-slate-600"
                      >
                        {user.email}
                      </td>
                      <td data-table-cell className="px-3 py-2.5">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-[var(--dm-surface-hover)] dark:text-[var(--dm-accent)]">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function UsersRolesRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route index element={<UsersRolesHome />} />
    </Routes>
  );
}

const usersRolesModule: BankModule = {
  id: 'users-roles',
  name: 'Users & Roles',
  basePath: '/users-roles',
  routes: UsersRolesRoutes,
  sidebarItems: [{ label: 'Users & Roles', to: '/users-roles', order: 5 }],
  permissionsRequired: ['admin', 'rbac:manage'],
};

export default usersRolesModule;
