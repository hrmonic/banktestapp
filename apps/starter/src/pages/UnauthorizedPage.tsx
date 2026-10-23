/**
 * Page affichée lorsque l'utilisateur n'a pas les permissions pour accéder à une section.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { useAuth } from '../lib/auth/authProvider';

export default function UnauthorizedPage(): React.ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card
        title="Accès refusé"
        description="Vous n'avez pas les permissions nécessaires pour accéder à cette section du backoffice."
        className="max-w-lg text-sm text-slate-700"
      >
        <p className="mb-4">
          Si vous deviez avoir accès à ce module, un rôle spécifique (par
          exemple <code>backoffice-approver</code>) serait requis.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/">
            <Button type="button" variant="primary" size="md">
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Button
            type="button"
            variant="secondary"
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
