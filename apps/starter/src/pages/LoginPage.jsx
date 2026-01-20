import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/auth/authProvider.js";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageLayout } from "@bank/ui";
import { PROFILE_IDS } from "../lib/security/profilePermissions.js";

function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState("admin-backoffice");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("demo-profile")
        : null;
    if (stored) {
      setProfile(stored);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("demo-profile", profile);
      }
      await login({ email, password });
      navigate("/");
    } catch (err) {
      // Dans une vraie intégration, on mapperait le code d'erreur backend.
      console.error(err);
      setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Backoffice bancaire démo
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Connectez-vous pour explorer les modules (données factices).
          </p>
        </div>

        <Card className="text-left">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="profile"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Profil de démo
              </label>
              <select
                id="profile"
                name="profile"
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={profile}
                onChange={(event) => setProfile(event.target.value)}
              >
                <option value={PROFILE_IDS.AGENT}>Agent d’agence</option>
                <option value={PROFILE_IDS.MANAGER}>Manager d’agence</option>
                <option value={PROFILE_IDS.ANALYST}>Analyste audit</option>
                <option value={PROFILE_IDS.ADMIN}>Admin backoffice</option>
                <option value={PROFILE_IDS.SUPER_ADMIN}>Super Admin (tous modules)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Card>

        <p className="text-xs text-slate-500">
          Cette interface est une démo front-end uniquement. Aucun appel réel à
          un système bancaire n’est effectué.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
