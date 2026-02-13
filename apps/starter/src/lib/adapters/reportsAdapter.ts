/**
 * Adaptateur Reports : démo ou API réelle (catalogue + téléchargement).
 */
import type { ApiClient } from '../api/apiClient';
import type { Report } from '../../modules/reports/types';

const DEMO_REPORTS: Report[] = [
  {
    id: 'RPT-001',
    name: 'Rapport mensuel agence',
    description: 'Volumes, encours et incidents par agence.',
    format: 'PDF',
  },
  {
    id: 'RPT-002',
    name: 'Rapport incidents cartes',
    description: "Taux d'échec et incidents par canal carte.",
    format: 'XLSX',
  },
  {
    id: 'RPT-003',
    name: 'Rapport conformité KYC',
    description: 'Dossiers en anomalie et niveau de risque.',
    format: 'PDF',
  },
];

export async function listReports(api: ApiClient | null): Promise<Report[]> {
  if (api) return api.get<Report[]>('/reports');
  await new Promise((r) => setTimeout(r, 150));
  return [...DEMO_REPORTS];
}

/**
 * Télécharge un rapport. En démo : blob factice ; en prod : GET /reports/:id/download.
 */
export async function downloadReport(
  api: ApiClient | null,
  report: Report
): Promise<void> {
  const filename = `${report.id}-${report.name.replace(/\s+/g, '-')}.${report.format === 'PDF' ? 'pdf' : 'xlsx'}`;
  if (api) {
    const blob = await api.getBlob(
      `/reports/${encodeURIComponent(report.id)}/download`
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  const content = `Rapport: ${report.name}\nID: ${report.id}\nFormat: ${report.format}\n\n(Démo - pas de contenu réel)`;
  const blob = new Blob([content], {
    type:
      report.format === 'PDF'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
