---
title: Meilleures Pratiques
description: Meilleures pratiques et directives générales Flutter.
---

# Meilleures Pratiques

Cette page documente les meilleures pratiques et directives générales pour le développement Flutter.

## Performance

### Optimisation de Build

- Utilisez les constructeurs `const` chaque fois que possible
- Évitez les reconstructions inutiles de widgets
- Utilisez `RepaintBoundary` pour les widgets coûteux
- Implémentez `shouldRebuild` dans les widgets personnalisés

```dart
// Bon : Constructeur const
const UserCard({required this.user});

// Bon : RepaintBoundary pour les widgets coûteux
RepaintBoundary(
  child: ExpensiveChart(data: data),
)
```

### Performance des Listes

- Utilisez `ListView.builder` pour les longues listes
- Implémentez un `itemExtent` approprié quand c'est possible
- Utilisez `cacheExtent` pour contrôler les éléments hors écran

```dart
ListView.builder(
  itemCount: items.length,
  itemExtent: 80.0, // Hauteur fixe améliore les performances
  itemBuilder: (context, index) => ItemTile(items[index]),
)
```

### Optimisation des Images

- Utilisez des formats d'image appropriés (WebP quand c'est possible)
- Implémentez le cache d'images
- Utilisez `cached_network_image` pour les images réseau
- Redimensionnez les images aux dimensions appropriées

## Gestion de la Mémoire

### Disposition des Ressources

Disposez toujours les contrôleurs et abonnements :

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

### Éviter les Fuites Mémoire

- Disposez tous les contrôleurs
- Annulez tous les abonnements
- Supprimez les listeners
- Videz les grandes structures de données quand terminé

## Gestion des Erreurs

### Blocs Try-Catch

Utilisez try-catch pour la gestion des erreurs :

```dart
Future<void> loadData() async {
  try {
    final data = await apiClient.fetchData();
    // Gérer le succès
  } on NetworkException catch (e) {
    // Gérer l'erreur réseau
  } on ValidationException catch (e) {
    // Gérer l'erreur de validation
  } catch (e, stackTrace) {
    // Gérer l'erreur inattendue
    logger.error('Unexpected error', e, stackTrace);
  }
}
```

### Messages d'Erreur Conviviaux

Affichez des messages d'erreur conviviaux :

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

## Programmation Asynchrone

### Gestion des Futures

Gérez les futures correctement :

```dart
// Bon : Gérer les erreurs
Future<void> loadUser() async {
  try {
    final user = await userRepository.getUser();
    // Utiliser l'utilisateur
  } catch (e) {
    // Gérer l'erreur
  }
}

// Bon : Utiliser when() pour AsyncValue
userAsync.when(
  data: (user) => UserWidget(user),
  loading: () => CircularProgressIndicator(),
  error: (error, stack) => ErrorWidget(error),
)
```

### Éviter de Bloquer l'UI

Ne bloquez pas le thread UI :

```dart
// Mauvais : Bloque l'UI
void processData() {
  final result = heavyComputation(); // Bloque l'UI
}

// Bon : Utiliser compute() pour le travail lourd
void processData() async {
  final result = await compute(heavyComputation, data);
}
```

## Navigation

### Routes Nommées

Utilisez des routes nommées pour une meilleure navigation :

```dart
MaterialApp(
  routes: {
    '/': (context) => HomePage(),
    '/login': (context) => LoginPage(),
    '/profile': (context) => ProfilePage(),
  },
)

// Naviguer
Navigator.pushNamed(context, '/login');
```

### Deep Linking

Implémentez le deep linking pour une meilleure UX :

```dart
// Gérer les deep links
onGenerateRoute: (settings) {
  if (settings.name == '/product/:id') {
    final id = settings.arguments as String;
    return MaterialPageRoute(
      builder: (_) => ProductPage(id: id),
    );
  }
}
```

## Localisation

### Configuration

Utilisez le package `intl` pour la localisation :

```dart
// Générer les fichiers de localisation
flutter gen-l10n

// Utiliser dans le code
Text(AppLocalizations.of(context)!.helloWorld)
```

### Externalisation des Chaînes

Ne codez jamais les chaînes en dur :

```dart
// Mauvais
Text('Hello World')

// Bon
Text(AppLocalizations.of(context)!.helloWorld)
```

## Accessibilité

### Labels Sémantiques

Ajoutez des labels sémantiques :

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

### Support des Lecteurs d'Écran

Assurez la compatibilité avec les lecteurs d'écran :

```dart
// Bon : Texte descriptif
Text('User profile: ${user.name}')

// Bon : Widgets sémantiques
Semantics(
  header: true,
  child: Text('User Profile'),
)
```

## Sécurité

### Stockage Sécurisé

Utilisez le stockage sécurisé pour les données sensibles :

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();
await storage.write(key: 'token', value: token);
```

### Gestion des Clés API

Ne commitez jamais les clés API :

```dart
// Utiliser les variables d'environnement
final apiKey = const String.fromEnvironment('API_KEY');
```

### Validation des Entrées

Validez toutes les entrées utilisateur :

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

## Réutilisabilité du Code

### Composition de Widgets

Composez des widgets pour la réutilisabilité :

```dart
// Bouton réutilisable
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

### Fonctions Utilitaires

Extrayez la logique commune :

```dart
// Fonction utilitaire
String formatCurrency(double amount) {
  return '\$${amount.toStringAsFixed(2)}';
}
```

## Documentation

### Commentaires de Code

Documentez la logique complexe :

```dart
/// Calcule la remise basée sur le niveau utilisateur et le total de la commande.
///
/// Les utilisateurs premium obtiennent 20% de remise sur les commandes de plus de 100$.
/// Les utilisateurs réguliers obtiennent 10% de remise sur les commandes de plus de 200$.
double calculateDiscount(User user, double orderTotal) {
  // Implémentation
}
```

### Fichiers README

Maintenez des fichiers README complets :
- Description du projet
- Instructions de configuration
- Exemples d'utilisation
- Directives de contribution

## Résumé

- Optimiser les performances avec les constructeurs const et RepaintBoundary
- Disposez toutes les ressources correctement
- Gérez les erreurs gracieusement avec des messages conviviaux
- Utilisez async/await correctement, évitez de bloquer l'UI
- Implémentez les routes nommées et le deep linking
- Externalisez toutes les chaînes pour la localisation
- Ajoutez des labels sémantiques pour l'accessibilité
- Utilisez le stockage sécurisé pour les données sensibles
- Validez toutes les entrées utilisateur
- Composez des widgets et utilitaires réutilisables
- Documentez la logique complexe et maintenez les fichiers README

