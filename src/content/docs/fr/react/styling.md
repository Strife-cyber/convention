---
title: Guide de styles React
description: Stratégies CSS, thèmes et bonnes pratiques d’accessibilité pour React.
---

# Guide de styles React

Une approche cohérente du styling garantit que header, footer, boutons et blocs réutilisables partagent la même identité visuelle.

## Approches privilégiées

- **Design tokens** : définir couleurs, typo, espacements, rayons, ombres et z-index dans `styles/tokens.ts` ou via des variables CSS.
- **Styles scoppés** : favoriser CSS Modules, Tailwind ou CSS-in-JS compatible SSR.
- **Compatibilité serveur** : vérifier que la solution choisie supporte SSR/SSG (styled-components + Babel plugin, Vanilla Extract, etc.).

### Exemple : Design Tokens

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

// Alternative avec variables CSS:
// styles/tokens.css
:root {
  --color-primary: #0066cc;
  --spacing-md: 1rem;
  --font-size-base: 1rem;
}
```

## Organisation des fichiers

- `styles/global.css` ou `styles/global.ts` pour les resets et la typo.
- Styles spécifiques à un composant à côté du fichier React (`Component.module.css`, `Component.styles.ts`).
- Les primitives partagées (header, footer, boutons, blocs) consomment les tokens via un point d'entrée unique afin d'éviter les divergences.

### Exemple : CSS Modules

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

## Nommage & conventions

- Utiliser des noms descriptifs type BEM pour le CSS pur (`.header__nav`, `.footer__cta`).
- Pour Tailwind, configurer les presets dans `tailwind.config.js` pour coller aux tokens.
- Limiter les styles inline aux cas dynamiques impraticables en CSS (canvas, calculs à la volée).

## Responsive design

- Concevoir mobile-first et monter en min-width.
- Créer des primitives de layout (`<Stack>`, `<Grid>`, `<Section>`) qui appliquent les espacements communs.
- Les blocs réutilisables doivent accepter des props responsive (`columns={{ base: 1, md: 2 }}`) afin de garder des interfaces déclaratives.

### Exemple : Composants de layout responsive

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

// Utilisation:
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap="lg">
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
</Grid>
```

## Mode sombre & thèmes

- Gérer les thèmes via variables CSS ou `ThemeProvider`.
- Vérifier que header, footer et boutons respectent le thème courant sans valeurs codées en dur.
- Tester toutes les variantes sur fonds clairs/foncés pour garantir les ratios de contraste.

### Exemple : Theme Provider

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
  if (!context) throw new Error('useTheme doit être utilisé dans ThemeProvider');
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

## Accessibilité

- Respecter WCAG (4.5:1 pour le texte standard).
- Ne jamais communiquer un état uniquement par la couleur ; ajouter icône ou texte.
- Conserver des focus visibles pour tous les éléments interactifs, y compris les boutons personnalisés.

## Gestion des assets

- Optimiser les images de sections réutilisées (`<picture>`, `srcset`, composant Next/Image).
- Précharger les polices critiques et prévoir des polices de secours système.

Documenter les décisions dans `styles/README.md` afin que l’équipe sache comment étendre le système de design sans casser l’uniformité des composants partagés.

