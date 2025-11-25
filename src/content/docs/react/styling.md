---
title: React Styling Guidelines
description: Styling strategies, naming rules, and theming guidance for React apps.
---

# React Styling Guidelines

Consistent styling ensures that headers, footers, buttons, and reusable blocks all share the same visual language.

## Preferred Approaches

- **Design tokens first**: define colors, typography, spacing, radii, shadows, and z-index scales in `styles/tokens.ts` or CSS variables.
- **Scoped styles**: favor CSS Modules, Tailwind, or CSS-in-JS solutions that scope styles to a component.
- **Server-side compatibility**: when using CSS-in-JS, ensure the library supports SSR/SSG (e.g., styled-components with SSR config, Vanilla Extract, Linaria).

## File Organization

- Keep global resets and typography in `styles/global.css` or `styles/global.ts`.
- Place component-specific styles next to the component (`Component.module.css` or `Component.styles.ts`).
- Shared layout primitives (header, footer, buttons, blocks) should import theme tokens via a single entry point to avoid divergence.

## Naming & Conventions

- Use BEM-like descriptive class names when writing CSS manually: `.header__nav`, `.footer__cta`.
- Tailwind utility classes follow project-approved presets (configure `tailwind.config.js` with tokens).
- Avoid inline styles except for dynamic values that can’t be expressed in CSS (e.g., canvas transforms).

## Responsive Design

- Design mobile-first; use min-width media queries for larger breakpoints.
- Create layout primitives (`<Stack>`, `<Grid>`, `<Section>`) to enforce consistent spacing and breakpoints across pages.
- Reusable blocks should accept breakpoint-aware props (e.g., `columns={{ base: 1, md: 2 }}`) to keep responsive rules declarative.

## Dark Mode & Theming

- Implement themes via CSS variables or a `ThemeProvider`.
- Ensure `Header`, `Footer`, `Button`, and block components read from the current theme instead of hardcoded colors.
- Test all components against light/dark backgrounds to maintain contrast ratios.

## Accessibility

- Respect WCAG contrast ratios (minimum 4.5:1 for body text, 3:1 for large text/icons).
- Never rely solely on color to communicate state; pair with icons, patterns, or text.
- Maintain visible focus states for all interactive elements, even when using custom buttons.

## Asset Management

- Optimize hero/section imagery via responsive sources (`<picture>`, `srcset`) or Next.js/Image components.
- Load critical fonts early (preload) and fall back to system fonts gracefully.

Document critical design decisions in `styles/README.md` so everyone understands how to extend the token system without fragmenting the UI.

