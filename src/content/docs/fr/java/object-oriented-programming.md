---
title: Programmation Orientée Objet
description: Classes, héritage, interfaces, encapsulation et principes POO en Java.
---

# Programmation Orientée Objet

Cette page couvre les concepts de programmation orientée objet en Java, incluant classes, objets, héritage, interfaces, encapsulation et polymorphisme. Nous suivons les meilleures pratiques POO et principes de conception.

## Classes et Objets

### Définition de Classe

Une classe est un modèle pour créer des objets. Définissez des classes avec des responsabilités claires :

```java
// Bon : Classe bien définie avec objectif clair
public class User {
    private String name;
    private String email;
    private int age;
    
    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public int getAge() {
        return age;
    }
}

// Mauvais : Classe avec objectif peu clair ou trop de responsabilités
public class User {
    // Trop de responsabilités mélangées
    public void sendEmail() {}
    public void saveToDatabase() {}
    public void validate() {}
    public void processPayment() {}
}
```

### Instanciation d'Objets

Créez des objets en utilisant le mot-clé `new` :

```java
// Bon : Création d'objets
User user = new User("John Doe", "john@example.com", 30);
List<String> names = new ArrayList<>();
Date currentDate = new Date();

// Bon : Utilisation de méthodes factory
String value = String.valueOf(123);
List<String> list = List.of("a", "b", "c");

// Mauvais : Création d'objets sans initialisation appropriée
User user = new User(); // Si pas de constructeur par défaut, ne compilera pas
```

### Constructeurs

Les constructeurs initialisent les objets. Utilisez-les pour définir les champs requis :

```java
// Bon : Constructeur avec paramètres requis
public class User {
    private final String name;
    private final String email;
    private int age;
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public User(String name, String email, int age) {
        this(name, email); // Appeler un autre constructeur
        this.age = age;
    }
}

// Bon : Pattern Builder pour objets complexes
public class User {
    private String name;
    private String email;
    private int age;
    
    private User() {} // Constructeur privé
    
    public static class Builder {
        private User user = new User();
        
        public Builder name(String name) {
            user.name = name;
            return this;
        }
        
        public Builder email(String email) {
            user.email = email;
            return this;
        }
        
        public Builder age(int age) {
            user.age = age;
            return this;
        }
        
        public User build() {
            return user;
        }
    }
}

// Utilisation :
User user = new User.Builder()
    .name("John")
    .email("john@example.com")
    .age(30)
    .build();
```

## Encapsulation

L'encapsulation est le regroupement de données et de méthodes qui opèrent sur ces données dans une seule unité (classe).

### Modificateurs d'Accès

Utilisez les modificateurs d'accès pour contrôler la visibilité :

```java
// Bon : Utilisation appropriée des modificateurs d'accès
public class BankAccount {
    private double balance; // Privé - accessible uniquement dans la classe
    private String accountNumber;
    
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    public double getBalance() { // Getter public
        return balance;
    }
    
    public void deposit(double amount) { // Méthode publique
        if (amount > 0) {
            balance += amount;
        }
    }
    
    private void logTransaction(String type, double amount) { // Helper privé
        // Logger la transaction
    }
}

// Mauvais : Exposer l'implémentation interne
public class BankAccount {
    public double balance; // Devrait être privé
    public String accountNumber; // Devrait être privé
    // Pas de validation, accès direct au balance
}
```

### Getters et Setters

Utilisez les getters et setters pour contrôler l'accès aux champs :

```java
// Bon : Getters et setters appropriés
public class User {
    private String name;
    private String email;
    private int age;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }
}

// Bon : Classe immuable avec seulement des getters
public class Point {
    private final int x;
    private final int y;
    
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public int getX() {
        return x;
    }
    
    public int getY() {
        return y;
    }
    // Pas de setters - classe immuable
}
```

## Héritage

L'héritage permet à une classe d'hériter des propriétés et méthodes d'une autre classe.

### Extension de Classes

Utilisez le mot-clé `extends` pour l'héritage :

```java
// Bon : Hiérarchie d'héritage appropriée
public class Animal {
    protected String name;
    protected int age;
    
    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void eat() {
        System.out.println(name + " mange");
    }
}

public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age); // Appeler le constructeur parent
        this.breed = breed;
    }
    
    public void bark() {
        System.out.println(name + " aboie");
    }
    
    @Override
    public void eat() {
        super.eat(); // Appeler la méthode parent
        System.out.println(name + " mange de la nourriture pour chien");
    }
}
```

### Le Mot-Clé `super`

Utilisez `super` pour accéder aux membres de la classe parent :

```java
// Bon : Utilisation appropriée de super
public class Vehicle {
    protected String brand;
    
    public Vehicle(String brand) {
        this.brand = brand;
    }
    
    public void start() {
        System.out.println(brand + " démarre");
    }
}

public class Car extends Vehicle {
    private int numberOfDoors;
    
    public Car(String brand, int numberOfDoors) {
        super(brand); // Appeler le constructeur parent
        this.numberOfDoors = numberOfDoors;
    }
    
    @Override
    public void start() {
        super.start(); // Appeler la méthode parent
        System.out.println("La voiture a " + numberOfDoors + " portes");
    }
}
```

## Interfaces

Les interfaces définissent des contrats que les classes doivent implémenter.

### Définition d'Interface

Définissez des interfaces pour spécifier le comportement :

```java
// Bon : Interfaces bien définies
public interface Drawable {
    void draw();
    void resize(double factor);
}

public interface Movable {
    void move(int x, int y);
    Point getPosition();
}

// Bon : Implémentation de multiples interfaces
public class Rectangle implements Drawable, Movable {
    private Point position;
    
    @Override
    public void draw() {
        System.out.println("Dessiner un rectangle");
    }
    
    @Override
    public void resize(double factor) {
        // Logique de redimensionnement
    }
    
    @Override
    public void move(int x, int y) {
        position = new Point(x, y);
    }
    
    @Override
    public Point getPosition() {
        return position;
    }
}
```

### Méthodes par Défaut (Java 8+)

Utilisez les méthodes par défaut pour fournir des implémentations par défaut :

```java
// Bon : Méthodes par défaut dans les interfaces
public interface Logger {
    void log(String message);
    
    default void logInfo(String message) {
        log("INFO: " + message);
    }
    
    default void logError(String message) {
        log("ERROR: " + message);
    }
}
```

## Classes Abstraites

Les classes abstraites fournissent des implémentations partielles et ne peuvent pas être instanciées.

### Définition de Classe Abstraite

```java
// Bon : Classe abstraite avec implémentation partielle
public abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    // Méthode concrète
    public void eat() {
        System.out.println(name + " mange");
    }
    
    // Méthode abstraite - doit être implémentée par les sous-classes
    public abstract void makeSound();
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " aboie");
    }
}
```

## Polymorphisme

Le polymorphisme permet de traiter des objets de types différents comme des objets d'un type de base commun.

### Polymorphisme à l'Exécution

```java
// Bon : Polymorphisme en action
public class Shape {
    public void draw() {
        System.out.println("Dessiner une forme");
    }
}

public class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("Dessiner un cercle");
    }
}

// Utilisation
Shape shape1 = new Circle();
shape1.draw(); // "Dessiner un cercle"

// Bon : Polymorphisme avec collections
List<Shape> shapes = new ArrayList<>();
shapes.add(new Circle());
shapes.add(new Rectangle());

for (Shape shape : shapes) {
    shape.draw(); // Appelle la méthode draw() appropriée
}
```

## Meilleures Pratiques

### Composition plutôt qu'Héritage

Préférez la composition à l'héritage quand possible :

```java
// Bon : Utilisation de la composition
public class Car {
    private Engine engine;
    private Wheel[] wheels;
    
    public Car(Engine engine, Wheel[] wheels) {
        this.engine = engine;
        this.wheels = wheels;
    }
}
```

### Principe de Responsabilité Unique

Chaque classe devrait avoir une seule raison de changer :

```java
// Bon : Responsabilité unique
public class User {
    private String name;
    private String email;
    // Seulement les données utilisateur
}

public class UserValidator {
    public boolean isValid(User user) {
        // Seulement la logique de validation
    }
}
```

## Résumé

- Utilisez les classes pour modéliser des entités du monde réel
- Encapsulez les données avec des champs privés et des méthodes publiques
- Utilisez l'héritage pour les relations "est-un"
- Utilisez les interfaces pour définir des contrats
- Préférez la composition à l'héritage
- Suivez le principe de responsabilité unique
- Utilisez le polymorphisme pour un code flexible
- Remplacez les méthodes avec l'annotation @Override

