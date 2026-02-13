/**
 * Indicateur de tendance (flèche + pourcentage), vert si positif et rouge si négatif.
 */
import React from 'react';

type TrendIndicatorProps = {
  value: number;
  label?: string;
};

export function TrendIndicator({
  value,
  label = 'vs période précédente',
}: TrendIndicatorProps): React.ReactElement {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  const arrow = isPositive ? '↑' : '↓';

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${bgColor} ${color}`}
    >
      <span>{arrow}</span>
      <span className="font-medium">{Math.abs(value).toFixed(1)}%</span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
