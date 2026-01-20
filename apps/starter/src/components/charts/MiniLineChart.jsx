import React, { useMemo } from "react";

/**
 * Mini graphique linéaire léger (CSS/SVG pur).
 * Utilisé pour afficher des tendances sur une période courte (ex: 7 jours).
 */
export function MiniLineChart({ data, height = 60, color = "#3b82f6" }) {
  const gradientId = useMemo(
    () => `gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

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
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const width = 200;
  const padding = 8;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
    const y =
      height -
      padding -
      ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
          fill={`url(#${gradientId})`}
        />
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
          const y =
            height -
            padding -
            ((d.value - min) / range) * (height - padding * 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="transition-opacity hover:opacity-75"
            />
          );
        })}
      </svg>
    </div>
  );
}

