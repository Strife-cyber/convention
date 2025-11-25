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

## Forms

- Use `react-hook-form` or `Formik` for complex forms to reduce re-renders and maintain validation consistency.
- Centralize field components (inputs, selects, buttons) so styling and validation messages are uniform.

## State Persistence

- Persist only what you truly need (e.g., auth tokens, theme preference). Use `localStorage` or `IndexedDB` with versioned keys and migration helpers.
- Never store secrets or derived data that can be recomputed cheaply.

By keeping state logic in hooks/contexts and feeding clean props into headers, footers, buttons, and reusable blocks, we maintain predictable component trees.

