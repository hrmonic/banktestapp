/**
 * Choisit le provider d'auth (démo ou OIDC) selon la config.
 */
import React from 'react';
import { AuthProvider } from './authProvider';
import { OidcAuthProvider } from './oidcAuthProvider';
import { isDemoAuth } from '../config/clientConfig';
import type { ClientConfig } from '../config/clientConfig';

type AuthProviderPickerProps = {
  children: React.ReactNode;
  config: ClientConfig;
};

export function AuthProviderPicker({
  children,
  config,
}: AuthProviderPickerProps): React.ReactElement {
  if (isDemoAuth(config)) {
    return <AuthProvider>{children}</AuthProvider>;
  }
  return <OidcAuthProvider config={config}>{children}</OidcAuthProvider>;
}
