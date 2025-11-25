---
title: Gestion d’état React
description: Bonnes pratiques pour gérer les états locaux, partagés et serveur dans React.
---

# Gestion d’état React

Choisir la solution la plus légère possible et garder les composants de présentation exempts d’effets de bord.

## Types d’états

- **État local UI** – `useState` ou `useReducer` directement dans le composant/hook (modales, formulaires, onglets).
- **État dérivé** – calculer via `useMemo`/sélecteurs plutôt que stocker des duplicatas.
- **État serveur/cache** – `react-query`, `SWR` ou loaders framework pour gérer cache, retries, revalidation.
- **État global** – Auth, thème, feature flags via Context + hooks ou librairies légères (Zustand, Jotai). Limiter la surface exposée.

## Lignes directrices

1. **Colocaliser** : conserver l’état au plus proche des composants qui l’utilisent.
2. **Encapsuler** : déplacer effets et requêtes dans des hooks (`useUserProfile`) afin que les composants restent déclaratifs.
3. **Normaliser** : mapper les réponses API vers des modèles UI dans les services/hooks, pas dans les composants.
4. **Éviter le prop drilling** : à partir de trois niveaux, créer un contexte ou une boutique de feature.
5. **Immutabilité** : ne jamais muter les objets/arrays en place.

## Données asynchrones

- Préférer les solutions compatibles Suspense lorsque possible.
- Gérer explicitement les états `loading`, `error`, `empty`. Les blocs réutilisables doivent accepter ces props pour rester prévisibles.
- Annuler les requêtes dans les cleanups (`AbortController`).

## Formulaires

- Utiliser `react-hook-form` ou `Formik` pour les formulaires complexes (validation, perf).
- Centraliser les champs (input, select, bouton) afin d’uniformiser styles et messages d’erreur.

## Persistance

- Persister uniquement ce qui est indispensable (token, thème). Versionner les clés `localStorage`/IndexedDB et prévoir des migrations.
- Ne jamais stocker de secrets ni de données aisément recalculables.

En gardant la logique d’état dans des hooks/conteneurs et en passant des props propres aux composants partagés (header, footer, blocs, boutons), on obtient des arbres React prévisibles.

