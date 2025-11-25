---
title: React Project Structure
description: Recommended folder layout and naming conventions for React apps.
---

# React Project Structure

We keep the file system aligned with React’s component-driven mindset so that reusable blocks (headers, footers, buttons, repeated sections) live in dedicated folders.

## Directory Layout

```
src/
├── app/ or pages/         # Route-level entries (Next.js, Remix) or page shells
├── components/            # Reusable, presentation-only building blocks
│   ├── layout/            # `Header`, `Footer`, navigation, SEO head
│   ├── ui/                # Buttons, cards, form controls, icons
│   └── blocks/            # Page sections repeated across screens (hero, feature grid)
├── features/              # Self-contained product flows combining UI + logic
├── hooks/                 # Custom hooks per domain (useAuth, useFeatureFlags)
├── services/              # API clients, data access, SDK wrappers
├── styles/                # Global styles, tokens, theme config
├── tests/                 # Cross-cutting mocks, integration helpers
└── utils/                 # Pure helpers with zero React imports
```

## Naming Guidelines

- **Components** use `PascalCase`: `Header.tsx`, `PricingCard.tsx`.
- **Hooks** start with `use`: `useSessionTimeout.ts`.
- **Shared variants** (buttons, layout blocks) belong to sub-folders that mirror their role: `components/ui/Button/PrimaryButton.tsx`.
- **Tests** colocated when practical: `ComponentName.test.tsx`. Cross-feature fixtures go under `tests/`.

## Layout Conventions

- Every page must import `Header` and `Footer` components from `components/layout/`. Layout components own navigation, branding, SEO tags, and shared providers (e.g., `<ThemeProvider>`).
- Sections that repeat (hero strips, KPI rows, FAQs) become reusable block components in `components/blocks/`. Configure them with props (e.g., `items`, `ctaLabel`) so they remain customizable.
- Buttons, links, and form controls ship from `components/ui/` with a base API (`variant`, `size`, `asChild`). Avoid redefining styles directly in pages.

## Feature Modules

- Group feature-specific screens, hooks, reducers, and services inside `features/<feature-name>/`.
- Export feature entry points via `features/<feature-name>/index.ts` to keep import paths short.
- Keep domain-specific components inside the feature until they become generic enough for `components/`.

## Entry Points

- Use `src/main.tsx` (Vite) or `src/index.tsx` (CRA) only for bootstrapping providers and rendering the root route.
- Maintain a single `AppRouter` that maps routes to page components; avoid defining routes from nested feature files.

## Environment & Configuration

- Store runtime configuration in `src/config/` (e.g., `env.ts`, feature flags). Read from environment variables once, then expose typed helpers.
- Treat `.env` files as read-only at runtime. Document required variables in the project README.

By sticking to this structure, React pages remain thin, and shared components (header, footer, buttons, repeated blocks) stay portable and easy to evolve.

