---
title: Naming Conventions
description: Script, GameObject, and component naming standards for Unity projects.
---

# Naming Conventions

This page documents the naming conventions for Unity scripts, GameObjects, components, and other assets. We follow [Microsoft C# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

## Scripts

Use **PascalCase** for script file names. The file name must exactly match the class name inside the file.

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

**Good:**
- `PlayerController.cs`
- `GameManager.cs`
- `AudioManager.cs`

**Bad:**
- `playerController.cs` (camelCase)
- `player_controller.cs` (snake_case)
- `PlayerController.cs` with class name `Player` (mismatch)

## Classes

Use **PascalCase** for class names. Class names should be nouns and clearly describe what the class represents.

```csharp
// Good
public class PlayerController : MonoBehaviour {}
public class GameManager : MonoBehaviour {}
public class AudioService {}

// Bad
public class playerController : MonoBehaviour {} // Should be PascalCase
public class Game {} // Too generic
public class PlayerControllerScript : MonoBehaviour {} // Redundant "Script" suffix
```

## Variables and Properties

### Private Fields

Use **camelCase** with underscore prefix for private fields (Unity convention for serialized fields):

```csharp
public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private int health = 100;
    private Rigidbody rb;
    private bool isGrounded;
}
```

**Note:** Unity uses `[SerializeField]` to expose private fields in the Inspector. The underscore prefix is optional but recommended for consistency.

### Public Properties

Use **PascalCase** for public properties:

```csharp
public class PlayerController : MonoBehaviour
{
    public int Health { get; private set; }
    public bool IsAlive { get; private set; }
    public string PlayerName { get; set; }
}
```

### Public Fields (Avoid)

Avoid public fields. Use properties instead. If you must use public fields (e.g., for Inspector exposure), use **PascalCase**:

```csharp
// Avoid if possible - use properties instead
public float MoveSpeed = 5f;
```

## Methods

Use **PascalCase** for all methods (both public and private), following C# conventions:

```csharp
public class PlayerController : MonoBehaviour
{
    // Public methods
    public void Move(Vector3 direction) {}
    public bool IsGrounded() => false;
    
    // Private methods
    private void UpdateMovement() {}
    private void CheckGround() {}
}
```

**Good:**
- `Move()`, `Jump()`, `TakeDamage()`
- `IsGrounded()`, `CanMove()`, `HasWeapon()`

**Bad:**
- `move()`, `jump()` (camelCase)
- `MovePlayer()` (redundant if class is already PlayerController)

### Unity Lifecycle Methods

Unity lifecycle methods should always use their exact names:
- `Awake()`, `Start()`, `Update()`, `FixedUpdate()`, `LateUpdate()`
- `OnEnable()`, `OnDisable()`, `OnDestroy()`
- `OnTriggerEnter()`, `OnCollisionEnter()`, etc.

## GameObjects

Use **descriptive PascalCase** names. Avoid default names like "GameObject", "GameObject (1)", etc.

**Good:**
- `Player`
- `Main Camera`
- `UI Canvas`
- `Enemy Spawner`
- `Health Bar`

**Bad:**
- `GameObject`
- `GameObject (1)`
- `New GameObject`
- `player` (camelCase)
- `player_controller` (snake_case)

**Note:** Unity allows spaces in GameObject names, which is acceptable for readability in the Hierarchy.

## Components

Component names in the Inspector should match the script name. When adding components, Unity automatically uses the class name.

**Good:**
- `PlayerController` component on `Player` GameObject
- `GameManager` component on `GameManager` GameObject

**Bad:**
- Renaming component in Inspector to something different from class name

## Scenes

Use **PascalCase** for scene names. Include the scene type or purpose:

**Good:**
- `MainMenu.unity`
- `Level01.unity`
- `GameScene.unity`
- `SettingsMenu.unity`

**Bad:**
- `main menu.unity` (spaces, lowercase)
- `level_01.unity` (snake_case)
- `Scene1.unity` (not descriptive)

## Prefabs

Use **PascalCase** for prefab names. Be descriptive about what the prefab represents:

**Good:**
- `Player.prefab`
- `Enemy_Basic.prefab`
- `UI_Button.prefab`
- `PowerUp_Health.prefab`

**Bad:**
- `player.prefab` (camelCase)
- `Enemy (1).prefab` (default naming)
- `button.prefab` (not descriptive)

**Note:** Underscores are acceptable in prefab names for grouping (e.g., `Enemy_Basic`, `UI_Button`).

## Tags and Layers

Use **PascalCase** for tags and layers. Be descriptive:

**Good Tags:**
- `Player`
- `Enemy`
- `Collectible`
- `Ground`

**Good Layers:**
- `Default`
- `UI`
- `Ground`
- `Enemy`

**Bad:**
- `player` (camelCase)
- `PLAYER` (all caps)
- `player_tag` (snake_case)

## Constants

Use **PascalCase** for constants:

```csharp
public class GameConstants
{
    public const int MaxHealth = 100;
    public const float Gravity = 9.81f;
    public const string PlayerTag = "Player";
}
```

## Enums

Use **PascalCase** for enum names and values:

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

Use **PascalCase** with `I` prefix for interfaces:

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

## Examples

```csharp
// Good examples
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
        // Handle death
    }
}

// Bad examples
public class playerController : MonoBehaviour // Should be PascalCase
{
    public float moveSpeed = 5f; // Should be private with [SerializeField]
    public int health; // Should use property
    private Rigidbody RB; // Should be camelCase
    private bool IsGrounded; // Private fields should be camelCase
    
    private void start() // Should be Start() with capital S
    {
        // ...
    }
    
    public void takeDamage(int amount) // Should be PascalCase
    {
        // ...
    }
}
```

## Summary

| Type | Convention | Example |
|------|-----------|---------|
| Scripts | PascalCase | `PlayerController.cs` |
| Classes | PascalCase | `PlayerController` |
| Private fields | camelCase (with `[SerializeField]`) | `moveSpeed` |
| Public properties | PascalCase | `Health` |
| Methods | PascalCase | `TakeDamage()` |
| GameObjects | Descriptive PascalCase | `Player`, `Main Camera` |
| Scenes | PascalCase | `MainMenu.unity` |
| Prefabs | PascalCase | `Player.prefab` |
| Tags/Layers | PascalCase | `Player`, `Ground` |
| Constants | PascalCase | `MaxHealth` |
| Enums | PascalCase | `PlayerState` |
| Interfaces | I + PascalCase | `IDamageable` |

