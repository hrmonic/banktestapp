import React from "react";
import { Card, Button } from "@bank/ui";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card
        title="Page non trouvée"
        description="La ressource demandée n’existe pas dans cette démo de backoffice bancaire."
        className="max-w-lg text-sm text-slate-700"
      >
        <p className="mb-4">
          Vérifiez l’URL ou revenez au tableau de bord principal pour continuer
          votre navigation.
        </p>
        <Button onClick={() => navigate("/")}>Revenir au Dashboard</Button>
      </Card>
    </div>
  );
}

export default NotFoundPage;
