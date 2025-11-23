---
title: Directives de Performance
description: Standards et pratiques d'optimisation pour les projets Unity.
---

# Directives de Performance

Cette page documente les standards et pratiques d'optimisation de performance pour les projets Unity.

## Profiling

### Unity Profiler

Utilisez Unity Profiler régulièrement pour identifier les goulots d'étranglement :

**Comment Profiler :**
1. Ouvrir Window > Analysis > Profiler
2. Cliquer sur Record
3. Jouer votre scène
4. Analyser l'utilisation CPU, GPU, Mémoire et Audio

**Ce qu'il Faut Chercher :**
- Utilisation CPU élevée dans des fonctions spécifiques
- Pics de mémoire
- Appels de rendu excessifs
- Pics de garbage collection

### Cibles de Performance

- **Desktop** : 60 FPS minimum, 144 FPS cible
- **Mobile** : 30 FPS minimum, 60 FPS cible
- **Console** : 60 FPS cible

## Gestion de la Mémoire

### Object Pooling

Utilisez l'object pooling pour les objets fréquemment instanciés :

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

Minimisez les allocations pour réduire la pression GC :

**Éviter dans Update() :**
```csharp
// Mauvais : Alloue chaque frame
void Update()
{
    string message = "Score: " + score; // Alloue une chaîne
    Debug.Log(message);
}

// Bon : Cache ou utilise string builder
private StringBuilder sb = new StringBuilder();
void Update()
{
    sb.Clear();
    sb.Append("Score: ");
    sb.Append(score);
    Debug.Log(sb.ToString());
}
```

**Réutiliser les Collections :**
```csharp
// Mauvais : Alloue une nouvelle liste à chaque appel
List<Enemy> GetEnemies()
{
    return new List<Enemy>(enemies);
}

// Bon : Réutilise la liste
private List<Enemy> cachedList = new List<Enemy>();
List<Enemy> GetEnemies()
{
    cachedList.Clear();
    cachedList.AddRange(enemies);
    return cachedList;
}
```

## Optimisation du Rendu

### Appels de Rendu

Réduisez les appels de rendu :
- Utilisez le batching statique pour les objets statiques
- Utilisez le batching dynamique pour les petits objets
- Combinez les meshes quand c'est possible
- Utilisez l'instanciation GPU pour les objets répétés

### Niveau de Détail (LOD)

Utilisez les groupes LOD pour les modèles complexes :

```csharp
// Configurer LOD dans Unity Editor
// LOD 0 : Détail élevé (proche)
// LOD 1 : Détail moyen (distance moyenne)
// LOD 2 : Détail faible (loin)
```

### Occlusion Culling

Activez l'occlusion culling pour les scènes intérieures :
- Window > Rendering > Occlusion Culling
- Cuire les données d'occlusion
- Utiliser les composants Occlusion Portal

## Optimisation de la Physique

### Optimisation des Colliders

- Utilisez des colliders simples (Box, Sphere, Capsule) quand c'est possible
- Évitez les Mesh Colliders pour les objets dynamiques
- Utilisez les Physics Layers pour réduire les vérifications de collision
- Désactivez les colliders sur les objets inactifs

### Timestep Fixe

Ajustez le timestep fixe pour la performance :
- Edit > Project Settings > Time
- Fixed Timestep : 0.02 (50 Hz) pour la plupart des jeux
- Réduire pour de meilleures performances si la physique le permet

## Optimisation Audio

### Compression Audio

- Utilisez les formats compressés (Vorbis) pour la plupart des audios
- Utilisez non compressé (PCM) seulement pour les sons courts et fréquemment joués
- Ajustez la qualité de compression selon l'importance

### Sources Audio

- Limitez les sources audio actives
- Utilisez Audio Mixer pour un traitement efficace
- Désactivez les sources audio quand elles ne sont pas nécessaires

## Optimisation UI

### Optimisation Canvas

- Utilisez des canvas séparés pour l'UI statique et dynamique
- Définissez Canvas sur "Screen Space - Overlay" quand c'est possible
- Utilisez "Screen Space - Camera" pour l'UI 3D
- Évitez les canvas imbriqués quand c'est possible

### Batching UI

- Groupez les éléments UI sur le même canvas
- Utilisez Sprite Atlases pour les sprites UI
- Minimisez les appels de rendu UI

## Optimisation de Scripts

### Optimisation Update()

Cachez les composants et évitez les opérations coûteuses :

```csharp
// Bon : Cache le composant
private Rigidbody rb;

void Start()
{
    rb = GetComponent<Rigidbody>();
}

void Update()
{
    rb.velocity = Vector3.zero;
}

// Mauvais : Obtient le composant chaque frame
void Update()
{
    GetComponent<Rigidbody>().velocity = Vector3.zero;
}
```

### Éviter FindObjectOfType

Cachez les références au lieu d'utiliser FindObjectOfType :

```csharp
// Mauvais : Coûteux à chaque appel
GameManager manager = FindObjectOfType<GameManager>();

// Bon : Cache la référence
private GameManager manager;
void Start()
{
    manager = FindObjectOfType<GameManager>();
}
```

### Coroutines vs Update

Utilisez les coroutines pour les opérations périodiques :

```csharp
// Bon : Coroutine pour vérification périodique
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

// Mauvais : Vérifie chaque frame dans Update
void Update()
{
    CheckDistanceToPlayer(); // Inutile chaque frame
}
```

## Optimisation Spécifique à la Plateforme

### Mobile

- Réduisez les tailles de textures
- Utilisez la compression de textures
- Limitez les effets de particules
- Optimisez les shaders
- Réduisez les appels de rendu
- Utilisez les groupes LOD

### Console

- Ciblez 60 FPS
- Utilisez les optimisations spécifiques à la plateforme
- Optimisez pour le matériel spécifique

## Meilleures Pratiques

1. **Profiler D'abord** : Toujours profiler avant d'optimiser
2. **Optimiser les Goulots d'Étranglement** : Concentrez-vous sur les plus gros problèmes de performance
3. **Tester sur les Appareils Cibles** : Testez sur le matériel cible réel
4. **Utiliser l'Object Pooling** : Pool les objets fréquemment instanciés
5. **Minimiser les Allocations** : Réduisez la pression de garbage collection
6. **Optimiser les Appels de Rendu** : Réduisez la surcharge de rendu
7. **Cache les Composants** : Évitez les appels GetComponent répétés
8. **Utiliser LOD** : Implémentez le niveau de détail pour les modèles complexes
9. **Optimiser la Physique** : Utilisez des colliders simples, physics layers
10. **Surveiller la Performance** : Vérifiez régulièrement les métriques de performance
