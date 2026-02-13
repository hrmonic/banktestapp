/**
 * Hook : export rapide « Exporter pour réunion » (P0-2).
 * Templates : Comptes (liste), Audit 7 jours, Rapport (premier PDF).
 */
import { useCallback, useState } from 'react';
import { useApiClient } from './api/useApiClient';
import { listAccounts } from './adapters/accountsAdapter';
import { listAuditEvents } from './adapters/auditAdapter';
import { listReports, downloadReport } from './adapters/reportsAdapter';
import { csvLine, downloadBlob } from './export/csvExport';
import type { AuditEvent } from '../modules/audit/types';

const ACTION_PREFIX = 'action:';
export const QUICK_EXPORT_ACCOUNTS = `${ACTION_PREFIX}export-accounts`;
export const QUICK_EXPORT_AUDIT_7D = `${ACTION_PREFIX}export-audit-7d`;
export const QUICK_EXPORT_REPORT = `${ACTION_PREFIX}export-report`;

function filterByLastDays(list: AuditEvent[], days: number): AuditEvent[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return list.filter((e) => {
    const d = new Date(e.at.replace(' ', 'T'));
    return !isNaN(d.getTime()) && d >= cutoff;
  });
}

export function useQuickExport() {
  const api = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAccounts = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const accounts = await listAccounts(api, { limit: 200 });
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
      downloadBlob('comptes-reunion.csv', [header, ...rows].join('\r\n'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [api]);

  const exportAudit7d = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const events = await listAuditEvents(api, { limit: 200 });
      const subset = filterByLastDays(events, 7);
      const header = csvLine([
        'Horodatage',
        'Acteur',
        'Action',
        'Ressource',
        'Détails',
      ]);
      const rows = subset.map((e) =>
        csvLine([e.at, e.actor, e.action, e.resource, e.details])
      );
      downloadBlob('audit-7jours.csv', [header, ...rows].join('\n'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [api]);

  const exportReport = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const reports = await listReports(api);
      const pdfReport = reports.find((r) => r.format === 'PDF') ?? reports[0];
      if (!pdfReport) {
        setError('Aucun rapport disponible');
        return;
      }
      await downloadReport(api, pdfReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [api]);

  const runAction = useCallback(
    (actionId: string) => {
      if (actionId === QUICK_EXPORT_ACCOUNTS) void exportAccounts();
      else if (actionId === QUICK_EXPORT_AUDIT_7D) void exportAudit7d();
      else if (actionId === QUICK_EXPORT_REPORT) void exportReport();
    },
    [exportAccounts, exportAudit7d, exportReport]
  );

  return {
    exportAccounts,
    exportAudit7d,
    exportReport,
    runAction,
    loading,
    error,
  };
}
