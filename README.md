# Code Conventions Documentation

A comprehensive documentation site for team code conventions and standards for Flutter, React, Unity, and Java projects, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## 📖 About

This documentation site serves as the central reference for code conventions, best practices, and standards used across Flutter, React, Unity, and Java projects. It provides clear guidelines for:

- **Flutter Development**: Naming conventions, project structure, code style, state management, widget conventions, testing standards, package management, and best practices
- **React Development**: Project structure, component architecture, styling strategies, state management, testing standards, and best practices for reusable UI blocks
- **Unity Development**: Naming conventions, project structure, code style, script organization, asset management, performance guidelines, and best practices
- **Java Development**: Naming conventions, code style, object-oriented programming, Java SE, web development (Servlets, JSP, Spring Boot), Android development, database management (JDBC, JPA), performance optimization, debugging, and comprehensive design patterns
- **Shared Conventions**: Git workflow, code review guidelines, and documentation standards

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd convention
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## 📁 Project Structure

```
.
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── assets/         # Images and other assets
│   ├── content/
│   │   └── docs/       # Documentation content
│   │       ├── flutter/    # Flutter conventions
│   │       ├── react/      # React conventions
│   │       ├── unity/      # Unity conventions
│   │       ├── java/       # Java conventions
│   │       └── shared/     # Shared conventions
│   └── content.config.ts
├── astro.config.mjs     # Astro configuration
├── package.json
└── tsconfig.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 📝 Adding Content

Documentation content is written in Markdown (`.md`) or MDX (`.mdx`) format and placed in `src/content/docs/`.

### Adding a New Page

1. Create a new `.md` or `.mdx` file in the appropriate directory:
   - `src/content/docs/flutter/` for Flutter conventions
   - `src/content/docs/react/` for React conventions
   - `src/content/docs/unity/` for Unity conventions
   - `src/content/docs/java/` for Java conventions
   - `src/content/docs/shared/` for shared conventions

2. Add frontmatter to the file:
```markdown
---
title: Page Title
description: Page description
---

# Page Title

Content goes here...
```

3. The page will automatically appear in the sidebar navigation

### Editing Existing Content

Simply edit the corresponding `.md` or `.mdx` file in `src/content/docs/`. Changes will be reflected immediately in the development server.

## 🚀 Deployment

This site is deployed to GitHub Pages using GitHub Actions. The deployment is automatic on every push to the `main` branch.

### Manual Deployment

1. Build the site:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

3. The built site is in the `dist/` directory

### GitHub Pages Setup

The site is automatically deployed to GitHub Pages via GitHub Actions workflow (`.github/workflows/deploy.yml`). 

**Initial Setup:**
1. Update `astro.config.mjs`:
   - Uncomment and set the `site` option with your GitHub Pages URL: `site: 'https://[username].github.io'`
   - Update the `base` path if your repository name is different from `convention`
   - Update the GitHub social link URL in the Starlight config

2. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically by the workflow)
   - Folder: `/ (root)`

3. Push to `main` branch - deployment happens automatically

**After Setup:**
- **Site URL**: `https://[username].github.io/convention/`
- Deployment happens automatically on push to `main` branch
- The workflow builds the site and deploys to the `gh-pages` branch
- Check deployment status in the Actions tab

## 🔧 Configuration

### Site Configuration

Edit `astro.config.mjs` to customize:
- Site title and description
- Theme colors and branding
- Sidebar navigation
- Social links

### Theme Customization

The site uses Starlight's default theme. To customize:
1. Edit `astro.config.mjs` to add theme configuration
2. Add custom CSS if needed
3. Update favicon in `public/` directory

## 📚 Documentation Sections

### Flutter Conventions
- Naming Conventions
- Project Structure
- Code Style
- State Management (Riverpod)
- Widget Conventions
- Testing Standards
- Package Management
- Best Practices

### React Conventions
- Project Structure
- Component Architecture
- Styling Guidelines
- State Management
- Testing Standards
- Best Practices

### Unity Conventions
- Naming Conventions
- Project Structure
- Code Style
- Script Organization
- Asset Management
- Performance Guidelines
- Best Practices

### Java Conventions
- Naming Conventions
- Code Style (variables, loops, conditions)
- Object-Oriented Programming
- Java SE (console apps, files, threads, collections)
- Web Development (Servlets, JSP, Spring Boot, REST APIs)
- Android Development
- Database Management (JDBC, JPA/Hibernate)
- Performance Optimization
- Debugging and Error Handling
- Best Practices (Design Patterns, SOLID principles, testing)

### Shared Conventions
- Git Workflow
- Code Review
- Documentation

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit with conventional commits: `git commit -m "feat: add new convention"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Create a Pull Request

## 📄 License

[Add your license here]

## 🔗 Resources

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build)
- [Flutter Documentation](https://flutter.dev/docs)
- [React Documentation](https://react.dev)
- [Unity Documentation](https://docs.unity3d.com)
- [Java Documentation](https://docs.oracle.com/javase/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:
1. Clear the `.astro` cache: `rm -rf .astro`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for syntax errors in Markdown files

### Deployment Issues

If deployment fails:
1. Check GitHub Actions logs
2. Verify `astro.config.mjs` has correct `site` URL
3. Ensure `base` path is configured correctly for GitHub Pages

### Development Server Issues

If the dev server doesn't start:
1. Check Node.js version: `node --version` (should be 18+)
2. Clear cache and reinstall: `rm -rf node_modules .astro && npm install`
3. Check for port conflicts (default port is 4321)
