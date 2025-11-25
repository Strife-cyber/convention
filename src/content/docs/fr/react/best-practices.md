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
- Ne mémoïser (`React.memo`, `useMemo`, `useCallback`) qu'après mesure via le profiler.

### Exemple : Découpage de composant

```tsx
// ❌ Mauvais : Composant monolithique
export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  // ... 300+ lignes de logique
}

// ✅ Bon : Découpage en petits composants
export function UserProfile() {
  const { user } = useUser();
  return (
    <div>
      <UserHeader user={user} />
      <UserPosts userId={user.id} />
      <UserSettings userId={user.id} />
    </div>
  );
}

// Les exports nommés améliorent le débogage:
export { UserProfile };
```

## Données & effets

- Centraliser les appels réseau dans des hooks/services, pas dans les composants de présentation.
- Utiliser `react-query`, `SWR` ou les loaders framework pour gérer cache, retries et revalidation.
- Nettoyer tous les effets (`AbortController`, clearTimeout) pour éviter les fuites mémoire.

### Exemple : Récupération de données avec React Query

```tsx
// hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Composant:
import { useProjects } from '@/hooks/useProjects';

export function ProjectsList() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {projects?.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

### Exemple : Nettoyage dans useEffect

```tsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(console.error);

  const timeoutId = setTimeout(() => {
    // Action différée
  }, 1000);

  return () => {
    controller.abort(); // Annuler le fetch
    clearTimeout(timeoutId); // Nettoyer le timeout
  };
}, []);
```

## Accessibilité

- Partir d’un HTML sémantique puis enrichir si nécessaire.
- Respecter l’ordre de tabulation visuel et fournir des focus visibles.
- N’employer `aria-*` qu’en complément lorsque les éléments natifs ne suffisent pas.

## Performance

- Découper le code par route et par gros composants (`React.lazy`, `next/dynamic`).
- Reporter les scripts non critiques (`async`, `defer`, `requestIdleCallback`).
- Mémoïser les dérivés coûteux à l'aide de sélecteurs ou `useMemo`.

### Exemple : Découpage de code

```tsx
// Chargement différé de composants lourds
import { lazy, Suspense } from 'react';

const HeavyModal = lazy(() => import('./HeavyModal'));
const ChartLibrary = lazy(() => import('./ChartLibrary'));

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <HeavyModal />
      </Suspense>
      <Suspense fallback={<div>Chargement du graphique...</div>}>
        <ChartLibrary />
      </Suspense>
    </div>
  );
}

// Import dynamique Next.js:
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('./Chart'), {
  loading: () => <p>Chargement...</p>,
  ssr: false, // Désactiver SSR si nécessaire
});
```

### Exemple : Mémoïsation

```tsx
// Mémoïser uniquement si le profiler le justifie
import { useMemo } from 'react';

export function ExpensiveList({ items, filter }) {
  // Mémoïser le calcul coûteux
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

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

