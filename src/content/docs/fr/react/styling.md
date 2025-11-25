---
title: Guide de styles React
description: Stratégies CSS, thèmes et bonnes pratiques d’accessibilité pour React.
---

# Guide de styles React

Une approche cohérente du styling garantit que header, footer, boutons et blocs réutilisables partagent la même identité visuelle.

## Approches privilégiées

- **Design tokens** : définir couleurs, typo, espacements, rayons, ombres et z-index dans `styles/tokens.ts` ou via des variables CSS.
- **Styles scoppés** : favoriser CSS Modules, Tailwind ou CSS-in-JS compatible SSR.
- **Compatibilité serveur** : vérifier que la solution choisie supporte SSR/SSG (styled-components + Babel plugin, Vanilla Extract, etc.).

## Organisation des fichiers

- `styles/global.css` ou `styles/global.ts` pour les resets et la typo.
- Styles spécifiques à un composant à côté du fichier React (`Component.module.css`, `Component.styles.ts`).
- Les primitives partagées (header, footer, boutons, blocs) consomment les tokens via un point d’entrée unique afin d’éviter les divergences.

## Nommage & conventions

- Utiliser des noms descriptifs type BEM pour le CSS pur (`.header__nav`, `.footer__cta`).
- Pour Tailwind, configurer les presets dans `tailwind.config.js` pour coller aux tokens.
- Limiter les styles inline aux cas dynamiques impraticables en CSS (canvas, calculs à la volée).

## Responsive design

- Concevoir mobile-first et monter en min-width.
- Créer des primitives de layout (`<Stack>`, `<Grid>`, `<Section>`) qui appliquent les espacements communs.
- Les blocs réutilisables doivent accepter des props responsive (`columns={{ base: 1, md: 2 }}`) afin de garder des interfaces déclaratives.

## Mode sombre & thèmes

- Gérer les thèmes via variables CSS ou `ThemeProvider`.
- Vérifier que header, footer et boutons respectent le thème courant sans valeurs codées en dur.
- Tester toutes les variantes sur fonds clairs/foncés pour garantir les ratios de contraste.

## Accessibilité

- Respecter WCAG (4.5:1 pour le texte standard).
- Ne jamais communiquer un état uniquement par la couleur ; ajouter icône ou texte.
- Conserver des focus visibles pour tous les éléments interactifs, y compris les boutons personnalisés.

## Gestion des assets

- Optimiser les images de sections réutilisées (`<picture>`, `srcset`, composant Next/Image).
- Précharger les polices critiques et prévoir des polices de secours système.

Documenter les décisions dans `styles/README.md` afin que l’équipe sache comment étendre le système de design sans casser l’uniformité des composants partagés.

