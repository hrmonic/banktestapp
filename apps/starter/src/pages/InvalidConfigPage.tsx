/**
 * Page affichée lorsque la configuration client (client.config.json) est invalide.
 */
import React from 'react';
import { Card, Button } from '@bank/ui';

type InvalidConfigPageProps = {
  error?: Error & { name?: string };
};

export default function InvalidConfigPage({
  error,
}: InvalidConfigPageProps): React.ReactElement {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card
        variant="error"
        title="Configuration invalide"
        description="Le fichier client.config.json ne respecte pas le contrat attendu par l'application."
        className="max-w-xl text-sm text-slate-700"
      >
        <p className="mb-4">
          Vérifiez les sections <code>branding</code>, <code>modules</code>,
          <code>api</code> et <code>auth</code> de votre configuration, puis
          rechargez la page.
        </p>
        {error != null && (
          <details className="mb-4 rounded bg-slate-50 p-3 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium">
              Détails techniques
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>
        )}
        <Button type="button" onClick={() => window.location.reload()}>
          Recharger la page
        </Button>
      </Card>
    </div>
  );
}
