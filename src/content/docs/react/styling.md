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

### Example: Design Tokens

```tsx
// styles/tokens.ts
export const tokens = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    background: '#ffffff',
    text: '#212529',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
};

// CSS Variables alternative:
// styles/tokens.css
:root {
  --color-primary: #0066cc;
  --spacing-md: 1rem;
  --font-size-base: 1rem;
}
```

## File Organization

- Keep global resets and typography in `styles/global.css` or `styles/global.ts`.
- Place component-specific styles next to the component (`Component.module.css` or `Component.styles.ts`).
- Shared layout primitives (header, footer, buttons, blocks) should import theme tokens via a single entry point to avoid divergence.

### Example: CSS Modules

```css
/* components/ui/Button/Button.module.css */
.button {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.button--primary {
  background-color: var(--color-primary);
  color: white;
}

.button--primary:hover {
  background-color: #0052a3;
}

.button--secondary {
  background-color: var(--color-secondary);
  color: white;
}
```

```tsx
// components/ui/Button/Button.tsx
import styles from './Button.module.css';

export function Button({ variant = 'primary', ...props }) {
  return (
    <button 
      className={`${styles.button} ${styles[`button--${variant}`]}`}
      {...props}
    />
  );
}
```

## Naming & Conventions

- Use BEM-like descriptive class names when writing CSS manually: `.header__nav`, `.footer__cta`.
- Tailwind utility classes follow project-approved presets (configure `tailwind.config.js` with tokens).
- Avoid inline styles except for dynamic values that can’t be expressed in CSS (e.g., canvas transforms).

## Responsive Design

- Design mobile-first; use min-width media queries for larger breakpoints.
- Create layout primitives (`<Stack>`, `<Grid>`, `<Section>`) to enforce consistent spacing and breakpoints across pages.
- Reusable blocks should accept breakpoint-aware props (e.g., `columns={{ base: 1, md: 2 }}`) to keep responsive rules declarative.

### Example: Responsive Layout Components

```tsx
// components/layout/Stack.tsx
interface StackProps {
  direction?: 'row' | 'column';
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Stack({ direction = 'column', gap = 'md', children }: StackProps) {
  return (
    <div 
      className={`stack stack--${direction} stack--gap-${gap}`}
    >
      {children}
    </div>
  );
}

// components/layout/Grid.tsx
interface GridProps {
  columns?: { base?: number; md?: number; lg?: number };
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Grid({ columns = { base: 1 }, gap = 'md', children }: GridProps) {
  const columnClasses = [
    columns.base && `grid--cols-${columns.base}`,
    columns.md && `md:grid--cols-${columns.md}`,
    columns.lg && `lg:grid--cols-${columns.lg}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid grid--gap-${gap} ${columnClasses}`}>
      {children}
    </div>
  );
}

// Usage:
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap="lg">
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
</Grid>
```

## Dark Mode & Theming

- Implement themes via CSS variables or a `ThemeProvider`.
- Ensure `Header`, `Footer`, `Button`, and block components read from the current theme instead of hardcoded colors.
- Test all components against light/dark backgrounds to maintain contrast ratios.

### Example: Theme Provider

```tsx
// components/providers/ThemeProvider.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// CSS:
/* styles/themes.css */
[data-theme='light'] {
  --color-background: #ffffff;
  --color-text: #212529;
}

[data-theme='dark'] {
  --color-background: #121212;
  --color-text: #ffffff;
}
```

## Accessibility

- Respect WCAG contrast ratios (minimum 4.5:1 for body text, 3:1 for large text/icons).
- Never rely solely on color to communicate state; pair with icons, patterns, or text.
- Maintain visible focus states for all interactive elements, even when using custom buttons.

## Asset Management

- Optimize hero/section imagery via responsive sources (`<picture>`, `srcset`) or Next.js/Image components.
- Load critical fonts early (preload) and fall back to system fonts gracefully.

Document critical design decisions in `styles/README.md` so everyone understands how to extend the token system without fragmenting the UI.

