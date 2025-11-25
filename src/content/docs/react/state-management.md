---
title: React State Management
description: Standards for managing local, shared, and server state in React.
---

# React State Management

Pick the lightest-weight solution that satisfies the problem. Keep presentation components free of data-fetching and side effects.

## State Categories

- **Local UI state** – use `useState` or `useReducer` inside components or hooks. Examples: modal visibility, form inputs, tabs.
- **Derived view state** – compute values from props/state with memoized selectors (`useMemo`) instead of storing copies.
- **Server/cache state** – use `react-query`, `SWR`, or framework data loaders to handle fetching, caching, retries, and background refresh.
- **Global app state** – share auth/session, feature flags, or theme through Context + custom hooks or light libraries (Zustand, Jotai). Keep the surface small.

### Example: Local State

```tsx
// Simple local state
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && (
        <div className="modal">
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}

// Complex local state with useReducer
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

## Guidelines

1. **Colocate**: keep state as close as possible to the components that need it. Lift only when two siblings require the same data.
2. **Encapsulate**: wrap complex side effects inside custom hooks (e.g., `useUserProfile`) so components stay declarative.
3. **Normalize server data**: map API responses to UI-friendly models inside services/hooks, not inside the component tree.
4. **Avoid prop drilling**: when three or more levels need the same data, create a context or use a feature store.
5. **Immutable updates**: rely on pure functions; never mutate state arrays/objects in place.

## Async Data

- Prefer suspense-friendly data layers (React Query + `suspense: true`, Next.js `fetch` caching) where possible.
- Handle loading, error, and empty states explicitly. Reusable blocks should accept `isLoading`, `error`, and fallback content props.
- Cancel requests inside `useEffect` cleanup for manual fetches (`AbortController`).

### Example: React Query with Suspense

```tsx
// hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json()),
    suspense: true, // Enable Suspense
  });
}

// Component with Suspense:
import { Suspense } from 'react';
import { useProjects } from '@/hooks/useProjects';

function ProjectsList() {
  const { data: projects } = useProjects(); // Suspense handles loading
  
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

### Example: Manual Fetch with Cleanup

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

    return () => controller.abort(); // Cancel on unmount
  }, []);

  return { data, loading, error };
}
```

## Forms

- Use `react-hook-form` or `Formik` for complex forms to reduce re-renders and maintain validation consistency.
- Centralize field components (inputs, selects, buttons) so styling and validation messages are uniform.

### Example: React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

## State Persistence

- Persist only what you truly need (e.g., auth tokens, theme preference). Use `localStorage` or `IndexedDB` with versioned keys and migration helpers.
- Never store secrets or derived data that can be recomputed cheaply.

### Example: Persistent State Hook

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

// Usage:
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

By keeping state logic in hooks/contexts and feeding clean props into headers, footers, buttons, and reusable blocks, we maintain predictable component trees.

