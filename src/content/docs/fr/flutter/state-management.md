---
title: Gestion d'État
description: Patterns et pratiques de gestion d'état pour les projets Flutter.
---

# Gestion d'État

Cette page documente les patterns et pratiques de gestion d'état utilisés dans les projets Flutter. Nous utilisons **Riverpod** comme solution principale de gestion d'état.

## Approche Préférée

Nous utilisons **Riverpod** (spécifiquement `flutter_riverpod`) pour la gestion d'état. Riverpod fournit :

- Sécurité au moment de la compilation
- Meilleure testabilité
- Disposition automatique
- Injection de dépendances
- Composition de providers

### Configuration

Ajouter à `pubspec.yaml` :

```yaml
dependencies:
  flutter_riverpod: ^2.4.0
```

Envelopper votre application avec `ProviderScope` :

```dart
void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}
```

## Types de Providers

### StateProvider

Utilisez `StateProvider` pour un état simple qui ne nécessite pas de logique complexe :

```dart
final counterProvider = StateProvider<int>((ref) => 0);

// Utilisation
Consumer(
  builder: (context, ref, child) {
    final count = ref.watch(counterProvider);
    return Text('Count: $count');
  },
)

// Mise à jour
ref.read(counterProvider.notifier).state = 5;
```

### StateNotifierProvider

Utilisez `StateNotifierProvider` pour un état complexe avec logique métier :

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

// Utilisation
Consumer(
  builder: (context, ref, child) {
    final count = ref.watch(counterNotifierProvider);
    return Text('Count: $count');
  },
)

// Mise à jour
ref.read(counterNotifierProvider.notifier).increment();
```

### FutureProvider

Utilisez `FutureProvider` pour des données asynchrones qui se chargent une fois :

```dart
final userProvider = FutureProvider<User>((ref) async {
  final apiClient = ref.watch(apiClientProvider);
  return await apiClient.getUser();
});

// Utilisation
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

Utilisez `StreamProvider` pour des flux de données en temps réel :

```dart
final messagesProvider = StreamProvider<List<Message>>((ref) {
  final chatService = ref.watch(chatServiceProvider);
  return chatService.messageStream();
});

// Utilisation
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

### Provider (Lecture seule)

Utilisez `Provider` pour l'injection de dépendances et les valeurs en lecture seule :

```dart
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(baseUrl: 'https://api.example.com');
});

// Utilisation dans d'autres providers
final userRepositoryProvider = Provider<UserRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return UserRepository(apiClient: apiClient);
});
```

## Patterns

### Organisation par Feature

Organiser les providers par feature dans le répertoire `presentation/providers/` :

```
features/
└── authentication/
    └── presentation/
        └── providers/
            ├── auth_provider.dart
            └── login_provider.dart
```

### Classes d'État

Utilisez des classes d'état immutables pour un état complexe :

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

### Composition de Providers

Composez les providers pour construire des dépendances complexes :

```dart
// Providers de base
final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthRepository(apiClient: apiClient);
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return UserRepository(apiClient: apiClient);
});

// Providers de feature qui dépendent des repositories
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return AuthNotifier(authRepository);
});
```

## Organisation de l'État

### État Global

Utilisez des providers globaux pour l'état à l'échelle de l'application :

```dart
// lib/core/providers/app_providers.dart
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);
final languageProvider = StateProvider<Locale>((ref) => const Locale('en'));
```

### État de Feature

Utilisez des providers spécifiques à la feature pour l'état de la feature :

```dart
// features/authentication/presentation/providers/auth_provider.dart
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref.watch(authRepositoryProvider)),
);
```

### État Local

Utilisez l'état local (StatefulWidget) pour l'état uniquement UI qui n'a pas besoin d'être partagé :

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
  
  // État uniquement UI, pas besoin de Riverpod
}
```

## Exemples

### Exemple Complet : Authentification Utilisateur

```dart
// Classe d'état
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

// Utilisation dans un widget
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

## Meilleures Pratiques

### 1. Utiliser `ref.watch()` pour Lire l'État

Utilisez `ref.watch()` lorsque vous voulez que le widget se reconstruise lorsque l'état change :

```dart
final count = ref.watch(counterProvider);
```

### 2. Utiliser `ref.read()` pour les Actions Ponctuelles

Utilisez `ref.read()` lorsque vous n'avez pas besoin d'écouter les changements (par exemple, dans les callbacks) :

```dart
ElevatedButton(
  onPressed: () => ref.read(counterProvider.notifier).increment(),
  child: Text('Increment'),
)
```

### 3. Garder l'État Immutable

Créez toujours de nouveaux objets d'état au lieu de muter les existants :

```dart
// Bon
state = state.copyWith(count: state.count + 1);

// Mauvais
state.count++; // Ne pas muter l'état directement
```

### 4. Utiliser `ConsumerWidget` ou `ConsumerStatefulWidget`

Utilisez les widgets consumer de Riverpod au lieu des widgets réguliers :

```dart
// Bon
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}

// Aussi bon pour StatefulWidget
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

### 5. Portée du Provider

Gardez les providers avec une portée appropriée :

- **Global** : État à l'échelle de l'application (thème, langue)
- **Feature** : État spécifique à la feature (auth, profil utilisateur)
- **Local** : État uniquement UI (contrôleurs de formulaire)

### 6. Gestion des Erreurs

Gérez les erreurs dans les providers :

```dart
final userProvider = FutureProvider<User>((ref) async {
  try {
    final apiClient = ref.watch(apiClientProvider);
    return await apiClient.getUser();
  } catch (e) {
    // L'erreur est automatiquement gérée par FutureProvider
    rethrow;
  }
});
```

### 7. Disposition

Riverpod dispose automatiquement les providers. Pour le nettoyage manuel, utilisez `ref.onDispose()` :

```dart
final timerProvider = Provider<Timer>((ref) {
  final timer = Timer.periodic(Duration(seconds: 1), (_) {});
  
  ref.onDispose(() {
    timer.cancel();
  });
  
  return timer;
});
```

## Directives de Migration

Si vous migrez de Provider vers Riverpod :

1. Remplacer `Provider` par le `Provider` de Riverpod
2. Remplacer `ChangeNotifier` par `StateNotifier`
3. Remplacer `Consumer` par le `Consumer` de Riverpod
4. Envelopper l'application avec `ProviderScope` au lieu de `MultiProvider`
5. Mettre à jour les imports de `provider` vers `flutter_riverpod`

Riverpod est largement compatible avec l'API de Provider, ce qui rend la migration simple.

