---
title: Git Workflow
description: Git branching, commit messages, and PR standards for all projects.
---

# Git Workflow

This page documents the Git workflow, branching strategy, commit message standards, and pull request process for all projects.

## Branching Strategy

We use **GitHub Flow**, a simple branching model that works well for continuous deployment.

### Main Branch

- `main` is the default branch and always deployable
- All changes are merged into `main` via pull requests
- `main` is protected and requires pull request reviews

### Branch Types

Create branches for:
- **Features**: New functionality
- **Bugfixes**: Bug fixes
- **Hotfixes**: Critical production fixes

## Branch Naming

Use descriptive branch names with prefixes:

```
feature/user-authentication
feature/add-payment-system
bugfix/login-error
bugfix/memory-leak-fix
hotfix/security-patch
hotfix/critical-bug
```

**Format:** `<type>/<short-description>`

**Types:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

## Commit Messages

We follow the **Conventional Commits** specification for clear, consistent commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(auth): add user login functionality

Implement user authentication with email and password.
Add validation and error handling.

Closes #123
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build, etc.)

### Commit Subject

- Use imperative mood: "add" not "added" or "adds"
- First letter lowercase
- No period at the end
- Maximum 50 characters

**Good:**
```
feat: add user authentication
fix: resolve memory leak in player controller
docs: update installation instructions
```

**Bad:**
```
feat: Added user authentication
fix: Resolved memory leak in player controller.
feat: add user authentication and also update the UI to show login status
```

### Commit Body

- Explain what and why, not how
- Wrap at 72 characters
- Use bullet points for multiple changes
- Reference issues and pull requests

**Example:**
```
feat(auth): add user login functionality

- Implement email/password authentication
- Add input validation
- Handle authentication errors gracefully
- Update UI to show login status

Closes #123
```

### Commit Footer

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

## Pull Requests

### PR Title

Match commit message format:

```
feat(auth): add user login functionality
fix(player): resolve movement bug
docs(readme): update installation guide
```

### PR Description

Use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] Tested on [platforms]

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Closes #123
```

### PR Review Process

1. **Create PR**: Create pull request from feature branch to `main`
2. **Self-Review**: Review your own changes first
3. **Request Review**: Request review from at least one team member
4. **Address Feedback**: Respond to review comments
5. **Approval**: Wait for at least one approval
6. **Merge**: Merge after approval and CI checks pass

### PR Best Practices

- Keep PRs small and focused (one feature/fix per PR)
- Write clear descriptions
- Link related issues
- Add screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Merge Strategy

We use **Squash and Merge** for pull requests:

- Combines all commits into a single commit
- Keeps `main` branch history clean
- Commit message is the PR title

**Alternative:** Use **Rebase and Merge** for feature branches that should preserve commit history.

## Best Practices

### Commit Frequency

- Commit frequently with small, logical changes
- Don't commit broken code
- Don't commit commented-out code
- Don't commit large binary files

### Commit Size

- Keep commits focused on a single change
- Split large changes into multiple commits
- Each commit should be a complete, working change

### Branch Management

- Delete branches after merging
- Keep branches up to date with `main`
- Rebase feature branches before merging

### Regular Pushes

- Push work regularly (at least daily)
- Don't keep large changes local only
- Push before leaving work

### Commit Messages

- Write clear, descriptive commit messages
- Explain why, not just what
- Reference related issues
- Use conventional commit format

## Summary

- Use GitHub Flow branching strategy
- Name branches: `feature/`, `bugfix/`, `hotfix/`
- Follow Conventional Commits format
- Write clear PR descriptions
- Use squash and merge
- Commit frequently with focused changes
- Keep branches up to date with `main`
