/**
 * Wrapper qui active le timeout de session (inactivité) et affiche la modal d'avertissement.
 * À utiliser autour du contenu authentifié (ex. sous RequireAuth).
 */
import React from 'react';
import { useSessionTimeout } from '../lib/session/useSessionTimeout';
import { useAuth } from '../lib/auth/authProvider';
import { useClientConfig } from '../lib/useClientConfig';
import { SessionTimeoutModal } from './SessionTimeoutModal';

type SessionTimeoutWrapperProps = {
  children: React.ReactNode;
};

export function SessionTimeoutWrapper({
  children,
}: SessionTimeoutWrapperProps): React.ReactElement {
  const { config } = useClientConfig();
  const { logout, isAuthenticated } = useAuth();
  const sessionConfig = config?.session;
  const resolvedConfig =
    sessionConfig?.idleTimeoutMinutes != null &&
    sessionConfig?.warningBeforeLogoutSeconds != null
      ? {
          idleTimeoutMinutes: sessionConfig.idleTimeoutMinutes,
          warningBeforeLogoutSeconds: sessionConfig.warningBeforeLogoutSeconds,
        }
      : undefined;
  const { showWarning, secondsLeft, extendSession } = useSessionTimeout(
    resolvedConfig,
    logout,
    isAuthenticated
  );

  return (
    <>
      {children}
      <SessionTimeoutModal
        open={showWarning}
        secondsLeft={secondsLeft}
        onExtend={extendSession}
        onLogout={logout}
      />
    </>
  );
}
