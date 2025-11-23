---
title: Project Structure
description: Folder organization, scene structure, and prefab organization for Unity projects.
---

# Project Structure

This page documents the standard folder organization and structure for Unity projects. A well-organized project structure improves maintainability and collaboration.

## Directory Structure

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

## Scripts Organization

Scripts are organized by functionality and feature. This structure supports component-based architecture while keeping related code together.

### Core Directory

The `Scripts/Core/` directory contains foundational code used across the entire project:

- **Managers/**: Singleton managers (GameManager, AudioManager, etc.)
- **Services/**: Service classes (SaveService, AnalyticsService, etc.)
- **Utilities/**: Helper classes and extension methods

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

### Features Directory

The `Scripts/Features/` directory contains feature-specific scripts organized by feature:

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

### Editor Directory

The `Scripts/Editor/` directory contains editor scripts and custom inspectors:

```
Scripts/Editor/
├── CustomInspectors/
│   └── PlayerControllerEditor.cs
└── Tools/
    └── LevelBuilder.cs
```

**Note:** Editor scripts must be in a folder named `Editor` to be excluded from builds.

## Scene Organization

### Scene Structure

Scenes should be organized by purpose:

- **Core/**: Essential scenes (MainMenu, LoadingScene, Settings)
- **Levels/**: Gameplay levels
- **Tests/**: Test scenes for development

### Scene Hierarchy

Maintain a consistent hierarchy structure in scenes:

```
Scene Root
├── Managers (empty GameObject for manager scripts)
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

### Scene Naming

- Use PascalCase: `MainMenu.unity`, `Level01.unity`
- Be descriptive: `SettingsMenu.unity` not `Scene2.unity`
- Use consistent numbering for levels: `Level01`, `Level02`, etc.

## Prefab Organization

Prefabs should be organized by category and subcategory:

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

### Prefab Variants

Use prefab variants for variations of the same base prefab:

- Base: `Enemy_Basic.prefab`
- Variants: `Enemy_Basic_Fast.prefab`, `Enemy_Basic_Strong.prefab`

## Asset Organization

### Materials

Organize materials by usage category:

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

Organize textures to match material organization:

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

**Naming Convention:** Use descriptive names with suffixes:
- `_Diffuse`, `_Normal`, `_Roughness`, `_Metallic` for PBR textures
- `_Albedo`, `_Specular` for legacy textures

### Models

Organize 3D models by category:

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

Organize audio files by type:

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

## Resources Folder

The `Resources/` folder allows loading assets at runtime using `Resources.Load()`. **Use sparingly** as it increases build size.

### When to Use Resources

- Assets that must be loaded dynamically at runtime
- Assets that can't be referenced directly (e.g., procedurally generated content)

### When NOT to Use Resources

- Assets referenced directly in scenes or prefabs
- Most game assets (use direct references instead)

### Organization

If you must use Resources, organize by feature:

```
Resources/
├── Prefabs/
│   └── Enemy_Basic.prefab
└── Audio/
    └── SFX/
        └── Explosion.wav
```

**Best Practice:** Minimize use of Resources folder. Prefer direct references or ScriptableObjects.

## StreamingAssets Folder

The `StreamingAssets/` folder contains assets that are copied to the build as-is and can be accessed at runtime.

### Use Cases

- Configuration files (JSON, XML)
- Asset bundles
- Files that need to be modified at runtime

### Organization

```
StreamingAssets/
├── Config/
│   └── game_config.json
└── AssetBundles/
    └── characters.unity3d
```

## Version Control Considerations

### .gitignore

Use a proper `.gitignore` for Unity projects. Essential exclusions:

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

Use Git LFS for large binary files:

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

**Files to track with LFS:**
- Textures (PNG, JPG, TGA)
- 3D models (FBX, OBJ)
- Audio files (WAV, MP3)
- Video files (MP4)
- Photoshop files (PSD)

### Scene Merging

Unity scenes are YAML files but can be difficult to merge. Best practices:

- Use prefabs instead of direct scene editing when possible
- Coordinate scene changes with team members
- Use Unity Collaborate or Plastic SCM for better merge support

## Best Practices

1. **Keep it organized from the start**: Establish structure early
2. **Be consistent**: Follow the same organization pattern throughout
3. **Use descriptive names**: Make it clear what each folder contains
4. **Avoid deep nesting**: Keep folder depth reasonable (3-4 levels max)
5. **Group related assets**: Keep assets used together in the same area
6. **Document exceptions**: If you deviate from the structure, document why

