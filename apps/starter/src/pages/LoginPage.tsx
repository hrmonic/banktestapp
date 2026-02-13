/**
 * Page de connexion démo (sélection du profil + formulaire).
 * Validation côté client via Zod (loginFormSchema).
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/auth/authProvider';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@bank/ui';
import { PROFILE_IDS } from '../lib/security/profilePermissions';
import {
  getDemoProfileFromStorage,
  setDemoProfileInStorage,
} from '../lib/auth/demoProfileStorage';
import { validateLoginForm } from '../lib/forms/loginSchema';

export type FieldErrors = Partial<Record<'email' | 'password', string>>;

export default function LoginPage(): React.ReactElement {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);
  const [profile, setProfile] = useState('admin-backoffice');

  useEffect(() => {
    const stored = getDemoProfileFromStorage();
    if (stored) setProfile(stored);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);
    const validationErrors = validateLoginForm({ email, password });
    if (validationErrors) {
      setFieldErrors(validationErrors);
      return;
    }
    try {
      setDemoProfileInStorage(profile);
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(t('login.error'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t('login.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600">{t('login.subtitle')}</p>
        </div>

        <Card className="text-left">
          <p className="sr-only">
            Les champs Email et Mot de passe sont obligatoires.
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
            aria-describedby={error ? 'login-error' : undefined}
          >
            <div>
              <label
                htmlFor="profile"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                {t('login.profileLabel')}
              </label>
              <select
                id="profile"
                name="profile"
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              >
                <option value={PROFILE_IDS.AGENT}>Agent d'agence</option>
                <option value={PROFILE_IDS.MANAGER}>Manager d'agence</option>
                <option value={PROFILE_IDS.ANALYST}>Analyste audit</option>
                <option value={PROFILE_IDS.ADMIN}>Admin backoffice</option>
                <option value={PROFILE_IDS.SUPER_ADMIN}>
                  Super Admin (tous modules)
                </option>
              </select>
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                {t('login.emailLabel')}{' '}
                <span className="text-error font-normal" aria-hidden="true">
                  (requis)
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) =>
                    prev ? { ...prev, email: undefined } : null
                  );
                }}
                className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${fieldErrors?.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-primary focus:ring-primary'}`}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors?.email}
                aria-describedby={
                  fieldErrors?.email ? 'email-error' : undefined
                }
              />
              {fieldErrors?.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                {t('login.passwordLabel')}{' '}
                <span className="text-error font-normal" aria-hidden="true">
                  (requis)
                </span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) =>
                    prev ? { ...prev, password: undefined } : null
                  );
                }}
                className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${fieldErrors?.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-primary focus:ring-primary'}`}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors?.password}
                aria-describedby={
                  fieldErrors?.password ? 'password-error' : undefined
                }
              />
              {fieldErrors?.password && (
                <p
                  id="password-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>
            {error && (
              <p id="login-error" className="text-sm text-error" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              size="md"
              disabled={loading}
            >
              {loading ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>
        </Card>

        <p className="text-xs text-slate-500">
          Cette interface est une démo front-end uniquement. Aucun appel réel à
          un système bancaire n'est effectué.
        </p>
      </div>
    </div>
  );
}
