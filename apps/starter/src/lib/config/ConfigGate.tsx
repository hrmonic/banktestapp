/**
 * Affiche loading/erreur ou rend les enfants avec le bon provider d'auth.
 * À utiliser sous ConfigProvider.
 */
import React from 'react';
import { useConfigContext } from './ConfigContext';
import { AuthProviderPicker } from '../auth/AuthProviderPicker';
import { PermissionsProvider } from '../security/rbac';
import { SessionProvider } from '../session/SessionContext';
import { ThemeProvider } from '../theme/themePreferences';
import { ThemeApply } from '../theme/ThemeApply';
import { NotificationProvider } from '../notifications/NotificationContext';
import { LoadingFallback } from '../../components/LoadingFallback';
import InvalidConfigPage from '../../pages/InvalidConfigPage';
import App from '../../App';

export function ConfigGate(): React.ReactElement {
  const { config, isLoading, error } = useConfigContext();

  if (isLoading || !config) {
    return <LoadingFallback />;
  }

  if (error) {
    return <InvalidConfigPage error={error} />;
  }

  return (
    <AuthProviderPicker config={config}>
      <PermissionsProvider>
        <SessionProvider>
          <ThemeProvider>
            <ThemeApply>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </ThemeApply>
          </ThemeProvider>
        </SessionProvider>
      </PermissionsProvider>
    </AuthProviderPicker>
  );
}
