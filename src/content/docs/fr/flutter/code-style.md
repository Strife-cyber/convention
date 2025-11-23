---
title: Style de Code
description: Formatage Dart, règles de lint et guide de style pour les projets Flutter.
---

# Style de Code

Cette page documente les standards de style de code, règles de formatage et configuration de linting pour les projets Flutter. Nous suivons le [Guide de Style Dart](https://dart.dev/guides/language/effective-dart/style) officiel et les directives [Effective Dart](https://dart.dev/guides/language/effective-dart).

## Formatage Dart

Utilisez toujours `dart format` pour formater votre code avant de le commiter. Le formateur gère :
- L'indentation (2 espaces)
- Les sauts de ligne
- L'espacement autour des opérateurs
- Le placement des accolades
- Et plus encore

### Exécution du Formateur

```bash
# Formater tous les fichiers Dart du projet
dart format .

# Formater un fichier spécifique
dart format lib/main.dart

# Vérifier le formatage sans faire de modifications
dart format --set-exit-if-changed .
```

**Important :** Exécutez toujours `dart format .` avant de commiter le code. La plupart des IDE peuvent être configurés pour formater à la sauvegarde.

### Règles de Formatage

Le formateur applique :
- **2 espaces** pour l'indentation (pas de tabulations)
- **80 caractères** de longueur de ligne (limite souple, peut être dépassée pour la lisibilité)
- **Virgules finales** dans les collections multi-lignes (recommandé)

```dart
// Bon : Virgule finale dans une liste multi-ligne
final items = [
  'item1',
  'item2',
  'item3', // Virgule finale
];

// Bon : Virgule finale dans les paramètres de fonction
void function(
  String param1,
  int param2,
  bool param3, // Virgule finale
) {}
```

## Règles de Lint

Nous utilisons le package `flutter_lints` qui inclut `effective_dart` et les règles de lint spécifiques à Flutter.

### Configuration

Ajouter à `pubspec.yaml` :

```yaml
dev_dependencies:
  flutter_lints: ^3.0.0
```

Créer `analysis_options.yaml` à la racine du projet :

```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    # Règles d'erreur
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
    
    # Règles de style
    - always_put_required_named_parameters_first
    - curly_braces_in_flow_control_structures
    - prefer_is_empty
    - prefer_is_not_empty
    - sort_pub_dependencies
    - use_key_in_widget_constructors
```

### Règles de Lint Clés

**Toujours déclarer les types de retour :**
```dart
// Bon
String getName() => 'John';

// Mauvais
getName() => 'John'; // Type de retour manquant
```

**Préférer les constructeurs const :**
```dart
// Bon
const Text('Hello');

// Mauvais
Text('Hello'); // Devrait être const
```

**Préférer les champs final :**
```dart
// Bon
final String name;

// Mauvais
String name; // Devrait être final si non réassigné
```

**Préférer les guillemets simples :**
```dart
// Bon
final String message = 'Hello';

// Mauvais
final String message = "Hello"; // Utilisez les guillemets simples
```

## Organisation du Code

### Ordre des Imports

Les imports doivent être ordonnés dans les groupes suivants, séparés par des lignes vides :

1. **Imports Dart SDK** (`dart:`)
2. **Imports Flutter** (`package:flutter/`)
3. **Imports de packages** (`package:`)
4. **Imports relatifs** (chemins relatifs)

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

// 4. Imports relatifs
import '../models/user.dart';
import 'user_service.dart';
```

**Règles :**
- Utiliser le préfixe `as` pour les imports avec des noms conflictuels
- Grouper les imports par type
- Séparer les groupes par des lignes vides
- Trier les imports alphabétiquement dans chaque groupe

### Ordre des Membres de Classe

Organiser les membres de classe dans cet ordre :

1. Constructeurs
2. Méthodes statiques publiques
3. Méthodes d'instance publiques
4. Méthodes statiques privées
5. Méthodes d'instance privées
6. Variables statiques publiques
7. Variables d'instance publiques
8. Variables statiques privées
9. Variables d'instance privées

```dart
class UserService {
  // 1. Constructeurs
  UserService(this.apiClient);
  
  // 2. Méthodes statiques publiques
  static UserService create() => UserService(ApiClient());
  
  // 3. Méthodes d'instance publiques
  Future<User> getUser(String id) async {
    // ...
  }
  
  // 4. Méthodes statiques privées
  static String _formatName(String name) => name.trim();
  
  // 5. Méthodes d'instance privées
  void _validateInput(String input) {
    // ...
  }
  
  // 6. Variables statiques publiques
  static const String defaultName = 'Guest';
  
  // 7. Variables d'instance publiques
  final ApiClient apiClient;
  
  // 8. Variables statiques privées
  static String? _cache;
  
  // 9. Variables d'instance privées
  String? _currentUser;
}
```

## Longueur de Ligne

**Limite souple : 80 caractères**

Les lignes peuvent dépasser 80 caractères lorsque :
- Cela rendrait le code moins lisible de le couper
- URLs ou chemins de fichiers longs
- Littéraux de chaîne longs qui ne doivent pas être coupés

```dart
// Bon : Sous 80 caractères
final String userName = 'John Doe';

// Acceptable : Légèrement au-dessus pour la lisibilité
final String apiUrl = 'https://api.example.com/v1/users/authenticate';

// Bon : Couper les longues lignes de manière appropriée
final String message = 
    'This is a very long message that needs to be broken '
    'across multiple lines for better readability.';
```

## Commentaires

### Commentaires de Documentation

Utilisez `///` pour les commentaires de documentation sur les APIs publiques :

```dart
/// Calcule le prix total incluant la taxe.
///
/// [subtotal] Le prix avant taxe.
/// [taxRate] Le taux de taxe en décimal (par exemple, 0.1 pour 10%).
///
/// Retourne le prix total incluant la taxe.
/// Lance [ArgumentError] si [subtotal] ou [taxRate] est négatif.
double calculateTotal(double subtotal, double taxRate) {
  if (subtotal < 0 || taxRate < 0) {
    throw ArgumentError('Values must be non-negative');
  }
  return subtotal * (1 + taxRate);
}
```

### Commentaires Inline

Utilisez `//` pour les commentaires inline. Expliquez **pourquoi**, pas **quoi** :

```dart
// Bon : Explique pourquoi
// Calculer la remise seulement si l'utilisateur est premium et la commande dépasse le seuil
if (user.isPremium && order.total > 100) {
  // ...
}

// Mauvais : Explique quoi (évident depuis le code)
// Vérifier si l'utilisateur est premium
if (user.isPremium) {
  // ...
}
```

### Commentaires TODO

Utilisez `// TODO:` pour les notes temporaires :

```dart
// TODO: Implémenter le cache pour de meilleures performances
Future<User> getUser(String id) async {
  // ...
}
```

## Exemples de Code

### Bon Style de Code

```dart
import 'package:flutter/material.dart';
import 'package:riverpod/riverpod.dart';

import '../models/user.dart';

/// Un widget qui affiche les informations de profil utilisateur.
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

### Mauvais Style de Code

```dart
import "package:flutter/material.dart";
import 'package:riverpod/riverpod.dart';
import '../models/user.dart';

class UserProfileWidget extends StatelessWidget {
  UserProfileWidget({this.user}); // Clé manquante, const manquant, required manquant

  final User user; // Devrait être final

  @override
  Widget build(BuildContext context) {
    return Card(child: Column(children: [Text(user.name), Text(user.email)])); // Pas de virgule finale, mauvais formatage
  }
}
```

## Résumé

- Exécutez toujours `dart format .` avant de commiter
- Utilisez `flutter_lints` pour le linting
- Suivez l'ordre des imports : Dart SDK → Flutter → Packages → Relatif
- Organisez les membres de classe logiquement
- Gardez les lignes sous 80 caractères quand c'est possible
- Utilisez `///` pour la documentation, `//` pour les commentaires inline
- Préférez les constructeurs const et les champs final

