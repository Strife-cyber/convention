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
- Assert that hooks return stable references when dependencies don’t change to avoid needless re-renders.

## Integration Tests

- Render route-level components with the real layout (`Header`, `Footer`) to catch provider regressions.
- Mock server responses via MSW so tests remain hermetic yet realistic.
- Verify analytics or side effects via spies; don’t rely on global state leakage between tests.

## E2E Tests

- Automate core journeys: sign-in, checkout, content browsing.
- Run against production-like builds (Preview/Storybook or deployed staging) to validate bundling, routing, and theming.
- Capture screenshots for visual regression on critical blocks (hero, pricing, CTA sections).

## Coverage Expectations

- 80%+ statement coverage on shared components and hooks.
- 100% coverage on critical design system primitives (buttons, layout, navigation).
- At least one E2E smoke suite per release pipeline.

Automated tests should run in CI for every pull request, preventing regressions across the React section of this documentation.

