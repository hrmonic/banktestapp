import React, { useState } from "react";
import { useAuth } from "../lib/auth/authProvider.js";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageLayout } from "@bank/ui";

function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      // Dans une vraie intégration, on mapperait le code d'erreur backend.
      console.error(err);
      setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <PageLayout
        title="Backoffice bancaire démo"
        subtitle="Connectez-vous pour explorer les modules (données factices)."
      >
        <Card className="mx-auto max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Card>
        <p className="text-xs text-slate-500">
          Cette interface est une démo front-end uniquement. Aucun appel réel à
          un système bancaire n’est effectué.
        </p>
      </PageLayout>
    </div>
  );
}

export default LoginPage;
