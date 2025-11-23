---
title: Script Organization
description: Script patterns and component architecture for Unity projects.
---

# Script Organization

This page documents script organization patterns and component architecture standards for Unity projects. We follow component-based architecture with clear separation of concerns.

## Component Architecture

Unity uses a component-based architecture where GameObjects are composed of multiple components. Each component should have a single, well-defined responsibility.

### Single Responsibility Principle

Each script should handle one specific concern:

```csharp
// Good: Single responsibility
public class PlayerMovement : MonoBehaviour
{
    // Handles only movement
}

public class PlayerHealth : MonoBehaviour
{
    // Handles only health
}

// Bad: Multiple responsibilities
public class PlayerController : MonoBehaviour
{
    // Handles movement, health, inventory, combat, etc.
}
```

### Component Composition

Compose complex behaviors from simple components:

```csharp
// GameObject with composed components
// Player GameObject:
//   - PlayerMovement (handles movement)
//   - PlayerHealth (handles health)
//   - PlayerInventory (handles inventory)
//   - PlayerCombat (handles combat)
```

## Script Patterns

### Manager Pattern

Use manager classes for system-wide functionality:

```csharp
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    public int Score { get; private set; }
    public int Lives { get; private set; }
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void AddScore(int points)
    {
        Score += points;
    }
}
```

**Use managers for:**
- Game state management
- Audio management
- Scene management
- Input management

### Service Locator Pattern

Use service locator for dependency injection:

```csharp
public class ServiceLocator : MonoBehaviour
{
    private static ServiceLocator _instance;
    public static ServiceLocator Instance => _instance;
    
    private Dictionary<Type, object> _services = new Dictionary<Type, object>();
    
    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void RegisterService<T>(T service)
    {
        _services[typeof(T)] = service;
    }
    
    public T GetService<T>()
    {
        return (T)_services[typeof(T)];
    }
}
```

## MonoBehaviour Usage

### When to Use MonoBehaviour

Use `MonoBehaviour` when you need:
- Unity lifecycle methods (Start, Update, etc.)
- Component attachment to GameObjects
- Coroutines
- Unity-specific features (collision, triggers, etc.)

### When NOT to Use MonoBehaviour

Use plain C# classes for:
- Pure business logic
- Data structures
- Utility classes
- Services that don't need Unity features

```csharp
// Good: Plain class for business logic
public class ScoreCalculator
{
    public int CalculateScore(int kills, int time)
    {
        return kills * 100 - time;
    }
}

// Bad: MonoBehaviour for simple calculation
public class ScoreCalculator : MonoBehaviour
{
    public int CalculateScore(int kills, int time)
    {
        return kills * 100 - time;
    }
}
```

## ScriptableObjects

Use `ScriptableObject` for:
- Configuration data
- Game settings
- Item definitions
- Event data

```csharp
[CreateAssetMenu(fileName = "Weapon", menuName = "Game/Weapon")]
public class WeaponData : ScriptableObject
{
    public string weaponName;
    public int damage;
    public float fireRate;
    public Sprite icon;
}

// Usage
public class Weapon : MonoBehaviour
{
    [SerializeField] private WeaponData weaponData;
    
    public void Fire()
    {
        // Use weaponData.damage, weaponData.fireRate, etc.
    }
}
```

## Interfaces

Use interfaces for:
- Defining contracts
- Enabling polymorphism
- Dependency inversion

```csharp
public interface IDamageable
{
    void TakeDamage(int amount);
    bool IsAlive { get; }
}

public class Player : MonoBehaviour, IDamageable
{
    private int health = 100;
    
    public void TakeDamage(int amount)
    {
        health -= amount;
    }
    
    public bool IsAlive => health > 0;
}

public class Enemy : MonoBehaviour, IDamageable
{
    private int health = 50;
    
    public void TakeDamage(int amount)
    {
        health -= amount;
    }
    
    public bool IsAlive => health > 0;
}
```

## Inheritance vs Composition

### Prefer Composition

Prefer composition over inheritance:

```csharp
// Good: Composition
public class Player : MonoBehaviour
{
    private PlayerMovement movement;
    private PlayerHealth health;
    private PlayerInventory inventory;
    
    private void Awake()
    {
        movement = GetComponent<PlayerMovement>();
        health = GetComponent<PlayerHealth>();
        inventory = GetComponent<PlayerInventory>();
    }
}

// Bad: Deep inheritance
public class Player : Character
{
    // ...
}

public class Character : Entity
{
    // ...
}

public class Entity : MonoBehaviour
{
    // ...
}
```

### When to Use Inheritance

Use inheritance for:
- Shared base functionality
- Polymorphism needs
- Framework extension (e.g., custom UI components)

## Manager Classes

### GameManager

Manages overall game state:

```csharp
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    public GameState CurrentState { get; private set; }
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void ChangeState(GameState newState)
    {
        CurrentState = newState;
        OnStateChanged?.Invoke(newState);
    }
    
    public event Action<GameState> OnStateChanged;
}
```

### AudioManager

Manages audio playback:

```csharp
public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }
    
    [SerializeField] private AudioSource musicSource;
    [SerializeField] private AudioSource sfxSource;
    
    public void PlayMusic(AudioClip clip)
    {
        musicSource.clip = clip;
        musicSource.Play();
    }
    
    public void PlaySFX(AudioClip clip)
    {
        sfxSource.PlayOneShot(clip);
    }
}
```

## Event System

### UnityEvents

Use `UnityEvent` for Inspector-configurable events:

```csharp
public class Health : MonoBehaviour
{
    [SerializeField] private int maxHealth = 100;
    private int currentHealth;
    
    public UnityEvent<int> OnHealthChanged;
    public UnityEvent OnDeath;
    
    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        OnHealthChanged?.Invoke(currentHealth);
        
        if (currentHealth <= 0)
        {
            OnDeath?.Invoke();
        }
    }
}
```

### C# Events

Use C# events for code-based events:

```csharp
public class ScoreManager : MonoBehaviour
{
    public event Action<int> OnScoreChanged;
    public event Action OnHighScore;
    
    private int score;
    
    public void AddScore(int points)
    {
        score += points;
        OnScoreChanged?.Invoke(score);
        
        if (score > highScore)
        {
            OnHighScore?.Invoke();
        }
    }
}
```

### Event Bus Pattern

Use event bus for decoupled communication:

```csharp
public static class EventBus
{
    public static event Action<Player> OnPlayerSpawned;
    public static event Action<int> OnScoreChanged;
    public static event Action OnGameOver;
    
    public static void PublishPlayerSpawned(Player player)
    {
        OnPlayerSpawned?.Invoke(player);
    }
    
    public static void PublishScoreChanged(int score)
    {
        OnScoreChanged?.Invoke(score);
    }
    
    public static void PublishGameOver()
    {
        OnGameOver?.Invoke();
    }
}
```

## Dependency Injection

### Constructor Injection (Limited)

Unity doesn't support constructor injection for MonoBehaviours, but you can use it for plain classes:

```csharp
public class PlayerService
{
    private readonly IAudioService audioService;
    private readonly ISaveService saveService;
    
    public PlayerService(IAudioService audioService, ISaveService saveService)
    {
        this.audioService = audioService;
        this.saveService = saveService;
    }
}
```

### Service Locator

Use service locator pattern (see Service Locator Pattern above).

## Examples

### Complete Example: Player Controller

```csharp
public class PlayerController : MonoBehaviour
{
    [Header("Components")]
    [SerializeField] private Rigidbody rb;
    [SerializeField] private PlayerHealth health;
    [SerializeField] private PlayerInventory inventory;
    
    [Header("Movement Settings")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;
    
    private bool isGrounded;
    
    private void Awake()
    {
        if (rb == null) rb = GetComponent<Rigidbody>();
        if (health == null) health = GetComponent<PlayerHealth>();
        if (inventory == null) inventory = GetComponent<PlayerInventory>();
    }
    
    private void Update()
    {
        HandleMovement();
        HandleJump();
    }
    
    private void HandleMovement()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;
        transform.position += direction * moveSpeed * Time.deltaTime;
    }
    
    private void HandleJump()
    {
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        }
    }
    
    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }
}
```

## Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Composition over Inheritance**: Prefer component composition
3. **Use Interfaces**: Define contracts with interfaces
4. **ScriptableObjects for Data**: Use ScriptableObjects for configuration
5. **Event-Driven**: Use events for decoupled communication
6. **Service Locator**: Use service locator for dependencies
7. **Avoid Deep Inheritance**: Keep inheritance hierarchies shallow
8. **Plain Classes for Logic**: Use plain C# classes for business logic
