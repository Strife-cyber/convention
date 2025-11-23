---
title: Performance Guidelines
description: Optimization standards and practices for Unity projects.
---

# Performance Guidelines

This page documents performance optimization standards and practices for Unity projects.

## Profiling

### Unity Profiler

Use Unity Profiler regularly to identify bottlenecks:

**How to Profile:**
1. Open Window > Analysis > Profiler
2. Click Record
3. Play your scene
4. Analyze CPU, GPU, Memory, and Audio usage

**What to Look For:**
- High CPU usage in specific functions
- Memory spikes
- Excessive draw calls
- Garbage collection spikes

### Performance Targets

- **Desktop**: 60 FPS minimum, 144 FPS target
- **Mobile**: 30 FPS minimum, 60 FPS target
- **Console**: 60 FPS target

## Memory Management

### Object Pooling

Use object pooling for frequently instantiated objects:

```csharp
public class ObjectPool : MonoBehaviour
{
    [SerializeField] private GameObject prefab;
    [SerializeField] private int poolSize = 10;
    
    private Queue<GameObject> pool = new Queue<GameObject>();
    
    private void Start()
    {
        for (int i = 0; i < poolSize; i++)
        {
            GameObject obj = Instantiate(prefab);
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
    }
    
    public GameObject Get()
    {
        if (pool.Count > 0)
        {
            GameObject obj = pool.Dequeue();
            obj.SetActive(true);
            return obj;
        }
        return Instantiate(prefab);
    }
    
    public void Return(GameObject obj)
    {
        obj.SetActive(false);
        pool.Enqueue(obj);
    }
}
```

### Garbage Collection

Minimize allocations to reduce GC pressure:

**Avoid in Update():**
```csharp
// Bad: Allocates every frame
void Update()
{
    string message = "Score: " + score; // Allocates string
    Debug.Log(message);
}

// Good: Cache or use string builder
private StringBuilder sb = new StringBuilder();
void Update()
{
    sb.Clear();
    sb.Append("Score: ");
    sb.Append(score);
    Debug.Log(sb.ToString());
}
```

**Reuse Collections:**
```csharp
// Bad: Allocates new list every call
List<Enemy> GetEnemies()
{
    return new List<Enemy>(enemies);
}

// Good: Reuse list
private List<Enemy> cachedList = new List<Enemy>();
List<Enemy> GetEnemies()
{
    cachedList.Clear();
    cachedList.AddRange(enemies);
    return cachedList;
}
```

## Rendering Optimization

### Draw Calls

Reduce draw calls:
- Use static batching for static objects
- Use dynamic batching for small objects
- Combine meshes when possible
- Use GPU instancing for repeated objects

### Level of Detail (LOD)

Use LOD groups for complex models:

```csharp
// Configure LOD in Unity Editor
// LOD 0: High detail (close)
// LOD 1: Medium detail (medium distance)
// LOD 2: Low detail (far)
```

### Occlusion Culling

Enable occlusion culling for indoor scenes:
- Window > Rendering > Occlusion Culling
- Bake occlusion data
- Use Occlusion Portal components

## Physics Optimization

### Collider Optimization

- Use simple colliders (Box, Sphere, Capsule) when possible
- Avoid Mesh Colliders for dynamic objects
- Use Physics Layers to reduce collision checks
- Disable colliders on inactive objects

### Fixed Timestep

Adjust fixed timestep for performance:
- Edit > Project Settings > Time
- Fixed Timestep: 0.02 (50 Hz) for most games
- Reduce for better performance if physics allows

## Audio Optimization

### Audio Compression

- Use compressed formats (Vorbis) for most audio
- Use uncompressed (PCM) only for short, frequently played sounds
- Adjust compression quality based on importance

### Audio Sources

- Limit active audio sources
- Use Audio Mixer for efficient processing
- Disable audio sources when not needed

## UI Optimization

### Canvas Optimization

- Use separate canvases for static and dynamic UI
- Set Canvas to "Screen Space - Overlay" when possible
- Use "Screen Space - Camera" for 3D UI
- Avoid nested canvases when possible

### UI Batching

- Group UI elements on same canvas
- Use Sprite Atlases for UI sprites
- Minimize UI draw calls

## Script Optimization

### Update() Optimization

Cache components and avoid expensive operations:

```csharp
// Good: Cache component
private Rigidbody rb;

void Start()
{
    rb = GetComponent<Rigidbody>();
}

void Update()
{
    rb.velocity = Vector3.zero;
}

// Bad: Get component every frame
void Update()
{
    GetComponent<Rigidbody>().velocity = Vector3.zero;
}
```

### Avoid FindObjectOfType

Cache references instead of using FindObjectOfType:

```csharp
// Bad: Expensive every call
GameManager manager = FindObjectOfType<GameManager>();

// Good: Cache reference
private GameManager manager;
void Start()
{
    manager = FindObjectOfType<GameManager>();
}
```

### Coroutines vs Update

Use coroutines for periodic operations:

```csharp
// Good: Coroutine for periodic check
void Start()
{
    StartCoroutine(CheckDistance());
}

IEnumerator CheckDistance()
{
    while (true)
    {
        CheckDistanceToPlayer();
        yield return new WaitForSeconds(0.5f);
    }
}

// Bad: Check every frame in Update
void Update()
{
    CheckDistanceToPlayer(); // Unnecessary every frame
}
```

## Platform-Specific Optimization

### Mobile

- Reduce texture sizes
- Use texture compression
- Limit particle effects
- Optimize shaders
- Reduce draw calls
- Use LOD groups

### Console

- Target 60 FPS
- Use platform-specific optimizations
- Optimize for specific hardware

## Best Practices

1. **Profile First**: Always profile before optimizing
2. **Optimize Bottlenecks**: Focus on biggest performance issues
3. **Test on Target Devices**: Test on actual target hardware
4. **Use Object Pooling**: Pool frequently instantiated objects
5. **Minimize Allocations**: Reduce garbage collection pressure
6. **Optimize Draw Calls**: Reduce rendering overhead
7. **Cache Components**: Avoid repeated GetComponent calls
8. **Use LOD**: Implement level of detail for complex models
9. **Optimize Physics**: Use simple colliders, physics layers
10. **Monitor Performance**: Regularly check performance metrics
