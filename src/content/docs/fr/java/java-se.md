---
title: Java SE
description: Applications console, manipulation de fichiers, threads, collections et API Streams.
---

# Java SE

Cette page couvre les concepts de Java Standard Edition (SE) incluant applications console, manipulation de fichiers, threads, collections et l'API Streams.

## Applications Console

### Lecture d'Entrée

Utilisez `Scanner` pour lire l'entrée utilisateur :

```java
// Bon : Lecture d'entrée avec Scanner
import java.util.Scanner;

public class ConsoleApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Entrez votre nom : ");
        String name = scanner.nextLine();
        
        System.out.print("Entrez votre âge : ");
        int age = scanner.nextInt();
        
        System.out.println("Bonjour, " + name + "! Vous avez " + age + " ans.");
        
        scanner.close();
    }
}

// Bon : Lecture de différents types
Scanner scanner = new Scanner(System.in);
String line = scanner.nextLine();
int number = scanner.nextInt();
double decimal = scanner.nextDouble();
boolean flag = scanner.nextBoolean();
```

### Arguments de Ligne de Commande

Accédez aux arguments de ligne de commande via le paramètre `args` :

```java
// Bon : Traitement des arguments de ligne de commande
public class ArgsApp {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Aucun argument fourni");
            return;
        }
        
        System.out.println("Nombre d'arguments : " + args.length);
        for (int i = 0; i < args.length; i++) {
            System.out.println("Argument " + i + ": " + args[i]);
        }
    }
}
```

## Manipulation de Fichiers

### Lecture de Fichiers

Utilisez la classe `Files` (Java 7+) pour les opérations de fichiers modernes :

```java
// Bon : Lire toutes les lignes d'un fichier
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

try {
    List<String> lines = Files.readAllLines(Paths.get("data.txt"));
    for (String line : lines) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.err.println("Erreur de lecture : " + e.getMessage());
}

// Bon : Lire un fichier comme chaîne
try {
    String content = Files.readString(Paths.get("data.txt"));
    System.out.println(content);
} catch (IOException e) {
    System.err.println("Erreur : " + e.getMessage());
}

// Bon : Lecture avec BufferedReader pour gros fichiers
try (BufferedReader reader = Files.newBufferedReader(Paths.get("large-file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        processLine(line);
    }
} catch (IOException e) {
    System.err.println("Erreur : " + e.getMessage());
}
```

### Écriture de Fichiers

```java
// Bon : Écrire dans un fichier
try {
    String content = "Bonjour, Monde!";
    Files.writeString(Paths.get("output.txt"), content);
} catch (IOException e) {
    System.err.println("Erreur d'écriture : " + e.getMessage());
}

// Bon : Écrire plusieurs lignes
List<String> lines = List.of("Ligne 1", "Ligne 2", "Ligne 3");
try {
    Files.write(Paths.get("output.txt"), lines);
} catch (IOException e) {
    System.err.println("Erreur : " + e.getMessage());
}
```

## Threads

### Création de Threads

Utilisez la classe `Thread` ou l'interface `Runnable` :

```java
// Bon : Utilisation de l'interface Runnable
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread en cours : " + Thread.currentThread().getName());
    }
}

// Utilisation
Thread thread = new Thread(new MyRunnable());
thread.start();

// Bon : Utilisation d'expression lambda
Thread thread = new Thread(() -> {
    System.out.println("Thread en cours");
});
thread.start();
```

### Synchronisation de Threads

Utilisez le mot-clé `synchronized` pour la sécurité des threads :

```java
// Bon : Méthode synchronisée
public class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

### ExecutorService

Utilisez `ExecutorService` pour gérer les pools de threads :

```java
// Bon : Utilisation d'ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(5);

for (int i = 0; i < 10; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Tâche " + taskId + " en cours");
    });
}

executor.shutdown();
```

## Collections

### List

Utilisez `ArrayList` pour tableaux dynamiques, `LinkedList` pour insertions/suppressions fréquentes :

```java
// Bon : Utilisation d'ArrayList
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

for (String name : names) {
    System.out.println(name);
}
```

### Set

Utilisez `HashSet` pour usage général, `TreeSet` pour ensembles triés :

```java
// Bon : Utilisation de HashSet
Set<String> uniqueNames = new HashSet<>();
uniqueNames.add("Alice");
uniqueNames.add("Bob");
uniqueNames.add("Alice"); // Duplicata - ignoré
```

### Map

Utilisez `HashMap` pour usage général, `TreeMap` pour clés triées :

```java
// Bon : Utilisation de HashMap
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);

Integer aliceAge = ages.get("Alice");
```

## API Streams

### Opérations de Base

```java
// Bon : Filtrage et mapping
List<String> names = List.of("Alice", "Bob", "Charlie", "David");

List<String> longNames = names.stream()
    .filter(name -> name.length() > 4)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## Résumé

- Utilisez `Scanner` pour l'entrée console
- Utilisez la classe `Files` pour les opérations de fichiers modernes
- Utilisez toujours try-with-resources pour les opérations de fichiers
- Utilisez `ExecutorService` pour la gestion de threads
- Synchronisez l'accès aux ressources partagées
- Choisissez le type de collection approprié
- Utilisez l'API Streams pour des opérations de style fonctionnel

