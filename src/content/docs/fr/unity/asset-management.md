---
title: Gestion des Assets
description: Organisation des assets, paramètres d'import et contrôle de version pour les projets Unity.
---

# Gestion des Assets

Cette page documente les standards de gestion des assets, paramètres d'import et contrôle de version dans les projets Unity.

## Organisation des Assets

Organisez les assets dans une structure de dossiers claire et cohérente (voir [Structure de Projet](./project-structure/) pour les détails).

### Nommage des Assets

Utilisez des conventions de nommage cohérentes :
- **PascalCase** pour la plupart des assets : `PlayerMaterial.mat`, `EnemyTexture.png`
- **Noms descriptifs** : `Player_Diffuse.png` pas `texture1.png`
- **Suffixes pour les variantes** : `Button_Primary.prefab`, `Button_Secondary.prefab`

## Paramètres d'Import

### Paramètres d'Import de Textures

Configurez les textures selon l'utilisation :

**Pour les Sprites UI :**
- Type de Texture : `Sprite (2D and UI)`
- Taille Max : 2048 ou 4096 (selon le besoin)
- Compression : `None` pour l'UI, `Normal` pour les sprites de jeu
- Générer Mip Maps : `Off` pour l'UI

**Pour les Textures 3D :**
- Type de Texture : `Default`
- Taille Max : Selon la plateforme cible
- Compression : Spécifique à la plateforme
- Générer Mip Maps : `On` pour les textures 3D

**Pour les Normal Maps :**
- Type de Texture : `Normal map`
- Compression : Compression `Normal map`
- sRGB : `Off`

### Paramètres d'Import de Modèles

Configurez les modèles de manière appropriée :

**Facteur d'Échelle :**
- Définir selon la source (généralement 0.01 pour Blender, 1.0 pour Maya)

**Compression de Mesh :**
- Utiliser `Off` pour les modèles importants
- Utiliser `Low` ou `Medium` pour les modèles moins critiques

**Paramètres d'Animation :**
- Compression : `Optimal` pour la plupart des cas
- Clips : Organiser les clips d'animation clairement

### Paramètres d'Import Audio

Configurez l'audio selon le type :

**Pour la Musique :**
- Type de Chargement : `Streaming`
- Format de Compression : `Vorbis` (qualité 70-80%)
- Forcer en Mono : `Off`

**Pour les SFX :**
- Type de Chargement : `Decompress On Load` ou `Compressed In Memory`
- Format de Compression : `Vorbis` (qualité 50-70%)
- Forcer en Mono : `On` pour les sons 3D

## Dépendances des Assets

### Comprendre les Dépendances

- Les matériaux dépendent des textures
- Les prefabs dépendent des modèles, matériaux, scripts
- Les scènes dépendent des prefabs, matériaux, scripts

### Éviter les Dépendances Circulaires

Évitez les références circulaires :
- Ne créez pas de prefabs qui se référencent directement
- Utilisez ScriptableObjects pour les données partagées
- Utilisez les événements pour la communication au lieu de références directes

## Contrôle de Version

### .gitignore

Utilisez un `.gitignore` approprié pour Unity :

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

**Configuration :**
```bash
git lfs install
```

**Suivre les fichiers :**
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

**Fichiers à suivre avec LFS :**
- Textures (PNG, JPG, TGA, EXR)
- Modèles 3D (FBX, OBJ)
- Fichiers audio (WAV, MP3, OGG)
- Fichiers vidéo (MP4)
- Fichiers Photoshop (PSD)
- Gros fichiers binaires (> 100MB)

## Asset Bundles

### Quand Utiliser les Asset Bundles

Utilisez les asset bundles pour :
- Contenu téléchargeable (DLC)
- Assets spécifiques à la plateforme
- Réduire la taille initiale du build
- Chargement dynamique de contenu

### Organisation des Asset Bundles

Organisez les asset bundles logiquement :
- Par feature : `characters.unity3d`, `environment.unity3d`
- Par plateforme : `android_textures.unity3d`, `ios_textures.unity3d`
- Par scène : `level01.unity3d`, `level02.unity3d`

## Dossier Resources

### Quand Utiliser Resources

Utilisez le dossier `Resources/` avec parcimonie :
- Assets qui doivent être chargés à l'exécution par nom de chaîne
- Contenu généré procéduralement
- Chargement dynamique d'assets

### Alternatives à Resources

Préférez :
- Références directes dans les scripts
- ScriptableObjects
- Asset bundles
- Système Addressables

**Pourquoi éviter Resources :**
- Augmente la taille du build
- Chargement plus lent
- Plus difficile à gérer

## Meilleures Pratiques

1. **Organiser Tôt** : Configurez la structure de dossiers dès le début
2. **Nommage Cohérent** : Utilisez des conventions de nommage cohérentes
3. **Paramètres d'Import Appropriés** : Configurez les paramètres d'import de manière appropriée
4. **Utiliser Git LFS** : Suivez les gros fichiers binaires avec Git LFS
5. **Éviter Resources** : Minimisez l'utilisation du dossier Resources
6. **Asset Bundles** : Utilisez les asset bundles pour le contenu téléchargeable
7. **Nettoyage Régulier** : Supprimez les assets inutilisés régulièrement
8. **Documenter les Exceptions** : Documentez toute déviation des standards
