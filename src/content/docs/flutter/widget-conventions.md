---
title: Widget Conventions
description: Widget creation and organization standards for Flutter projects.
---

# Widget Conventions

This page documents standards for creating and organizing widgets in Flutter projects. Well-organized widgets improve maintainability and performance.

## Widget Types

### StatelessWidget

Use `StatelessWidget` when the widget doesn't need to maintain mutable state:

```dart
class UserProfileCard extends StatelessWidget {
  final User user;
  
  const UserProfileCard({
    super.key,
    required this.user,
  });

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

**Use StatelessWidget when:**
- Widget displays data without modification
- All state comes from parent or providers
- No local state management needed

### StatefulWidget

Use `StatefulWidget` when the widget needs to maintain mutable state:

```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _count = 0;
  
  void _increment() {
    setState(() {
      _count++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: _increment,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

**Use StatefulWidget when:**
- Widget needs local mutable state
- State is UI-only and doesn't need to be shared
- Simple state that doesn't warrant a state management solution

**Prefer Riverpod/StateNotifier for:**
- Complex state logic
- State that needs to be shared
- State that persists across widget rebuilds

### ConsumerWidget

Use `ConsumerWidget` (from Riverpod) when the widget needs to read providers:

```dart
class UserProfileWidget extends ConsumerWidget {
  const UserProfileWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider);
    return Text(user.name);
  }
}
```

## Widget Organization

### Small, Focused Widgets

Keep widgets small and focused on a single responsibility:

```dart
// Good: Small, focused widget
class UserAvatar extends StatelessWidget {
  final String imageUrl;
  final double size;
  
  const UserAvatar({
    super.key,
    required this.imageUrl,
    this.size = 48.0,
  });

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: size / 2,
      backgroundImage: NetworkImage(imageUrl),
    );
  }
}

// Bad: Large, unfocused widget
class UserProfilePage extends StatelessWidget {
  // 200+ lines of code mixing multiple concerns
}
```

### Widget Composition

Build complex UIs by composing smaller widgets:

```dart
class UserProfilePage extends StatelessWidget {
  final User user;
  
  const UserProfilePage({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          UserHeader(user: user),
          UserStats(user: user),
          UserBio(user: user),
          UserActions(user: user),
        ],
      ),
    );
  }
}
```

## Naming Widgets

Use **PascalCase** for widget class names. Be descriptive:

**Good:**
- `UserProfileCard`
- `LoginButton`
- `ProductListItem`
- `NavigationDrawer`

**Bad:**
- `Card` (too generic)
- `Widget1` (not descriptive)
- `userProfileCard` (should be PascalCase)
- `UserProfileCardWidget` (redundant "Widget" suffix)

## Widget Extraction

### When to Extract

Extract widgets when:

1. **Widget exceeds ~100 lines** in the `build` method
2. **Reusability**: Widget is used in multiple places
3. **Complexity**: Widget has complex nested structure
4. **Performance**: Widget rebuilds unnecessarily
5. **Testability**: Need to test widget in isolation

### How to Extract

Extract widgets into separate files in the `widgets/` directory:

```
features/
└── user_profile/
    └── presentation/
        ├── pages/
        │   └── user_profile_page.dart
        └── widgets/
            ├── user_header.dart
            ├── user_stats.dart
            └── user_bio.dart
```

**Example:**

```dart
// Before: Everything in one file
class UserProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // 50 lines of header code
          Container(...),
          Row(...),
          // 50 lines of stats code
          // 50 lines of bio code
        ],
      ),
    );
  }
}

// After: Extracted widgets
class UserProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          UserHeader(),
          UserStats(),
          UserBio(),
        ],
      ),
    );
  }
}
```

## StatefulWidget Guidelines

### When to Use StatefulWidget

Use `StatefulWidget` for:
- **Local UI state**: Text field controllers, animation controllers, scroll controllers
- **Simple state**: Toggle states, counters, form inputs
- **Widget-specific state**: Expansion panel state, tab selection

### When NOT to Use StatefulWidget

Avoid `StatefulWidget` for:
- **Shared state**: Use Riverpod providers instead
- **Business logic**: Use StateNotifier or use cases
- **Complex state**: Use state management solution
- **Persistent state**: Use state management or local storage

### Example: Appropriate Use

```dart
class SearchBar extends StatefulWidget {
  const SearchBar({super.key});

  @override
  State<SearchBar> createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  final _controller = TextEditingController();
  bool _isExpanded = false;
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      // UI-only state, appropriate for StatefulWidget
    );
  }
}
```

## Examples

### Good Widget Organization

```dart
// user_profile_card.dart
class UserProfileCard extends StatelessWidget {
  final User user;
  final VoidCallback? onTap;
  
  const UserProfileCard({
    super.key,
    required this.user,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            UserAvatar(imageUrl: user.avatarUrl),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    user.name,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Text(
                    user.email,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Widget with Riverpod

```dart
class UserProfilePage extends ConsumerWidget {
  const UserProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProvider);
    
    return Scaffold(
      appBar: AppBar(title: Text('Profile')),
      body: userAsync.when(
        data: (user) => UserProfileContent(user: user),
        loading: () => Center(child: CircularProgressIndicator()),
        error: (error, stack) => ErrorWidget(error: error),
      ),
    );
  }
}
```

## Performance Considerations

### Const Constructors

Always use `const` constructors when possible:

```dart
// Good
const UserProfileCard({
  super.key,
  required this.user,
});

// Bad
UserProfileCard({
  super.key,
  required this.user,
});
```

**Benefits:**
- Reduces widget rebuilds
- Improves performance
- Makes intent clear

### Widget Rebuild Optimization

Use `const` widgets to prevent unnecessary rebuilds:

```dart
// Good: Child widget won't rebuild
Column(
  children: [
    const Text('Static text'),
    DynamicWidget(data: data),
  ],
)

// Bad: Child widget rebuilds unnecessarily
Column(
  children: [
    Text('Static text'), // Rebuilds even though it doesn't change
    DynamicWidget(data: data),
  ],
)
```

### Extract Expensive Widgets

Extract expensive widgets to prevent unnecessary rebuilds:

```dart
class ExpensiveList extends StatelessWidget {
  final List<Item> items;
  
  const ExpensiveList({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        return ExpensiveListItem(item: items[index]);
      },
    );
  }
}
```

### Use Keys Appropriately

Use keys when widgets need to maintain state across rebuilds:

```dart
// Good: Key preserves state when list order changes
ListView.builder(
  itemBuilder: (context, index) {
    return UserTile(
      key: ValueKey(users[index].id),
      user: users[index],
    );
  },
)
```

## Best Practices

1. **Prefer composition over large widgets**
2. **Use const constructors whenever possible**
3. **Extract widgets when they exceed ~100 lines**
4. **Use StatelessWidget by default, StatefulWidget only when needed**
5. **Use ConsumerWidget for Riverpod integration**
6. **Keep widgets focused on a single responsibility**
7. **Extract reusable widgets to shared/widgets/**
8. **Use keys only when necessary for state preservation**

