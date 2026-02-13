/**
 * Page de callback OIDC après redirection depuis l'IDP.
 * Appelle signinRedirectCallback puis redirige vers l'app.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserManager } from 'oidc-client-ts';
import { memoryStateStore } from '../lib/auth/memoryStore';
import { useConfigContext } from '../lib/config/ConfigContext';

const LOGIN_CALLBACK_PATH = '/login/callback';

function getRedirectUri(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${LOGIN_CALLBACK_PATH}`;
}

export default function LoginCallbackPage(): React.ReactElement {
  const navigate = useNavigate();
  const { config } = useConfigContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = config?.auth;
    if (!auth?.issuer || !auth?.clientId) {
      setError('Configuration OIDC manquante');
      return;
    }
    const manager = new UserManager({
      authority: auth.issuer,
      client_id: auth.clientId,
      redirect_uri: getRedirectUri(),
      userStore: memoryStateStore,
      stateStore: memoryStateStore,
    });
    manager
      .signinRedirectCallback()
      .then(() => {
        navigate('/', { replace: true });
        window.location.reload();
      })
      .catch((err) => {
        setError(err?.message ?? 'Échec de la connexion');
      });
  }, [config?.auth?.issuer, config?.auth?.clientId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4" role="alert">
            {error}
          </p>
          <a href="/login" className="text-blue-600 underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <p className="text-slate-600">Connexion en cours…</p>
    </div>
  );
}
