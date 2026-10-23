/**
 * Périmètre d'erreur React : affiche un écran de repli en cas d'exception dans l'arbre.
 * Les erreurs sont loguées via le logger (sans PII).
 */
import React from 'react';
import { Card, Button } from '@bank/ui';
import { logBoundaryError } from '../lib/monitoring/logger';

type ErrorBoundaryState = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logBoundaryError(error, {
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <Card
            variant="error"
            title="Une erreur inattendue est survenue"
            description="Cette interface est en mode démo : aucun impact sur un environnement réel."
            className="max-w-xl"
          >
            <p className="mb-3 text-sm text-slate-600">
              Détail (technique) de l'erreur :
            </p>
            <pre className="mb-4 max-h-32 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-50">
              {this.state.error?.message ?? 'Erreur inconnue'}
            </pre>
            <div className="flex gap-2">
              <Button onClick={this.handleRetry}>Réessayer</Button>
              <Button variant="ghost" onClick={() => window.location.reload()}>
                Recharger la page
              </Button>
            </div>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
