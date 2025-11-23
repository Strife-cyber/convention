---
title: Conventions de Nommage
description: Standards de nommage pour les scripts, GameObjects et composants dans les projets Unity.
---

# Conventions de Nommage

Cette page documente les conventions de nommage pour les scripts Unity, GameObjects, composants et autres assets. Nous suivons les [Conventions de Codage C# Microsoft](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

## Scripts

Utilisez **PascalCase** pour les noms de fichiers de scripts. Le nom du fichier doit correspondre exactement au nom de la classe dans le fichier.

```csharp
// File: PlayerController.cs
public class PlayerController : MonoBehaviour
{
    // ...
}

// File: GameManager.cs
public class GameManager : MonoBehaviour
{
    // ...
}
```

**Bon :**
- `PlayerController.cs`
- `GameManager.cs`
- `AudioManager.cs`

**Mauvais :**
- `playerController.cs` (camelCase)
- `player_controller.cs` (snake_case)
- `PlayerController.cs` avec le nom de classe `Player` (non correspondant)

## Classes

Utilisez **PascalCase** pour les noms de classes. Les noms de classes doivent être des noms et décrire clairement ce que la classe représente.

```csharp
// Bon
public class PlayerController : MonoBehaviour {}
public class GameManager : MonoBehaviour {}
public class AudioService {}

// Mauvais
public class playerController : MonoBehaviour {} // Devrait être PascalCase
public class Game {} // Trop générique
public class PlayerControllerScript : MonoBehaviour {} // Suffixe "Script" redondant
```

## Variables et Propriétés

### Champs Privés

Utilisez **camelCase** avec préfixe underscore pour les champs privés (convention Unity pour les champs sérialisés) :

```csharp
public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private int health = 100;
    private Rigidbody rb;
    private bool isGrounded;
}
```

**Note :** Unity utilise `[SerializeField]` pour exposer les champs privés dans l'Inspector. Le préfixe underscore est optionnel mais recommandé pour la cohérence.

### Propriétés Publiques

Utilisez **PascalCase** pour les propriétés publiques :

```csharp
public class PlayerController : MonoBehaviour
{
    public int Health { get; private set; }
    public bool IsAlive { get; private set; }
    public string PlayerName { get; set; }
}
```

### Champs Publics (À Éviter)

Évitez les champs publics. Utilisez des propriétés à la place. Si vous devez utiliser des champs publics (par exemple, pour l'exposition dans l'Inspector), utilisez **PascalCase** :

```csharp
// Éviter si possible - utiliser des propriétés à la place
public float MoveSpeed = 5f;
```

## Méthodes

Utilisez **PascalCase** pour toutes les méthodes (publiques et privées), suivant les conventions C# :

```csharp
public class PlayerController : MonoBehaviour
{
    // Méthodes publiques
    public void Move(Vector3 direction) {}
    public bool IsGrounded() => false;
    
    // Méthodes privées
    private void UpdateMovement() {}
    private void CheckGround() {}
}
```

**Bon :**
- `Move()`, `Jump()`, `TakeDamage()`
- `IsGrounded()`, `CanMove()`, `HasWeapon()`

**Mauvais :**
- `move()`, `jump()` (camelCase)
- `MovePlayer()` (redondant si la classe est déjà PlayerController)

### Méthodes de Cycle de Vie Unity

Les méthodes de cycle de vie Unity doivent toujours utiliser leurs noms exacts :
- `Awake()`, `Start()`, `Update()`, `FixedUpdate()`, `LateUpdate()`
- `OnEnable()`, `OnDisable()`, `OnDestroy()`
- `OnTriggerEnter()`, `OnCollisionEnter()`, etc.

## GameObjects

Utilisez des noms **PascalCase descriptifs**. Évitez les noms par défaut comme "GameObject", "GameObject (1)", etc.

**Bon :**
- `Player`
- `Main Camera`
- `UI Canvas`
- `Enemy Spawner`
- `Health Bar`

**Mauvais :**
- `GameObject`
- `GameObject (1)`
- `New GameObject`
- `player` (camelCase)
- `player_controller` (snake_case)

**Note :** Unity permet les espaces dans les noms de GameObjects, ce qui est acceptable pour la lisibilité dans la Hiérarchie.

## Composants

Les noms de composants dans l'Inspector doivent correspondre au nom du script. Lors de l'ajout de composants, Unity utilise automatiquement le nom de la classe.

**Bon :**
- Composant `PlayerController` sur le GameObject `Player`
- Composant `GameManager` sur le GameObject `GameManager`

**Mauvais :**
- Renommer le composant dans l'Inspector en quelque chose de différent du nom de classe

## Scènes

Utilisez **PascalCase** pour les noms de scènes. Incluez le type ou le but de la scène :

**Bon :**
- `MainMenu.unity`
- `Level01.unity`
- `GameScene.unity`
- `SettingsMenu.unity`

**Mauvais :**
- `main menu.unity` (espaces, minuscules)
- `level_01.unity` (snake_case)
- `Scene1.unity` (pas descriptif)

## Prefabs

Utilisez **PascalCase** pour les noms de prefabs. Soyez descriptif sur ce que le prefab représente :

**Bon :**
- `Player.prefab`
- `Enemy_Basic.prefab`
- `UI_Button.prefab`
- `PowerUp_Health.prefab`

**Mauvais :**
- `player.prefab` (camelCase)
- `Enemy (1).prefab` (nommage par défaut)
- `button.prefab` (pas descriptif)

**Note :** Les underscores sont acceptables dans les noms de prefabs pour le regroupement (par exemple, `Enemy_Basic`, `UI_Button`).

## Tags et Layers

Utilisez **PascalCase** pour les tags et layers. Soyez descriptif :

**Tags Bons :**
- `Player`
- `Enemy`
- `Collectible`
- `Ground`

**Layers Bons :**
- `Default`
- `UI`
- `Ground`
- `Enemy`

**Mauvais :**
- `player` (camelCase)
- `PLAYER` (tout en majuscules)
- `player_tag` (snake_case)

## Constantes

Utilisez **PascalCase** pour les constantes :

```csharp
public class GameConstants
{
    public const int MaxHealth = 100;
    public const float Gravity = 9.81f;
    public const string PlayerTag = "Player";
}
```

## Énumérations

Utilisez **PascalCase** pour les noms d'énumérations et les valeurs :

```csharp
public enum PlayerState
{
    Idle,
    Walking,
    Running,
    Jumping,
}
```

## Interfaces

Utilisez **PascalCase** avec le préfixe `I` pour les interfaces :

```csharp
public interface IDamageable
{
    void TakeDamage(int amount);
}

public interface ICollectible
{
    void Collect();
}
```

## Exemples

```csharp
// Bons exemples
public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private int maxHealth = 100;
    
    public int Health { get; private set; }
    public bool IsAlive => Health > 0;
    
    private Rigidbody rb;
    private bool isGrounded;
    
    private void Start()
    {
        rb = GetComponent<Rigidbody>();
        Health = maxHealth;
    }
    
    public void TakeDamage(int amount)
    {
        Health -= amount;
        if (!IsAlive)
        {
            Die();
        }
    }
    
    private void Die()
    {
        // Gérer la mort
    }
}

// Mauvais exemples
public class playerController : MonoBehaviour // Devrait être PascalCase
{
    public float moveSpeed = 5f; // Devrait être privé avec [SerializeField]
    public int health; // Devrait utiliser une propriété
    private Rigidbody RB; // Devrait être camelCase
    private bool IsGrounded; // Les champs privés devraient être camelCase
    
    private void start() // Devrait être Start() avec S majuscule
    {
        // ...
    }
    
    public void takeDamage(int amount) // Devrait être PascalCase
    {
        // ...
    }
}
```

## Résumé

| Type | Convention | Exemple |
|------|-----------|---------|
| Scripts | PascalCase | `PlayerController.cs` |
| Classes | PascalCase | `PlayerController` |
| Champs privés | camelCase (avec `[SerializeField]`) | `moveSpeed` |
| Propriétés publiques | PascalCase | `Health` |
| Méthodes | PascalCase | `TakeDamage()` |
| GameObjects | PascalCase descriptif | `Player`, `Main Camera` |
| Scènes | PascalCase | `MainMenu.unity` |
| Prefabs | PascalCase | `Player.prefab` |
| Tags/Layers | PascalCase | `Player`, `Ground` |
| Constantes | PascalCase | `MaxHealth` |
| Énumérations | PascalCase | `PlayerState` |
| Interfaces | I + PascalCase | `IDamageable` |


