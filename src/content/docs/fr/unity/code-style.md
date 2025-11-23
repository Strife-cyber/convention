---
title: Style de Code
description: Standards de codage C# et formatage pour les projets Unity.
---

# Style de Code

Cette page documente les standards de codage C# et les règles de formatage pour les projets Unity. Nous suivons les [Conventions de Codage C# Microsoft](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) avec des adaptations spécifiques à Unity.

## Standards de Codage C#

Nous suivons les conventions de codage C# de Microsoft avec les directives spécifiques à Unity suivantes :

- Utiliser l'architecture basée sur les composants d'Unity
- Préférer la composition à l'héritage
- Utiliser `[SerializeField]` pour les champs privés exposés dans l'Inspector
- Suivre les conventions des méthodes de cycle de vie Unity
- Utiliser les types spécifiques à Unity (Vector3, Quaternion, etc.) de manière appropriée

## Formatage

### Indentation

Utilisez **4 espaces** pour l'indentation (pas de tabulations). C'est la valeur par défaut dans Visual Studio et Unity.

```csharp
public class PlayerController : MonoBehaviour
{
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Jump();
        }
    }
}
```

### Style d'Accolades

Utilisez le **style Allman** (accolades sur de nouvelles lignes) :

```csharp
// Bon
public class PlayerController : MonoBehaviour
{
    private void Update()
    {
        // Code ici
    }
}

// Mauvais - Style K&R
public class PlayerController : MonoBehaviour {
    private void Update() {
        // Code ici
    }
}
```

### Espacement

- Utilisez des espaces autour des opérateurs : `x = y + z`
- Utilisez des espaces après les virgules : `Method(param1, param2)`
- Pas d'espace avant le point-virgule : `x++;`
- Utilisez des lignes vides pour séparer les sections logiques

```csharp
// Bon
float speed = moveSpeed * Time.deltaTime;
Vector3 position = transform.position + direction * speed;

// Mauvais
float speed=moveSpeed*Time.deltaTime;
Vector3 position=transform.position+direction*speed;
```

## Organisation du Code

### Organisation des Champs

Organisez les champs dans cet ordre :

1. **Champs sérialisés** (avec `[SerializeField]`)
2. **Propriétés publiques**
3. **Champs privés**
4. **Constantes**

```csharp
public class PlayerController : MonoBehaviour
{
    // 1. Champs sérialisés
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private int maxHealth = 100;
    [SerializeField] private GameObject projectilePrefab;
    
    // 2. Propriétés publiques
    public int Health { get; private set; }
    public bool IsAlive => Health > 0;
    
    // 3. Champs privés
    private Rigidbody rb;
    private bool isGrounded;
    private Vector3 velocity;
    
    // 4. Constantes
    private const float GRAVITY = 9.81f;
    private const string PLAYER_TAG = "Player";
}
```

### Organisation des Méthodes

Organisez les méthodes dans cet ordre :

1. **Méthodes de cycle de vie Unity** (Awake, Start, Update, etc.)
2. **Méthodes publiques**
3. **Méthodes privées**
4. **Gestionnaires d'événements** (OnTriggerEnter, OnCollisionEnter, etc.)

```csharp
public class PlayerController : MonoBehaviour
{
    // Méthodes de cycle de vie Unity
    private void Awake()
    {
        // Initialisation
    }
    
    private void Start()
    {
        // Configuration
    }
    
    private void Update()
    {
        // Logique par frame
    }
    
    // Méthodes publiques
    public void TakeDamage(int amount)
    {
        Health -= amount;
    }
    
    public void Heal(int amount)
    {
        Health += amount;
    }
    
    // Méthodes privées
    private void Move()
    {
        // Logique de mouvement
    }
    
    private void Jump()
    {
        // Logique de saut
    }
    
    // Gestionnaires d'événements
    private void OnTriggerEnter(Collider other)
    {
        // Logique de trigger
    }
}
```

### Regions (Utiliser avec Parcimonie)

Utilisez `#region` seulement pour les très gros fichiers ou pour grouper la fonctionnalité liée :

```csharp
public class GameManager : MonoBehaviour
{
    #region Properties
    public int Score { get; private set; }
    public int Lives { get; private set; }
    #endregion
    
    #region Unity Lifecycle
    private void Start() { }
    private void Update() { }
    #endregion
}
```

**Meilleure Pratique :** Préférez des classes plus petites et ciblées aux gros fichiers avec des regions.

## Attributs

### SerializeField

Utilisez `[SerializeField]` pour exposer les champs privés dans l'Inspector :

```csharp
[SerializeField] private float moveSpeed = 5f;
[SerializeField] private GameObject target;
```

**Pourquoi :** Maintient l'encapsulation tout en permettant la configuration dans l'Inspector.

### Header

Utilisez `[Header]` pour organiser les champs de l'Inspector :

```csharp
[Header("Movement Settings")]
[SerializeField] private float moveSpeed = 5f;
[SerializeField] private float jumpForce = 10f;

[Header("Combat Settings")]
[SerializeField] private int damage = 10;
[SerializeField] private float attackRange = 2f;
```

### Tooltip

Utilisez `[Tooltip]` pour ajouter des descriptions utiles dans l'Inspector :

```csharp
[Tooltip("La vitesse à laquelle le joueur se déplace en unités par seconde")]
[SerializeField] private float moveSpeed = 5f;
```

### Range

Utilisez `[Range]` pour les champs numériques qui doivent être contraints :

```csharp
[Range(0f, 100f)]
[SerializeField] private float health = 100f;

[Range(1, 10)]
[SerializeField] private int difficulty = 5;
```

### Space

Utilisez `[Space]` pour ajouter une séparation visuelle dans l'Inspector :

```csharp
[SerializeField] private float moveSpeed = 5f;

[Space]
[SerializeField] private int health = 100;
```

## Commentaires

### Commentaires de Documentation XML

Utilisez les commentaires de documentation XML (`///`) pour les APIs publiques :

```csharp
/// <summary>
/// Déplace le joueur dans la direction spécifiée.
/// </summary>
/// <param name="direction">La direction dans laquelle se déplacer en espace monde.</param>
/// <param name="speed">La vitesse à laquelle se déplacer.</param>
public void Move(Vector3 direction, float speed)
{
    transform.position += direction * speed * Time.deltaTime;
}
```

### Commentaires Inline

Utilisez `//` pour les commentaires inline. Expliquez **pourquoi**, pas **quoi** :

```csharp
// Bon : Explique pourquoi
// Utiliser Time.deltaTime pour rendre le mouvement indépendant du taux de rafraîchissement
transform.position += direction * moveSpeed * Time.deltaTime;

// Mauvais : Explique quoi (évident depuis le code)
// Déplacer la position du transform
transform.position += direction * moveSpeed * Time.deltaTime;
```

### Commentaires TODO

Utilisez `// TODO:` pour les notes temporaires :

```csharp
// TODO: Implémenter l'object pooling pour de meilleures performances
private void SpawnEnemy()
{
    // ...
}
```

## Conventions de Nommage

Voir [Conventions de Nommage](./naming-conventions/) pour les standards de nommage détaillés.

Résumé :
- Classes : PascalCase
- Méthodes : PascalCase
- Champs privés : camelCase (avec `[SerializeField]` si nécessaire)
- Propriétés publiques : PascalCase
- Constantes : PascalCase

## Scripts d'Éditeur

Les scripts d'éditeur doivent être dans un dossier nommé `Editor` (n'importe où dans `Assets/`) :

```
Assets/
└── Scripts/
    └── Editor/
        ├── CustomInspectors/
        └── Tools/
```

### Conventions des Scripts d'Éditeur

- Hériter de `Editor` pour les inspecteurs personnalisés
- Utiliser l'attribut `[CustomEditor(typeof(YourClass))]`
- Utiliser `EditorGUILayout` et `GUILayout` pour l'UI

```csharp
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(PlayerController))]
public class PlayerControllerEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        
        PlayerController controller = (PlayerController)target;
        
        if (GUILayout.Button("Reset Health"))
        {
            controller.ResetHealth();
        }
    }
}
```

## Exemples de Code

### Bon Style de Code

```csharp
using UnityEngine;

/// <summary>
/// Contrôle le mouvement du joueur et les actions de base.
/// </summary>
public class PlayerController : MonoBehaviour
{
    [Header("Movement Settings")]
    [Tooltip("La vitesse à laquelle le joueur se déplace en unités par seconde")]
    [SerializeField] private float moveSpeed = 5f;
    
    [SerializeField] private float jumpForce = 10f;
    
    public int Health { get; private set; } = 100;
    public bool IsAlive => Health > 0;
    
    private Rigidbody rb;
    private bool isGrounded;
    
    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
    }
    
    private void Update()
    {
        HandleMovement();
        HandleJump();
    }
    
    public void TakeDamage(int amount)
    {
        Health -= amount;
        if (!IsAlive)
        {
            Die();
        }
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
    
    private void Die()
    {
        // Gérer la logique de mort
        gameObject.SetActive(false);
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

### Mauvais Style de Code

```csharp
using UnityEngine;
public class playerController:MonoBehaviour{ // Mauvais nommage, pas d'espacement
[SerializeField]float moveSpeed=5f; // Pas d'espacement d'attribut, pas de modificateur d'accès
public int health; // Devrait utiliser une propriété
private Rigidbody RB; // Mauvais nommage
void update(){ // Devrait être Update() avec majuscule, devrait être privé
if(Input.GetKeyDown(KeyCode.Space)){ // Pas d'espacement
Jump(); // Méthode non définie
}
}
void jump(){ // Mauvais nommage, devrait être privé
// Pas d'implémentation
}
}
```

## Résumé

- Utiliser 4 espaces pour l'indentation
- Utiliser le style d'accolades Allman (accolades sur de nouvelles lignes)
- Organiser les champs : Sérialisés → Propriétés → Privés → Constantes
- Organiser les méthodes : Cycle de Vie Unity → Publiques → Privées → Événements
- Utiliser `[SerializeField]` pour les champs privés exposés dans l'Inspector
- Utiliser la documentation XML (`///`) pour les APIs publiques
- Expliquer **pourquoi** dans les commentaires, pas **quoi**
- Suivre les conventions de codage C# Microsoft


