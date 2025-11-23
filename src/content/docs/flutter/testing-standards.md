---
title: Testing Standards
description: Unit, widget, and integration testing conventions for Flutter projects.
---

# Testing Standards

This page documents testing conventions and standards for Flutter projects. We follow comprehensive testing practices to ensure code quality and reliability.

## Test Types

### Unit Tests

Test individual functions, methods, or classes in isolation. Unit tests are fast and don't require the Flutter framework.

**Use for:**
- Business logic (use cases, repositories)
- Utility functions
- Data models and transformations
- State management logic

### Widget Tests

Test individual widgets in isolation. Widget tests run faster than integration tests but slower than unit tests.

**Use for:**
- Widget rendering
- User interactions
- Widget state changes
- UI component behavior

### Integration Tests

Test complete user flows and app functionality. Integration tests run on real devices or emulators.

**Use for:**
- End-to-end user flows
- Critical app paths
- Feature completeness
- Performance testing

## Test Organization

### Directory Structure

Mirror the `lib/` structure in the `test/` directory:

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

### Test File Naming

Name test files with `_test.dart` suffix:

- Source: `lib/features/auth/domain/usecases/login_usecase.dart`
- Test: `test/unit/features/auth/domain/usecases/login_usecase_test.dart`

## Test Naming

Use descriptive test names that explain what is being tested:

```dart
// Good
test('should return user when login is successful', () {
  // ...
});

test('should throw exception when email is invalid', () {
  // ...
});

// Bad
test('test login', () {
  // Too vague
});

test('login_usecase_test_1', () {
  // Not descriptive
});
```

### Group Organization

Use `group()` to organize related tests:

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

## Coverage Requirements

### Minimum Coverage

- **Critical paths**: 90%+ coverage
- **Business logic**: 80%+ coverage
- **Overall project**: 70%+ coverage

### Coverage for Critical Areas

Focus coverage on:
- Authentication and authorization
- Payment processing
- Data validation
- State management
- API integration

### Running Coverage

```bash
# Generate coverage report
flutter test --coverage

# View coverage (requires lcov)
genhtml coverage/lcov.info -o coverage/html
```

## Unit Testing

### Example: Use Case Test

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

### Example: Utility Function Test

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

## Widget Testing

### Example: Widget Test

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

### Testing with Riverpod

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

## Integration Testing

### Example: Integration Test

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('Authentication Flow', () {
    testWidgets('complete login flow', (tester) async {
      // Start app
      app.main();
      await tester.pumpAndSettle();
      
      // Navigate to login
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();
      
      // Enter credentials
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password123');
      
      // Submit
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();
      
      // Verify navigation to home
      expect(find.text('Home'), findsOneWidget);
    });
  });
}
```

## Mocking and Test Doubles

### Mockito

Use Mockito for creating mocks:

```dart
// Generate mocks
@GenerateMocks([AuthRepository, ApiClient])
void main() {
  // Use mocks
  final mockRepository = MockAuthRepository();
  when(mockRepository.login(any, any))
      .thenAnswer((_) async => User(id: '1'));
}
```

### Fake Implementations

Create fake implementations for simpler testing:

```dart
class FakeAuthRepository implements AuthRepository {
  @override
  Future<User> login(String email, String password) async {
    return User(id: '1', email: email);
  }
}
```

## Best Practices

### 1. Test Independence

Each test should be independent and not rely on other tests:

```dart
// Good: Each test is independent
test('should return user', () {
  final repository = MockAuthRepository();
  // Test implementation
});

// Bad: Tests depend on shared state
AuthRepository? sharedRepository;

test('test 1', () {
  sharedRepository = MockAuthRepository();
  // ...
});

test('test 2', () {
  // Depends on sharedRepository from test 1
});
```

### 2. Arrange-Act-Assert Pattern

Structure tests with clear sections:

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

### 3. Test Data Management

Use test fixtures for consistent test data:

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

### 4. Test Edge Cases

Test boundary conditions and error cases:

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

### 5. Keep Tests Fast

- Use unit tests for business logic
- Use widget tests for UI components
- Use integration tests sparingly for critical flows

### 6. Meaningful Assertions

Use specific matchers:

```dart
// Good
expect(result, isA<User>());
expect(result.id, '1');
expect(list, hasLength(3));

// Bad
expect(result, isNotNull); // Too vague
```

## Summary

- Organize tests to mirror source structure
- Use descriptive test names
- Aim for 70%+ overall coverage, 90%+ for critical paths
- Use Arrange-Act-Assert pattern
- Keep tests independent and fast
- Test edge cases and error conditions
- Use mocks for dependencies, fakes for simpler cases

