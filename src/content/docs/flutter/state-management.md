---
title: State Management
description: State management patterns and practices for Flutter projects.
---

# State Management

This page documents the state management patterns and practices used in Flutter projects. We use **Riverpod** as our primary state management solution.

## Preferred Approach

We use **Riverpod** (specifically `flutter_riverpod`) for state management. Riverpod provides:

- Compile-time safety
- Better testability
- Automatic disposal
- Dependency injection
- Provider composition

### Setup

Add to `pubspec.yaml`:

```yaml
dependencies:
  flutter_riverpod: ^2.4.0
```

Wrap your app with `ProviderScope`:

```dart
void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}
```

## Provider Types

### StateProvider

Use `StateProvider` for simple state that doesn't require complex logic:

```dart
final counterProvider = StateProvider<int>((ref) => 0);

// Usage
Consumer(
  builder: (context, ref, child) {
    final count = ref.watch(counterProvider);
    return Text('Count: $count');
  },
)

// Update
ref.read(counterProvider.notifier).state = 5;
```

### StateNotifierProvider

Use `StateNotifierProvider` for complex state with business logic:

```dart
class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);
  
  void increment() => state++;
  void decrement() => state--;
  void reset() => state = 0;
}

final counterNotifierProvider = StateNotifierProvider<CounterNotifier, int>(
  (ref) => CounterNotifier(),
);

// Usage
Consumer(
  builder: (context, ref, child) {
    final count = ref.watch(counterNotifierProvider);
    return Text('Count: $count');
  },
)

// Update
ref.read(counterNotifierProvider.notifier).increment();
```

### FutureProvider

Use `FutureProvider` for asynchronous data that loads once:

```dart
final userProvider = FutureProvider<User>((ref) async {
  final apiClient = ref.watch(apiClientProvider);
  return await apiClient.getUser();
});

// Usage
Consumer(
  builder: (context, ref, child) {
    final userAsync = ref.watch(userProvider);
    return userAsync.when(
      data: (user) => Text(user.name),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  },
)
```

### StreamProvider

Use `StreamProvider` for real-time data streams:

```dart
final messagesProvider = StreamProvider<List<Message>>((ref) {
  final chatService = ref.watch(chatServiceProvider);
  return chatService.messageStream();
});

// Usage
Consumer(
  builder: (context, ref, child) {
    final messagesAsync = ref.watch(messagesProvider);
    return messagesAsync.when(
      data: (messages) => ListView.builder(
        itemCount: messages.length,
        itemBuilder: (context, index) => MessageTile(messages[index]),
      ),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  },
)
```

### Provider (Read-only)

Use `Provider` for dependency injection and read-only values:

```dart
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(baseUrl: 'https://api.example.com');
});

// Usage in other providers
final userRepositoryProvider = Provider<UserRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return UserRepository(apiClient: apiClient);
});
```

## Patterns

### Feature-Based Organization

Organize providers by feature in the `presentation/providers/` directory:

```
features/
└── authentication/
    └── presentation/
        └── providers/
            ├── auth_provider.dart
            └── login_provider.dart
```

### State Classes

Use immutable state classes for complex state:

```dart
@immutable
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;
  
  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });
  
  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._authRepository) : super(const AuthState());
  
  final AuthRepository _authRepository;
  
  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final user = await _authRepository.login(email, password);
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
  
  void logout() {
    state = const AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) {
    final authRepository = ref.watch(authRepositoryProvider);
    return AuthNotifier(authRepository);
  },
);
```

### Provider Composition

Compose providers to build complex dependencies:

```dart
// Base providers
final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthRepository(apiClient: apiClient);
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return UserRepository(apiClient: apiClient);
});

// Feature providers that depend on repositories
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return AuthNotifier(authRepository);
});
```

## State Organization

### Global State

Use global providers for app-wide state:

```dart
// lib/core/providers/app_providers.dart
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);
final languageProvider = StateProvider<Locale>((ref) => const Locale('en'));
```

### Feature State

Use feature-specific providers for feature state:

```dart
// features/authentication/presentation/providers/auth_provider.dart
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref.watch(authRepositoryProvider)),
);
```

### Local State

Use local state (StatefulWidget) for UI-only state that doesn't need to be shared:

```dart
class SearchBar extends StatefulWidget {
  @override
  _SearchBarState createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  final _controller = TextEditingController();
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  // UI-only state, no need for Riverpod
}
```

## Examples

### Complete Example: User Authentication

```dart
// State class
@immutable
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;
  
  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });
  
  bool get isAuthenticated => user != null;
  
  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

// Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._authRepository) : super(const AuthState());
  
  final AuthRepository _authRepository;
  
  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final user = await _authRepository.login(email, password);
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
  
  Future<void> logout() async {
    await _authRepository.logout();
    state = const AuthState();
  }
}

// Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) {
    final authRepository = ref.watch(authRepositoryProvider);
    return AuthNotifier(authRepository);
  },
);

// Usage in widget
class LoginPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    
    if (authState.isLoading) {
      return CircularProgressIndicator();
    }
    
    if (authState.error != null) {
      return Text('Error: ${authState.error}');
    }
    
    return LoginForm();
  }
}
```

## Best Practices

### 1. Use `ref.watch()` for Reading State

Use `ref.watch()` when you want the widget to rebuild when state changes:

```dart
final count = ref.watch(counterProvider);
```

### 2. Use `ref.read()` for One-Time Actions

Use `ref.read()` when you don't need to listen to changes (e.g., in callbacks):

```dart
ElevatedButton(
  onPressed: () => ref.read(counterProvider.notifier).increment(),
  child: Text('Increment'),
)
```

### 3. Keep State Immutable

Always create new state objects instead of mutating existing ones:

```dart
// Good
state = state.copyWith(count: state.count + 1);

// Bad
state.count++; // Don't mutate state directly
```

### 4. Use `ConsumerWidget` or `ConsumerStatefulWidget`

Use Riverpod's consumer widgets instead of regular widgets:

```dart
// Good
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}

// Also good for StatefulWidget
class MyWidget extends ConsumerStatefulWidget {
  @override
  ConsumerState<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends ConsumerState<MyWidget> {
  @override
  Widget build(BuildContext context) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}
```

### 5. Provider Scope

Keep providers scoped appropriately:

- **Global**: App-wide state (theme, language)
- **Feature**: Feature-specific state (auth, user profile)
- **Local**: UI-only state (form controllers)

### 6. Error Handling

Handle errors in providers:

```dart
final userProvider = FutureProvider<User>((ref) async {
  try {
    final apiClient = ref.watch(apiClientProvider);
    return await apiClient.getUser();
  } catch (e) {
    // Error is automatically handled by FutureProvider
    rethrow;
  }
});
```

### 7. Disposal

Riverpod automatically disposes providers. For manual cleanup, use `ref.onDispose()`:

```dart
final timerProvider = Provider<Timer>((ref) {
  final timer = Timer.periodic(Duration(seconds: 1), (_) {});
  
  ref.onDispose(() {
    timer.cancel();
  });
  
  return timer;
});
```

## Migration Guidelines

If migrating from Provider to Riverpod:

1. Replace `Provider` with Riverpod's `Provider`
2. Replace `ChangeNotifier` with `StateNotifier`
3. Replace `Consumer` with Riverpod's `Consumer`
4. Wrap app with `ProviderScope` instead of `MultiProvider`
5. Update imports from `provider` to `flutter_riverpod`

Riverpod is largely compatible with Provider's API, making migration straightforward.

