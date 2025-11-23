---
title: Conventions de Widgets
description: Standards de création et d'organisation des widgets pour les projets Flutter.
---

# Conventions de Widgets

Cette page documente les standards de création et d'organisation des widgets dans les projets Flutter. Des widgets bien organisés améliorent la maintenabilité et les performances.

## Types de Widgets

### StatelessWidget

Utilisez `StatelessWidget` lorsque le widget n'a pas besoin de maintenir un état mutable :

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

**Utilisez StatelessWidget lorsque :**
- Le widget affiche des données sans modification
- Tout l'état provient du parent ou des providers
- Aucune gestion d'état locale n'est nécessaire

### StatefulWidget

Utilisez `StatefulWidget` lorsque le widget a besoin de maintenir un état mutable :

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

**Utilisez StatefulWidget lorsque :**
- Le widget a besoin d'un état mutable local
- L'état est uniquement UI et n'a pas besoin d'être partagé
- État simple qui ne justifie pas une solution de gestion d'état

**Préférez Riverpod/StateNotifier pour :**
- Logique d'état complexe
- État qui doit être partagé
- État qui persiste à travers les reconstructions de widgets

### ConsumerWidget

Utilisez `ConsumerWidget` (de Riverpod) lorsque le widget a besoin de lire des providers :

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

## Organisation des Widgets

### Petits Widgets Ciblés

Gardez les widgets petits et ciblés sur une seule responsabilité :

```dart
// Bon : Petit widget ciblé
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

// Mauvais : Grand widget non ciblé
class UserProfilePage extends StatelessWidget {
  // 200+ lignes de code mélangeant plusieurs préoccupations
}
```

### Composition de Widgets

Construisez des UIs complexes en composant des widgets plus petits :

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

## Nommage des Widgets

Utilisez **PascalCase** pour les noms de classes de widgets. Soyez descriptif :

**Bon :**
- `UserProfileCard`
- `LoginButton`
- `ProductListItem`
- `NavigationDrawer`

**Mauvais :**
- `Card` (trop générique)
- `Widget1` (pas descriptif)
- `userProfileCard` (devrait être PascalCase)
- `UserProfileCardWidget` (suffixe "Widget" redondant)

## Extraction de Widgets

### Quand Extraire

Extrayez les widgets lorsque :

1. **Le widget dépasse ~100 lignes** dans la méthode `build`
2. **Réutilisabilité** : Le widget est utilisé à plusieurs endroits
3. **Complexité** : Le widget a une structure imbriquée complexe
4. **Performance** : Le widget se reconstruit inutilement
5. **Testabilité** : Besoin de tester le widget isolément

### Comment Extraire

Extrayez les widgets dans des fichiers séparés dans le répertoire `widgets/` :

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

**Exemple :**

```dart
// Avant : Tout dans un fichier
class UserProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // 50 lignes de code d'en-tête
          Container(...),
          Row(...),
          // 50 lignes de code de stats
          // 50 lignes de code de bio
        ],
      ),
    );
  }
}

// Après : Widgets extraits
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

## Directives StatefulWidget

### Quand Utiliser StatefulWidget

Utilisez `StatefulWidget` pour :
- **État UI local** : Contrôleurs de champs de texte, contrôleurs d'animation, contrôleurs de défilement
- **État simple** : États de bascule, compteurs, entrées de formulaire
- **État spécifique au widget** : État du panneau d'expansion, sélection d'onglet

### Quand NE PAS Utiliser StatefulWidget

Évitez `StatefulWidget` pour :
- **État partagé** : Utilisez des providers Riverpod à la place
- **Logique métier** : Utilisez StateNotifier ou des use cases
- **État complexe** : Utilisez une solution de gestion d'état
- **État persistant** : Utilisez la gestion d'état ou le stockage local

### Exemple : Utilisation Appropriée

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
      // État uniquement UI, approprié pour StatefulWidget
    );
  }
}
```

## Exemples

### Bonne Organisation de Widget

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

### Widget avec Riverpod

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

## Considérations de Performance

### Constructeurs Const

Utilisez toujours les constructeurs `const` quand c'est possible :

```dart
// Bon
const UserProfileCard({
  super.key,
  required this.user,
});

// Mauvais
UserProfileCard({
  super.key,
  required this.user,
});
```

**Avantages :**
- Réduit les reconstructions de widgets
- Améliore les performances
- Rend l'intention claire

### Optimisation de Reconstruction de Widget

Utilisez des widgets `const` pour éviter les reconstructions inutiles :

```dart
// Bon : Le widget enfant ne se reconstruira pas
Column(
  children: [
    const Text('Static text'),
    DynamicWidget(data: data),
  ],
)

// Mauvais : Le widget enfant se reconstruit inutilement
Column(
  children: [
    Text('Static text'), // Se reconstruit même s'il ne change pas
    DynamicWidget(data: data),
  ],
)
```

### Extraire les Widgets Coûteux

Extrayez les widgets coûteux pour éviter les reconstructions inutiles :

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

### Utiliser les Clés Appropriément

Utilisez les clés lorsque les widgets doivent maintenir l'état à travers les reconstructions :

```dart
// Bon : La clé préserve l'état lorsque l'ordre de la liste change
ListView.builder(
  itemBuilder: (context, index) {
    return UserTile(
      key: ValueKey(users[index].id),
      user: users[index],
    );
  },
)
```

## Meilleures Pratiques

1. **Préférez la composition aux grands widgets**
2. **Utilisez les constructeurs const chaque fois que possible**
3. **Extrayez les widgets lorsqu'ils dépassent ~100 lignes**
4. **Utilisez StatelessWidget par défaut, StatefulWidget seulement quand nécessaire**
5. **Utilisez ConsumerWidget pour l'intégration Riverpod**
6. **Gardez les widgets ciblés sur une seule responsabilité**
7. **Extrayez les widgets réutilisables vers shared/widgets/**
8. **Utilisez les clés seulement quand nécessaire pour la préservation de l'état**

