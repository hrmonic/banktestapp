/**
 * Module Reports : catalogue de rapports (démo ou API).
 * Générer / Télécharger : en démo blob factice ; en prod GET /reports/:id/download.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { EmptyState } from '../../components/EmptyState';
import type { Report } from './types';
import type { BankModule } from '../../core/types';
import { useApiClient } from '../../lib/api/useApiClient';
import { listReports, downloadReport } from '../../lib/adapters/reportsAdapter';

function ReportsHome(): React.ReactElement {
  const { t } = useTranslation();
  const api = useApiClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await listReports(api);
      setReports(list);
    } catch {
      setLoadError(t('reports.loadError', 'Error loading reports'));
    } finally {
      setLoading(false);
    }
  }, [api, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleGenerate = async (report: Report) => {
    setGeneratingId(report.id);
    try {
      await downloadReport(api, report);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownload = (report: Report) => {
    void downloadReport(api, report);
  };

  const reportMonthly = reports.find((r) => r.id === 'RPT-001');
  const reportIncidents = reports.find((r) => r.id === 'RPT-002');

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">{t('reports.title')}</h1>
        <p className="text-sm text-slate-600">{t('reports.subtitle')}</p>
      </header>

      {!loadError && !loading && reports.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-slate-700">
            {t('reports.exportForMeeting', 'Exporter pour réunion')}
          </span>
          {reportMonthly && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleDownload(reportMonthly)}
            >
              {t('reports.weeklyReport', 'Rapport mensuel agence')}
            </Button>
          )}
          {reportIncidents && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDownload(reportIncidents)}
            >
              {t('reports.incidentsReport', 'Rapport incidents cartes')}
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
      ) : loading ? (
        <Card>
          <p className="text-sm text-slate-600">
            {t('reports.loading', 'Loading reports…')}
          </p>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <EmptyState
            message={t(
              'reports.emptyMessage',
              'Aucun rapport disponible pour le moment.'
            )}
            actionLabel={t('reports.viewDashboard', 'Voir le tableau de bord')}
            actionTo="/dashboard"
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <p className="text-xs font-mono text-slate-500 mb-1">
                {report.id}
              </p>
              <h2 className="text-sm font-semibold">{report.name}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {report.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t('reports.format')} : {report.format}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleGenerate(report)}
                  disabled={generatingId !== null}
                >
                  {generatingId === report.id
                    ? t('reports.generating')
                    : t('reports.generate')}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(report)}
                >
                  {t('reports.download')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportsRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route index element={<ReportsHome />} />
    </Routes>
  );
}

const reportsModule: BankModule = {
  id: 'reports',
  name: 'Reports',
  basePath: '/reports',
  routes: ReportsRoutes,
  sidebarItems: [{ label: 'Reports', to: '/reports', order: 4 }],
  permissionsRequired: ['reports:view'],
};

export default reportsModule;
