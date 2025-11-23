---
title: Structure de Projet
description: Organisation des dossiers et architecture pour les projets Flutter.
---

# Structure de Projet

Cette page documente l'organisation standard des dossiers et l'architecture pour les projets Flutter. Nous suivons une **architecture feature-first** avec les principes de Clean Architecture.

## Structure des Répertoires

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

## Organisation par Feature

Nous utilisons une **architecture feature-first** où chaque feature est autonome avec ses propres couches data, domain et presentation. Cette approche :

- Améliore l'organisation et la maintenabilité du code
- Facilite les tests isolés des features
- Réduit le couplage entre les features
- Facilite l'ajout ou la suppression de features

### Structure d'une Feature

Chaque feature suit Clean Architecture avec trois couches principales :

#### Couche Data (`data/`)
- **datasources/**: Sources de données distantes et locales (clients API, stockage local)
- **models/**: Objets de transfert de données (DTOs) qui mappent vers JSON/entities
- **repositories/**: Implémentations de repositories qui coordonnent les sources de données

#### Couche Domain (`domain/`)
- **entities/**: Objets métier (classes Dart pures)
- **repositories/**: Interfaces de repositories (classes abstraites)
- **usecases/**: Opérations de logique métier

#### Couche Presentation (`presentation/`)
- **pages/**: Widgets plein écran (écrans)
- **widgets/**: Widgets réutilisables spécifiques à la feature
- **providers/**: Providers Riverpod pour la gestion d'état

**Exemple de Structure de Feature :**

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

## Répertoire Core

Le répertoire `core/` contient le code utilisé dans plusieurs features mais qui n'est pas spécifique à une feature.

### `core/constants/`
Constantes à l'échelle de l'application :
- Points de terminaison API
- Valeurs de configuration de l'application
- Nombres et chaînes magiques

```dart
// core/constants/app_constants.dart
class AppConstants {
  static const String appName = 'MyApp';
  static const Duration apiTimeout = Duration(seconds: 30);
}
```

### `core/utils/`
Fonctions utilitaires et helpers :
- Validateurs (email, téléphone, etc.)
- Formateurs (date, devise, etc.)
- Extensions
- Fonctions helper

```dart
// core/utils/validators.dart
class Validators {
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }
}
```

### `core/services/`
Services partagés utilisés dans toute l'application :
- Service API (configuration du client HTTP)
- Service de stockage (stockage local, stockage sécurisé)
- Service de notifications
- Service d'analytics

### `core/errors/`
Gestion des erreurs :
- Exceptions personnalisées
- Classes de failure
- Mappers d'erreurs

## Répertoire Shared

Le répertoire `shared/` contient des composants réutilisables qui ne sont pas spécifiques à une feature.

### `shared/widgets/`
Composants UI réutilisables utilisés dans les features :
- Boutons (primaire, secondaire, etc.)
- Champs de saisie (texte, mot de passe, etc.)
- Cartes, dialogues, loaders
- Composants de mise en page

### `shared/models/`
Modèles de données partagés :
- Wrappers de réponse API
- DTOs communs
- Entities partagées

### `shared/themes/`
Thématisation à l'échelle de l'application :
- Schémas de couleurs
- Styles de texte
- Configuration du thème de l'application

## Assets

Les assets sont organisés dans le répertoire `assets/` à la racine du projet :

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

Référencer les assets dans `pubspec.yaml` :

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

## Fichiers de Configuration

### Configuration d'Environnement
Placer la configuration spécifique à l'environnement dans `lib/core/config/` :

```
lib/core/config/
├── app_config.dart
├── dev_config.dart
├── prod_config.dart
└── staging_config.dart
```

### Variables d'Environnement
Utiliser des fichiers `.env` pour la configuration sensible (clés API, etc.) :

```
.env
.env.dev
.env.prod
```

**Note :** Ajouter les fichiers `.env` à `.gitignore` et utiliser `.env.example` comme modèle.

## Point d'Entrée Principal

Le fichier `main.dart` doit être minimal et se concentrer sur :
- L'initialisation de l'application
- La configuration des providers
- La configuration du thème
- La configuration des routes

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

## Meilleures Pratiques

1. **Garder les features indépendantes** : Les features ne doivent pas dépendre directement d'autres features
2. **Utiliser l'injection de dépendances** : Passer les dépendances via les constructeurs
3. **Suivre la responsabilité unique** : Chaque classe/fichier doit avoir un objectif clair
4. **Éviter l'imbrication profonde** : Garder la structure des dossiers plate quand c'est possible
5. **Grouper les fichiers liés** : Garder les fichiers liés proches les uns des autres
6. **Utiliser les barrel files avec parcimonie** : Seulement pour les groupes fréquemment importés (par exemple, `widgets/widgets.dart`)

