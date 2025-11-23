---
title: Standards de Test
description: Conventions de test unitaire, widget et d'intégration pour les projets Flutter.
---

# Standards de Test

Cette page documente les conventions et standards de test pour les projets Flutter. Nous suivons des pratiques de test complètes pour assurer la qualité et la fiabilité du code.

## Types de Tests

### Tests Unitaires

Testez des fonctions, méthodes ou classes individuelles isolément. Les tests unitaires sont rapides et ne nécessitent pas le framework Flutter.

**Utiliser pour :**
- Logique métier (use cases, repositories)
- Fonctions utilitaires
- Modèles de données et transformations
- Logique de gestion d'état

### Tests de Widget

Testez des widgets individuels isolément. Les tests de widget sont plus rapides que les tests d'intégration mais plus lents que les tests unitaires.

**Utiliser pour :**
- Rendu de widgets
- Interactions utilisateur
- Changements d'état de widgets
- Comportement des composants UI

### Tests d'Intégration

Testez les flux utilisateur complets et la fonctionnalité de l'application. Les tests d'intégration s'exécutent sur de vrais appareils ou émulateurs.

**Utiliser pour :**
- Flux utilisateur de bout en bout
- Chemins critiques de l'application
- Complétude des features
- Tests de performance

## Organisation des Tests

### Structure des Répertoires

Miroitez la structure `lib/` dans le répertoire `test/` :

```
test/
├── unit/
│   ├── core/
│   │   ├── utils/
│   │   │   └── validators_test.dart
│   │   └── services/
│   │       └── api_service_test.dart
│   └── features/
│       └── authentication/
│           ├── domain/
│           │   └── usecases/
│           │       └── login_usecase_test.dart
│           └── data/
│               └── repositories/
│                   └── auth_repository_test.dart
├── widget/
│   └── features/
│       └── authentication/
│           └── presentation/
│               └── widgets/
│                   └── login_form_test.dart
└── integration/
    └── app_test.dart
```

### Nommage des Fichiers de Test

Nommez les fichiers de test avec le suffixe `_test.dart` :

- Source : `lib/features/auth/domain/usecases/login_usecase.dart`
- Test : `test/unit/features/auth/domain/usecases/login_usecase_test.dart`

## Nommage des Tests

Utilisez des noms de tests descriptifs qui expliquent ce qui est testé :

```dart
// Bon
test('should return user when login is successful', () {
  // ...
});

test('should throw exception when email is invalid', () {
  // ...
});

// Mauvais
test('test login', () {
  // Trop vague
});

test('login_usecase_test_1', () {
  // Pas descriptif
});
```

### Organisation par Groupes

Utilisez `group()` pour organiser les tests liés :

```dart
group('LoginUseCase', () {
  group('when login is successful', () {
    test('should return user', () {
      // ...
    });
    
    test('should save user to local storage', () {
      // ...
    });
  });
  
  group('when login fails', () {
    test('should throw AuthenticationException', () {
      // ...
    });
  });
});
```

## Exigences de Couverture

### Couverture Minimale

- **Chemins critiques** : 90%+ de couverture
- **Logique métier** : 80%+ de couverture
- **Projet global** : 70%+ de couverture

### Couverture pour les Zones Critiques

Concentrez la couverture sur :
- Authentification et autorisation
- Traitement des paiements
- Validation des données
- Gestion d'état
- Intégration API

### Exécution de la Couverture

```bash
# Générer le rapport de couverture
flutter test --coverage

# Voir la couverture (nécessite lcov)
genhtml coverage/lcov.info -o coverage/html
```

## Tests Unitaires

### Exemple : Test de Use Case

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

import 'package:app/features/auth/domain/usecases/login_usecase.dart';
import 'package:app/features/auth/domain/repositories/auth_repository.dart';
import 'package:app/features/auth/domain/entities/user.dart';

@GenerateMocks([AuthRepository])
void main() {
  late LoginUseCase useCase;
  late MockAuthRepository mockRepository;
  
  setUp(() {
    mockRepository = MockAuthRepository();
    useCase = LoginUseCase(mockRepository);
  });
  
  group('LoginUseCase', () {
    const email = 'test@example.com';
    const password = 'password123';
    const user = User(id: '1', email: email);
    
    test('should return user when login is successful', () async {
      // Arrange
      when(mockRepository.login(email, password))
          .thenAnswer((_) async => user);
      
      // Act
      final result = await useCase(email, password);
      
      // Assert
      expect(result, user);
      verify(mockRepository.login(email, password)).called(1);
    });
    
    test('should throw exception when login fails', () async {
      // Arrange
      when(mockRepository.login(email, password))
          .thenThrow(AuthenticationException('Invalid credentials'));
      
      // Act & Assert
      expect(
        () => useCase(email, password),
        throwsA(isA<AuthenticationException>()),
      );
    });
  });
}
```

### Exemple : Test de Fonction Utilitaire

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:app/core/utils/validators.dart';

void main() {
  group('Validators', () {
    group('isValidEmail', () {
      test('should return true for valid email', () {
        expect(Validators.isValidEmail('test@example.com'), true);
        expect(Validators.isValidEmail('user.name@domain.co.uk'), true);
      });
      
      test('should return false for invalid email', () {
        expect(Validators.isValidEmail('invalid'), false);
        expect(Validators.isValidEmail('test@'), false);
        expect(Validators.isValidEmail('@example.com'), false);
      });
    });
  });
}
```

## Tests de Widget

### Exemple : Test de Widget

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:app/features/auth/presentation/widgets/login_form.dart';

void main() {
  testWidgets('LoginForm should display email and password fields', (tester) async {
    // Arrange
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: LoginForm(),
        ),
      ),
    );
    
    // Assert
    expect(find.byType(TextFormField), findsNWidgets(2));
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
  });
  
  testWidgets('LoginForm should call onLogin when submit button is pressed', (tester) async {
    // Arrange
    bool loginCalled = false;
    
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: LoginForm(
            onLogin: () => loginCalled = true,
          ),
        ),
      ),
    );
    
    // Act
    await tester.enterText(find.byType(TextFormField).first, 'test@example.com');
    await tester.enterText(find.byType(TextFormField).last, 'password');
    await tester.tap(find.text('Login'));
    await tester.pump();
    
    // Assert
    expect(loginCalled, true);
  });
}
```

### Tests avec Riverpod

```dart
testWidgets('should display user name from provider', (tester) async {
  // Arrange
  final container = ProviderContainer(
    overrides: [
      userProvider.overrideWith((ref) => User(name: 'Test User')),
    ],
  );
  
  await tester.pumpWidget(
    UncontrolledProviderScope(
      container: container,
      child: MaterialApp(
        home: UserProfileWidget(),
      ),
    ),
  );
  
  // Assert
  expect(find.text('Test User'), findsOneWidget);
  
  container.dispose();
});
```

## Tests d'Intégration

### Exemple : Test d'Intégration

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('Authentication Flow', () {
    testWidgets('complete login flow', (tester) async {
      // Démarrer l'application
      app.main();
      await tester.pumpAndSettle();
      
      // Naviguer vers login
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();
      
      // Entrer les identifiants
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password123');
      
      // Soumettre
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();
      
      // Vérifier la navigation vers home
      expect(find.text('Home'), findsOneWidget);
    });
  });
}
```

## Mocking et Doublures de Test

### Mockito

Utilisez Mockito pour créer des mocks :

```dart
// Générer des mocks
@GenerateMocks([AuthRepository, ApiClient])
void main() {
  // Utiliser les mocks
  final mockRepository = MockAuthRepository();
  when(mockRepository.login(any, any))
      .thenAnswer((_) async => User(id: '1'));
}
```

### Implémentations Fausses

Créez des implémentations fausses pour des tests plus simples :

```dart
class FakeAuthRepository implements AuthRepository {
  @override
  Future<User> login(String email, String password) async {
    return User(id: '1', email: email);
  }
}
```

## Meilleures Pratiques

### 1. Indépendance des Tests

Chaque test doit être indépendant et ne pas dépendre d'autres tests :

```dart
// Bon : Chaque test est indépendant
test('should return user', () {
  final repository = MockAuthRepository();
  // Implémentation du test
});

// Mauvais : Les tests dépendent d'un état partagé
AuthRepository? sharedRepository;

test('test 1', () {
  sharedRepository = MockAuthRepository();
  // ...
});

test('test 2', () {
  // Dépend de sharedRepository du test 1
});
```

### 2. Pattern Arrange-Act-Assert

Structurez les tests avec des sections claires :

```dart
test('should return user when login is successful', () async {
  // Arrange
  final repository = MockAuthRepository();
  when(repository.login(any, any)).thenAnswer((_) async => User(id: '1'));
  
  // Act
  final result = await repository.login('email', 'password');
  
  // Assert
  expect(result.id, '1');
  verify(repository.login('email', 'password')).called(1);
});
```

### 3. Gestion des Données de Test

Utilisez des fixtures de test pour des données de test cohérentes :

```dart
class TestFixtures {
  static User createUser({
    String id = '1',
    String email = 'test@example.com',
  }) {
    return User(id: id, email: email);
  }
}
```

### 4. Tests des Cas Limites

Testez les conditions limites et les cas d'erreur :

```dart
test('should handle null input', () {
  // ...
});

test('should handle empty string', () {
  // ...
});

test('should handle maximum value', () {
  // ...
});
```

### 5. Garder les Tests Rapides

- Utilisez des tests unitaires pour la logique métier
- Utilisez des tests de widget pour les composants UI
- Utilisez des tests d'intégration avec parcimonie pour les flux critiques

### 6. Assertions Significatives

Utilisez des matchers spécifiques :

```dart
// Bon
expect(result, isA<User>());
expect(result.id, '1');
expect(list, hasLength(3));

// Mauvais
expect(result, isNotNull); // Trop vague
```

## Résumé

- Organisez les tests pour miroiter la structure source
- Utilisez des noms de tests descriptifs
- Viser 70%+ de couverture globale, 90%+ pour les chemins critiques
- Utilisez le pattern Arrange-Act-Assert
- Gardez les tests indépendants et rapides
- Testez les cas limites et les conditions d'erreur
- Utilisez des mocks pour les dépendances, des fakes pour les cas plus simples

