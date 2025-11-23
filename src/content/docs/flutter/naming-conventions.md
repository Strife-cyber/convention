---
title: Naming Conventions
description: File, class, and variable naming standards for Flutter projects.
---

# Naming Conventions

This page documents the naming conventions for Flutter code, files, and variables. We follow the official [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style).

## Files

Use **snake_case** for file names. The file name should match the name of the primary class or top-level identifier in the file.

```dart
// File: user_profile_screen.dart
class UserProfileScreen extends StatelessWidget {
  // ...
}

// File: authentication_service.dart
class AuthenticationService {
  // ...
}
```

**Good:**
- `user_profile_screen.dart`
- `authentication_service.dart`
- `api_client.dart`

**Bad:**
- `UserProfileScreen.dart` (PascalCase)
- `authenticationService.dart` (camelCase)
- `user-profile-screen.dart` (kebab-case)

## Classes

Use **PascalCase** for class names. Class names should be nouns and clearly describe what the class represents.

```dart
// Good
class UserProfileScreen extends StatelessWidget {}
class AuthenticationService {}
class ApiResponse {}

// Bad
class userProfileScreen {} // Should be PascalCase
class API {} // Acronyms should be all caps only if they're 2-3 letters
class User {} // Too generic
```

## Variables and Functions

Use **camelCase** for variables, functions, and method names. Names should be descriptive and clearly indicate their purpose.

```dart
// Good
String userName = 'John';
int itemCount = 0;
void getUserData() {}
bool isValidEmail(String email) {}

// Bad
String user_name = 'John'; // snake_case
String UserName = 'John'; // PascalCase
void GetUserData() {} // PascalCase for function
```

### Boolean Variables

Boolean variables and functions should be named with a verb or adjective that clearly indicates true/false.

```dart
// Good
bool isEnabled = true;
bool hasPermission = false;
bool canEdit = true;
bool isEmpty() => items.isEmpty;

// Bad
bool enabled = true; // Ambiguous
bool permission = false; // Not clear it's a boolean
```

## Constants

Use **lowerCamelCase** for constants, including `const` and `static const` variables.

```dart
// Good
const int maxRetryCount = 3;
const String apiBaseUrl = 'https://api.example.com';
static const Duration defaultTimeout = Duration(seconds: 30);

// Bad
const int MAX_RETRY_COUNT = 3; // SCREAMING_CAPS
const String ApiBaseUrl = 'https://api.example.com'; // PascalCase
```

For enum values, use **lowerCamelCase**:

```dart
enum UserRole {
  admin,
  moderator,
  user,
}
```

## Private Members

Use **underscore prefix** (`_`) for private members (fields, methods, top-level functions, and variables).

```dart
class UserService {
  // Public
  String userName = '';
  
  // Private
  String _internalState = '';
  void _validateInput() {}
  
  // Private static
  static String _apiKey = '';
}
```

**Important:** In Dart, privacy is library-level, not class-level. A private member (prefixed with `_`) is visible to all code in the same file but not to other files.

## Type Parameters

Use single, uppercase letters for type parameters, typically `T`, `E`, `K`, `V`, `R`.

```dart
// Good
class Repository<T> {}
Future<E> fetchData<E>();
Map<K, V> processMap<K, V>();

// Bad
class Repository<Type> {} // Too verbose
Future<Element> fetchData<Element>(); // Use single letters
```

## Libraries and Packages

Use **lowercase_with_underscores** for library names and package names.

```dart
// File: user_authentication.dart
library user_authentication;

// Package name in pubspec.yaml
name: user_authentication_service
```

## Examples

```dart
// Good examples
class UserProfileScreen extends StatelessWidget {
  final String userName;
  final bool isActive;
  static const int maxRetryCount = 3;
  String _internalState = '';
  
  void _validateForm() {}
  bool isValidEmail(String email) => email.contains('@');
}

// Bad examples
class userProfileScreen extends StatelessWidget { // Should be PascalCase
  final String UserName; // Should be camelCase
  final bool active; // Should be isActive for boolean
  static const int MAX_RETRY = 3; // Should be lowerCamelCase
  String internalState = ''; // Should be _internalState if private
}
```

## Summary

| Type | Convention | Example |
|------|-----------|---------|
| Files | snake_case | `user_profile_screen.dart` |
| Classes | PascalCase | `UserProfileScreen` |
| Variables | camelCase | `userName` |
| Functions | camelCase | `getUserData()` |
| Constants | lowerCamelCase | `maxRetryCount` |
| Private members | _lowerCamelCase | `_internalState` |
| Type parameters | Single uppercase | `T`, `E`, `K`, `V` |
| Libraries | lowercase_with_underscores | `user_authentication` |

