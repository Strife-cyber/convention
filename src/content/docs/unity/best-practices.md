---
title: Best Practices
description: General Unity best practices and guidelines.
---

# Best Practices

This page documents general best practices and guidelines for Unity development.

## Scene Management

### Scene Loading

Use SceneManager for scene transitions:

```csharp
using UnityEngine.SceneManagement;

public void LoadScene(string sceneName)
{
    SceneManager.LoadScene(sceneName);
}

public void LoadSceneAsync(string sceneName)
{
    StartCoroutine(LoadSceneCoroutine(sceneName));
}

private IEnumerator LoadSceneCoroutine(string sceneName)
{
    AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName);
    
    while (!asyncLoad.isDone)
    {
        float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f);
        // Update loading bar
        yield return null;
    }
}
```

### Additive Scenes

Use additive scene loading for modular content:

```csharp
SceneManager.LoadScene("Level01", LoadSceneMode.Additive);
```

## Prefab Usage

### When to Use Prefabs

Use prefabs for:
- Repeated GameObjects
- Templates for instantiation
- Shared configurations
- Version control benefits

### Prefab Variants

Use prefab variants for variations:

```csharp
// Base: Enemy_Basic.prefab
// Variants:
//   - Enemy_Basic_Fast.prefab (faster movement)
//   - Enemy_Basic_Strong.prefab (more health)
```

### Nested Prefabs

Use nested prefabs for complex hierarchies:
- Character prefab contains weapon prefab
- UI panel prefab contains button prefabs

## Component Design

### Single Responsibility

Each component should have one clear purpose:

```csharp
// Good: Single responsibility
public class PlayerMovement : MonoBehaviour { }
public class PlayerHealth : MonoBehaviour { }

// Bad: Multiple responsibilities
public class PlayerController : MonoBehaviour
{
    // Handles movement, health, inventory, etc.
}
```

### Component Composition

Compose complex behaviors from simple components:

```csharp
// Player GameObject:
//   - PlayerMovement
//   - PlayerHealth
//   - PlayerInventory
//   - PlayerCombat
```

## Error Handling

### Null Checks

Always check for null references:

```csharp
// Good: Null check
if (target != null)
{
    target.DoSomething();
}

// Good: Null-conditional operator
target?.DoSomething();

// Bad: No null check
target.DoSomething(); // May throw NullReferenceException
```

### Try-Catch Blocks

Use try-catch for error handling:

```csharp
try
{
    // Risky operation
    LoadData();
}
catch (System.Exception e)
{
    Debug.LogError($"Error loading data: {e.Message}");
    // Handle error gracefully
}
```

### Defensive Programming

Validate inputs and state:

```csharp
public void TakeDamage(int amount)
{
    if (amount < 0)
    {
        Debug.LogWarning("Damage amount cannot be negative");
        return;
    }
    
    if (health <= 0)
    {
        Debug.LogWarning("Entity is already dead");
        return;
    }
    
    health -= amount;
}
```

## Debugging

### Debug.Log Usage

Use appropriate log levels:

```csharp
Debug.Log("Info message");
Debug.LogWarning("Warning message");
Debug.LogError("Error message");
```

### Conditional Compilation

Use conditional compilation for debug code:

```csharp
#if UNITY_EDITOR
    Debug.Log("Editor-only debug message");
#endif

[Conditional("UNITY_EDITOR")]
private void DebugMethod()
{
    Debug.Log("Editor-only method");
}
```

### Debug Draw

Use Gizmos for visual debugging:

```csharp
private void OnDrawGizmos()
{
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere(transform.position, attackRange);
}
```

## Testing

### Play Mode Testing

Test functionality in Play Mode:
- Verify component interactions
- Test game mechanics
- Validate physics behavior

### Unit Testing

Use Unity Test Framework for unit tests:
- Test business logic
- Test utility functions
- Test data structures

## Documentation

### XML Comments

Document public APIs:

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

### Code Comments

Comment complex logic:

```csharp
// Calculate damage with armor reduction
// Formula: finalDamage = baseDamage * (1 - armor / (armor + 100))
float finalDamage = baseDamage * (1f - armor / (armor + 100f));
```

## Version Control

### Commit Frequency

Commit frequently with meaningful messages:
- Small, focused commits
- Clear commit messages
- Related changes together

### Branch Strategy

Follow team's branching strategy (see [Git Workflow](../shared/git-workflow/)).

## Collaboration

### Scene Merging

Coordinate scene changes:
- Use prefabs instead of direct scene editing when possible
- Communicate scene modifications
- Use Unity Collaborate or Plastic SCM for better merge support

### Prefab Workflows

- Work on prefabs, not scene instances
- Use prefab variants for variations
- Test prefabs in isolation

## Security

### Input Validation

Validate all user input:

```csharp
public void SetPlayerName(string name)
{
    if (string.IsNullOrEmpty(name))
    {
        Debug.LogError("Player name cannot be empty");
        return;
    }
    
    if (name.Length > 20)
    {
        Debug.LogError("Player name too long");
        return;
    }
    
    playerName = name;
}
```

### Secure Data Storage

Use secure storage for sensitive data:
- Encrypt save files
- Don't store sensitive data in PlayerPrefs
- Validate data on load

## Accessibility

### UI Accessibility

- Use clear, readable fonts
- Provide sufficient color contrast
- Support keyboard navigation
- Add tooltips and help text

### Input Accessibility

- Support multiple input methods
- Provide input remapping
- Support assistive technologies

## Code Reusability

### Utility Classes

Create reusable utility classes:

```csharp
public static class MathUtils
{
    public static float Remap(float value, float fromMin, float fromMax, float toMin, float toMax)
    {
        return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
    }
}
```

### Shared Components

Extract shared components:
- Common UI elements
- Reusable game mechanics
- Shared utilities

## Summary

- Use SceneManager for scene loading
- Use prefabs for repeated objects
- Keep components focused on single responsibility
- Always check for null references
- Use appropriate debug logging
- Document public APIs
- Commit frequently with clear messages
- Coordinate scene changes with team
- Validate all user input
- Create reusable utilities and components
