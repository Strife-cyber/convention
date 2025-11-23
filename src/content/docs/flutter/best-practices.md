---
title: Best Practices
description: General Flutter best practices and guidelines.
---

# Best Practices

This page documents general best practices and guidelines for Flutter development.

## Performance

### Build Optimization

- Use `const` constructors whenever possible
- Avoid unnecessary widget rebuilds
- Use `RepaintBoundary` for expensive widgets
- Implement `shouldRebuild` in custom widgets

```dart
// Good: Const constructor
const UserCard({required this.user});

// Good: RepaintBoundary for expensive widgets
RepaintBoundary(
  child: ExpensiveChart(data: data),
)
```

### List Performance

- Use `ListView.builder` for long lists
- Implement proper `itemExtent` when possible
- Use `cacheExtent` to control off-screen items

```dart
ListView.builder(
  itemCount: items.length,
  itemExtent: 80.0, // Fixed height improves performance
  itemBuilder: (context, index) => ItemTile(items[index]),
)
```

### Image Optimization

- Use appropriate image formats (WebP when possible)
- Implement image caching
- Use `cached_network_image` for network images
- Resize images to appropriate dimensions

## Memory Management

### Disposing Resources

Always dispose controllers and subscriptions:

```dart
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late TextEditingController _controller;
  late StreamSubscription _subscription;
  
  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _subscription = stream.listen((data) {});
  }
  
  @override
  void dispose() {
    _controller.dispose();
    _subscription.cancel();
    super.dispose();
  }
}
```

### Avoiding Memory Leaks

- Dispose all controllers
- Cancel all subscriptions
- Remove listeners
- Clear large data structures when done

## Error Handling

### Try-Catch Blocks

Use try-catch for error handling:

```dart
Future<void> loadData() async {
  try {
    final data = await apiClient.fetchData();
    // Handle success
  } on NetworkException catch (e) {
    // Handle network error
  } on ValidationException catch (e) {
    // Handle validation error
  } catch (e, stackTrace) {
    // Handle unexpected error
    logger.error('Unexpected error', e, stackTrace);
  }
}
```

### User-Friendly Error Messages

Display user-friendly error messages:

```dart
try {
  await login(email, password);
} catch (e) {
  showErrorDialog(
    context,
    title: 'Login Failed',
    message: 'Please check your credentials and try again.',
  );
}
```

## Async Programming

### Future Handling

Handle futures properly:

```dart
// Good: Handle errors
Future<void> loadUser() async {
  try {
    final user = await userRepository.getUser();
    // Use user
  } catch (e) {
    // Handle error
  }
}

// Good: Use when() for AsyncValue
userAsync.when(
  data: (user) => UserWidget(user),
  loading: () => CircularProgressIndicator(),
  error: (error, stack) => ErrorWidget(error),
)
```

### Avoid Blocking UI

Don't block the UI thread:

```dart
// Bad: Blocks UI
void processData() {
  final result = heavyComputation(); // Blocks UI
}

// Good: Use compute() for heavy work
void processData() async {
  final result = await compute(heavyComputation, data);
}
```

## Navigation

### Named Routes

Use named routes for better navigation:

```dart
MaterialApp(
  routes: {
    '/': (context) => HomePage(),
    '/login': (context) => LoginPage(),
    '/profile': (context) => ProfilePage(),
  },
)

// Navigate
Navigator.pushNamed(context, '/login');
```

### Deep Linking

Implement deep linking for better UX:

```dart
// Handle deep links
onGenerateRoute: (settings) {
  if (settings.name == '/product/:id') {
    final id = settings.arguments as String;
    return MaterialPageRoute(
      builder: (_) => ProductPage(id: id),
    );
  }
}
```

## Localization

### Setup

Use `intl` package for localization:

```dart
// Generate localization files
flutter gen-l10n

// Use in code
Text(AppLocalizations.of(context)!.helloWorld)
```

### String Externalization

Never hardcode strings:

```dart
// Bad
Text('Hello World')

// Good
Text(AppLocalizations.of(context)!.helloWorld)
```

## Accessibility

### Semantic Labels

Add semantic labels:

```dart
Semantics(
  label: 'Close button',
  button: true,
  child: IconButton(
    icon: Icon(Icons.close),
    onPressed: () {},
  ),
)
```

### Screen Reader Support

Ensure screen reader compatibility:

```dart
// Good: Descriptive text
Text('User profile: ${user.name}')

// Good: Semantic widgets
Semantics(
  header: true,
  child: Text('User Profile'),
)
```

## Security

### Secure Storage

Use secure storage for sensitive data:

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();
await storage.write(key: 'token', value: token);
```

### API Key Management

Never commit API keys:

```dart
// Use environment variables
final apiKey = const String.fromEnvironment('API_KEY');
```

### Input Validation

Validate all user input:

```dart
String? validateEmail(String? value) {
  if (value == null || value.isEmpty) {
    return 'Email is required';
  }
  if (!Validators.isValidEmail(value)) {
    return 'Invalid email format';
  }
  return null;
}
```

## Code Reusability

### Widget Composition

Compose widgets for reusability:

```dart
// Reusable button
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  
  const PrimaryButton({
    super.key,
    required this.text,
    this.onPressed,
  });
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
```

### Utility Functions

Extract common logic:

```dart
// Utility function
String formatCurrency(double amount) {
  return '\$${amount.toStringAsFixed(2)}';
}
```

## Documentation

### Code Comments

Document complex logic:

```dart
/// Calculates the discount based on user tier and order total.
///
/// Premium users get 20% discount on orders over $100.
/// Regular users get 10% discount on orders over $200.
double calculateDiscount(User user, double orderTotal) {
  // Implementation
}
```

### README Files

Maintain comprehensive README files:
- Project description
- Setup instructions
- Usage examples
- Contribution guidelines

## Summary

- Optimize performance with const constructors and RepaintBoundary
- Dispose all resources properly
- Handle errors gracefully with user-friendly messages
- Use async/await properly, avoid blocking UI
- Implement named routes and deep linking
- Externalize all strings for localization
- Add semantic labels for accessibility
- Use secure storage for sensitive data
- Validate all user input
- Compose reusable widgets and utilities
- Document complex logic and maintain README files
