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

### Example: Page Structure

```tsx
// src/app/home/HomePage.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroBlock } from '@/components/blocks/HeroBlock';
import { FeatureGrid } from '@/components/blocks/FeatureGrid';
import { Button } from '@/components/ui/Button';

export function HomePage() {
  return (
    <>
      <Header 
        navItems={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' }
        ]}
      />
      <main>
        <HeroBlock 
          heading="Welcome"
          ctaLabel="Get Started"
          ctaHref="/signup"
        />
        <FeatureGrid 
          items={features}
          columns={3}
        />
      </main>
      <Footer 
        copyright="© 2024 Company"
        links={footerLinks}
      />
    </>
  );
}
```

### Example: Entry Point

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AppRouter } from './AppRouter';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
);
```

## Feature Modules

- Group feature-specific screens, hooks, reducers, and services inside `features/<feature-name>/`.
- Export feature entry points via `features/<feature-name>/index.ts` to keep import paths short.
- Keep domain-specific components inside the feature until they become generic enough for `components/`.

### Example: Feature Structure

```
features/
└── auth/
    ├── components/
    │   ├── LoginForm.tsx
    │   └── SignupForm.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useLogin.ts
    ├── services/
    │   └── authService.ts
    └── index.ts          # Exports: LoginForm, SignupForm, useAuth
```

```tsx
// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { useAuth } from './hooks/useAuth';

// Usage in app:
import { LoginForm, useAuth } from '@/features/auth';
```

## Entry Points

- Use `src/main.tsx` (Vite) or `src/index.tsx` (CRA) only for bootstrapping providers and rendering the root route.
- Maintain a single `AppRouter` that maps routes to page components; avoid defining routes from nested feature files.

## Environment & Configuration

- Store runtime configuration in `src/config/` (e.g., `env.ts`, feature flags). Read from environment variables once, then expose typed helpers.
- Treat `.env` files as read-only at runtime. Document required variables in the project README.

### Example: Configuration

```tsx
// src/config/env.ts
interface EnvConfig {
  apiUrl: string;
  enableAnalytics: boolean;
  featureFlags: {
    newCheckout: boolean;
  };
}

export const config: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.example.com',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  featureFlags: {
    newCheckout: import.meta.env.VITE_FEATURE_NEW_CHECKOUT === 'true',
  },
};

// Usage:
import { config } from '@/config/env';
fetch(`${config.apiUrl}/users`);
```

By sticking to this structure, React pages remain thin, and shared components (header, footer, buttons, repeated blocks) stay portable and easy to evolve.

