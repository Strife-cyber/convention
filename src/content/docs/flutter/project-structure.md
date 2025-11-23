---
title: Project Structure
description: Folder organization and architecture for Flutter projects.
---

# Project Structure

This page documents the standard folder organization and architecture for Flutter projects. We follow a **feature-first architecture** with Clean Architecture principles.

## Directory Structure

```
lib/
├── core/
│   ├── constants/
│   │   ├── app_constants.dart
│   │   └── api_constants.dart
│   ├── utils/
│   │   ├── validators.dart
│   │   └── formatters.dart
│   ├── services/
│   │   ├── api_service.dart
│   │   └── storage_service.dart
│   └── errors/
│       ├── exceptions.dart
│       └── failures.dart
├── features/
│   ├── authentication/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── pages/
│   │       ├── widgets/
│   │       └── providers/
│   └── user_profile/
│       ├── data/
│       ├── domain/
│       └── presentation/
├── shared/
│   ├── widgets/
│   │   ├── buttons/
│   │   ├── inputs/
│   │   └── cards/
│   ├── models/
│   │   └── api_response.dart
│   └── themes/
│       ├── app_theme.dart
│       └── text_styles.dart
└── main.dart
```

## Feature Organization

We use a **feature-first architecture** where each feature is self-contained with its own data, domain, and presentation layers. This approach:

- Improves code organization and maintainability
- Makes features easier to test in isolation
- Reduces coupling between features
- Makes it easier to add or remove features

### Feature Structure

Each feature follows Clean Architecture with three main layers:

#### Data Layer (`data/`)
- **datasources/**: Remote and local data sources (API clients, local storage)
- **models/**: Data transfer objects (DTOs) that map to JSON/entities
- **repositories/**: Repository implementations that coordinate data sources

#### Domain Layer (`domain/`)
- **entities/**: Business objects (pure Dart classes)
- **repositories/**: Repository interfaces (abstract classes)
- **usecases/**: Business logic operations

#### Presentation Layer (`presentation/`)
- **pages/**: Full screen widgets (screens)
- **widgets/**: Feature-specific reusable widgets
- **providers/**: Riverpod providers for state management

**Example Feature Structure:**

```
authentication/
├── data/
│   ├── datasources/
│   │   ├── auth_remote_datasource.dart
│   │   └── auth_local_datasource.dart
│   ├── models/
│   │   └── user_model.dart
│   └── repositories/
│       └── auth_repository_impl.dart
├── domain/
│   ├── entities/
│   │   └── user.dart
│   ├── repositories/
│   │   └── auth_repository.dart
│   └── usecases/
│       ├── login_usecase.dart
│       └── logout_usecase.dart
└── presentation/
    ├── pages/
    │   ├── login_page.dart
    │   └── register_page.dart
    ├── widgets/
    │   └── login_form.dart
    └── providers/
        └── auth_provider.dart
```

## Core Directory

The `core/` directory contains code that is used across multiple features but is not feature-specific.

### `core/constants/`
Application-wide constants:
- API endpoints
- App configuration values
- Magic numbers and strings

```dart
// core/constants/app_constants.dart
class AppConstants {
  static const String appName = 'MyApp';
  static const Duration apiTimeout = Duration(seconds: 30);
}
```

### `core/utils/`
Utility functions and helpers:
- Validators (email, phone, etc.)
- Formatters (date, currency, etc.)
- Extensions
- Helper functions

```dart
// core/utils/validators.dart
class Validators {
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }
}
```

### `core/services/`
Shared services used across the app:
- API service (HTTP client setup)
- Storage service (local storage, secure storage)
- Notification service
- Analytics service

### `core/errors/`
Error handling:
- Custom exceptions
- Failure classes
- Error mappers

## Shared Directory

The `shared/` directory contains reusable components that are not feature-specific.

### `shared/widgets/`
Reusable UI components used across features:
- Buttons (primary, secondary, etc.)
- Input fields (text, password, etc.)
- Cards, dialogs, loaders
- Layout components

### `shared/models/`
Shared data models:
- API response wrappers
- Common DTOs
- Shared entities

### `shared/themes/`
App-wide theming:
- Color schemes
- Text styles
- App theme configuration

## Assets

Assets are organized in the `assets/` directory at the project root:

```
assets/
├── images/
│   ├── icons/
│   ├── illustrations/
│   └── logos/
├── fonts/
│   └── custom_fonts/
└── animations/
    └── lottie/
```

Reference assets in `pubspec.yaml`:

```yaml
flutter:
  assets:
    - assets/images/
    - assets/fonts/
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/custom_font.ttf
```

## Configuration Files

### Environment Configuration
Place environment-specific configuration in `lib/core/config/`:

```
lib/core/config/
├── app_config.dart
├── dev_config.dart
├── prod_config.dart
└── staging_config.dart
```

### Environment Variables
Use `.env` files for sensitive configuration (API keys, etc.):

```
.env
.env.dev
.env.prod
```

**Note:** Add `.env` files to `.gitignore` and use `.env.example` as a template.

## Main Entry Point

The `main.dart` file should be kept minimal and focus on:
- App initialization
- Provider setup
- Theme configuration
- Route configuration

```dart
// main.dart
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp(
        title: 'MyApp',
        theme: AppTheme.lightTheme,
        home: const HomePage(),
      ),
    );
  }
}
```

## Best Practices

1. **Keep features independent**: Features should not directly depend on other features
2. **Use dependency injection**: Pass dependencies through constructors
3. **Follow single responsibility**: Each class/file should have one clear purpose
4. **Avoid deep nesting**: Keep folder structure flat when possible
5. **Group related files**: Keep related files close together
6. **Use barrel files sparingly**: Only for frequently imported groups (e.g., `widgets/widgets.dart`)

