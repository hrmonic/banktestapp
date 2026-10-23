/**
 * Module Audit : journal d'audit (démo ou API).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { ModuleLoadingFallback } from '../../components/ModuleLoadingFallback';
import { EmptyState } from '../../components/EmptyState';
import type { AuditEvent } from './types';
import type { BankModule } from '../../core/types';
import { useApiClient } from '../../lib/api/useApiClient';
import { useFeatureFlags } from '../../lib/useFeatureFlags';
import { listAuditEvents } from '../../lib/adapters/auditAdapter';
import { csvLine, downloadBlob } from '../../lib/export/csvExport';

const AUDIT_PAGE_SIZE = 5;

function AuditHome(): React.ReactElement {
  const { t } = useTranslation();
  const api = useApiClient();
  const featureFlags = useFeatureFlags('audit');
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await listAuditEvents(api, {
        search: search || undefined,
        page: 1,
        limit: 999,
      });
      setEvents(list);
    } catch {
      setLoadError(t('audit.loadError', 'Error loading audit'));
    } finally {
      setLoading(false);
    }
  }, [api, search, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return events;
    const s = search.toLowerCase();
    return events.filter(
      (e) =>
        e.actor.toLowerCase().includes(s) ||
        e.action.toLowerCase().includes(s) ||
        e.resource.toLowerCase().includes(s) ||
        e.details.toLowerCase().includes(s)
    );
  }, [events, search]);

  const paginated = filtered.slice(
    (page - 1) * AUDIT_PAGE_SIZE,
    page * AUDIT_PAGE_SIZE
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / AUDIT_PAGE_SIZE));

  /** Filtre les événements dont la date est dans les N derniers jours. */
  const filterByLastDays = useCallback((list: typeof events, days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return list.filter((e) => {
      const d = new Date(e.at.replace(' ', 'T'));
      return !isNaN(d.getTime()) && d >= cutoff;
    });
  }, []);

  const exportCsv = (
    source: {
      at: string;
      actor: string;
      action: string;
      resource: string;
      details: string;
    }[] = paginated,
    filename = 'audit.csv'
  ) => {
    const header = [
      t('audit.colTimestamp'),
      t('audit.colActor'),
      t('audit.colAction'),
      t('audit.colResource'),
      t('audit.colDetails'),
    ];
    const rows = source.map((e) => [
      e.at,
      e.actor,
      e.action,
      e.resource,
      e.details,
    ]);
    const content = [csvLine(header), ...rows.map((r) => csvLine(r))].join(
      '\n'
    );
    downloadBlob(filename, content);
  };

  const exportLastDays = (days: number) => {
    const subset = filterByLastDays(events, days);
    exportCsv(subset, `audit-${days}jours.csv`);
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">{t('audit.title')}</h1>
        <p className="text-sm text-slate-600">{t('audit.subtitle')}</p>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder={t('audit.searchPlaceholder')}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          aria-label={t('audit.searchLabel')}
        />
        {featureFlags.exportEnabled !== false && (
          <>
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => exportLastDays(7)}
              disabled={loading}
            >
              {t('audit.exportForMeeting', 'Exporter pour réunion (7 jours)')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => exportLastDays(30)}
              disabled={loading}
            >
              {t('audit.export30Days', 'Audit 30 jours')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => exportCsv()}
              disabled={loading || filtered.length === 0}
            >
              {t('audit.exportCsv')}
            </Button>
          </>
        )}
      </div>

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
              message={t('audit.loading', 'Loading audit…')}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              message={
                search.trim()
                  ? t(
                      'audit.noResults',
                      'Aucun événement ne correspond à votre recherche.'
                    )
                  : t(
                      'audit.emptyMessage',
                      "Aucun événement d'audit pour le moment."
                    )
              }
              actionLabel={
                search.trim()
                  ? t('audit.clearSearch', 'Effacer la recherche')
                  : t('audit.viewDashboard', 'Voir le tableau de bord')
              }
              actionTo={search.trim() ? undefined : '/dashboard'}
              onAction={
                search.trim()
                  ? () => {
                      setSearch('');
                      setPage(1);
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:bg-[var(--dm-thead)] dark:border-[var(--dm-border)]">
                      <th
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {t('audit.colTimestamp')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {t('audit.colActor')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {t('audit.colAction')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {t('audit.colResource')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {t('audit.colDetails')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-[var(--dm-border)] dark:hover:bg-[var(--dm-surface-hover)] transition-colors"
                      >
                        <td
                          data-table-cell
                          className="px-3 py-2.5 text-xs text-slate-600"
                        >
                          {event.at}
                        </td>
                        <td
                          data-table-cell
                          className="px-3 py-2.5 text-slate-700"
                        >
                          {event.actor}
                        </td>
                        <td
                          data-table-cell
                          className="px-3 py-2.5 text-slate-900"
                        >
                          {event.action}
                        </td>
                        <td
                          data-table-cell
                          className="px-3 py-2.5 font-mono text-xs text-slate-700"
                        >
                          {event.resource}
                        </td>
                        <td
                          data-table-cell
                          className="px-3 py-2.5 text-sm text-slate-700"
                        >
                          {event.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-600">
                    {t('audit.pageInfo', {
                      page,
                      totalPages,
                      count: filtered.length,
                    })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      aria-label={t('audit.prevPage')}
                    >
                      {t('audit.prev')}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      aria-label={t('audit.nextPage')}
                    >
                      {t('audit.next')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  );
}

function AuditRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route index element={<AuditHome />} />
    </Routes>
  );
}

const auditModule: BankModule = {
  id: 'audit',
  name: 'Audit',
  basePath: '/audit',
  routes: AuditRoutes,
  sidebarItems: [{ label: 'Audit', to: '/audit', order: 6 }],
  permissionsRequired: ['audit:view'],
};

export default auditModule;
