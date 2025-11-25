---
title: Structure de projet React
description: Organisation recommandée des dossiers et règles de nommage pour React.
---

# Structure de projet React

Nous alignons l’arborescence sur l’approche component-driven de React afin que les blocs réutilisables (header, footer, boutons, sections répétées) restent centralisés et faciles à maintenir.

## Arborescence type

```
src/
├── app/ ou pages/         # Points d’entrée par route (Next.js, Remix) ou coquilles de pages
├── components/            # Blocs réutilisables axés présentation
│   ├── layout/            # `Header`, `Footer`, navigation, métadonnées SEO
│   ├── ui/                # Boutons, cartes, champs de formulaire, icônes
│   └── blocks/            # Sections de page récurrentes (hero, grille de fonctionnalités)
├── features/              # Flows produit autonomes mêlant UI + logique
├── hooks/                 # Hooks personnalisés (useAuth, useFeatureFlags)
├── services/              # Clients API, accès données, wrappers SDK
├── styles/                # Styles globaux, tokens, thème
├── tests/                 # Mocks partagés, tests d’intégration
└── utils/                 # Helpers purs sans import React
```

## Règles de nommage

- **Composants** en `PascalCase` : `Header.tsx`, `PricingCard.tsx`.
- **Hooks** commencent par `use` : `useSessionTimeout.ts`.
- **Composants partagés** (boutons, blocs) rangés dans des sous-dossiers reflétant leur rôle : `components/ui/Button/PrimaryButton.tsx`.
- **Tests** idéalement co-localisés (`ComponentName.test.tsx`), sinon dans `tests/`.

## Conventions layout

- Chaque page importe un composant `Header` et `Footer` depuis `components/layout/`. Ils portent navigation, branding, SEO et providers globaux (`<ThemeProvider>`…).
- Les sections répétées (hero, FAQ, KPI, témoignages) vivent dans `components/blocks/` et s’exposent via des props (`items`, `ctaLabel`, `alignment`) pour rester personnalisables.
- Boutons, liens et contrôles de formulaire proviennent de `components/ui/` et exposent une API standard (`variant`, `size`, `asChild`).

### Exemple : Structure de page

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
          { label: 'Accueil', href: '/' },
          { label: 'À propos', href: '/about' }
        ]}
      />
      <main>
        <HeroBlock 
          heading="Bienvenue"
          ctaLabel="Commencer"
          ctaHref="/signup"
        />
        <FeatureGrid 
          items={features}
          columns={3}
        />
      </main>
      <Footer 
        copyright="© 2024 Entreprise"
        links={footerLinks}
      />
    </>
  );
}
```

### Exemple : Point d'entrée

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

## Modules feature

- Grouper écrans, hooks, reducers et services propres à une fonctionnalité dans `features/<nom-feature>/`.
- Exporter via `features/<nom>/index.ts` pour simplifier les imports.
- Migrer un composant vers `components/` seulement lorsqu'il devient générique.

### Exemple : Structure de feature

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

// Utilisation dans l'app:
import { LoginForm, useAuth } from '@/features/auth';
```

## Points d’entrée

- `src/main.tsx` (Vite) ou `src/index.tsx` (CRA) ne servent qu’à monter les providers et router principal.
- Centraliser la définition des routes dans un `AppRouter`; les features fournissent des pages mais ne modifient pas la configuration globale.

## Environnement & config

- Regrouper la configuration runtime dans `src/config/` (`env.ts`, feature flags). Lire les variables d'environnement une seule fois puis exposer des helpers typés.
- Documenter toutes les variables requis dans le README du projet.

### Exemple : Configuration

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

// Utilisation:
import { config } from '@/config/env';
fetch(`${config.apiUrl}/users`);
```

Cette structure maintient des pages légères et garantit que header, footer, boutons et blocs réutilisables restent cohérents sur l’ensemble des applications React.

