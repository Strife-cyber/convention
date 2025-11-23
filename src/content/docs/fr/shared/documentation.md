---
title: Documentation
description: Standards de documentation de code pour tous les projets.
---

# Documentation

Cette page documente les standards de documentation de code qui s'appliquent à tous les projets. Une bonne documentation rend le code plus maintenable et plus facile à comprendre.

## Commentaires de Code

### Quand Commenter

Commentez le code lorsque :
- **Logique Complexe** : Algorithme ou logique métier qui n'est pas évidente
- **Code Non-Évident** : Code qui fait quelque chose d'inattendu
- **APIs Publiques** : Toutes les fonctions, classes et méthodes publiques
- **Workarounds** : Solutions temporaires ou problèmes connus
- **Décisions** : Décisions de design importantes et raisonnement

**Ne commentez pas :**
- Code évident qui s'explique de lui-même
- Ce que le code fait (le code devrait être auto-documenté)
- Commentaires qui répètent juste le code

### Style de Commentaire

**Commentaires d'une ligne :**
```dart
// Calculer la remise seulement si l'utilisateur est premium et la commande dépasse le seuil
if (user.isPremium && order.total > 100) {
  // Appliquer la remise premium
}
```

```csharp
// Calculer la remise seulement si l'utilisateur est premium et la commande dépasse le seuil
if (user.IsPremium && order.Total > 100)
{
    // Appliquer la remise premium
}
```

**Commentaires multi-lignes :**
```dart
/*
 * Cette fonction calcule le prix total incluant la taxe.
 * Elle gère les cas limites pour les articles exonérés de taxe et applique
 * le taux de taxe approprié basé sur la catégorie de l'article.
 */
```

**Expliquez Pourquoi, Pas Quoi :**
```dart
// Bon : Explique pourquoi
// Utiliser Time.deltaTime pour rendre le mouvement indépendant du taux de rafraîchissement
transform.position += direction * moveSpeed * Time.deltaTime;

// Mauvais : Explique quoi (évident depuis le code)
// Déplacer la position du transform
transform.position += direction * moveSpeed * Time.deltaTime;
```

## Documentation API

### Documentation de Fonction

Documentez toutes les fonctions, méthodes et classes publiques :

**Dart :**
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

**C# :**
```csharp
/// <summary>
/// Calcule le prix total incluant la taxe.
/// </summary>
/// <param name="subtotal">Le prix avant taxe.</param>
/// <param name="taxRate">Le taux de taxe en décimal (par exemple, 0.1 pour 10%).</param>
/// <returns>Le prix total incluant la taxe.</returns>
/// <exception cref="ArgumentOutOfRangeException">Lancé lorsque subtotal ou taxRate est négatif.</exception>
public double CalculateTotal(double subtotal, double taxRate)
{
    if (subtotal < 0 || taxRate < 0)
    {
        throw new ArgumentOutOfRangeException("Values must be non-negative");
    }
    return subtotal * (1 + taxRate);
}
```

### Documentation de Classe

Documentez les classes avec leur objectif et utilisation :

```dart
/// Un service pour gérer l'authentification utilisateur.
///
/// Ce service gère la connexion utilisateur, la déconnexion et la gestion de session.
/// Il s'intègre avec l'API backend et le stockage local.
///
/// Exemple :
/// ```dart
/// final authService = AuthService();
/// await authService.login('user@example.com', 'password');
/// ```
class AuthService {
  // ...
}
```

```csharp
/// <summary>
/// Gère le mouvement du joueur et la gestion des entrées.
/// </summary>
/// <remarks>
/// Ce composant gère le mouvement du joueur basé sur les entrées.
/// Il supporte à la fois les entrées clavier et gamepad.
/// </remarks>
public class PlayerController : MonoBehaviour
{
    // ...
}
```

### Documentation de Paramètres

Documentez tous les paramètres :

```dart
/// Crée un nouveau profil utilisateur.
///
/// [name] Le nom complet de l'utilisateur.
/// [email] L'adresse email de l'utilisateur. Doit être un format email valide.
/// [age] L'âge de l'utilisateur. Doit être entre 18 et 120.
void createUser(String name, String email, int age) {
  // ...
}
```

## Fichiers README

### README de Projet

Chaque projet devrait avoir un README complet :

```markdown
# Nom du Projet

Brève description du projet.

## Fonctionnalités

- Fonctionnalité 1
- Fonctionnalité 2
- Fonctionnalité 3

## Prérequis

- Flutter 3.0.0+
- Dart 3.0.0+
- Node.js 18+

## Installation

1. Cloner le dépôt
2. Exécuter `flutter pub get`
3. Configurer les variables d'environnement
4. Exécuter `flutter run`

## Utilisation

Exemple d'utilisation de base.

## Contribution

Directives pour contribuer.

## Licence

Informations de licence.
```

### Documentation de Code

- Documentez les instructions de configuration
- Incluez des exemples d'utilisation
- Expliquez les options de configuration
- Documentez les variables d'environnement
- Fournissez des conseils de dépannage

## Documentation Inline

### Commentaires TODO

Utilisez les commentaires TODO pour le travail futur :

```dart
// TODO: Implémenter le cache pour de meilleures performances
Future<User> getUser(String id) async {
  // ...
}
```

```csharp
// TODO: Implémenter l'object pooling pour de meilleures performances
private void SpawnEnemy()
{
    // ...
}
```

### Commentaires FIXME

Utilisez FIXME pour les problèmes connus :

```dart
// FIXME: Ce workaround devrait être supprimé quand l'API est corrigée
Future<void> loadData() async {
  // Solution temporaire
}
```

### Commentaires NOTE

Utilisez NOTE pour les informations importantes :

```dart
// NOTE: Cette fonction doit être appelée sur le thread principal
void updateUI() {
  // ...
}
```

## Outils de Documentation

### Dart

- **DartDoc** : Génère la documentation API à partir des commentaires
- Exécuter : `dart doc`

### C#

- **Documentation XML** : Génère la documentation à partir des commentaires XML
- **DocFX** : Génère des sites web de documentation

### Markdown

- Utilisez Markdown pour les fichiers README
- Utilisez des blocs de code avec des tags de langue
- Incluez des exemples et des captures d'écran

## Meilleures Pratiques

### Garder la Documentation à Jour

- Mettez à jour la documentation quand le code change
- Supprimez les commentaires obsolètes
- Revoyez la documentation pendant les revues de code

### Écrire pour les Mainteneurs Futurs

- Supposez que le lecteur a des connaissances de base
- Expliquez les concepts complexes
- Fournissez du contexte et des exemples

### Être Concis

- Ne sur-documentez pas le code évident
- Concentrez-vous sur les aspects non-évidents
- Utilisez un langage clair et simple

### Utiliser des Exemples

- Incluez des exemples de code
- Montrez les patterns d'utilisation courants
- Démontrez les cas limites

### Documenter les Décisions

- Expliquez pourquoi, pas juste quoi
- Documentez les décisions de design
- Notez les compromis et alternatives

## Résumé

- Commentez la logique complexe et le code non-évident
- Documentez toutes les APIs publiques
- Écrivez des fichiers README complets
- Utilisez les commentaires TODO/FIXME/NOTE de manière appropriée
- Gardez la documentation à jour
- Écrivez pour les mainteneurs futurs
- Incluez des exemples et du contexte
- Expliquez pourquoi, pas juste quoi

