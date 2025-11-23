---
title: Package Management
description: Dependencies and package organization for Flutter projects.
---

# Package Management

This page documents standards for managing dependencies and packages in Flutter projects.

## Dependency Management

We use semantic versioning with caret constraints (`^`) to allow compatible updates while preventing breaking changes.

### Version Constraints

- **Caret (`^`)**: Allows compatible version updates (e.g., `^2.0.0` allows `>=2.0.0 <3.0.0`)
- **Exact version**: Use only when necessary for stability (e.g., `2.0.0`)
- **Range**: Use for specific requirements (e.g., `>=2.0.0 <3.0.0`)

## pubspec.yaml Organization

Organize `pubspec.yaml` with clear sections and comments:

```yaml
name: my_app
description: My Flutter application
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.0.0"

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.4.0
  
  # Networking
  http: ^1.1.0
  dio: ^5.3.0
  
  # Local Storage
  shared_preferences: ^2.2.0
  hive: ^2.2.3
  
  # UI
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  
  # Utilities
  intl: ^0.18.0
  equatable: ^2.0.5

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  
  # Testing
  mockito: ^5.4.0
  build_runner: ^2.4.0
  
  # Code Generation
  riverpod_generator: ^2.3.0
  hive_generator: ^2.0.0

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/fonts/
  
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/custom_font.ttf
```

## Version Constraints

### Caret Constraints (Recommended)

Use caret constraints for most dependencies:

```yaml
dependencies:
  http: ^1.1.0  # Allows 1.1.0 to <2.0.0
  dio: ^5.3.0   # Allows 5.3.0 to <6.0.0
```

### Exact Versions (Use Sparingly)

Use exact versions only when necessary:

```yaml
dependencies:
  critical_package: 2.0.0  # Exact version for stability
```

### Version Ranges

Use ranges for specific requirements:

```yaml
dependencies:
  flexible_package: ">=2.0.0 <3.0.0"
```

## Adding New Dependencies

### Process

1. **Research the package**: Check pub.dev, read documentation, review issues
2. **Check compatibility**: Ensure it's compatible with your Flutter/Dart version
3. **Add to pubspec.yaml**: Use appropriate version constraint
4. **Run `flutter pub get`**: Install the package
5. **Test thoroughly**: Ensure it works with your codebase
6. **Update documentation**: Document why the package was added

### Considerations

- **License**: Ensure package license is compatible with your project
- **Maintenance**: Check if package is actively maintained
- **Size**: Consider package size impact on app bundle
- **Alternatives**: Evaluate if a lighter alternative exists

## Updating Dependencies

### Regular Updates

Update dependencies regularly to receive:
- Security patches
- Bug fixes
- Performance improvements
- New features

### Update Process

```bash
# Check for outdated packages
flutter pub outdated

# Update all packages (within constraints)
flutter pub upgrade

# Update specific package
flutter pub upgrade package_name

# Update to latest (may break)
flutter pub upgrade --major-versions
```

### Breaking Changes

When updating to a new major version:

1. **Read changelog**: Review breaking changes
2. **Update code**: Fix breaking changes
3. **Test thoroughly**: Run full test suite
4. **Update documentation**: Document any API changes

## Local Packages

### When to Create Local Packages

Create local packages for:
- Shared code across multiple projects
- Reusable components
- Common utilities
- Feature modules

### Package Structure

```
packages/
└── shared_utils/
    ├── lib/
    │   └── shared_utils.dart
    ├── pubspec.yaml
    └── README.md
```

### Using Local Packages

```yaml
dependencies:
  shared_utils:
    path: ../packages/shared_utils
```

## Dependency Conflicts

### Resolving Conflicts

When dependencies conflict:

1. **Check versions**: Ensure compatible versions
2. **Use dependency_overrides**: Temporary solution
3. **Update packages**: Update to compatible versions
4. **Find alternatives**: Consider alternative packages

### dependency_overrides

Use sparingly and document why:

```yaml
dependency_overrides:
  package_name: ^2.0.0  # Override for compatibility
```

## Best Practices

### 1. Minimize Dependencies

Only add dependencies when necessary:
- Check if functionality exists in Flutter SDK
- Consider if you can implement it yourself
- Evaluate package size vs. benefit

### 2. Keep Dependencies Updated

Regularly update dependencies:
- Check `flutter pub outdated` monthly
- Update security patches immediately
- Test after major version updates

### 3. Document Dependencies

Document why each dependency is needed:
- Add comments in `pubspec.yaml`
- Document in README if significant
- Note any special configuration

### 4. Version Constraints

- Use caret (`^`) for most packages
- Use exact versions only when necessary
- Avoid overly restrictive ranges

### 5. Security Considerations

- Regularly check for security vulnerabilities
- Use `flutter pub audit` (when available)
- Keep sensitive packages updated
- Review package permissions

### 6. Lock File

Commit `pubspec.lock` to version control:
- Ensures consistent builds
- Locks exact versions
- Reproducible builds

### 7. Package Size

Monitor package impact:
- Use `flutter build apk --analyze-size`
- Consider package size in decisions
- Remove unused dependencies

## Summary

- Use caret constraints (`^`) for most dependencies
- Organize `pubspec.yaml` with clear sections
- Regularly update dependencies
- Minimize dependencies when possible
- Document why dependencies are needed
- Resolve conflicts promptly
- Commit `pubspec.lock` to version control
