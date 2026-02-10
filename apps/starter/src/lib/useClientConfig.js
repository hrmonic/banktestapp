import { useState, useEffect } from "react";
import { parseClientConfig } from "./configSchema.js";

/** @typedef {import("./config/clientConfig").ClientConfig} ClientConfig */

/**
 * Hook de chargement et de validation de la configuration client.
 *
 * @returns {{ config: ClientConfig | null; isLoading: boolean; error: Error | null }}
 */
export function useClientConfig() {
  const [config, setConfig] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/client.config.json");
        if (!res.ok) throw new Error("Erreur lors du chargement de la configuration");
        const data = await res.json();
        // Validation via schéma : permet de détecter rapidement une
        // config invalide côté client, avec un message exploitable.
        const parsed = parseClientConfig(data);
        setConfig(parsed);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  return { config, isLoading, error };
}

export default useClientConfig;
