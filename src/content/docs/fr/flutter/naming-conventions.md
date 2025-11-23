---
title: Conventions de Nommage
description: Standards de nommage pour les fichiers, classes et variables dans les projets Flutter.
---

# Conventions de Nommage

Cette page documente les conventions de nommage pour le code Flutter, les fichiers et les variables. Nous suivons le [Guide de Style Dart](https://dart.dev/guides/language/effective-dart/style) officiel.

## Fichiers

Utilisez **snake_case** pour les noms de fichiers. Le nom du fichier doit correspondre au nom de la classe principale ou de l'identifiant de niveau supérieur dans le fichier.

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

**Bon :**
- `user_profile_screen.dart`
- `authentication_service.dart`
- `api_client.dart`

**Mauvais :**
- `UserProfileScreen.dart` (PascalCase)
- `authenticationService.dart` (camelCase)
- `user-profile-screen.dart` (kebab-case)

## Classes

Utilisez **PascalCase** pour les noms de classes. Les noms de classes doivent être des noms et décrire clairement ce que la classe représente.

```dart
// Bon
class UserProfileScreen extends StatelessWidget {}
class AuthenticationService {}
class ApiResponse {}

// Mauvais
class userProfileScreen {} // Devrait être PascalCase
class API {} // Les acronymes doivent être en majuscules seulement s'ils font 2-3 lettres
class User {} // Trop générique
```

## Variables et Fonctions

Utilisez **camelCase** pour les variables, fonctions et noms de méthodes. Les noms doivent être descriptifs et indiquer clairement leur objectif.

```dart
// Bon
String userName = 'John';
int itemCount = 0;
void getUserData() {}
bool isValidEmail(String email) {}

// Mauvais
String user_name = 'John'; // snake_case
String UserName = 'John'; // PascalCase
void GetUserData() {} // PascalCase pour une fonction
```

### Variables Booléennes

Les variables et fonctions booléennes doivent être nommées avec un verbe ou un adjectif qui indique clairement vrai/faux.

```dart
// Bon
bool isEnabled = true;
bool hasPermission = false;
bool canEdit = true;
bool isEmpty() => items.isEmpty;

// Mauvais
bool enabled = true; // Ambigu
bool permission = false; // Pas clair que c'est un booléen
```

## Constantes

Utilisez **lowerCamelCase** pour les constantes, y compris les variables `const` et `static const`.

```dart
// Bon
const int maxRetryCount = 3;
const String apiBaseUrl = 'https://api.example.com';
static const Duration defaultTimeout = Duration(seconds: 30);

// Mauvais
const int MAX_RETRY_COUNT = 3; // SCREAMING_CAPS
const String ApiBaseUrl = 'https://api.example.com'; // PascalCase
```

Pour les valeurs d'énumération, utilisez **lowerCamelCase** :

```dart
enum UserRole {
  admin,
  moderator,
  user,
}
```

## Membres Privés

Utilisez le **préfixe underscore** (`_`) pour les membres privés (champs, méthodes, fonctions de niveau supérieur et variables).

```dart
class UserService {
  // Public
  String userName = '';
  
  // Privé
  String _internalState = '';
  void _validateInput() {}
  
  // Privé statique
  static String _apiKey = '';
}
```

**Important :** En Dart, la confidentialité est au niveau de la bibliothèque, pas au niveau de la classe. Un membre privé (préfixé avec `_`) est visible pour tout le code dans le même fichier mais pas pour les autres fichiers.

## Paramètres de Type

Utilisez des lettres majuscules uniques pour les paramètres de type, généralement `T`, `E`, `K`, `V`, `R`.

```dart
// Bon
class Repository<T> {}
Future<E> fetchData<E>();
Map<K, V> processMap<K, V>();

// Mauvais
class Repository<Type> {} // Trop verbeux
Future<Element> fetchData<Element>(); // Utilisez des lettres uniques
```

## Bibliothèques et Packages

Utilisez **lowercase_with_underscores** pour les noms de bibliothèques et de packages.

```dart
// File: user_authentication.dart
library user_authentication;

// Package name in pubspec.yaml
name: user_authentication_service
```

## Exemples

```dart
// Bons exemples
class UserProfileScreen extends StatelessWidget {
  final String userName;
  final bool isActive;
  static const int maxRetryCount = 3;
  String _internalState = '';
  
  void _validateForm() {}
  bool isValidEmail(String email) => email.contains('@');
}

// Mauvais exemples
class userProfileScreen extends StatelessWidget { // Devrait être PascalCase
  final String UserName; // Devrait être camelCase
  final bool active; // Devrait être isActive pour un booléen
  static const int MAX_RETRY = 3; // Devrait être lowerCamelCase
  String internalState = ''; // Devrait être _internalState si privé
}
```

## Résumé

| Type | Convention | Exemple |
|------|-----------|---------|
| Fichiers | snake_case | `user_profile_screen.dart` |
| Classes | PascalCase | `UserProfileScreen` |
| Variables | camelCase | `userName` |
| Fonctions | camelCase | `getUserData()` |
| Constantes | lowerCamelCase | `maxRetryCount` |
| Membres privés | _lowerCamelCase | `_internalState` |
| Paramètres de type | Lettre majuscule unique | `T`, `E`, `K`, `V` |
| Bibliothèques | lowercase_with_underscores | `user_authentication` |

