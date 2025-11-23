---
title: Documentation
description: Code documentation standards for all projects.
---

# Documentation

This page documents code documentation standards that apply to all projects. Good documentation makes code more maintainable and easier to understand.

## Code Comments

### When to Comment

Comment code when:
- **Complex Logic**: Algorithm or business logic that's not obvious
- **Non-Obvious Code**: Code that does something unexpected
- **Public APIs**: All public functions, classes, and methods
- **Workarounds**: Temporary solutions or known issues
- **Decisions**: Important design decisions and rationale

**Don't comment:**
- Obvious code that's self-explanatory
- What the code does (code should be self-documenting)
- Comments that just repeat the code

### Comment Style

**Single-line comments:**
```dart
// Calculate discount only if user is premium and order exceeds threshold
if (user.isPremium && order.total > 100) {
  // Apply premium discount
}
```

```csharp
// Calculate discount only if user is premium and order exceeds threshold
if (user.IsPremium && order.Total > 100)
{
    // Apply premium discount
}
```

**Multi-line comments:**
```dart
/*
 * This function calculates the total price including tax.
 * It handles edge cases for tax-exempt items and applies
 * the appropriate tax rate based on the item category.
 */
```

**Explain Why, Not What:**
```dart
// Good: Explains why
// Use Time.deltaTime to make movement frame-rate independent
transform.position += direction * moveSpeed * Time.deltaTime;

// Bad: Explains what (obvious from code)
// Move the transform position
transform.position += direction * moveSpeed * Time.deltaTime;
```

## API Documentation

### Function Documentation

Document all public functions, methods, and classes:

**Dart:**
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

**C#:**
```csharp
/// <summary>
/// Calculates the total price including tax.
/// </summary>
/// <param name="subtotal">The price before tax.</param>
/// <param name="taxRate">The tax rate as a decimal (e.g., 0.1 for 10%).</param>
/// <returns>The total price including tax.</returns>
/// <exception cref="ArgumentOutOfRangeException">Thrown when subtotal or taxRate is negative.</exception>
public double CalculateTotal(double subtotal, double taxRate)
{
    if (subtotal < 0 || taxRate < 0)
    {
        throw new ArgumentOutOfRangeException("Values must be non-negative");
    }
    return subtotal * (1 + taxRate);
}
```

### Class Documentation

Document classes with their purpose and usage:

```dart
/// A service for managing user authentication.
///
/// This service handles user login, logout, and session management.
/// It integrates with the backend API and local storage.
///
/// Example:
/// ```dart
/// final authService = AuthService();
/// await authService.login('user@example.com', 'password');
/// ```
class AuthService {
  // ...
}
```

```csharp
/// <summary>
/// Manages player movement and input handling.
/// </summary>
/// <remarks>
/// This component handles player movement based on input.
/// It supports both keyboard and gamepad input.
/// </remarks>
public class PlayerController : MonoBehaviour
{
    // ...
}
```

### Parameter Documentation

Document all parameters:

```dart
/// Creates a new user profile.
///
/// [name] The user's full name.
/// [email] The user's email address. Must be a valid email format.
/// [age] The user's age. Must be between 18 and 120.
void createUser(String name, String email, int age) {
  // ...
}
```

## README Files

### Project README

Every project should have a comprehensive README:

```markdown
# Project Name

Brief description of the project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Requirements

- Flutter 3.0.0+
- Dart 3.0.0+
- Node.js 18+

## Installation

1. Clone the repository
2. Run `flutter pub get`
3. Configure environment variables
4. Run `flutter run`

## Usage

Basic usage example.

## Contributing

Guidelines for contributing.

## License

License information.
```

### Code Documentation

- Document setup instructions
- Include usage examples
- Explain configuration options
- Document environment variables
- Provide troubleshooting tips

## Inline Documentation

### TODO Comments

Use TODO comments for future work:

```dart
// TODO: Implement caching for better performance
Future<User> getUser(String id) async {
  // ...
}
```

```csharp
// TODO: Implement object pooling for better performance
private void SpawnEnemy()
{
    // ...
}
```

### FIXME Comments

Use FIXME for known issues:

```dart
// FIXME: This workaround should be removed when API is fixed
Future<void> loadData() async {
  // Temporary workaround
}
```

### NOTE Comments

Use NOTE for important information:

```dart
// NOTE: This function must be called on the main thread
void updateUI() {
  // ...
}
```

## Documentation Tools

### Dart

- **DartDoc**: Generates API documentation from comments
- Run: `dart doc`

### C#

- **XML Documentation**: Generates documentation from XML comments
- **DocFX**: Generates documentation websites

### Markdown

- Use Markdown for README files
- Use code blocks with language tags
- Include examples and screenshots

## Best Practices

### Keep Documentation Up to Date

- Update documentation when code changes
- Remove outdated comments
- Review documentation during code reviews

### Write for Future Maintainers

- Assume reader has basic knowledge
- Explain complex concepts
- Provide context and examples

### Be Concise

- Don't over-document obvious code
- Focus on non-obvious aspects
- Use clear, simple language

### Use Examples

- Include code examples
- Show common usage patterns
- Demonstrate edge cases

### Document Decisions

- Explain why, not just what
- Document design decisions
- Note trade-offs and alternatives

## Summary

- Comment complex logic and non-obvious code
- Document all public APIs
- Write comprehensive README files
- Use TODO/FIXME/NOTE comments appropriately
- Keep documentation up to date
- Write for future maintainers
- Include examples and context
- Explain why, not just what
