/**
 * Shell principal du backoffice : sidebar (nav issue du registry) + zone de contenu.
 * Sur mobile : sidebar en drawer (ouvert par bouton menu), skip link et focus pour a11y.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { getSidebarItems } from '../../modules/registry';
import { PageLayout, Button } from '@bank/ui';
import { useEffectivePermissions } from '../../lib/security/rbac';
import { useAuth } from '../../lib/auth/authProvider';
import {
  useSessionInfo,
  useSessionDurationMinutes,
} from '../../lib/session/SessionContext';
import { SafeHtml } from '../../lib/security/SafeHtml';
import { DemoModeBanner } from '../DemoModeBanner';
import { CommandPalette } from '../CommandPalette/CommandPalette';
import { ExportQuickMenu } from '../ExportQuickMenu/ExportQuickMenu';
import { ThemeSelector } from '../ThemeSelector';
import { ThemeToggleIcon } from '../ThemeToggleIcon';
import { ShortcutHelpModal } from '../ShortcutHelpModal';
import {
  useQuickExport,
  QUICK_EXPORT_ACCOUNTS,
  QUICK_EXPORT_AUDIT_7D,
  QUICK_EXPORT_REPORT,
} from '../../lib/useQuickExport';
import { isDemoAuth, type ClientConfig } from '../../lib/config/clientConfig';

type AppShellProps = {
  config: ClientConfig | null;
};

function SidebarContent({
  config,
  profileLabel,
  items,
  location,
  onLogout,
  onNavigate,
}: {
  config: ClientConfig | null;
  profileLabel: string;
  items: { to: string; label: string }[];
  location: { pathname: string };
  onLogout: () => void;
  onNavigate: () => void;
}): React.ReactElement {
  return (
    <>
      <div className="border-b border-slate-200 dark:border-cursor-border p-4">
        <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-cursor-text-muted">
          Backoffice
        </span>
        <span className="mt-1 block text-sm font-bold text-slate-900 dark:text-cursor-text">
          {config?.branding?.name != null ? (
            <SafeHtml html={String(config.branding.name)} as="span" />
          ) : (
            'Modular BankUI Studio'
          )}
        </span>
        <span className="mt-2 inline-flex rounded-full bg-slate-100 dark:bg-cursor-surface px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-cursor-text-muted">
          Profil&nbsp;: {profileLabel}
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={[
                    'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-cursor-surface/80 dark:text-cursor-accent'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-cursor-text-muted dark:hover:bg-cursor-surface dark:hover:text-cursor-text',
                  ].join(' ')}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-slate-200 dark:border-cursor-border p-3 space-y-3">
        <ThemeSelector densityOnly />
        <SidebarFooter onLogout={onLogout} />
      </div>
    </>
  );
}

function SidebarFooter({
  onLogout,
}: {
  onLogout: () => void;
}): React.ReactElement {
  const { t } = useTranslation();
  const sessionMinutes = useSessionDurationMinutes();
  const { lastLoginAt, lastLoginOrigin } = useSessionInfo();
  return (
    <>
      {sessionMinutes != null && (
        <p
          className="text-xs text-slate-500 dark:text-cursor-text-muted"
          aria-live="polite"
        >
          {t('shell.sessionActive', 'Session active depuis {{minutes}} min.', {
            minutes: sessionMinutes,
          })}
        </p>
      )}
      {lastLoginAt != null && (
        <p className="text-xs text-slate-500 dark:text-cursor-text-muted">
          {t(
            'shell.lastLogin',
            'Dernière connexion : {{date}} depuis {{origin}}.',
            {
              date: lastLoginAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              origin: lastLoginOrigin ?? 'cet appareil',
            }
          )}
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={onLogout}
      >
        {t('shell.logout')}
      </Button>
      <p className="text-xs text-slate-500 dark:text-cursor-text-muted">
        Demo • No real data. {t('shell.changeProfileHint')}
      </p>
    </>
  );
}

export function AppShell({ config }: AppShellProps): React.ReactElement {
  const { t } = useTranslation();
  const permissions = useEffectivePermissions();
  const navItems = getSidebarItems(config, permissions);
  const { runAction } = useQuickExport();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileLabel = user?.profile ?? 'admin-backoffice';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);
  const pendingGRef = useRef(false);
  const pendingGTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commandPaletteItems = React.useMemo(
    () => [
      ...navItems,
      { to: QUICK_EXPORT_ACCOUNTS, label: t('exportQuick.templateAccounts') },
      { to: QUICK_EXPORT_AUDIT_7D, label: t('exportQuick.templateAudit7d') },
      { to: QUICK_EXPORT_REPORT, label: t('exportQuick.templateReport') },
    ],
    [navItems, t]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
        return;
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShortcutHelpOpen((open) => !open);
        return;
      }
      if (
        e.key.toLowerCase() === 'g' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.repeat
      ) {
        pendingGRef.current = true;
        if (pendingGTimeoutRef.current)
          clearTimeout(pendingGTimeoutRef.current);
        pendingGTimeoutRef.current = setTimeout(() => {
          pendingGRef.current = false;
          pendingGTimeoutRef.current = null;
        }, 800);
        return;
      }
      if (
        pendingGRef.current &&
        e.key >= '1' &&
        e.key <= '7' &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        const index = parseInt(e.key, 10) - 1;
        if (navItems[index]) {
          e.preventDefault();
          navigate(navItems[index].to);
          pendingGRef.current = false;
          if (pendingGTimeoutRef.current) {
            clearTimeout(pendingGTimeoutRef.current);
            pendingGTimeoutRef.current = null;
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pendingGTimeoutRef.current) clearTimeout(pendingGTimeoutRef.current);
    };
  }, [navItems, navigate]);

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  const closeDrawer = (): void => setSidebarOpen(false);

  return (
    <>
      <DemoModeBanner />
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-cursor-bg dark:text-cursor-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:rounded-md focus:ring-2 focus:ring-primary focus:shadow-lg"
        >
          {t('shell.skipToContent')}
        </a>

        {/* Mobile: menu button + overlay when drawer open */}
        {/* Icône thème : discret, en haut à droite ; sous la bannière démo si elle est affichée */}
        <div
          className={`fixed right-3 z-20 flex items-center gap-2 md:right-4 ${config && isDemoAuth(config) ? 'top-12 md:top-14' : 'top-3 md:top-4'}`}
        >
          <ExportQuickMenu />
          <ThemeToggleIcon />
        </div>

        <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white dark:border-cursor-border dark:bg-cursor-sidebar px-4 py-3 pr-14">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold text-slate-900 dark:text-cursor-text truncate">
            {config?.branding?.name ?? 'Backoffice'}
          </span>
        </header>

        {sidebarOpen && (
          <button
            type="button"
            className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
            aria-label="Fermer le menu"
            onClick={closeDrawer}
          />
        )}

        <aside
          className={[
            'flex w-64 flex-col border-r border-slate-200 bg-white dark:bg-cursor-sidebar dark:border-cursor-border transition-transform duration-200 ease-out',
            'md:relative md:translate-x-0 md:flex-none',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'fixed inset-y-0 left-0 z-50 md:static',
          ].join(' ')}
          aria-label="Navigation principale du backoffice"
        >
          <SidebarContent
            config={config}
            profileLabel={profileLabel}
            items={navItems}
            location={location}
            onLogout={handleLogout}
            onNavigate={closeDrawer}
          />
        </aside>

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6 pt-20 md:pt-6"
          tabIndex={-1}
        >
          <PageLayout>
            <Outlet />
          </PageLayout>
        </main>

        <CommandPalette
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          items={commandPaletteItems}
          onSelect={(to) => {
            if (to.startsWith('action:')) {
              runAction(to);
            } else {
              navigate(to);
            }
            setCommandPaletteOpen(false);
          }}
        />

        <ShortcutHelpModal
          open={shortcutHelpOpen}
          onClose={() => setShortcutHelpOpen(false)}
          sidebarItems={navItems}
        />
      </div>
    </>
  );
}
