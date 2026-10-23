/**
 * Mini graphique en barres (SVG/CSS) pour comparer des catégories.
 */
import React from 'react';

type BarPoint = { label: string; value: number };

type MiniBarChartProps = {
  data: BarPoint[];
  height?: number;
  color?: string;
};

export function MiniBarChart({
  data,
  height = 60,
  color = '#10b981',
}: MiniBarChartProps): React.ReactElement {
  if (!data?.length) {
    return (
      <div
        className="flex items-center justify-center text-xs text-slate-400"
        style={{ height: `${height}px` }}
      >
        Aucune donnée
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value));
  const width = 200;
  const summaryText = `Graphique en barres : ${data.map((d) => `${d.label} ${d.value.toLocaleString('fr-FR')}`).join(', ')}.`;

  return (
    <div
      className="flex items-end gap-1"
      style={{ height: `${height}px`, width: `${width}px` }}
      role="img"
      aria-label={summaryText}
    >
      {data.map((d, i) => {
        const barHeight = max > 0 ? (d.value / max) * (height - 8) : 0;
        return (
          <div
            key={i}
            className="flex-1 rounded-t transition-opacity hover:opacity-75"
            style={{
              height: `${barHeight}px`,
              backgroundColor: color,
              minHeight: barHeight > 0 ? '2px' : '0',
            }}
            title={`${d.label}: ${d.value}`}
            aria-label={`${d.label}: ${d.value}`}
          />
        );
      })}
    </div>
  );
}
