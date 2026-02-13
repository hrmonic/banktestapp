/**
 * Page affichée lorsqu'aucun module n'est activé dans la configuration.
 * Évite un état indéterminé sur "/" quand l'utilisateur est authentifié.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { useAuth } from '../lib/auth/authProvider';

export default function NoModulesPage(): React.ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-xl">
      <Card
        title="Aucun module activé"
        description="Aucun module métier n'est actuellement activé pour cette application. Contactez votre administrateur pour activer au moins un module dans la configuration (client.config.json)."
        className="text-sm text-slate-700"
      >
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </div>
      </Card>
    </div>
  );
}
