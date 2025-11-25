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

### Example: Header Component

```tsx
// components/layout/Header.tsx
import { Button } from '@/components/ui/Button';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems: NavItem[];
  cta?: { label: string; href: string };
  showLanguageSwitcher?: boolean;
  locale?: string;
}

export function Header({ 
  navItems, 
  cta, 
  showLanguageSwitcher = false,
  locale = 'en' 
}: HeaderProps) {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      {cta && (
        <Button variant="primary" href={cta.href}>
          {cta.label}
        </Button>
      )}
      {showLanguageSwitcher && <LanguageSwitcher currentLocale={locale} />}
    </header>
  );
}
```

## Block Components

- Sections that can appear on multiple pages (hero banners, testimonial rails, pricing tables) must live in `components/blocks/`.
- Provide prop-driven customization (e.g., `alignment`, `mediaPosition`, `badgeLabel`) instead of cloning similar markup in each page.
- When blocks require data fetching, keep the fetch logic in a parent container/hook and pass data through props to keep the block pure.

### Example: Hero Block

```tsx
// components/blocks/HeroBlock.tsx
import { Button } from '@/components/ui/Button';

interface HeroBlockProps {
  heading: string;
  subheading?: string;
  ctaLabel: string;
  ctaHref: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundImage?: string;
}

export function HeroBlock({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  alignment = 'center',
  backgroundImage,
}: HeroBlockProps) {
  return (
    <section 
      className={`hero hero--${alignment}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <h1>{heading}</h1>
      {subheading && <p>{subheading}</p>}
      <Button variant="primary" href={ctaHref}>
        {ctaLabel}
      </Button>
    </section>
  );
}

// Usage:
<HeroBlock 
  heading="Build Faster"
  subheading="Ship quality apps in record time"
  ctaLabel="Get Started"
  ctaHref="/signup"
  alignment="center"
/>
```

## UI Elements (Buttons, Inputs, etc.)

- Implement buttons once inside `components/ui/Button/` and expose variants via props (`variant="primary" | "secondary" | "ghost"`, `size="sm" | "md" | "lg"`).
- Support polymorphism via `as` or `asChild` if you need a link styled like a button.
- Follow accessibility defaults: `type="button"` unless submitting, keyboard focus styles, and ARIA attributes where appropriate.
- Share tokens (colors, spacing, typography) via a central theme to keep buttons and other primitives consistent.

### Example: Button Component

```tsx
// components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, href, ...props }, ref) => {
    const classes = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      className,
    ].filter(Boolean).join(' ');

    if (href) {
      return (
        <a href={href} className={classes} role="button">
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Usage:
<Button variant="primary" size="lg">Submit</Button>
<Button variant="secondary" href="/about">Learn More</Button>
<Button variant="ghost" size="sm" disabled>Cancel</Button>
```

## Hooks and Containers

- Hooks (`useFetchProjects`, `useHeroContent`) encapsulate data dependencies and side effects.
- Containers (often within `features/`) wire hooks to presentational components. Keep containers lightweight: map data → props, define callbacks, handle loading states.
- Refrain from performing `fetch` or global state mutations inside presentation components.

### Example: Custom Hook

```tsx
// hooks/useFetchProjects.ts
import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'archived';
}

export function useFetchProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    projectService
      .getAll()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
}

// Container component:
// features/projects/ProjectsContainer.tsx
import { useFetchProjects } from '@/hooks/useFetchProjects';
import { ProjectList } from './components/ProjectList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ProjectsContainer() {
  const { projects, loading, error } = useFetchProjects();

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return <ProjectList projects={projects} />;
}
```

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

