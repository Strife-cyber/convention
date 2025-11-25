---
title: Bonnes pratiques React
description: Principes clés pour des applications React fiables et maintenables.
---

# Bonnes pratiques React

Ces principes maintiennent nos bases de code React prévisibles, accessibles et alignées avec les autres plateformes du projet.

## Langage & tooling

- Utiliser **TypeScript** partout avec `strict: true`.
- S’appuyer sur l’outillage recommandé par le framework (Vite, Next.js, Remix) et éviter les éjections.
- Faire respecter `prettier` + `eslint` en local et en CI.

## Hygiène des composants

- Viser <200 lignes par composant. Extraire la logique dans des hooks ou sous-composants si besoin.
- Préférer les exports nommés pour améliorer les traces de stack.
- Ne mémoïser (`React.memo`, `useMemo`, `useCallback`) qu’après mesure via le profiler.

## Données & effets

- Centraliser les appels réseau dans des hooks/services, pas dans les composants de présentation.
- Utiliser `react-query`, `SWR` ou les loaders framework pour gérer cache, retries et revalidation.
- Nettoyer tous les effets (`AbortController`, clearTimeout) pour éviter les fuites mémoire.

## Accessibilité

- Partir d’un HTML sémantique puis enrichir si nécessaire.
- Respecter l’ordre de tabulation visuel et fournir des focus visibles.
- N’employer `aria-*` qu’en complément lorsque les éléments natifs ne suffisent pas.

## Performance

- Découper le code par route et par gros composants (`React.lazy`, `next/dynamic`).
- Reporter les scripts non critiques (`async`, `defer`, `requestIdleCallback`).
- Mémoïser les dérivés coûteux à l’aide de sélecteurs ou `useMemo`.

## Styles & thèmes

- Centraliser les design tokens et les réutiliser dans header, footer, boutons et blocs.
- Garder les styles spécifiques à une page scoppés (CSS Modules, CSS-in-JS, Tailwind).

## Tests & qualité

- Respecter la pyramide de tests : unitaires (React Testing Library), intégration (routes + MSW), E2E (Playwright/Cypress).
- Tester depuis le point de vue utilisateur : rôles, texte, interactions clavier.
- Automatiser les checks accessibilité/visuels dans la CI.

## Documentation

- Chaque dossier feature doit documenter architecture, API et choix techniques.
- Documenter les composants réutilisables (header, footer, boutons, blocs) dans Storybook/MDX.

Appliquer ces bonnes pratiques rapproche la qualité de nos projets React des conventions Flutter et Unity décrites dans cette documentation.

