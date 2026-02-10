import { useEffect } from "react";

/**
 * Hook de mesure très simple pour observer le temps de rendu
 * perçu sur une page ou un module.
 *
 * En mode dév uniquement, logge dans la console le temps écoulé
 * entre le montage et la fin du premier paint approximatif.
 */
export function usePerfMetrics(label: string) {
  useEffect(() => {
    if (import.meta.env.MODE !== "development") return;

    const start = performance.now();

    const id = window.requestAnimationFrame(() => {
      const duration = performance.now() - start;
      // eslint-disable-next-line no-console
      console.info(`[perf] ${label} first-paint ~${duration.toFixed(1)}ms`);
    });

    return () => window.cancelAnimationFrame(id);
  }, [label]);
}

