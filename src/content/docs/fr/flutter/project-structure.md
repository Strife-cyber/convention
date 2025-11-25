---
title: Structure de Projet
description: Organisation des dossiers et architecture pour les projets Flutter.
---

Ce guide reflète désormais la mise en page utilisée dans des projets hérités comme `braidsbook_mobile`. Elle privilégie des dossiers descriptifs (`views/`, `notifiers/`, `manager/`, etc.) plutôt qu'une Clean Architecture profondément imbriquée afin que les équipes identifient rapidement où vivent les responsabilités.

## Structure des Répertoires

```text
lib/
├── l10n/
├── manager/
│   ├── auth/
│   └── diagnostics/
├── models/
│   ├── auth/
│   └── profile/
├── notifiers/
│   ├── auth/
│   └── profile/
├── services/
│   ├── api/
│   └── storage/
├── theme/
│   ├── colors.dart
│   ├── spacing.dart
│   └── text_styles.dart
├── utils/
│   ├── formatters/
│   └── validators/
├── views/
│   ├── auth/
│   └── profile/
├── widgets/
│   ├── buttons/
│   └── cards/
├── app_config.dart
├── firebase_options.dart
└── main.dart
```

Chaque nom décrit la préoccupation principale. Ajoutez un seul niveau de sous-dossiers métiers (`auth/`, `profile/`, `billing/`, etc.) dès qu'un répertoire dépasse quelques fichiers, et recyclez les mêmes noms dans les autres dossiers pour conserver une navigation prévisible.

### `l10n/`

Contient les fichiers de localisation générés et leurs sources `arb`.

- `arb/` : définitions éditables `intl_xx.arb`
- `generated/` : fichiers `messages_xx.dart` produits par `flutter gen-l10n`

N'éditez jamais les fichiers générés à la main, automatisez la génération.

### `manager/`

Regroupe les orchestrateurs à large périmètre (bootstrap session, gardes de navigation, synchronisation en arrière-plan).

- API focalisée (`AuthManager`, `CrashReportingManager`, etc.)
- Hooks d'initialisation invoqués depuis `main.dart` ou `app_config.dart`
- Dépendances injectées via le constructeur pour rester testables

Évitez d'y ranger des helpers génériques ; si la logique est stateless, redirigez-la vers `utils/`.

**Montée en charge** : créez `manager/auth/`, `manager/payments/`, etc., quand plusieurs orchestrateurs appartiennent au même domaine, tout en gardant chaque sous-dossier sous la barre des ~5 fichiers.

### `models/`

Représentations de données partagées :

- DTOs alignés sur les contrats backend
- Objets de valeur (`Money`, `GeoPoint`) et modèles de persistance locale

Favorisez l'immuabilité, fournissez `fromJson`/`toJson` et placez les fixtures tests à proximité.

**Sous-dossiers recommandés** : regroupez par domaine (`models/auth/`, `models/profile/`) pour refléter les structures de `views/` et `notifiers/`.

### `notifiers/`

Sources d'état (Riverpod, ChangeNotifier, Bloc).

- Consomment des services/managers au lieu d'appeler HTTP directement
- Exposent des états typés provenant de `models/`
- Se nomment d'après l'écran ou le domaine (`profile_notifier.dart`)

Documentez les transitions d'état pour faciliter la maintenance.

Ajoutez des sous-dossiers comme `notifiers/auth/` dès qu'une feature comporte plusieurs notifiers, en reprenant les mêmes noms que sous `views/`.

### `services/`

Abstractions orientées IO : REST, stockage, analytics, notifications, paiements.

- Un service par système externe
- Composants stateless avec dépendances injectées
- Implémentations mock ou fake pour les tests widgets

Les managers et notifiers consomment ces services ; l'UI ne doit jamais y accéder directement.

Séparez les intégrations par type (`services/api/`, `services/storage/`, `services/notifications/`) afin que les implémentations réelles et les fakes restent côte à côte.

### `theme/`

Centralise les thèmes, couleurs, typographies et espacements.

- `app_theme.dart` expose les variantes `ThemeData`
- Fichiers auxiliaires (`colors.dart`, `text_styles.dart`, `spacing.dart`)

Branchez-les dans `main.dart` pour garantir une configuration cohérente.

### `utils/`

Petits helpers sans état (formatters, validateurs, extensions). Gardez-les purs ; s'ils commencent à maintenir de l'état, migrez-les vers `services/`.

**Organisation suggérée** : `utils/formatters/`, `utils/validators/`, `utils/extensions/` dès que le dossier abrite plus de quelques helpers.

### `views/`

Écrans et flows de haut niveau (`HomeView`, `BookingFlowView`).

- Nommez les fichiers selon la route (`login_view.dart`)
- Gardez les arbres de widgets lisibles ; extraire vers `widgets/` quand nécessaire
- Composez la logique via les notifiers/providers

Les sous-dossiers comme `views/auth/` ou `views/profile/` gardent les écrans groupés et doivent être reflétés sous `notifiers/`, `models/` et `services/` pour suivre un flux métier de bout en bout.

### `widgets/`

Composants UI réutilisables (boutons, cartes, layouts). Ils doivent rester présentations-only : reçoivent des données via paramètres et exposent des callbacks sans instancier de services. Si un widget requiert de la logique, associez-lui un notifier ou convertissez-le en `view`.

Déclinez-les en familles (`widgets/buttons/`, `widgets/cards/`, `widgets/forms/`) pour garder les diffs courts et les imports clairs.

### Fichiers de Configuration

- `app_config.dart` : configuration runtime (API, flags). Charge les valeurs `.env` et expose des getters typés.
- `app_config.dart.backup` : copie de secours éventuelle ; ne la gardez que si votre workflow l'exige.
- `firebase_options.dart` : généré par `flutterfire configure`, à ne pas modifier.
- `main.dart` : initialise les bindings, charge la config, enregistre les managers/notifiers et exécute le widget racine.

Exemple de séquence de démarrage :

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final config = await AppConfig.load();
  await ManagerRegistry.bootstrap(config);
  runApp(MyApp(config: config));
}
```

### Exemple de Flux de Données

1. `views/profile_view.dart` observe `ProfileNotifier`.
2. `ProfileNotifier` demande les données à `UserService`.
3. `UserService` lit/écrit `UserModel`.
4. Le notifier propage l'état mis à jour au view.

Cette circulation horizontale sépare clairement les responsabilités sans multiplier les couches.

## Assets

La disposition Flutter standard reste valable :

```text
assets/
├── images/
├── fonts/
└── animations/
```

Déclarez-les dans `pubspec.yaml` et synchronisez les noms avec les widgets qui les consomment.

## Bonnes Pratiques

1. **Une responsabilité par dossier** : un fichier dans `services/` ne doit parler qu'aux systèmes externes.
2. **Composer plutôt qu'hériter** : les managers composent les services, ils ne les étendent pas.
3. **Couches fines** : si un notifier duplique la logique d'un manager, consolidez.
4. **Documenter les contrats** : ajoutez un commentaire bref sur les effets de bord des notifiers/services.
5. **Tests proches du code** : placez les `*_test.dart` à côté des fichiers concernés.
6. **Automatiser la génération** : `build_runner` et `flutter gen-l10n` gardent `models/` et `l10n/` alignés.

## Quand Revoir la Structure

Envisagez de réintroduire des dossiers par feature ou une Clean Architecture si :

- Un répertoire (comme `views/`) devient trop volumineux
- Plusieurs équipes gèrent des domaines produits distincts
- Vous prévoyez d'extraire des packages/modules réutilisables

Tant que ce n'est pas le cas, la structure inspirée de l'héritage accélère l'onboarding tout en restant évolutive grâce à des noms explicites et une discipline sur les responsabilités.
