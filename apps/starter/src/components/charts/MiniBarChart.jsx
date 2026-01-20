import React from "react";

/**
 * Mini graphique en barres léger (CSS/SVG pur).
 * Utilisé pour comparer des catégories (ex: transactions par type).
 */
export function MiniBarChart({ data, height = 60, color = "#10b981" }) {
  if (!data || data.length === 0) {
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
  const barWidth = (width - 16) / data.length - 4;
  const barSpacing = 4;

  return (
    <div className="flex items-end gap-1" style={{ height: `${height}px`, width: `${width}px` }}>
      {data.map((d, i) => {
        const barHeight = max > 0 ? (d.value / max) * (height - 8) : 0;
        return (
          <div
            key={i}
            className="flex-1 rounded-t transition-opacity hover:opacity-75"
            style={{
              height: `${barHeight}px`,
              backgroundColor: color,
              minHeight: barHeight > 0 ? "2px" : "0",
            }}
            title={`${d.label}: ${d.value}`}
            aria-label={`${d.label}: ${d.value}`}
          />
        );
      })}
    </div>
  );
}

