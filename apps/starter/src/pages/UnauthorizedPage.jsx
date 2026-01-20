import React from "react";

function UnauthorizedPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  );
}

export default UnauthorizedPage;
