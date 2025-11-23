---
title: Gestion des Packages
description: Dépendances et organisation des packages pour les projets Flutter.
---

# Gestion des Packages

Cette page documente les standards de gestion des dépendances et packages dans les projets Flutter.

## Gestion des Dépendances

Nous utilisons le versioning sémantique avec des contraintes caret (`^`) pour permettre les mises à jour compatibles tout en empêchant les changements cassants.

### Contraintes de Version

- **Caret (`^`)** : Permet les mises à jour de version compatibles (par exemple, `^2.0.0` permet `>=2.0.0 <3.0.0`)
- **Version exacte** : Utiliser seulement quand nécessaire pour la stabilité (par exemple, `2.0.0`)
- **Plage** : Utiliser pour des exigences spécifiques (par exemple, `>=2.0.0 <3.0.0`)

## Organisation pubspec.yaml

Organisez `pubspec.yaml` avec des sections claires et des commentaires :

```yaml
name: my_app
description: My Flutter application
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.0.0"

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.4.0
  
  # Networking
  http: ^1.1.0
  dio: ^5.3.0
  
  # Local Storage
  shared_preferences: ^2.2.0
  hive: ^2.2.3
  
  # UI
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  
  # Utilities
  intl: ^0.18.0
  equatable: ^2.0.5

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  
  # Testing
  mockito: ^5.4.0
  build_runner: ^2.4.0
  
  # Code Generation
  riverpod_generator: ^2.3.0
  hive_generator: ^2.0.0

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/fonts/
  
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/custom_font.ttf
```

## Contraintes de Version

### Contraintes Caret (Recommandé)

Utilisez les contraintes caret pour la plupart des dépendances :

```yaml
dependencies:
  http: ^1.1.0  # Permet 1.1.0 à <2.0.0
  dio: ^5.3.0   # Permet 5.3.0 à <6.0.0
```

### Versions Exactes (Utiliser avec Parcimonie)

Utilisez les versions exactes seulement quand nécessaire :

```yaml
dependencies:
  critical_package: 2.0.0  # Version exacte pour la stabilité
```

### Plages de Version

Utilisez les plages pour des exigences spécifiques :

```yaml
dependencies:
  flexible_package: ">=2.0.0 <3.0.0"
```

## Ajout de Nouvelles Dépendances

### Processus

1. **Rechercher le package** : Vérifier pub.dev, lire la documentation, examiner les issues
2. **Vérifier la compatibilité** : S'assurer qu'il est compatible avec votre version Flutter/Dart
3. **Ajouter à pubspec.yaml** : Utiliser une contrainte de version appropriée
4. **Exécuter `flutter pub get`** : Installer le package
5. **Tester minutieusement** : S'assurer qu'il fonctionne avec votre codebase
6. **Mettre à jour la documentation** : Documenter pourquoi le package a été ajouté

### Considérations

- **Licence** : S'assurer que la licence du package est compatible avec votre projet
- **Maintenance** : Vérifier si le package est activement maintenu
- **Taille** : Considérer l'impact de la taille du package sur le bundle de l'application
- **Alternatives** : Évaluer si une alternative plus légère existe

## Mise à Jour des Dépendances

### Mises à Jour Régulières

Mettez à jour les dépendances régulièrement pour recevoir :
- Correctifs de sécurité
- Corrections de bugs
- Améliorations de performance
- Nouvelles fonctionnalités

### Processus de Mise à Jour

```bash
# Vérifier les packages obsolètes
flutter pub outdated

# Mettre à jour tous les packages (dans les contraintes)
flutter pub upgrade

# Mettre à jour un package spécifique
flutter pub upgrade package_name

# Mettre à jour vers la dernière version (peut casser)
flutter pub upgrade --major-versions
```

### Changements Cassants

Lors de la mise à jour vers une nouvelle version majeure :

1. **Lire le changelog** : Examiner les changements cassants
2. **Mettre à jour le code** : Corriger les changements cassants
3. **Tester minutieusement** : Exécuter la suite de tests complète
4. **Mettre à jour la documentation** : Documenter tout changement d'API

## Packages Locaux

### Quand Créer des Packages Locaux

Créez des packages locaux pour :
- Code partagé entre plusieurs projets
- Composants réutilisables
- Utilitaires communs
- Modules de features

### Structure de Package

```
packages/
└── shared_utils/
    ├── lib/
    │   └── shared_utils.dart
    ├── pubspec.yaml
    └── README.md
```

### Utilisation de Packages Locaux

```yaml
dependencies:
  shared_utils:
    path: ../packages/shared_utils
```

## Conflits de Dépendances

### Résolution des Conflits

Lorsque les dépendances entrent en conflit :

1. **Vérifier les versions** : S'assurer que les versions sont compatibles
2. **Utiliser dependency_overrides** : Solution temporaire
3. **Mettre à jour les packages** : Mettre à jour vers des versions compatibles
4. **Trouver des alternatives** : Considérer des packages alternatifs

### dependency_overrides

Utiliser avec parcimonie et documenter pourquoi :

```yaml
dependency_overrides:
  package_name: ^2.0.0  # Override pour compatibilité
```

## Meilleures Pratiques

### 1. Minimiser les Dépendances

Ajoutez des dépendances seulement quand nécessaire :
- Vérifier si la fonctionnalité existe dans le SDK Flutter
- Considérer si vous pouvez l'implémenter vous-même
- Évaluer la taille du package vs. le bénéfice

### 2. Garder les Dépendances à Jour

Mettez à jour les dépendances régulièrement :
- Vérifier `flutter pub outdated` mensuellement
- Mettre à jour les correctifs de sécurité immédiatement
- Tester après les mises à jour de version majeure

### 3. Documenter les Dépendances

Documentez pourquoi chaque dépendance est nécessaire :
- Ajouter des commentaires dans `pubspec.yaml`
- Documenter dans le README si significatif
- Noter toute configuration spéciale

### 4. Contraintes de Version

- Utiliser caret (`^`) pour la plupart des packages
- Utiliser les versions exactes seulement quand nécessaire
- Éviter les plages trop restrictives

### 5. Considérations de Sécurité

- Vérifier régulièrement les vulnérabilités de sécurité
- Utiliser `flutter pub audit` (quand disponible)
- Garder les packages sensibles à jour
- Examiner les permissions des packages

### 6. Fichier de Verrouillage

Commiter `pubspec.lock` au contrôle de version :
- Assure des builds cohérents
- Verrouille les versions exactes
- Builds reproductibles

### 7. Taille du Package

Surveiller l'impact du package :
- Utiliser `flutter build apk --analyze-size`
- Considérer la taille du package dans les décisions
- Supprimer les dépendances inutilisées

## Résumé

- Utiliser les contraintes caret (`^`) pour la plupart des dépendances
- Organiser `pubspec.yaml` avec des sections claires
- Mettre à jour les dépendances régulièrement
- Minimiser les dépendances quand c'est possible
- Documenter pourquoi les dépendances sont nécessaires
- Résoudre les conflits rapidement
- Commiter `pubspec.lock` au contrôle de version


