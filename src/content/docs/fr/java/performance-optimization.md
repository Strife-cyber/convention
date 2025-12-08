---
title: Optimisation de Performance
description: Gestion mémoire, optimisation CPU, optimisation I/O et bonnes pratiques de performance en Java.
---

# Optimisation de Performance

Cette page couvre les techniques d'optimisation de performance en Java incluant gestion mémoire, optimisation CPU, optimisation I/O et meilleures pratiques.

## Gestion Mémoire

### Optimisation de String

```java
// Mauvais : Concaténation de String dans boucle
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "item" + i; // Crée un nouvel objet String à chaque fois
}

// Bon : Utilisation de StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("item").append(i);
}
String result = sb.toString();
```

### Initialisation de Collections

```java
// Bon : Pré-dimensionner ArrayList
List<String> list = new ArrayList<>(1000);
for (int i = 0; i < 1000; i++) {
    list.add("item" + i); // Pas de redimensionnement nécessaire
}
```

## Optimisation CPU

### Efficacité d'Algorithmes

```java
// Bon : Algorithme O(n)
public boolean containsDuplicates(List<Integer> list) {
    Set<Integer> seen = new HashSet<>();
    for (Integer item : list) {
        if (!seen.add(item)) {
            return true;
        }
    }
    return false;
}
```

## Optimisation I/O

### Buffering

```java
// Bon : Utilisation de BufferedReader
try (BufferedReader reader = new BufferedReader(
        new FileReader("large-file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        processLine(line);
    }
}
```

## Résumé

- Utilisez StringBuilder pour concaténation de String dans boucles
- Pré-dimensionnez les collections quand la taille est connue
- Choisissez les types de collections appropriés
- Utilisez le buffering pour opérations I/O
- Utilisez I/O asynchrone pour meilleur débit

