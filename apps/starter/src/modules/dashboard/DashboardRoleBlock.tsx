/**
 * Bloc "Mon rôle" du dashboard : titre, description, actions rapides.
 * Composant présentiel uniquement (pas de logique métier).
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import type { RoleCopy } from './roleCopy';

type DashboardRoleBlockProps = {
  role: RoleCopy;
};

export function DashboardRoleBlock({
  role,
}: DashboardRoleBlockProps): React.ReactElement {
  const navigate = useNavigate();
  return (
    <Card>
      <p className="text-xs font-semibold uppercase text-slate-500 mb-1">
        Mon rôle
      </p>
      <p className="text-sm font-semibold">{role.title}</p>
      <p className="mt-1 text-sm text-slate-600">{role.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {role.actions.map((action) => (
          <Button
            key={action.to}
            size="sm"
            variant="secondary"
            onClick={() => navigate(action.to)}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
