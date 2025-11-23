---
title: Meilleures Pratiques
description: Meilleures pratiques et directives générales Unity.
---

# Meilleures Pratiques

Cette page documente les meilleures pratiques et directives générales pour le développement Unity.

## Gestion de Scènes

### Chargement de Scènes

Utilisez SceneManager pour les transitions de scènes :

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
        // Mettre à jour la barre de chargement
        yield return null;
    }
}
```

### Scènes Additives

Utilisez le chargement de scènes additives pour le contenu modulaire :

```csharp
SceneManager.LoadScene("Level01", LoadSceneMode.Additive);
```

## Utilisation des Prefabs

### Quand Utiliser les Prefabs

Utilisez les prefabs pour :
- GameObjects répétés
- Modèles pour l'instanciation
- Configurations partagées
- Avantages du contrôle de version

### Variantes de Prefabs

Utilisez les variantes de prefabs pour les variations :

```csharp
// Base : Enemy_Basic.prefab
// Variantes :
//   - Enemy_Basic_Fast.prefab (mouvement plus rapide)
//   - Enemy_Basic_Strong.prefab (plus de santé)
```

### Prefabs Imbriqués

Utilisez les prefabs imbriqués pour les hiérarchies complexes :
- Prefab de personnage contient prefab d'arme
- Prefab de panneau UI contient prefabs de boutons

## Conception de Composants

### Responsabilité Unique

Chaque composant doit avoir un objectif clair :

```csharp
// Bon : Responsabilité unique
public class PlayerMovement : MonoBehaviour { }
public class PlayerHealth : MonoBehaviour { }

// Mauvais : Responsabilités multiples
public class PlayerController : MonoBehaviour
{
    // Gère le mouvement, la santé, l'inventaire, etc.
}
```

### Composition de Composants

Composez des comportements complexes à partir de composants simples :

```csharp
// GameObject Player :
//   - PlayerMovement
//   - PlayerHealth
//   - PlayerInventory
//   - PlayerCombat
```

## Gestion des Erreurs

### Vérifications Null

Vérifiez toujours les références null :

```csharp
// Bon : Vérification null
if (target != null)
{
    target.DoSomething();
}

// Bon : Opérateur null-conditionnel
target?.DoSomething();

// Mauvais : Pas de vérification null
target.DoSomething(); // Peut lancer NullReferenceException
```

### Blocs Try-Catch

Utilisez try-catch pour la gestion des erreurs :

```csharp
try
{
    // Opération risquée
    LoadData();
}
catch (System.Exception e)
{
    Debug.LogError($"Erreur lors du chargement des données : {e.Message}");
    // Gérer l'erreur gracieusement
}
```

### Programmation Défensive

Validez les entrées et l'état :

```csharp
public void TakeDamage(int amount)
{
    if (amount < 0)
    {
        Debug.LogWarning("Le montant des dégâts ne peut pas être négatif");
        return;
    }
    
    if (health <= 0)
    {
        Debug.LogWarning("L'entité est déjà morte");
        return;
    }
    
    health -= amount;
}
```

## Débogage

### Utilisation de Debug.Log

Utilisez les niveaux de log appropriés :

```csharp
Debug.Log("Message d'info");
Debug.LogWarning("Message d'avertissement");
Debug.LogError("Message d'erreur");
```

### Compilation Conditionnelle

Utilisez la compilation conditionnelle pour le code de débogage :

```csharp
#if UNITY_EDITOR
    Debug.Log("Message de débogage uniquement éditeur");
#endif

[Conditional("UNITY_EDITOR")]
private void DebugMethod()
{
    Debug.Log("Méthode uniquement éditeur");
}
```

### Debug Draw

Utilisez Gizmos pour le débogage visuel :

```csharp
private void OnDrawGizmos()
{
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere(transform.position, attackRange);
}
```

## Tests

### Tests en Mode Play

Testez la fonctionnalité en Mode Play :
- Vérifiez les interactions de composants
- Testez les mécaniques de jeu
- Validez le comportement de la physique

### Tests Unitaires

Utilisez Unity Test Framework pour les tests unitaires :
- Testez la logique métier
- Testez les fonctions utilitaires
- Testez les structures de données

## Documentation

### Commentaires XML

Documentez les APIs publiques :

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

### Commentaires de Code

Commentez la logique complexe :

```csharp
// Calculer les dégâts avec réduction d'armure
// Formule : finalDamage = baseDamage * (1 - armor / (armor + 100))
float finalDamage = baseDamage * (1f - armor / (armor + 100f));
```

## Contrôle de Version

### Fréquence de Commit

Commitez fréquemment avec des messages significatifs :
- Petits commits ciblés
- Messages de commit clairs
- Changements liés ensemble

### Stratégie de Branches

Suivez la stratégie de branches de l'équipe (voir [Git Workflow](../shared/git-workflow/)).

## Collaboration

### Fusion de Scènes

Coordonnez les changements de scènes :
- Utilisez des prefabs au lieu de l'édition directe de scène quand c'est possible
- Communiquez les modifications de scènes
- Utilisez Unity Collaborate ou Plastic SCM pour un meilleur support de fusion

### Workflows de Prefabs

- Travaillez sur les prefabs, pas les instances de scène
- Utilisez les variantes de prefabs pour les variations
- Testez les prefabs isolément

## Sécurité

### Validation des Entrées

Validez toutes les entrées utilisateur :

```csharp
public void SetPlayerName(string name)
{
    if (string.IsNullOrEmpty(name))
    {
        Debug.LogError("Le nom du joueur ne peut pas être vide");
        return;
    }
    
    if (name.Length > 20)
    {
        Debug.LogError("Le nom du joueur est trop long");
        return;
    }
    
    playerName = name;
}
```

### Stockage de Données Sécurisé

Utilisez le stockage sécurisé pour les données sensibles :
- Chiffrez les fichiers de sauvegarde
- Ne stockez pas de données sensibles dans PlayerPrefs
- Validez les données au chargement

## Accessibilité

### Accessibilité UI

- Utilisez des polices claires et lisibles
- Fournissez un contraste de couleurs suffisant
- Supportez la navigation au clavier
- Ajoutez des tooltips et du texte d'aide

### Accessibilité des Entrées

- Supportez plusieurs méthodes d'entrée
- Fournissez le remappage d'entrées
- Supportez les technologies d'assistance

## Réutilisabilité du Code

### Classes Utilitaires

Créez des classes utilitaires réutilisables :

```csharp
public static class MathUtils
{
    public static float Remap(float value, float fromMin, float fromMax, float toMin, float toMax)
    {
        return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
    }
}
```

### Composants Partagés

Extrayez les composants partagés :
- Éléments UI communs
- Mécaniques de jeu réutilisables
- Utilitaires partagés

## Résumé

- Utilisez SceneManager pour le chargement de scènes
- Utilisez les prefabs pour les objets répétés
- Gardez les composants ciblés sur une responsabilité unique
- Vérifiez toujours les références null
- Utilisez le logging de débogage approprié
- Documentez les APIs publiques
- Commitez fréquemment avec des messages clairs
- Coordonnez les changements de scènes avec l'équipe
- Validez toutes les entrées utilisateur
- Créez des utilitaires et composants réutilisables

