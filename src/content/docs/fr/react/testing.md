---
title: Standards de tests React
description: Attendus pour les tests unitaires, d’intégration et E2E des projets React.
---

# Standards de tests React

Tester garantit le bon fonctionnement des composants partagés (header, footer, boutons, blocs) sur toutes les pages.

## Outils

- **Unitaires / intégration** : React Testing Library + Vitest/Jest (environnement jsdom).
- **Mock** : MSW pour les appels HTTP, fixtures dédiées pour les stores.
- **E2E** : Playwright ou Cypress.
- **Accessibilité** : `@testing-library/jest-dom` + `axe-core`.

## Pyramide de tests

1. **Unitaires** – composants, hooks, utils isolés.
2. **Intégration** – routes/flows complets avec APIs mockées.
3. **E2E** – parcours réels dans un navigateur.

## Tests de composants

- Interagir comme un utilisateur (`screen.getByRole`, `getByText`), limiter `data-testid`.
- Couvrir les props critiques (navigation du header, variantes de boutons, sections personnalisables).
- Vérifier focus, gestion clavier et attributs ARIA.

```tsx
it('affiche le bloc hero avec CTA', () => {
  render(<HeroBlock heading="Construisez plus vite" ctaLabel="Commencer" />);
  expect(screen.getByRole('heading', { name: /construisez plus vite/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /commencer/i })).toHaveAttribute('data-variant', 'primary');
});
```

## Hooks & état

- Utiliser `renderHook` + `act` et mocker le réseau/contexte requis.
- Vérifier la stabilité des références lorsque les dépendances ne changent pas.

## Tests d’intégration

- Rendre les routes complètes avec `Header` + `Footer` pour capturer les régressions de providers.
- Mocker les réponses via MSW pour rester déterministe.
- Contrôler les effets (analytics, stockage) via des espions.

## Tests E2E

- Automatiser les parcours clés : authentification, navigation contenu, achats.
- Exécuter sur des builds proches de la prod (preview, staging).
- Capturer des screenshots pour les blocs critiques (hero, pricing, CTA).

## Couverture attendue

- 80 %+ de couverture sur composants partagés et hooks.
- 100 % sur les primitives design system (boutons, navigation).
- Au moins une suite E2E smoke par pipeline.

Les tests doivent tourner en CI sur chaque pull request afin d’éviter les régressions côté React.

