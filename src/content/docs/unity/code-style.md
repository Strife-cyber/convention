---
title: Code Style
description: C# coding standards and formatting for Unity projects.
---

# Code Style

This page documents the C# coding standards and formatting rules for Unity projects. We follow [Microsoft C# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) with Unity-specific adaptations.

## C# Coding Standards

We follow Microsoft's C# coding conventions with the following Unity-specific guidelines:

- Use Unity's component-based architecture
- Prefer composition over inheritance
- Use `[SerializeField]` for Inspector-exposed private fields
- Follow Unity lifecycle method conventions
- Use Unity-specific types (Vector3, Quaternion, etc.) appropriately

## Formatting

### Indentation

Use **4 spaces** for indentation (not tabs). This is the default in Visual Studio and Unity.

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

### Brace Style

Use **Allman style** (braces on new lines):

```csharp
// Good
public class PlayerController : MonoBehaviour
{
    private void Update()
    {
        // Code here
    }
}

// Bad - K&R style
public class PlayerController : MonoBehaviour {
    private void Update() {
        // Code here
    }
}
```

### Spacing

- Use spaces around operators: `x = y + z`
- Use spaces after commas: `Method(param1, param2)`
- No space before semicolon: `x++;`
- Use blank lines to separate logical sections

```csharp
// Good
float speed = moveSpeed * Time.deltaTime;
Vector3 position = transform.position + direction * speed;

// Bad
float speed=moveSpeed*Time.deltaTime;
Vector3 position=transform.position+direction*speed;
```

## Code Organization

### Field Organization

Organize fields in this order:

1. **Serialized fields** (with `[SerializeField]`)
2. **Public properties**
3. **Private fields**
4. **Constants**

```csharp
public class PlayerController : MonoBehaviour
{
    // 1. Serialized fields
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private int maxHealth = 100;
    [SerializeField] private GameObject projectilePrefab;
    
    // 2. Public properties
    public int Health { get; private set; }
    public bool IsAlive => Health > 0;
    
    // 3. Private fields
    private Rigidbody rb;
    private bool isGrounded;
    private Vector3 velocity;
    
    // 4. Constants
    private const float GRAVITY = 9.81f;
    private const string PLAYER_TAG = "Player";
}
```

### Method Organization

Organize methods in this order:

1. **Unity lifecycle methods** (Awake, Start, Update, etc.)
2. **Public methods**
3. **Private methods**
4. **Event handlers** (OnTriggerEnter, OnCollisionEnter, etc.)

```csharp
public class PlayerController : MonoBehaviour
{
    // Unity lifecycle methods
    private void Awake()
    {
        // Initialization
    }
    
    private void Start()
    {
        // Setup
    }
    
    private void Update()
    {
        // Per-frame logic
    }
    
    // Public methods
    public void TakeDamage(int amount)
    {
        Health -= amount;
    }
    
    public void Heal(int amount)
    {
        Health += amount;
    }
    
    // Private methods
    private void Move()
    {
        // Movement logic
    }
    
    private void Jump()
    {
        // Jump logic
    }
    
    // Event handlers
    private void OnTriggerEnter(Collider other)
    {
        // Trigger logic
    }
}
```

### Regions (Use Sparingly)

Use `#region` only for very large files or to group related functionality:

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

**Best Practice:** Prefer smaller, focused classes over large files with regions.

## Attributes

### SerializeField

Use `[SerializeField]` to expose private fields in the Inspector:

```csharp
[SerializeField] private float moveSpeed = 5f;
[SerializeField] private GameObject target;
```

**Why:** Keeps encapsulation while allowing Inspector configuration.

### Header

Use `[Header]` to organize Inspector fields:

```csharp
[Header("Movement Settings")]
[SerializeField] private float moveSpeed = 5f;
[SerializeField] private float jumpForce = 10f;

[Header("Combat Settings")]
[SerializeField] private int damage = 10;
[SerializeField] private float attackRange = 2f;
```

### Tooltip

Use `[Tooltip]` to add helpful descriptions in the Inspector:

```csharp
[Tooltip("The speed at which the player moves in units per second")]
[SerializeField] private float moveSpeed = 5f;
```

### Range

Use `[Range]` for numeric fields that should be constrained:

```csharp
[Range(0f, 100f)]
[SerializeField] private float health = 100f;

[Range(1, 10)]
[SerializeField] private int difficulty = 5;
```

### Space

Use `[Space]` to add visual separation in the Inspector:

```csharp
[SerializeField] private float moveSpeed = 5f;

[Space]
[SerializeField] private int health = 100;
```

## Comments

### XML Documentation Comments

Use XML documentation comments (`///`) for public APIs:

```csharp
/// <summary>
/// Moves the player in the specified direction.
/// </summary>
/// <param name="direction">The direction to move in world space.</param>
/// <param name="speed">The speed at which to move.</param>
public void Move(Vector3 direction, float speed)
{
    transform.position += direction * speed * Time.deltaTime;
}
```

### Inline Comments

Use `//` for inline comments. Explain **why**, not **what**:

```csharp
// Good: Explains why
// Use Time.deltaTime to make movement frame-rate independent
transform.position += direction * moveSpeed * Time.deltaTime;

// Bad: Explains what (obvious from code)
// Move the transform position
transform.position += direction * moveSpeed * Time.deltaTime;
```

### TODO Comments

Use `// TODO:` for temporary notes:

```csharp
// TODO: Implement object pooling for better performance
private void SpawnEnemy()
{
    // ...
}
```

## Naming Conventions

See [Naming Conventions](./naming-conventions/) for detailed naming standards.

Summary:
- Classes: PascalCase
- Methods: PascalCase
- Private fields: camelCase (with `[SerializeField]` if needed)
- Public properties: PascalCase
- Constants: PascalCase

## Editor Scripts

Editor scripts must be in a folder named `Editor` (anywhere in `Assets/`):

```
Assets/
└── Scripts/
    └── Editor/
        ├── CustomInspectors/
        └── Tools/
```

### Editor Script Conventions

- Inherit from `Editor` for custom inspectors
- Use `[CustomEditor(typeof(YourClass))]` attribute
- Use `EditorGUILayout` and `GUILayout` for UI

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

## Code Examples

### Good Code Style

```csharp
using UnityEngine;

/// <summary>
/// Controls player movement and basic actions.
/// </summary>
public class PlayerController : MonoBehaviour
{
    [Header("Movement Settings")]
    [Tooltip("The speed at which the player moves in units per second")]
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
        // Handle death logic
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

### Bad Code Style

```csharp
using UnityEngine;
public class playerController:MonoBehaviour{ // Wrong naming, no spacing
[SerializeField]float moveSpeed=5f; // No attribute spacing, no access modifier
public int health; // Should use property
private Rigidbody RB; // Wrong naming
void update(){ // Should be Update() with capital, should be private
if(Input.GetKeyDown(KeyCode.Space)){ // No spacing
Jump(); // Method not defined
}
}
void jump(){ // Wrong naming, should be private
// No implementation
}
}
```

## Summary

- Use 4 spaces for indentation
- Use Allman brace style (braces on new lines)
- Organize fields: Serialized → Properties → Private → Constants
- Organize methods: Unity Lifecycle → Public → Private → Events
- Use `[SerializeField]` for Inspector-exposed private fields
- Use XML documentation (`///`) for public APIs
- Explain **why** in comments, not **what**
- Follow Microsoft C# coding conventions

