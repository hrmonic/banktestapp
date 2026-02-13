/**
 * Module Accounts : liste et détail des comptes (démo).
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { useApiClient } from '../../lib/api/useApiClient';
import { useFeatureFlags } from '../../lib/useFeatureFlags';
import {
  listAccounts,
  getAccountById,
} from '../../lib/adapters/accountsAdapter';
import { csvLine, downloadBlob } from '../../lib/export/csvExport';
import { ModuleLoadingFallback } from '@/components/ModuleLoadingFallback';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmptyState } from '@/components/EmptyState';
import type { Account } from './types';
import type { BankModule } from '../../core/types';

const PAGE_SIZE = 10;

/** IBAN avec espaces tous les 4 caractères pour lisibilité. */
function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

function AccountsList(): React.ReactElement {
  const { t } = useTranslation();
  const api = useApiClient();
  const featureFlags = useFeatureFlags('accounts');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const loadAccounts = React.useCallback((): (() => void) => {
    setLoadError(null);
    setLoading(true);
    let cancelled = false;
    (async () => {
      try {
        const data = await listAccounts(api, {
          status: statusFilter || undefined,
          search: search.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setAccounts(data);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : t('accounts.loadError')
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, statusFilter, search, page, t]);

  useEffect(() => {
    return loadAccounts();
  }, [loadAccounts]);

  const applyFilters = () => setPage(1);

  const exportCsv = () => {
    const header = csvLine([
      'ID',
      'Titulaire',
      'IBAN',
      'Type',
      'Statut',
      'Solde',
      'Devise',
    ]);
    const rows = accounts.map((a) =>
      csvLine([
        a.id,
        a.holder,
        a.iban,
        a.type,
        a.status,
        String(a.balance),
        a.currency,
      ])
    );
    downloadBlob('comptes.csv', [header, ...rows].join('\r\n'));
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Comptes', to: '/accounts' }]} />
      <header>
        <h1 className="text-2xl font-bold mb-1">{t('accounts.title')}</h1>
        <p className="text-sm text-slate-600">{t('accounts.subtitle')}</p>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <label
          htmlFor="accounts-status"
          className="text-sm font-medium text-slate-700"
        >
          {t('accounts.statusFilter')}
        </label>
        <select
          id="accounts-status"
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          aria-label={t('accounts.statusFilter')}
        >
          <option value="">Tous</option>
          <option value="Actif">Actif</option>
          <option value="Suspendu">Suspendu</option>
        </select>
        <label
          htmlFor="accounts-search"
          className="text-sm font-medium text-slate-700"
        >
          Recherche
        </label>
        <input
          id="accounts-search"
          type="search"
          placeholder={t('accounts.searchPlaceholder')}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          aria-label="Rechercher un compte"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={applyFilters}
        >
          {t('accounts.applyFilters')}
        </Button>
        {featureFlags.exportEnabled !== false && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={exportCsv}
            disabled={loading || accounts.length === 0}
          >
            Exporter CSV
          </Button>
        )}
      </div>

      {loadError ? (
        <Card
          variant="error"
          title={t('common.loadErrorTitle', 'Erreur de chargement')}
          description={loadError}
        >
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => loadAccounts()}
          >
            {t('common.retry', 'Réessayer')}
          </Button>
        </Card>
      ) : (
        <Card>
          {loading ? (
            <ModuleLoadingFallback message="Chargement des comptes…" />
          ) : accounts.length === 0 ? (
            <EmptyState
              message={t(
                'accounts.emptyMessage',
                'Aucun compte à afficher avec ces critères.'
              )}
              actionLabel={t(
                'accounts.clearFilters',
                'Réinitialiser les filtres'
              )}
              onAction={() => {
                setStatusFilter('');
                setSearch('');
                setPage(1);
              }}
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
                      ID compte
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Titulaire
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      IBAN
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      Solde
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right w-24">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-[var(--dm-border)] dark:hover:bg-[var(--dm-surface-hover)] transition-colors"
                    >
                      <td
                        data-table-cell
                        className="px-3 py-2.5 font-mono text-xs text-slate-700"
                      >
                        {account.id}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-900"
                      >
                        {account.holder}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 font-mono text-xs text-slate-600"
                      >
                        {formatIban(account.iban)}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-700"
                      >
                        {account.type}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-700"
                      >
                        {account.status}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-right tabular-nums text-slate-900"
                      >
                        {account.balance.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: account.currency,
                        })}
                      </td>
                      <td data-table-cell className="px-3 py-2.5 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/accounts/${account.id}`)}
                          aria-label={`Voir le détail du compte ${account.id}`}
                        >
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadError && !loading && accounts.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm text-slate-600">Page {page}</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Page précédente"
                >
                  Précédent
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={accounts.length < PAGE_SIZE}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Page suivante"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function AccountDetails(): React.ReactElement {
  const api = useApiClient();
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadAccount = React.useCallback((): (() => void) => {
    setLoadError(null);
    setLoading(true);
    let cancelled = false;
    (async () => {
      try {
        const data = await getAccountById(accountId ?? '', api);
        if (!cancelled) {
          setAccount(data);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : 'Erreur lors du chargement du compte.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountId, api]);

  useEffect(() => {
    return loadAccount();
  }, [loadAccount]);

  if (loadError) {
    return (
      <div className="space-y-4">
        <Breadcrumbs
          items={[
            { label: 'Comptes', to: '/accounts' },
            { label: '…', to: '' },
          ]}
        />
        <Card
          variant="error"
          title="Erreur de chargement"
          description={loadError}
        >
          <Button type="button" variant="primary" onClick={() => loadAccount()}>
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumbs
          items={[
            { label: 'Comptes', to: '/accounts' },
            { label: '…', to: '' },
          ]}
        />
        <ModuleLoadingFallback message="Chargement du compte…" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">
          Compte introuvable. Il s'agit probablement d'un identifiant de démo.
        </p>
        <Button variant="secondary" onClick={() => navigate('/accounts')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Comptes', to: '/accounts' },
          { label: `Compte ${account.id}`, to: '' },
        ]}
      />
      <Button variant="secondary" onClick={() => navigate('/accounts')}>
        ← Retour à la liste
      </Button>
      <Card>
        <h1 className="text-xl font-bold mb-2">
          Compte {account.id} – {account.holder}
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Détails du compte (données de démo, aucune action réelle).
        </p>
        <dl className="grid gap-2 md:grid-cols-2 text-sm">
          <div>
            <dt className="text-slate-500">IBAN</dt>
            <dd className="font-mono text-xs">{account.iban}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Type</dt>
            <dd>{account.type}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Statut</dt>
            <dd>{account.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Solde</dt>
            <dd>
              {account.balance.toLocaleString('fr-FR', {
                style: 'currency',
                currency: account.currency,
              })}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

function AccountsRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route index element={<AccountsList />} />
      <Route path=":accountId" element={<AccountDetails />} />
    </Routes>
  );
}

const accountsModule: BankModule = {
  id: 'accounts',
  name: 'Accounts',
  basePath: '/accounts',
  routes: AccountsRoutes,
  sidebarItems: [{ label: 'Accounts', to: '/accounts', order: 1 }],
  permissionsRequired: ['accounts:view'],
};

export default accountsModule;
