/**
 * Export CSV côté client (listes).
 * En production, peut être remplacé par un appel API GET /accounts/export?format=csv.
 */

/**
 * Échappe une cellule CSV (guillemets si contient virgule ou guillemet).
 */
function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Génère une ligne CSV à partir d'un tableau de chaînes.
 */
export function csvLine(cells: string[]): string {
  return cells.map(escapeCell).join(',');
}

/**
 * Déclenche le téléchargement d'un fichier (nom + contenu texte).
 */
export function downloadBlob(
  filename: string,
  content: string,
  mimeType = 'text/csv;charset=utf-8'
): void {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
