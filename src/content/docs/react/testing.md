---
title: React Testing Standards
description: Expectations for unit, integration, and E2E testing in React projects.
---

# React Testing Standards

Testing ensures that our reusable components (header, footer, buttons, shared blocks) behave consistently across pages and releases.

## Tools

- **Unit/Integration**: React Testing Library + Vitest/Jest. Tests run in JS DOM.
- **Mocking**: MSW (Mock Service Worker) for HTTP, custom fixtures for feature stores.
- **E2E**: Playwright or Cypress for full browser coverage.
- **Accessibility**: `@testing-library/jest-dom` + `axe-core` for automated a11y assertions.

## Testing Pyramid

1. **Unit tests** cover isolated components, hooks, and utilities.
2. **Integration tests** render routes or feature flows with mocked APIs to verify wiring between components.
3. **E2E tests** validate happy-path journeys in real browsers and deploy previews.

## Component Tests

- Render components as the user sees them (use `screen.getByRole`, `getByText`). Avoid querying by `data-testid` unless no semantic role exists.
- Test critical props for reusable blocks (e.g., header navigation items, button variants, customizable sections).
- Verify accessibility: focus management, keyboard handlers, aria labels.

```tsx
it('renders the hero block with CTA', () => {
  render(<HeroBlock heading="Build faster" ctaLabel="Get started" />);
  expect(screen.getByRole('heading', { name: /build faster/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /get started/i })).toHaveAttribute('data-variant', 'primary');
});
```

## Hooks & State

- For hooks, use `renderHook` and simulate events with `act`. Mock network calls or context providers as needed.
- Assert that hooks return stable references when dependencies don't change to avoid needless re-renders.

### Example: Testing Custom Hooks

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchProjects } from '@/hooks/useFetchProjects';
import { projectService } from '@/services/projectService';

jest.mock('@/services/projectService');

describe('useFetchProjects', () => {
  it('fetches projects on mount', async () => {
    const mockProjects = [{ id: '1', name: 'Project 1' }];
    (projectService.getAll as jest.Mock).resolves(mockProjects);

    const { result } = renderHook(() => useFetchProjects());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual(mockProjects);
  });

  it('handles errors', async () => {
    const mockError = new Error('Failed to fetch');
    (projectService.getAll as jest.Mock).rejects(mockError);

    const { result } = renderHook(() => useFetchProjects());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });
});
```

## Integration Tests

- Render route-level components with the real layout (`Header`, `Footer`) to catch provider regressions.
- Mock server responses via MSW so tests remain hermetic yet realistic.
- Verify analytics or side effects via spies; don't rely on global state leakage between tests.

### Example: Integration Test with MSW

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { HomePage } from '@/app/home/HomePage';

const server = setupServer(
  http.get('/api/features', () => {
    return HttpResponse.json([
      { id: '1', title: 'Feature 1' },
      { id: '2', title: 'Feature 2' },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('HomePage Integration', () => {
  it('renders header, hero, and features', async () => {
    render(<HomePage />);

    // Verify header is present
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Verify hero block
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();

    // Wait for features to load
    await waitFor(() => {
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
    });

    // Verify footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
```

## E2E Tests

- Automate core journeys: sign-in, checkout, content browsing.
- Run against production-like builds (Preview/Storybook or deployed staging) to validate bundling, routing, and theming.
- Capture screenshots for visual regression on critical blocks (hero, pricing, CTA sections).

### Example: Playwright E2E Test

```tsx
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display header, hero, and footer', async ({ page }) => {
    await page.goto('/');

    // Verify header navigation
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

    // Verify hero section
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();

    // Verify footer
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('should navigate to signup from CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /get started/i }).click();
    await expect(page).toHaveURL('/signup');
  });
});
```

## Coverage Expectations

- 80%+ statement coverage on shared components and hooks.
- 100% coverage on critical design system primitives (buttons, layout, navigation).
- At least one E2E smoke suite per release pipeline.

Automated tests should run in CI for every pull request, preventing regressions across the React section of this documentation.

