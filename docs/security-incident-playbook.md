## Playbook d'incident front – Modular BankUI Studio

Ce playbook décrit les actions recommandées lorsqu'un incident
de sécurité ou de confidentialité est détecté côté front.

### 1. PII détectée dans les logs front

1. Identifier la source :
   - composant ou module à l'origine du log,
   - payload exact (sans le republier en clair dans les tickets).
2. Désactiver immédiatement tout log incriminé (feature flag ou patch rapide).
3. Ouvrir un ticket d'incident interne avec :
   - contexte, date/heure, environnements concernés,
   - estimation du volume d'utilisateurs potentiellement affectés.
4. Coordonner avec les équipes backend/compliance pour l'analyse d'impact.

### 2. Désactivation urgente d'un module via `client.config.json`

En cas d'incident ciblant un module (ex. `transactions`, `audit`) :

- positionner `modules.<id>.enabled = false` dans la config d'environnement ;
- vérifier, via les tests E2E, que le module disparaît bien de la sidebar
  et que ses routes ne sont plus accessibles ;
- documenter le changement et prévoir un plan de réactivation sécurisé.

### 3. Erreurs front critiques en production

1. Surveiller les erreurs via votre outil d'observabilité (ex. Sentry).
2. Taguer les erreurs critiques liées à la sécurité ou à l'accès aux données.
3. Définir des seuils d'alerting (taux d'erreurs, endpoints, modules).
4. En cas de dépassement de seuil :
   - communiquer avec les équipes produit/support,
   - envisager un rollback de la version ou la désactivation d'un module.

### 4. Coordination & post-mortem

Après résolution de l'incident :

- organiser un court post-mortem orienté apprentissage ;
- mettre à jour `docs/security-hardening.md` et ce playbook
  avec les mesures préventives identifiées ;
- ajouter ou renforcer les tests (unitaires, intégration, E2E)
  qui auraient permis de détecter le problème plus tôt.
