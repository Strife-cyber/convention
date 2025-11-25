---
title: Architecture des composants React
description: Principes pour composer des composants React réutilisables et accessibles.
---

# Architecture des composants React

Les pages React doivent être une composition de petits composants autonomes, réutilisables et faciles à tester.

## Principes

- **Composition > héritage** : assembler des primitives (`Layout`, `Stack`, `Button`) plutôt que de créer de gros composants monolithiques.
- **Responsabilité unique** : un composant gère soit la présentation, soit l’orchestration, soit la logique de données, jamais tout en même temps.
- **Contrats explicites** : typer tous les props avec TypeScript, bannir `any`.
- **UI stateless par défaut** : déplacer l’état dans un hook ou un conteneur proche et passer les données par props.

## Composants de layout

- `Header`, `Footer` et tout chrome persistant vivent dans `components/layout/`.
- Ils hébergent les providers globaux (thème, i18n) et les hooks de navigation mais déléguent la logique métier aux features.
- Les props doivent permettre la configuration (items de navigation, CTA, langue active, switcher).

### Exemple : Composant Header

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
  locale = 'fr' 
}: HeaderProps) {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Navigation principale">
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

## Blocs réutilisables

- Toute section récurrente (hero, grilles de fonctionnalités, témoignages) est placée dans `components/blocks/`.
- Les blocs exposent des props pour rester personnalisables (`alignment`, `mediaPosition`, `badgeLabel`, `items`).
- Si un bloc nécessite une requête, effectuer l'appel dans un parent/Hook puis fournir les données au bloc afin qu'il reste pur.

### Exemple : Bloc Hero

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

// Utilisation:
<HeroBlock 
  heading="Construisez plus vite"
  subheading="Livrez des apps de qualité en un temps record"
  ctaLabel="Commencer"
  ctaHref="/signup"
  alignment="center"
/>
```

## UI Elements (boutons, inputs, etc.)

- Implémenter les boutons une seule fois dans `components/ui/Button/` avec des variantes (`variant`, `size`, `asChild`).
- Gérer les états focus/hover/disabled et ajouter par défaut `type="button"` hors formulaires de soumission.
- Partager tokens (couleurs, espaces, polices) via un thème central pour garder header, footer, blocs et boutons alignés.

### Exemple : Composant Button

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

// Utilisation:
<Button variant="primary" size="lg">Soumettre</Button>
<Button variant="secondary" href="/about">En savoir plus</Button>
<Button variant="ghost" size="sm" disabled>Annuler</Button>
```

## Hooks & conteneurs

- Les hooks (`useHeroContent`, `useFetchProjects`) encapsulent side effects et accès données.
- Les conteneurs (souvent sous `features/`) connectent hooks + composants de présentation, gèrent les loaders et callbacks.
- Éviter `fetch` ou mutations globales dans les composants de présentation.

### Exemple : Hook personnalisé

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

// Composant conteneur:
// features/projects/ProjectsContainer.tsx
import { useFetchProjects } from '@/hooks/useFetchProjects';
import { ProjectList } from './components/ProjectList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ProjectsContainer() {
  const { projects, loading, error } = useFetchProjects();

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erreur : {error.message}</div>;

  return <ProjectList projects={projects} />;
}
```

## Props et valeurs par défaut

- Limiter les props obligatoires au strict nécessaire et définir des `defaultProps`/valeurs par défaut.
- Utiliser des unions discriminées pour les variantes exclusives.
- Documenter les props via TSDoc pour faciliter l’autocomplétion.

## Accessibilité & i18n

- Tous les composants doivent rester accessibles au clavier et exposer des focus visibles.
- Internationaliser le texte : passer les libellés via props ou hooks de traduction, ne pas hardcoder.
- Utiliser les balises sémantiques (`<header>`, `<footer>`, `<section role="region">`) lorsque pertinent.

## Documentation visuelle

- Chaque composant réutilisable doit être documenté (Storybook ou MDX) avec :
  - États par défaut, variantes et modes désactivés
  - Thèmes clair/sombre
  - Exemples multi-langues si nécessaire

Ces règles garantissent que header, footer, boutons et blocs personnalisables restent cohérents tout en laissant de la flexibilité aux équipes produit.

