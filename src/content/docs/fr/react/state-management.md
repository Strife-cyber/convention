---
title: Gestion d’état React
description: Bonnes pratiques pour gérer les états locaux, partagés et serveur dans React.
---

# Gestion d’état React

Choisir la solution la plus légère possible et garder les composants de présentation exempts d’effets de bord.

## Types d'états

- **État local UI** – `useState` ou `useReducer` directement dans le composant/hook (modales, formulaires, onglets).
- **État dérivé** – calculer via `useMemo`/sélecteurs plutôt que stocker des duplicatas.
- **État serveur/cache** – `react-query`, `SWR` ou loaders framework pour gérer cache, retries, revalidation.
- **État global** – Auth, thème, feature flags via Context + hooks ou librairies légères (Zustand, Jotai). Limiter la surface exposée.

### Exemple : État local

```tsx
// État local simple
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir</button>
      {isOpen && (
        <div className="modal">
          <button onClick={() => setIsOpen(false)}>Fermer</button>
        </div>
      )}
    </>
  );
}

// État local complexe avec useReducer
interface TabState {
  activeTab: string;
  tabs: string[];
}

function tabReducer(state: TabState, action: { type: string; tab?: string }) {
  switch (action.type) {
    case 'SELECT_TAB':
      return { ...state, activeTab: action.tab! };
    default:
      return state;
  }
}

function Tabs() {
  const [state, dispatch] = useReducer(tabReducer, {
    activeTab: 'tab1',
    tabs: ['tab1', 'tab2', 'tab3'],
  });

  return (
    <div>
      {state.tabs.map(tab => (
        <button
          key={tab}
          onClick={() => dispatch({ type: 'SELECT_TAB', tab })}
          className={state.activeTab === tab ? 'active' : ''}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
```

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

### Exemple : React Query avec Suspense

```tsx
// hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json()),
    suspense: true, // Activer Suspense
  });
}

// Composant avec Suspense:
import { Suspense } from 'react';
import { useProjects } from '@/hooks/useProjects';

function ProjectsList() {
  const { data: projects } = useProjects(); // Suspense gère le chargement
  
  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}

export function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary>
        <ProjectsList />
      </ErrorBoundary>
    </Suspense>
  );
}
```

### Exemple : Fetch manuel avec nettoyage

```tsx
function useFetchProjects() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/projects', { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // Annuler au démontage
  }, []);

  return { data, loading, error };
}
```

## Formulaires

- Utiliser `react-hook-form` ou `Formik` pour les formulaires complexes (validation, perf).
- Centraliser les champs (input, select, bouton) afin d'uniformiser styles et messages d'erreur.

### Exemple : React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Mot de passe"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}
```

## Persistance

- Persister uniquement ce qui est indispensable (token, thème). Versionner les clés `localStorage`/IndexedDB et prévoir des migrations.
- Ne jamais stocker de secrets ni de données aisément recalculables.

### Exemple : Hook d'état persistant

```tsx
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Utilisation:
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Thème actuel : {theme}
    </button>
  );
}
```

En gardant la logique d’état dans des hooks/conteneurs et en passant des props propres aux composants partagés (header, footer, blocs, boutons), on obtient des arbres React prévisibles.

