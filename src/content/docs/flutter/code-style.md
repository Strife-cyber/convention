---
title: Code Style
description: Dart formatting, lint rules, and style guide for Flutter projects.
---

# Code Style

This page documents the code style standards, formatting rules, and linting configuration for Flutter projects. We follow the official [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style) and [Effective Dart](https://dart.dev/guides/language/effective-dart) guidelines.

## Dart Formatting

Always use `dart format` to format your code before committing. The formatter handles:
- Indentation (2 spaces)
- Line breaks
- Spacing around operators
- Brace placement
- And more

### Running the Formatter

```bash
# Format all Dart files in the project
dart format .

# Format a specific file
dart format lib/main.dart

# Check formatting without making changes
dart format --set-exit-if-changed .
```

**Important:** Always run `dart format .` before committing code. Most IDEs can be configured to format on save.

### Formatting Rules

The formatter enforces:
- **2 spaces** for indentation (not tabs)
- **80 characters** line length (soft limit, can exceed for readability)
- **Trailing commas** in multi-line collections (recommended)

```dart
// Good: Trailing comma in multi-line list
final items = [
  'item1',
  'item2',
  'item3', // Trailing comma
];

// Good: Trailing comma in function parameters
void function(
  String param1,
  int param2,
  bool param3, // Trailing comma
) {}
```

## Lint Rules

We use `flutter_lints` package which includes `effective_dart` and Flutter-specific lint rules.

### Setup

Add to `pubspec.yaml`:

```yaml
dev_dependencies:
  flutter_lints: ^3.0.0
```

Create `analysis_options.yaml` in the project root:

```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    # Error rules
    - always_declare_return_types
    - avoid_print
    - avoid_relative_lib_imports
    - avoid_types_as_parameter_names
    - no_duplicate_case_values
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
    - prefer_final_fields
    - prefer_single_quotes
    - require_trailing_commas
    
    # Style rules
    - always_put_required_named_parameters_first
    - curly_braces_in_flow_control_structures
    - prefer_is_empty
    - prefer_is_not_empty
    - sort_pub_dependencies
    - use_key_in_widget_constructors
```

### Key Lint Rules

**Always declare return types:**
```dart
// Good
String getName() => 'John';

// Bad
getName() => 'John'; // Missing return type
```

**Prefer const constructors:**
```dart
// Good
const Text('Hello');

// Bad
Text('Hello'); // Should be const
```

**Prefer final fields:**
```dart
// Good
final String name;

// Bad
String name; // Should be final if not reassigned
```

**Prefer single quotes:**
```dart
// Good
final String message = 'Hello';

// Bad
final String message = "Hello"; // Use single quotes
```

## Code Organization

### Import Order

Imports should be ordered in the following groups, separated by blank lines:

1. **Dart SDK imports** (`dart:`)
2. **Flutter imports** (`package:flutter/`)
3. **Package imports** (`package:`)
4. **Relative imports** (relative paths)

```dart
// 1. Dart SDK
import 'dart:async';
import 'dart:io';

// 2. Flutter
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// 3. Packages
import 'package:riverpod/riverpod.dart';
import 'package:http/http.dart' as http;

// 4. Relative imports
import '../models/user.dart';
import 'user_service.dart';
```

**Rules:**
- Use `as` prefix for imports with conflicting names
- Group imports by type
- Separate groups with blank lines
- Sort imports alphabetically within each group

### Class Member Order

Organize class members in this order:

1. Constructors
2. Public static methods
3. Public instance methods
4. Private static methods
5. Private instance methods
6. Public static variables
7. Public instance variables
8. Private static variables
9. Private instance variables

```dart
class UserService {
  // 1. Constructors
  UserService(this.apiClient);
  
  // 2. Public static methods
  static UserService create() => UserService(ApiClient());
  
  // 3. Public instance methods
  Future<User> getUser(String id) async {
    // ...
  }
  
  // 4. Private static methods
  static String _formatName(String name) => name.trim();
  
  // 5. Private instance methods
  void _validateInput(String input) {
    // ...
  }
  
  // 6. Public static variables
  static const String defaultName = 'Guest';
  
  // 7. Public instance variables
  final ApiClient apiClient;
  
  // 8. Private static variables
  static String? _cache;
  
  // 9. Private instance variables
  String? _currentUser;
}
```

## Line Length

**Soft limit: 80 characters**

Lines can exceed 80 characters when:
- It would make the code less readable to break it
- Long URLs or file paths
- Long string literals that shouldn't be broken

```dart
// Good: Under 80 characters
final String userName = 'John Doe';

// Acceptable: Slightly over for readability
final String apiUrl = 'https://api.example.com/v1/users/authenticate';

// Good: Break long lines appropriately
final String message = 
    'This is a very long message that needs to be broken '
    'across multiple lines for better readability.';
```

## Comments

### Documentation Comments

Use `///` for documentation comments on public APIs:

```dart
/// Calculates the total price including tax.
///
/// [subtotal] The price before tax.
/// [taxRate] The tax rate as a decimal (e.g., 0.1 for 10%).
///
/// Returns the total price including tax.
/// Throws [ArgumentError] if [subtotal] or [taxRate] is negative.
double calculateTotal(double subtotal, double taxRate) {
  if (subtotal < 0 || taxRate < 0) {
    throw ArgumentError('Values must be non-negative');
  }
  return subtotal * (1 + taxRate);
}
```

### Inline Comments

Use `//` for inline comments. Explain **why**, not **what**:

```dart
// Good: Explains why
// Calculate discount only if user is premium and order exceeds threshold
if (user.isPremium && order.total > 100) {
  // ...
}

// Bad: Explains what (obvious from code)
// Check if user is premium
if (user.isPremium) {
  // ...
}
```

### TODO Comments

Use `// TODO:` for temporary notes:

```dart
// TODO: Implement caching for better performance
Future<User> getUser(String id) async {
  // ...
}
```

## Code Examples

### Good Code Style

```dart
import 'package:flutter/material.dart';
import 'package:riverpod/riverpod.dart';

import '../models/user.dart';

/// A widget that displays user profile information.
class UserProfileWidget extends StatelessWidget {
  const UserProfileWidget({
    super.key,
    required this.user,
  });

  final User user;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          Text(user.name),
          Text(user.email),
        ],
      ),
    );
  }
}
```

### Bad Code Style

```dart
import "package:flutter/material.dart";
import 'package:riverpod/riverpod.dart';
import '../models/user.dart';

class UserProfileWidget extends StatelessWidget {
  UserProfileWidget({this.user}); // Missing key, missing const, missing required

  final User user; // Should be final

  @override
  Widget build(BuildContext context) {
    return Card(child: Column(children: [Text(user.name), Text(user.email)])); // No trailing comma, poor formatting
  }
}
```

## Summary

- Always run `dart format .` before committing
- Use `flutter_lints` for linting
- Follow import order: Dart SDK → Flutter → Packages → Relative
- Organize class members logically
- Keep lines under 80 characters when possible
- Use `///` for documentation, `//` for inline comments
- Prefer const constructors and final fields

