---
title: Asset Management
description: Asset organization, import settings, and version control for Unity projects.
---

# Asset Management

This page documents standards for managing assets, import settings, and version control in Unity projects.

## Asset Organization

Organize assets in a clear, consistent folder structure (see [Project Structure](./project-structure/) for details).

### Asset Naming

Use consistent naming conventions:
- **PascalCase** for most assets: `PlayerMaterial.mat`, `EnemyTexture.png`
- **Descriptive names**: `Player_Diffuse.png` not `texture1.png`
- **Suffixes for variants**: `Button_Primary.prefab`, `Button_Secondary.prefab`

## Import Settings

### Texture Import Settings

Configure textures based on usage:

**For UI Sprites:**
- Texture Type: `Sprite (2D and UI)`
- Max Size: 2048 or 4096 (based on need)
- Compression: `None` for UI, `Normal` for game sprites
- Generate Mip Maps: `Off` for UI

**For 3D Textures:**
- Texture Type: `Default`
- Max Size: Based on target platform
- Compression: Platform-specific
- Generate Mip Maps: `On` for 3D textures

**For Normal Maps:**
- Texture Type: `Normal map`
- Compression: `Normal map` compression
- sRGB: `Off`

### Model Import Settings

Configure models appropriately:

**Scale Factor:**
- Set based on source (usually 0.01 for Blender, 1.0 for Maya)

**Mesh Compression:**
- Use `Off` for important models
- Use `Low` or `Medium` for less critical models

**Animation Settings:**
- Compression: `Optimal` for most cases
- Clips: Organize animation clips clearly

### Audio Import Settings

Configure audio based on type:

**For Music:**
- Load Type: `Streaming`
- Compression Format: `Vorbis` (quality 70-80%)
- Force to Mono: `Off`

**For SFX:**
- Load Type: `Decompress On Load` or `Compressed In Memory`
- Compression Format: `Vorbis` (quality 50-70%)
- Force to Mono: `On` for 3D sounds

## Asset Dependencies

### Understanding Dependencies

- Materials depend on textures
- Prefabs depend on models, materials, scripts
- Scenes depend on prefabs, materials, scripts

### Avoiding Circular Dependencies

Avoid circular references:
- Don't create prefabs that reference each other directly
- Use ScriptableObjects for shared data
- Use events for communication instead of direct references

## Version Control

### .gitignore

Use proper `.gitignore` for Unity:

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

**Setup:**
```bash
git lfs install
```

**Track files:**
```text
# .gitattributes
*.psd filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.tga filter=lfs diff=lfs merge=lfs -text
*.exr filter=lfs diff=lfs merge=lfs -text
```

**Files to track with LFS:**
- Textures (PNG, JPG, TGA, EXR)
- 3D models (FBX, OBJ)
- Audio files (WAV, MP3, OGG)
- Video files (MP4)
- Photoshop files (PSD)
- Large binary files (> 100MB)

## Asset Bundles

### When to Use Asset Bundles

Use asset bundles for:
- Downloadable content (DLC)
- Platform-specific assets
- Reducing initial build size
- Dynamic content loading

### Asset Bundle Organization

Organize asset bundles logically:
- By feature: `characters.unity3d`, `environment.unity3d`
- By platform: `android_textures.unity3d`, `ios_textures.unity3d`
- By scene: `level01.unity3d`, `level02.unity3d`

## Resources Folder

### When to Use Resources

Use `Resources/` folder sparingly:
- Assets that must be loaded at runtime by string name
- Procedurally generated content
- Dynamic asset loading

### Alternatives to Resources

Prefer:
- Direct references in scripts
- ScriptableObjects
- Asset bundles
- Addressables system

**Why avoid Resources:**
- Increases build size
- Slower loading
- Harder to manage

## Best Practices

1. **Organize Early**: Set up folder structure from the start
2. **Consistent Naming**: Use consistent naming conventions
3. **Proper Import Settings**: Configure import settings appropriately
4. **Use Git LFS**: Track large binary files with Git LFS
5. **Avoid Resources**: Minimize use of Resources folder
6. **Asset Bundles**: Use asset bundles for downloadable content
7. **Regular Cleanup**: Remove unused assets regularly
8. **Document Exceptions**: Document any deviations from standards
