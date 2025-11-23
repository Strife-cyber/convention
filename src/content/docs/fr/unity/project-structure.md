---
title: Structure de Projet
description: Organisation des dossiers, structure des scènes et organisation des prefabs pour les projets Unity.
---

# Structure de Projet

Cette page documente l'organisation standard des dossiers et la structure pour les projets Unity. Une structure de projet bien organisée améliore la maintenabilité et la collaboration.

## Structure des Répertoires

```
Assets/
├── Scripts/
│   ├── Core/
│   │   ├── Managers/
│   │   ├── Services/
│   │   └── Utilities/
│   ├── Features/
│   │   ├── Player/
│   │   ├── Enemy/
│   │   └── UI/
│   └── Editor/
├── Prefabs/
│   ├── Characters/
│   │   ├── Player/
│   │   └── Enemies/
│   ├── UI/
│   │   ├── Buttons/
│   │   └── Panels/
│   └── Environment/
│       ├── Props/
│       └── Buildings/
├── Scenes/
│   ├── Core/
│   │   ├── MainMenu.unity
│   │   └── LoadingScene.unity
│   └── Levels/
│       ├── Level01.unity
│       └── Level02.unity
├── Materials/
│   ├── Characters/
│   ├── Environment/
│   └── UI/
├── Textures/
│   ├── Characters/
│   ├── Environment/
│   └── UI/
├── Models/
│   ├── Characters/
│   ├── Environment/
│   └── Props/
├── Audio/
│   ├── Music/
│   ├── SFX/
│   └── Voice/
├── Animations/
│   ├── Characters/
│   └── UI/
├── Resources/
└── StreamingAssets/
```

## Organisation des Scripts

Les scripts sont organisés par fonctionnalité et feature. Cette structure supporte l'architecture basée sur les composants tout en gardant le code lié ensemble.

### Répertoire Core

Le répertoire `Scripts/Core/` contient le code fondamental utilisé dans tout le projet :

- **Managers/** : Managers singleton (GameManager, AudioManager, etc.)
- **Services/** : Classes de service (SaveService, AnalyticsService, etc.)
- **Utilities/** : Classes helper et méthodes d'extension

```
Scripts/Core/
├── Managers/
│   ├── GameManager.cs
│   ├── AudioManager.cs
│   └── SceneManager.cs
├── Services/
│   ├── SaveService.cs
│   └── AnalyticsService.cs
└── Utilities/
    ├── MathUtils.cs
    ├── StringExtensions.cs
    └── VectorExtensions.cs
```

### Répertoire Features

Le répertoire `Scripts/Features/` contient les scripts spécifiques aux features organisés par feature :

```
Scripts/Features/
├── Player/
│   ├── PlayerController.cs
│   ├── PlayerHealth.cs
│   └── PlayerInventory.cs
├── Enemy/
│   ├── EnemyController.cs
│   ├── EnemyAI.cs
│   └── EnemySpawner.cs
└── UI/
    ├── HealthBar.cs
    ├── ScoreDisplay.cs
    └── MenuController.cs
```

### Répertoire Editor

Le répertoire `Scripts/Editor/` contient les scripts d'éditeur et les inspecteurs personnalisés :

```
Scripts/Editor/
├── CustomInspectors/
│   └── PlayerControllerEditor.cs
└── Tools/
    └── LevelBuilder.cs
```

**Note :** Les scripts d'éditeur doivent être dans un dossier nommé `Editor` pour être exclus des builds.

## Organisation des Scènes

### Structure de Scène

Les scènes doivent être organisées par objectif :

- **Core/** : Scènes essentielles (MainMenu, LoadingScene, Settings)
- **Levels/** : Niveaux de gameplay
- **Tests/** : Scènes de test pour le développement

### Hiérarchie de Scène

Maintenez une structure de hiérarchie cohérente dans les scènes :

```
Scene Root
├── Managers (GameObject vide pour les scripts manager)
├── Environment
│   ├── Terrain
│   └── Props
├── Characters
│   ├── Player
│   └── NPCs
├── UI
│   └── Canvas
└── Lighting
    └── Directional Light
```

### Nommage des Scènes

- Utilisez PascalCase : `MainMenu.unity`, `Level01.unity`
- Soyez descriptif : `SettingsMenu.unity` pas `Scene2.unity`
- Utilisez une numérotation cohérente pour les niveaux : `Level01`, `Level02`, etc.

## Organisation des Prefabs

Les prefabs doivent être organisés par catégorie et sous-catégorie :

```
Prefabs/
├── Characters/
│   ├── Player/
│   │   ├── Player.prefab
│   │   └── Player_Variant.prefab
│   └── Enemies/
│       ├── Enemy_Basic.prefab
│       └── Enemy_Elite.prefab
├── UI/
│   ├── Buttons/
│   │   ├── Button_Primary.prefab
│   │   └── Button_Secondary.prefab
│   └── Panels/
│       └── Panel_Menu.prefab
└── Environment/
    ├── Props/
    │   └── Prop_Crate.prefab
    └── Buildings/
        └── Building_House.prefab
```

### Variantes de Prefabs

Utilisez les variantes de prefabs pour les variations du même prefab de base :

- Base : `Enemy_Basic.prefab`
- Variantes : `Enemy_Basic_Fast.prefab`, `Enemy_Basic_Strong.prefab`

## Organisation des Assets

### Matériaux

Organisez les matériaux par catégorie d'utilisation :

```
Materials/
├── Characters/
│   ├── Player_Material.mat
│   └── Enemy_Material.mat
├── Environment/
│   ├── Ground_Material.mat
│   └── Wall_Material.mat
└── UI/
    └── Button_Material.mat
```

### Textures

Organisez les textures pour correspondre à l'organisation des matériaux :

```
Textures/
├── Characters/
│   ├── Player_Diffuse.png
│   └── Player_Normal.png
├── Environment/
│   └── Ground_Diffuse.png
└── UI/
    └── Button_Background.png
```

**Convention de Nommage :** Utilisez des noms descriptifs avec des suffixes :
- `_Diffuse`, `_Normal`, `_Roughness`, `_Metallic` pour les textures PBR
- `_Albedo`, `_Specular` pour les textures legacy

### Modèles

Organisez les modèles 3D par catégorie :

```
Models/
├── Characters/
│   ├── Player.fbx
│   └── Enemy.fbx
├── Environment/
│   ├── Buildings/
│   └── Props/
└── Vehicles/
```

### Audio

Organisez les fichiers audio par type :

```
Audio/
├── Music/
│   ├── MainTheme.mp3
│   └── BattleTheme.mp3
├── SFX/
│   ├── UI/
│   │   └── ButtonClick.wav
│   └── Gameplay/
│       └── Jump.wav
└── Voice/
    └── Dialog/
```

## Dossier Resources

Le dossier `Resources/` permet de charger les assets à l'exécution en utilisant `Resources.Load()`. **Utiliser avec parcimonie** car cela augmente la taille du build.

### Quand Utiliser Resources

- Assets qui doivent être chargés dynamiquement à l'exécution
- Assets qui ne peuvent pas être référencés directement (par exemple, contenu généré procéduralement)

### Quand NE PAS Utiliser Resources

- Assets référencés directement dans les scènes ou prefabs
- La plupart des assets de jeu (utiliser des références directes à la place)

### Organisation

Si vous devez utiliser Resources, organisez par feature :

```
Resources/
├── Prefabs/
│   └── Enemy_Basic.prefab
└── Audio/
    └── SFX/
        └── Explosion.wav
```

**Meilleure Pratique :** Minimisez l'utilisation du dossier Resources. Préférez les références directes ou ScriptableObjects.

## Dossier StreamingAssets

Le dossier `StreamingAssets/` contient les assets qui sont copiés dans le build tel quel et peuvent être accédés à l'exécution.

### Cas d'Utilisation

- Fichiers de configuration (JSON, XML)
- Asset bundles
- Fichiers qui doivent être modifiés à l'exécution

### Organisation

```
StreamingAssets/
├── Config/
│   └── game_config.json
└── AssetBundles/
    └── characters.unity3d
```

## Considérations de Contrôle de Version

### .gitignore

Utilisez un `.gitignore` approprié pour les projets Unity. Exclusions essentielles :

```
[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/
*.csproj
*.unityproj
*.sln
*.suo
*.user
*.userprefs
*.pidb
*.booproj
*.svd
*.pdb
*.mdb
*.opendb
*.VC.db
```

### Git LFS

Utilisez Git LFS pour les gros fichiers binaires :

```
# .gitattributes
*.psd filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
```

**Fichiers à suivre avec LFS :**
- Textures (PNG, JPG, TGA)
- Modèles 3D (FBX, OBJ)
- Fichiers audio (WAV, MP3)
- Fichiers vidéo (MP4)
- Fichiers Photoshop (PSD)

### Fusion de Scènes

Les scènes Unity sont des fichiers YAML mais peuvent être difficiles à fusionner. Meilleures pratiques :

- Utilisez des prefabs au lieu de l'édition directe de scène quand c'est possible
- Coordonnez les changements de scène avec les membres de l'équipe
- Utilisez Unity Collaborate ou Plastic SCM pour un meilleur support de fusion

## Meilleures Pratiques

1. **Gardez-le organisé dès le début** : Établissez la structure tôt
2. **Soyez cohérent** : Suivez le même pattern d'organisation partout
3. **Utilisez des noms descriptifs** : Rendez clair ce que contient chaque dossier
4. **Évitez l'imbrication profonde** : Gardez la profondeur des dossiers raisonnable (3-4 niveaux max)
5. **Groupez les assets liés** : Gardez les assets utilisés ensemble dans la même zone
6. **Documentez les exceptions** : Si vous déviez de la structure, documentez pourquoi


