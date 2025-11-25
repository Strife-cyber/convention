---
title: Architecture des composants React
description: Principes pour composer des composants React réutilisables et accessibles.
---

# Architecture des composants React

Les pages React doivent être une composition de petits composants autonomes, réutilisables et faciles à tester.

## Principes

- **Composition > héritage** : assembler des primitives (`Layout`, `Stack`, `Button`) plutôt que de créer de gros composants monolithiques.
- **Responsabilité unique** : un composant gère soit la présentation, soit l’orchestration, soit la logique de données, jamais tout en même temps.
- **Contrats explicites** : typer tous les props avec TypeScript, bannir `any`.
- **UI stateless par défaut** : déplacer l’état dans un hook ou un conteneur proche et passer les données par props.

## Composants de layout

- `Header`, `Footer` et tout chrome persistant vivent dans `components/layout/`.
- Ils hébergent les providers globaux (thème, i18n) et les hooks de navigation mais déléguent la logique métier aux features.
- Les props doivent permettre la configuration (items de navigation, CTA, langue active, switcher).

## Blocs réutilisables

- Toute section récurrente (hero, grilles de fonctionnalités, témoignages) est placée dans `components/blocks/`.
- Les blocs exposent des props pour rester personnalisables (`alignment`, `mediaPosition`, `badgeLabel`, `items`).
- Si un bloc nécessite une requête, effectuer l’appel dans un parent/Hook puis fournir les données au bloc afin qu’il reste pur.

## UI Elements (boutons, inputs, etc.)

- Implémenter les boutons une seule fois dans `components/ui/Button/` avec des variantes (`variant`, `size`, `asChild`).
- Gérer les états focus/hover/disabled et ajouter par défaut `type="button"` hors formulaires de soumission.
- Partager tokens (couleurs, espaces, polices) via un thème central pour garder header, footer, blocs et boutons alignés.

## Hooks & conteneurs

- Les hooks (`useHeroContent`, `useFetchProjects`) encapsulent side effects et accès données.
- Les conteneurs (souvent sous `features/`) connectent hooks + composants de présentation, gèrent les loaders et callbacks.
- Éviter `fetch` ou mutations globales dans les composants de présentation.

## Props et valeurs par défaut

- Limiter les props obligatoires au strict nécessaire et définir des `defaultProps`/valeurs par défaut.
- Utiliser des unions discriminées pour les variantes exclusives.
- Documenter les props via TSDoc pour faciliter l’autocomplétion.

## Accessibilité & i18n

- Tous les composants doivent rester accessibles au clavier et exposer des focus visibles.
- Internationaliser le texte : passer les libellés via props ou hooks de traduction, ne pas hardcoder.
- Utiliser les balises sémantiques (`<header>`, `<footer>`, `<section role="region">`) lorsque pertinent.

## Documentation visuelle

- Chaque composant réutilisable doit être documenté (Storybook ou MDX) avec :
  - États par défaut, variantes et modes désactivés
  - Thèmes clair/sombre
  - Exemples multi-langues si nécessaire

Ces règles garantissent que header, footer, boutons et blocs personnalisables restent cohérents tout en laissant de la flexibilité aux équipes produit.

