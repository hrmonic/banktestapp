import type { ReactNode } from 'react';
import type { Permission } from '../../core/constants';
import type { BankModule } from '../../core/types';

/**
 * Permission logique utilisée par le système RBAC.
 *
 * Dans la démo, il s'agit d'une chaîne issue de `core/constants.ts`,
 * mais on laisse la porte ouverte à des extensions.
 */
export type PermissionId = Permission | string;

/**
 * Props du `PermissionsProvider`.
 */
export type PermissionsProviderProps = {
  /**
   * Permissions additionnelles injectées par le backend ou un module.
   */
  permissions?: PermissionId[];
  children: ReactNode;
};

/**
 * Ensemble effectif des permissions calculées pour l'utilisateur courant.
 */
export type EffectivePermissions = PermissionId[];

export type RequireAuthProps = {
  children: ReactNode;
  redirectTo?: string;
};

export type RequirePermissionProps = {
  permission: PermissionId;
  children: ReactNode;
  redirectTo?: string;
};

export type ModuleRouteGuardProps = {
  module: BankModule;
  children: ReactNode;
  redirectTo?: string;
};
