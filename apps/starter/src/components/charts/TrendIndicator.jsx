import React from "react";

/**
 * Indicateur de tendance avec flèche et pourcentage.
 * Affiche une variation positive (vert) ou négative (rouge).
 */
export function TrendIndicator({ value, label = "vs période précédente" }) {
  const isPositive = value >= 0;
  const color = isPositive ? "text-green-600" : "text-red-600";
  const bgColor = isPositive ? "bg-green-50" : "bg-red-50";
  const arrow = isPositive ? "↑" : "↓";

  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${bgColor} ${color}`}>
      <span>{arrow}</span>
      <span className="font-medium">{Math.abs(value).toFixed(1)}%</span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}

