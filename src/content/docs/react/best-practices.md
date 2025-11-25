---
title: React Best Practices
description: Core guidelines for building reliable, maintainable React apps.
---

# React Best Practices

These principles keep our React codebases predictable, accessible, and easy to evolve.

## Language & Tooling

- Prefer **TypeScript** for every React project. Enable `strict` mode and fix type errors immediately.
- Adopt the framework’s recommended tooling (Vite, Next.js, Remix). Avoid ejecting unless absolutely necessary.
- Enforce formatting (`prettier`) and linting (`eslint-config-next`, `eslint-config-airbnb`, or custom) via CI.

## Component Hygiene

- Keep components below ~200 lines. Split logic into custom hooks or child components when they grow too large.
- Avoid anonymous default exports; named components improve stack traces and DevTools readability.
- Memoize only when profiling proves it helps. Measure before introducing `React.memo`, `useMemo`, or `useCallback`.

### Example: Component Splitting

```tsx
// ❌ Bad: Monolithic component
export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  // ... 300+ lines of logic
}

// ✅ Good: Split into smaller components
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

// Named exports improve debugging:
export { UserProfile };
```

## Data & Side Effects

- Fetch data inside hooks or route loaders, not inside presentation components.
- Use `react-query`, `SWR`, or framework loaders for caching, retries, and background refresh.
- Cancel subscriptions/timeouts in `useEffect` cleanup to prevent memory leaks.

### Example: Data Fetching with React Query

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

// Component:
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

### Example: Cleanup in useEffect

```tsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(console.error);

  const timeoutId = setTimeout(() => {
    // Some delayed action
  }, 1000);

  return () => {
    controller.abort(); // Cancel fetch
    clearTimeout(timeoutId); // Clear timeout
  };
}, []);
```

## Accessibility

- Build with semantic HTML first, then enhance with interactivity.
- Ensure keyboard focus order matches the visual order. Provide visible focus indicators.
- Use `aria-*` attributes only when semantics are insufficient; otherwise rely on native elements.

## Performance

- Code-split by route and by large components (e.g., modal-heavy flows). Prefer framework-level support (`next/dynamic`, `React.lazy`).
- Defer non-critical scripts with `async`/`defer` or load them after `requestIdleCallback`.
- Cache expensive derived data via memoized selectors or `useMemo`.

### Example: Code Splitting

```tsx
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyModal = lazy(() => import('./HeavyModal'));
const ChartLibrary = lazy(() => import('./ChartLibrary'));

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <HeavyModal />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <ChartLibrary />
      </Suspense>
    </div>
  );
}

// Next.js dynamic import:
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('./Chart'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if needed
});
```

### Example: Memoization

```tsx
// Only memoize when profiling shows it helps
import { useMemo } from 'react';

export function ExpensiveList({ items, filter }) {
  // Memoize expensive computation
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

## Styling & Theming

- Centralize design tokens (colors, typography, radii) and consume them from buttons, blocks, header/footer, etc.
- Keep page-specific styles scoped (CSS Modules, CSS-in-JS, or utility-first classes). Avoid bleeding selectors into global scope.

## Testing & Quality

- Aim for the testing pyramid: unit (React Testing Library + Vitest/Jest), integration (render routes with mock APIs), and E2E (Playwright/Cypress).
- Write tests from the user’s perspective: interact via screen text and roles rather than class names.
- Automate accessibility and visual regression checks in CI where feasible.

## Documentation

- Each feature folder needs a README covering architecture decisions, APIs, and known trade-offs.
- Document reusable components (header, footer, buttons, page blocks) in Storybook or MDX.

Consistently applying these practices keeps our React stack aligned with the same rigor as the Flutter and Unity guidelines already in this repository.

