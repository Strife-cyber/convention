---
title: Workflow Git
description: Branches Git, messages de commit et standards de PR pour tous les projets.
---

# Workflow Git

Cette page documente le workflow Git, la stratégie de branches, les standards de messages de commit et le processus de pull request pour tous les projets.

## Stratégie de Branches

Nous utilisons **GitHub Flow**, un modèle de branches simple qui fonctionne bien pour le déploiement continu.

### Branche Main

- `main` est la branche par défaut et toujours déployable
- Tous les changements sont fusionnés dans `main` via des pull requests
- `main` est protégée et nécessite des revues de pull request

### Types de Branches

Créez des branches pour :
- **Features** : Nouvelles fonctionnalités
- **Bugfixes** : Corrections de bugs
- **Hotfixes** : Corrections critiques de production

## Nommage des Branches

Utilisez des noms de branches descriptifs avec préfixes :

```
feature/user-authentication
feature/add-payment-system
bugfix/login-error
bugfix/memory-leak-fix
hotfix/security-patch
hotfix/critical-bug
```

**Format :** `<type>/<short-description>`

**Types :**
- `feature/` - Nouvelles fonctionnalités
- `bugfix/` - Corrections de bugs
- `hotfix/` - Corrections critiques de production
- `refactor/` - Refactorisation de code
- `docs/` - Mises à jour de documentation

## Messages de Commit

Nous suivons la spécification **Conventional Commits** pour des messages de commit clairs et cohérents.

### Format de Message de Commit

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Exemple :**
```
feat(auth): add user login functionality

Implement user authentication with email and password.
Add validation and error handling.

Closes #123
```

### Types de Commit

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Changements de documentation
- `style` : Changements de style de code (formatage, point-virgules, etc.)
- `refactor` : Refactorisation de code
- `perf` : Améliorations de performance
- `test` : Ajout ou mise à jour de tests
- `chore` : Tâches de maintenance (dépendances, build, etc.)

### Sujet de Commit

- Utilisez l'impératif : "add" pas "added" ou "adds"
- Première lettre en minuscule
- Pas de point à la fin
- Maximum 50 caractères

**Bon :**
```
feat: add user authentication
fix: resolve memory leak in player controller
docs: update installation instructions
```

**Mauvais :**
```
feat: Added user authentication
fix: Resolved memory leak in player controller.
feat: add user authentication and also update the UI to show login status
```

### Corps de Commit

- Expliquez quoi et pourquoi, pas comment
- Limitez à 72 caractères par ligne
- Utilisez des puces pour plusieurs changements
- Référencez les issues et pull requests

**Exemple :**
```
feat(auth): add user login functionality

- Implement email/password authentication
- Add input validation
- Handle authentication errors gracefully
- Update UI to show login status

Closes #123
```

### Pied de Commit

- Référencez les issues : `Closes #123`, `Fixes #456`
- Changements cassants : `BREAKING CHANGE: description`

## Pull Requests

### Titre de PR

Correspond au format de message de commit :

```
feat(auth): add user login functionality
fix(player): resolve movement bug
docs(readme): update installation guide
```

### Description de PR

Utilisez ce modèle :

```markdown
## Description
Brève description des changements

## Type de Changement
- [ ] Correction de bug
- [ ] Nouvelle fonctionnalité
- [ ] Changement cassant
- [ ] Mise à jour de documentation

## Changements Effectués
- Changement 1
- Changement 2
- Changement 3

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Testé sur [plateformes]

## Captures d'Écran (si applicable)
[Ajouter des captures d'écran]

## Issues Liées
Closes #123
```

### Processus de Revue de PR

1. **Créer PR** : Créer une pull request de la branche feature vers `main`
2. **Auto-Revue** : Revoyez vos propres changements d'abord
3. **Demander une Revue** : Demander une revue d'au moins un membre de l'équipe
4. **Répondre aux Commentaires** : Répondre aux commentaires de revue
5. **Approbation** : Attendre au moins une approbation
6. **Fusion** : Fusionner après approbation et passage des vérifications CI

### Meilleures Pratiques de PR

- Gardez les PRs petites et ciblées (une feature/correction par PR)
- Écrivez des descriptions claires
- Liez les issues liées
- Ajoutez des captures d'écran pour les changements UI
- Assurez-vous que tous les tests passent
- Mettez à jour la documentation si nécessaire

## Stratégie de Fusion

Nous utilisons **Squash and Merge** pour les pull requests :

- Combine tous les commits en un seul commit
- Garde l'historique de la branche `main` propre
- Le message de commit est le titre de la PR

**Alternative :** Utilisez **Rebase and Merge** pour les branches de features qui doivent préserver l'historique des commits.

## Meilleures Pratiques

### Fréquence de Commit

- Commitez fréquemment avec de petits changements logiques
- Ne commitez pas de code cassé
- Ne commitez pas de code commenté
- Ne commitez pas de gros fichiers binaires

### Taille de Commit

- Gardez les commits ciblés sur un seul changement
- Divisez les gros changements en plusieurs commits
- Chaque commit doit être un changement complet et fonctionnel

### Gestion de Branches

- Supprimez les branches après fusion
- Gardez les branches à jour avec `main`
- Rebasez les branches de features avant fusion

### Pushes Réguliers

- Poussez le travail régulièrement (au moins quotidiennement)
- Ne gardez pas de gros changements uniquement en local
- Poussez avant de quitter le travail

### Messages de Commit

- Écrivez des messages de commit clairs et descriptifs
- Expliquez pourquoi, pas juste quoi
- Référencez les issues liées
- Utilisez le format conventional commit

## Résumé

- Utilisez la stratégie de branches GitHub Flow
- Nommez les branches : `feature/`, `bugfix/`, `hotfix/`
- Suivez le format Conventional Commits
- Écrivez des descriptions de PR claires
- Utilisez squash and merge
- Commitez fréquemment avec des changements ciblés
- Gardez les branches à jour avec `main`

