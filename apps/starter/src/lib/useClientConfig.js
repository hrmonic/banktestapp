import { useState, useEffect } from "react";

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
        // Basic shape check to avoid cryptic runtime errors later.
        if (!data || typeof data !== "object") {
          throw new Error("Configuration client invalide");
        }
        setConfig(data);
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
