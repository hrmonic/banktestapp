import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { ModuleLoadingFallback } from '../../components/ModuleLoadingFallback';
import { EmptyState } from '../../components/EmptyState';
import { PERMISSIONS } from '../../core/constants';
import { useApiClient } from '../../lib/api/useApiClient';
import { useFeatureFlags } from '../../lib/useFeatureFlags';
import {
  listTransactions,
  type TransactionRow,
} from '../../lib/adapters/transactionsAdapter';
import { csvLine, downloadBlob } from '../../lib/export/csvExport';

const TX_PAGE_SIZE = 5;

function TransactionsHome() {
  const { t } = useTranslation();
  const api = useApiClient();
  const featureFlags = useFeatureFlags('transactions');
  const [allTransactions, setAllTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await listTransactions(api, {
        search: search || undefined,
        status: statusFilter || undefined,
        page: 1,
        limit: 999,
      });
      setAllTransactions(list);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : t('transactions.loadError')
      );
    } finally {
      setLoading(false);
    }
  }, [api, search, statusFilter, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filtered = allTransactions.filter((row) => {
    if (statusFilter && row.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        row.id.toLowerCase().includes(s) ||
        row.accountId.toLowerCase().includes(s) ||
        row.type.toLowerCase().includes(s)
      );
    }
    return true;
  });
  const paginated = filtered.slice(
    (page - 1) * TX_PAGE_SIZE,
    page * TX_PAGE_SIZE
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / TX_PAGE_SIZE));

  const exportCsv = () => {
    const header = [
      t('transactions.colDate'),
      t('transactions.colAccount'),
      t('transactions.colType'),
      t('transactions.colAmount'),
      t('transactions.colStatus'),
    ];
    const rows = paginated.map((trx) => [
      trx.date,
      trx.accountId,
      trx.type,
      String(trx.amount),
      trx.status,
    ]);
    const content = [csvLine(header), ...rows.map((r) => csvLine(r))].join(
      '\n'
    );
    downloadBlob('transactions.csv', content);
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">{t('transactions.title')}</h1>
        <p className="text-sm text-slate-600">{t('transactions.subtitle')}</p>
      </header>

      {!loading && (
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="search"
            placeholder={t('transactions.searchPlaceholder')}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm w-56"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label={t('transactions.searchLabel')}
          />
          <select
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label={t('transactions.statusFilterLabel')}
          >
            <option value="">{t('transactions.statusAll')}</option>
            <option value="Confirmée">
              {t('transactions.statusConfirmed')}
            </option>
            <option value="En attente">
              {t('transactions.statusPending')}
            </option>
          </select>
          {featureFlags.exportEnabled !== false && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={exportCsv}
              disabled={loading || filtered.length === 0}
            >
              {t('transactions.exportCsv')}
            </Button>
          )}
        </div>
      )}

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
            <ModuleLoadingFallback message={t('transactions.loading')} />
          ) : filtered.length === 0 ? (
            <EmptyState
              message={t(
                'transactions.emptyMessage',
                'Aucune transaction à afficher.'
              )}
              actionLabel={t('transactions.viewAccounts', 'Voir les comptes')}
              actionTo="/accounts"
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
                      {t('transactions.colDate')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('transactions.colAccount')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('transactions.colType')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('transactions.colAmount')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {t('transactions.colStatus')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((trx) => (
                    <tr
                      key={trx.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-[var(--dm-border)] dark:hover:bg-[var(--dm-surface-hover)] transition-colors"
                    >
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-xs text-slate-600"
                      >
                        {trx.date}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 font-mono text-xs text-slate-700"
                      >
                        {trx.accountId}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-900"
                      >
                        {trx.type}
                      </td>
                      <td
                        data-table-cell
                        className={`px-3 py-2.5 text-right tabular-nums ${trx.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900'}`}
                      >
                        {trx.amount.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: trx.currency,
                        })}
                      </td>
                      <td
                        data-table-cell
                        className="px-3 py-2.5 text-slate-700"
                      >
                        {trx.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !loadError && filtered.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm text-slate-600">
                {t('transactions.pageInfo', {
                  page,
                  totalPages: totalPages || 1,
                  count: filtered.length,
                })}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label={t('transactions.prevPage')}
                >
                  {t('transactions.prev')}
                </button>
                <button
                  type="button"
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label={t('transactions.nextPage')}
                >
                  {t('transactions.next')}
                </button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function TransactionsRoutes() {
  return (
    <Routes>
      <Route index element={<TransactionsHome />} />
    </Routes>
  );
}

const transactionsModule = {
  id: 'transactions',
  name: 'Transactions',
  basePath: '/transactions',
  routes: TransactionsRoutes,
  sidebarItems: [{ label: 'Transactions', to: '/transactions', order: 2 }],
  permissionsRequired: [PERMISSIONS.TRANSACTIONS_VIEW],
};

export default transactionsModule;
