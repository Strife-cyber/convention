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

## Data & Side Effects

- Fetch data inside hooks or route loaders, not inside presentation components.
- Use `react-query`, `SWR`, or framework loaders for caching, retries, and background refresh.
- Cancel subscriptions/timeouts in `useEffect` cleanup to prevent memory leaks.

## Accessibility

- Build with semantic HTML first, then enhance with interactivity.
- Ensure keyboard focus order matches the visual order. Provide visible focus indicators.
- Use `aria-*` attributes only when semantics are insufficient; otherwise rely on native elements.

## Performance

- Code-split by route and by large components (e.g., modal-heavy flows). Prefer framework-level support (`next/dynamic`, `React.lazy`).
- Defer non-critical scripts with `async`/`defer` or load them after `requestIdleCallback`.
- Cache expensive derived data via memoized selectors or `useMemo`.

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

