---
title: Organisation des Scripts
description: Patterns de scripts et architecture de composants pour les projets Unity.
---

# Organisation des Scripts

Cette page documente les patterns d'organisation des scripts et les standards d'architecture de composants pour les projets Unity. Nous suivons une architecture basée sur les composants avec une séparation claire des préoccupations.

## Architecture de Composants

Unity utilise une architecture basée sur les composants où les GameObjects sont composés de plusieurs composants. Chaque composant doit avoir une seule responsabilité bien définie.

### Principe de Responsabilité Unique

Chaque script doit gérer une préoccupation spécifique :

```csharp
// Bon : Responsabilité unique
public class PlayerMovement : MonoBehaviour
{
    // Gère uniquement le mouvement
}

public class PlayerHealth : MonoBehaviour
{
    // Gère uniquement la santé
}

// Mauvais : Responsabilités multiples
public class PlayerController : MonoBehaviour
{
    // Gère le mouvement, la santé, l'inventaire, le combat, etc.
}
```

### Composition de Composants

Composez des comportements complexes à partir de composants simples :

```csharp
// GameObject avec composants composés
// GameObject Player :
//   - PlayerMovement (gère le mouvement)
//   - PlayerHealth (gère la santé)
//   - PlayerInventory (gère l'inventaire)
//   - PlayerCombat (gère le combat)
```

## Patterns de Scripts

### Pattern Manager

Utilisez les classes manager pour la fonctionnalité à l'échelle du système :

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

**Utiliser les managers pour :**
- Gestion de l'état du jeu
- Gestion audio
- Gestion de scène
- Gestion d'entrée

### Pattern Service Locator

Utilisez le service locator pour l'injection de dépendances :

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

## Utilisation de MonoBehaviour

### Quand Utiliser MonoBehaviour

Utilisez `MonoBehaviour` lorsque vous avez besoin de :
- Méthodes de cycle de vie Unity (Start, Update, etc.)
- Attachement de composant aux GameObjects
- Coroutines
- Fonctionnalités spécifiques à Unity (collision, triggers, etc.)

### Quand NE PAS Utiliser MonoBehaviour

Utilisez des classes C# simples pour :
- Logique métier pure
- Structures de données
- Classes utilitaires
- Services qui n'ont pas besoin de fonctionnalités Unity

```csharp
// Bon : Classe simple pour la logique métier
public class ScoreCalculator
{
    public int CalculateScore(int kills, int time)
    {
        return kills * 100 - time;
    }
}

// Mauvais : MonoBehaviour pour un calcul simple
public class ScoreCalculator : MonoBehaviour
{
    public int CalculateScore(int kills, int time)
    {
        return kills * 100 - time;
    }
}
```

## ScriptableObjects

Utilisez `ScriptableObject` pour :
- Données de configuration
- Paramètres de jeu
- Définitions d'objets
- Données d'événements

```csharp
[CreateAssetMenu(fileName = "Weapon", menuName = "Game/Weapon")]
public class WeaponData : ScriptableObject
{
    public string weaponName;
    public int damage;
    public float fireRate;
    public Sprite icon;
}

// Utilisation
public class Weapon : MonoBehaviour
{
    [SerializeField] private WeaponData weaponData;
    
    public void Fire()
    {
        // Utiliser weaponData.damage, weaponData.fireRate, etc.
    }
}
```

## Interfaces

Utilisez les interfaces pour :
- Définir des contrats
- Permettre le polymorphisme
- Inversion de dépendance

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

## Héritage vs Composition

### Préférer la Composition

Préférez la composition à l'héritage :

```csharp
// Bon : Composition
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

// Mauvais : Héritage profond
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

### Quand Utiliser l'Héritage

Utilisez l'héritage pour :
- Fonctionnalité de base partagée
- Besoins de polymorphisme
- Extension de framework (par exemple, composants UI personnalisés)

## Classes Manager

### GameManager

Gère l'état global du jeu :

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

Gère la lecture audio :

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

## Système d'Événements

### UnityEvents

Utilisez `UnityEvent` pour les événements configurables dans l'Inspector :

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

### Événements C#

Utilisez les événements C# pour les événements basés sur le code :

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

### Pattern Event Bus

Utilisez l'event bus pour la communication découplée :

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

## Injection de Dépendances

### Injection de Constructeur (Limitée)

Unity ne supporte pas l'injection de constructeur pour les MonoBehaviours, mais vous pouvez l'utiliser pour les classes simples :

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

Utilisez le pattern service locator (voir Pattern Service Locator ci-dessus).

## Exemples

### Exemple Complet : Contrôleur de Joueur

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

## Meilleures Pratiques

1. **Responsabilité Unique** : Chaque composant doit faire une chose bien
2. **Composition sur Héritage** : Préférez la composition de composants
3. **Utiliser les Interfaces** : Définissez des contrats avec des interfaces
4. **ScriptableObjects pour les Données** : Utilisez ScriptableObjects pour la configuration
5. **Event-Driven** : Utilisez les événements pour la communication découplée
6. **Service Locator** : Utilisez le service locator pour les dépendances
7. **Éviter l'Héritage Profond** : Gardez les hiérarchies d'héritage peu profondes
8. **Classes Simples pour la Logique** : Utilisez des classes C# simples pour la logique métier


