---
title: React Component Architecture
description: Patterns for composing reusable, accessible React components.
---

# React Component Architecture

React pages must be collections of small, well-defined components that can be reused, themed, and tested in isolation.

## Design Principles

- **Composition over inheritance**: compose small primitives (`Layout`, `Stack`, `Button`) rather than bloated “god” components.
- **Single responsibility**: each component handles one concern—layout, data wiring, or presentation, but never all three.
- **Explicit contracts**: use TypeScript props interfaces for every component; avoid using `any`.
- **Stateless UI blocks**: default to presentational components with props-only data. Lift state to the closest container or hook.

## Layout Components

- `Header`, `Footer`, and any persistent chrome belong in `components/layout/`.
- Layout components host providers (theme, i18n), navigation logic, and page metadata but delegate business logic to features.
- Keep layout components highly configurable via props such as `navItems`, `cta`, `locale`, `showLanguageSwitcher`.

## Block Components

- Sections that can appear on multiple pages (hero banners, testimonial rails, pricing tables) must live in `components/blocks/`.
- Provide prop-driven customization (e.g., `alignment`, `mediaPosition`, `badgeLabel`) instead of cloning similar markup in each page.
- When blocks require data fetching, keep the fetch logic in a parent container/hook and pass data through props to keep the block pure.

## UI Elements (Buttons, Inputs, etc.)

- Implement buttons once inside `components/ui/Button/` and expose variants via props (`variant="primary" | "secondary" | "ghost"`, `size="sm" | "md" | "lg"`).
- Support polymorphism via `as` or `asChild` if you need a link styled like a button.
- Follow accessibility defaults: `type="button"` unless submitting, keyboard focus styles, and ARIA attributes where appropriate.
- Share tokens (colors, spacing, typography) via a central theme to keep buttons and other primitives consistent.

## Hooks and Containers

- Hooks (`useFetchProjects`, `useHeroContent`) encapsulate data dependencies and side effects.
- Containers (often within `features/`) wire hooks to presentational components. Keep containers lightweight: map data → props, define callbacks, handle loading states.
- Refrain from performing `fetch` or global state mutations inside presentation components.

## Props and Defaults

- Require only the minimal props needed to render; everything else gets sensible defaults.
- Use discriminated unions for mutually exclusive configurations (e.g., `icon?: never` when `loading` is true).
- Document props inline using TSDoc to ease discoverability.

## Accessibility & Internationalization

- All components must be fully keyboard navigable. Don’t swallow key events without re-emitting them.
- Ensure text content and aria labels are translated. Accept copy through props or localization hooks—never hardcode strings.
- Prefer semantic HTML elements (`<header>`, `<footer>`, `<section>` with `aria-labelledby`) to improve screen-reader experience.

## Storybook / Preview Coverage

- Every reusable component should have a Storybook story or MDX doc showing:
  - Default, variant, and disabled states
  - Theming knobs (light/dark)
  - Localization examples if strings differ per language
- Keep stories colocated in the component folder (`Component.stories.tsx`) for quick maintenance.

Following these conventions keeps headers, footers, blocks, and buttons consistent project-wide while still allowing feature teams to compose unique experiences. ::=*** End Patch

