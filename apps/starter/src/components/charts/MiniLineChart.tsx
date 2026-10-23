/**
 * Mini graphique linéaire (SVG) pour tendances sur une courte période.
 */
import React, { useMemo } from 'react';

type DataPoint = { value: number };

type MiniLineChartProps = {
  data: DataPoint[];
  height?: number;
  color?: string;
};

export function MiniLineChart({
  data,
  height = 60,
  color = '#3b82f6',
}: MiniLineChartProps): React.ReactElement {
  const gradientId = useMemo(
    () => `gradient-${Math.random().toString(36).slice(2, 11)}`,
    []
  );

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
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const width = 200;
  const padding = 8;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
    const y =
      height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;
  const summaryText = `Évolution sur ${data.length} point(s) : minimum ${min.toLocaleString('fr-FR')}, maximum ${max.toLocaleString('fr-FR')}.`;

  return (
    <div
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
      role="img"
      aria-label={summaryText}
    >
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
          const x =
            padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
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
