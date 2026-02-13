// Types cœur partagés pour l'application starter.
import type { Permission } from './constants';
import type { ComponentType } from 'react';

export interface BankModuleSidebarItem {
  /**
   * Libellé affiché dans la sidebar.
   */
  label: string;
  /**
   * Chemin de navigation (souvent égal à basePath).
   */
  to: string;
  /**
   * Identifiant d'icône (optionnel) pour l'UI.
   */
  icon?: string;
  /**
   * Ordre relatif d'affichage dans la sidebar.
   */
  order?: number;
}

/**
 * Contrat commun à tous les modules métier du backoffice.
 *
 * Un module est une "feature" isolée : il déclare un préfixe de route,
 * un ensemble de sous-routes, et ce qu'il expose à la navigation globale.
 */
export interface BankModule {
  /**
   * Identifiant unique du module (clé utilisée dans client.config.json).
   */
  id: string;
  /**
   * Libellé affiché dans la navigation et l’UI.
   */
  name: string;
  /**
   * Préfixe de route (ex: "/transactions").
   */
  basePath: string;
  /**
   * Composant React qui déclare les <Routes> internes du module.
   */
  routes: ComponentType;
  /**
   * Éléments de navigation latérale dérivés de ce module.
   */
  sidebarItems: BankModuleSidebarItem[];
  /**
   * Permissions/roles nécessaires pour accéder au module.
   */
  permissionsRequired?: Permission[];
  /**
   * Flags pour activer/désactiver des sous-fonctionnalités.
   */
  featureFlags?: Record<string, boolean>;
  /**
   * Adaptateurs d’API spécifiques au module (list, get, update, etc.).
   */
  apiAdapter?: Record<string, unknown>;
}

export type BankModuleId = BankModule['id'];
