import React from "react";
import { Card } from "@bank/ui";

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card
        title="Accès refusé"
        description="Vous n’avez pas les permissions nécessaires pour accéder à cette section du backoffice."
        className="max-w-lg text-sm text-slate-700"
      >
        <p>
          Si vous deviez avoir accès à ce module, ce serait ici qu’un rôle
          spécifique (par exemple <code>backoffice-approver</code>) serait
          requis.
        </p>
      </Card>
    </div>
  );
}

export default UnauthorizedPage;
