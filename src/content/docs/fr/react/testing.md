---
title: Standards de tests React
description: Attendus pour les tests unitaires, d’intégration et E2E des projets React.
---

# Standards de tests React

Tester garantit le bon fonctionnement des composants partagés (header, footer, boutons, blocs) sur toutes les pages.

## Outils

- **Unitaires / intégration** : React Testing Library + Vitest/Jest (environnement jsdom).
- **Mock** : MSW pour les appels HTTP, fixtures dédiées pour les stores.
- **E2E** : Playwright ou Cypress.
- **Accessibilité** : `@testing-library/jest-dom` + `axe-core`.

## Pyramide de tests

1. **Unitaires** – composants, hooks, utils isolés.
2. **Intégration** – routes/flows complets avec APIs mockées.
3. **E2E** – parcours réels dans un navigateur.

## Tests de composants

- Interagir comme un utilisateur (`screen.getByRole`, `getByText`), limiter `data-testid`.
- Couvrir les props critiques (navigation du header, variantes de boutons, sections personnalisables).
- Vérifier focus, gestion clavier et attributs ARIA.

```tsx
it('affiche le bloc hero avec CTA', () => {
  render(<HeroBlock heading="Construisez plus vite" ctaLabel="Commencer" />);
  expect(screen.getByRole('heading', { name: /construisez plus vite/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /commencer/i })).toHaveAttribute('data-variant', 'primary');
});
```

## Hooks & état

- Utiliser `renderHook` + `act` et mocker le réseau/contexte requis.
- Vérifier la stabilité des références lorsque les dépendances ne changent pas.

### Exemple : Test de hook personnalisé

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchProjects } from '@/hooks/useFetchProjects';
import { projectService } from '@/services/projectService';

jest.mock('@/services/projectService');

describe('useFetchProjects', () => {
  it('récupère les projets au montage', async () => {
    const mockProjects = [{ id: '1', name: 'Projet 1' }];
    (projectService.getAll as jest.Mock).resolves(mockProjects);

    const { result } = renderHook(() => useFetchProjects());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual(mockProjects);
  });

  it('gère les erreurs', async () => {
    const mockError = new Error('Échec de la récupération');
    (projectService.getAll as jest.Mock).rejects(mockError);

    const { result } = renderHook(() => useFetchProjects());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });
});
```

## Tests d'intégration

- Rendre les routes complètes avec `Header` + `Footer` pour capturer les régressions de providers.
- Mocker les réponses via MSW pour rester déterministe.
- Contrôler les effets (analytics, stockage) via des espions.

### Exemple : Test d'intégration avec MSW

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { HomePage } from '@/app/home/HomePage';

const server = setupServer(
  http.get('/api/features', () => {
    return HttpResponse.json([
      { id: '1', title: 'Fonctionnalité 1' },
      { id: '2', title: 'Fonctionnalité 2' },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Intégration HomePage', () => {
  it('affiche header, hero et fonctionnalités', async () => {
    render(<HomePage />);

    // Vérifier la présence du header
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Vérifier le bloc hero
    expect(screen.getByRole('heading', { name: /bienvenue/i })).toBeInTheDocument();

    // Attendre le chargement des fonctionnalités
    await waitFor(() => {
      expect(screen.getByText('Fonctionnalité 1')).toBeInTheDocument();
    });

    // Vérifier le footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
```

## Tests E2E

- Automatiser les parcours clés : authentification, navigation contenu, achats.
- Exécuter sur des builds proches de la prod (preview, staging).
- Capturer des screenshots pour les blocs critiques (hero, pricing, CTA).

### Exemple : Test E2E avec Playwright

```tsx
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil', () => {
  test('devrait afficher header, hero et footer', async ({ page }) => {
    await page.goto('/');

    // Vérifier la navigation du header
    await expect(page.getByRole('link', { name: 'Accueil' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'À propos' })).toBeVisible();

    // Vérifier la section hero
    await expect(page.getByRole('heading', { name: /bienvenue/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /commencer/i })).toBeVisible();

    // Vérifier le footer
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('devrait naviguer vers signup depuis le CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /commencer/i }).click();
    await expect(page).toHaveURL('/signup');
  });
});
```

## Couverture attendue

- 80 %+ de couverture sur composants partagés et hooks.
- 100 % sur les primitives design system (boutons, navigation).
- Au moins une suite E2E smoke par pipeline.

Les tests doivent tourner en CI sur chaque pull request afin d’éviter les régressions côté React.

