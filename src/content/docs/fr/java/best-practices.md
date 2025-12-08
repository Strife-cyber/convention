---
title: Bonnes Pratiques
description: Design patterns, principes SOLID, tests, documentation et bonnes pratiques générales en Java.
---

# Bonnes Pratiques

Cette page couvre les bonnes pratiques générales en Java incluant design patterns, principes SOLID, tests, documentation et organisation du code.

## Design Patterns

Les design patterns sont des solutions réutilisables à des problèmes courants de conception logicielle. Ils sont catégorisés en trois types principaux : patterns de **création**, **structurels** et **comportementaux**.

### Patterns de Création

Les patterns de création fournissent des solutions pour l'instanciation d'objets dans des situations spécifiques.

#### Pattern Singleton

Le pattern Singleton garantit qu'une classe n'a qu'une seule instance et fournit un point d'accès global à cette instance. Il est utile pour la journalisation, la mise en cache, les pools de threads et les paramètres de configuration.

**Deux formes :**
- **Instanciation anticipée** : Instance créée au moment du chargement de la classe
- **Instanciation paresseuse** : Instance créée si nécessaire

**Avantages :**
- Économise la mémoire en réutilisant une seule instance
- Fournit un accès contrôlé à une instance unique

```java
// Bon : Singleton thread-safe avec instanciation paresseuse
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    
    private DatabaseConnection() {
        // Constructeur privé empêche l'instanciation
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
    
    public void connect() {
        // Logique de connexion
    }
}

// Bon : Singleton enum (préféré - thread-safe par défaut)
public enum DatabaseConnection {
    INSTANCE;
    
    public void connect() {
        // Logique de connexion
    }
}
```

#### Pattern Factory Method

Le pattern Factory Method définit une interface ou une classe abstraite pour créer des objets, mais laisse les sous-classes décider quelle classe instancier. Il favorise le couplage lâche.

**Avantages :**
- Permet aux sous-classes de choisir le type d'objets à créer
- Favorise le couplage lâche
- Élimine le besoin de lier des classes spécifiques dans le code

```java
// Bon : Pattern Factory Method
public interface Animal {
    void makeSound();
}

public class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof");
    }
}

public class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}

// Classe factory abstraite
public abstract class AnimalFactory {
    public abstract Animal createAnimal();
    
    public void displayAnimal() {
        Animal animal = createAnimal();
        animal.makeSound();
    }
}

// Factories concrètes
public class DogFactory extends AnimalFactory {
    @Override
    public Animal createAnimal() {
        return new Dog();
    }
}
```

#### Pattern Abstract Factory

Le pattern Abstract Factory fournit une interface pour créer des familles d'objets liés sans spécifier leurs classes concrètes. C'est un pattern de niveau supérieur au Factory Method.

```java
// Bon : Pattern Abstract Factory
public interface Button {
    void render();
}

public interface Checkbox {
    void render();
}

// Famille Windows
public class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendu bouton Windows");
    }
}

// Factory abstraite
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}
```

#### Pattern Builder

Le pattern Builder construit des objets complexes étape par étape. Il est utile lorsque l'objet ne peut pas être créé en une seule étape.

```java
// Bon : Pattern Builder
public class User {
    private String firstName;
    private String lastName;
    private int age;
    
    private User(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
    }
    
    public static class Builder {
        private String firstName;
        private String lastName;
        private int age;
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// Utilisation
User user = new User.Builder()
    .firstName("John")
    .lastName("Doe")
    .age(30)
    .build();
```

#### Pattern Prototype

Le pattern Prototype crée des objets en clonant des instances existantes plutôt qu'en créant de nouveaux. Utile lorsque la création d'objets est coûteuse.

```java
// Bon : Pattern Prototype
public interface Cloneable {
    Cloneable clone();
}

public class User implements Cloneable {
    private String name;
    private String email;
    
    @Override
    public User clone() {
        return new User(this.name, this.email);
    }
}
```

#### Pattern Object Pool

Le pattern Object Pool réutilise des objets coûteux à créer. Il maintient un pool d'objets qui peuvent être empruntés et retournés.

```java
// Bon : Pattern Object Pool
public class ConnectionPool {
    private final Queue<Connection> pool = new LinkedList<>();
    
    public Connection borrow() {
        Connection conn = pool.poll();
        if (conn == null) {
            conn = createConnection();
        }
        return conn;
    }
    
    public void returnConnection(Connection conn) {
        if (conn != null) {
            pool.offer(conn);
        }
    }
}
```

### Patterns Structurels

Les patterns structurels traitent de la composition d'objets et fournissent des moyens de former des structures plus grandes à partir d'objets individuels.

#### Pattern Adapter

Le pattern Adapter convertit l'interface d'une classe en une autre interface attendue par les clients. Il permet à des classes avec des interfaces incompatibles de travailler ensemble.

```java
// Bon : Pattern Adapter
public interface MediaPlayer {
    void play(String audioType, String fileName);
}

public class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;
    
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer = new VlcPlayer();
        }
    }
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer.playVlc(fileName);
        }
    }
}
```

#### Pattern Decorator

Le pattern Decorator attache dynamiquement des responsabilités supplémentaires à un objet. Il utilise la composition au lieu de l'héritage pour étendre les fonctionnalités.

```java
// Bon : Pattern Decorator
public interface Coffee {
    double getCost();
    String getDescription();
}

public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public double getCost() {
        return super.getCost() + 0.5;
    }
}
```

#### Pattern Facade

Le pattern Facade fournit une interface unifiée et simplifiée à un ensemble d'interfaces dans un sous-système, masquant les complexités du sous-système aux clients.

```java
// Bon : Pattern Facade
public class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public void startComputer() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}
```

#### Pattern Proxy

Le pattern Proxy fournit un substitut ou un espace réservé pour un autre objet afin de contrôler l'accès à celui-ci. Utile pour le chargement paresseux et le contrôle d'accès.

```java
// Bon : Pattern Proxy
public class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;
    
    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(fileName); // Chargement paresseux
        }
        realImage.display();
    }
}
```

### Patterns Comportementaux

Les patterns comportementaux se concentrent sur la communication entre objets et la façon dont ils opèrent ensemble.

#### Pattern Observer

Le pattern Observer établit une dépendance un-à-plusieurs entre objets de sorte que lorsqu'un objet change d'état, tous les objets dépendants sont notifiés automatiquement. Aussi connu sous le nom de pattern Publish-Subscribe.

**Composants :**
- **Sujet (Observable)** : Objet qui détient l'information et maintient une liste d'observateurs
- **Observateur** : Objet qui veut être notifié des mises à jour

**Avantages :**
- Couplage lâche entre sujet et observateurs
- Supporte la communication de type diffusion
- Facile d'ajouter ou retirer des observateurs

```java
// Bon : Pattern Observer
public interface Observer {
    void update(String message);
}

public class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;
    
    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(news);
        }
    }
    
    public void setNews(String news) {
        this.news = news;
        notifyObservers();
    }
}

public class NewsChannel implements Observer {
    @Override
    public void update(String message) {
        System.out.println("Reçu: " + message);
    }
}
```

#### Pattern State

Le pattern State permet à un objet de modifier son comportement lorsque son état interne change. Chaque état est encapsulé dans une classe distincte.

**Composants :**
- **Contexte** : Classe qui maintient une référence à l'état actuel
- **État** : Interface ou classe abstraite définissant les méthodes d'état
- **État concret** : Classes implémentant un comportement d'état spécifique

**Avantages :**
- Conserve le comportement spécifique à l'état organisé
- Rend toutes les transitions d'état explicites
- Élimine les grandes instructions conditionnelles

**Cas d'utilisation :**
- Lorsque le comportement de l'objet dépend de son état
- Lorsque les opérations ont de grandes instructions conditionnelles basées sur l'état

```java
// Bon : Pattern State
public interface DocumentState {
    void publish(Document document);
    void archive(Document document);
}

public class DraftState implements DocumentState {
    @Override
    public void publish(Document document) {
        System.out.println("Publication du document depuis le brouillon");
        document.setState(new PublishedState());
    }
    
    @Override
    public void archive(Document document) {
        System.out.println("Impossible d'archiver un brouillon");
    }
}

public class PublishedState implements DocumentState {
    @Override
    public void publish(Document document) {
        System.out.println("Document déjà publié");
    }
    
    @Override
    public void archive(Document document) {
        System.out.println("Archivage du document publié");
        document.setState(new ArchivedState());
    }
}
```

#### Pattern Strategy

Le pattern Strategy définit une famille d'algorithmes, encapsule chacun d'eux et les rend interchangeables. Il laisse l'algorithme varier indépendamment des clients qui l'utilisent.

```java
// Bon : Pattern Strategy
public interface PaymentStrategy {
    void pay(double amount);
}

public class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Paiement de " + amount + " par carte de crédit");
    }
}

public class PaymentProcessor {
    private PaymentStrategy strategy;
    
    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void processPayment(double amount) {
        strategy.pay(amount);
    }
}
```

#### Pattern Chain of Responsibility

Le pattern Chain of Responsibility donne à plusieurs objets une chance de traiter une requête, évitant de coupler l'expéditeur à un récepteur spécifique.

```java
// Bon : Pattern Chain of Responsibility
public abstract class Handler {
    protected Handler nextHandler;
    
    public void setNext(Handler handler) {
        this.nextHandler = handler;
    }
    
    public abstract void handleRequest(int amount);
}

public class ManagerHandler extends Handler {
    @Override
    public void handleRequest(int amount) {
        if (amount <= 1000) {
            System.out.println("Manager approuve: " + amount);
        } else if (nextHandler != null) {
            nextHandler.handleRequest(amount);
        }
    }
}
```

#### Pattern Command

Le pattern Command encapsule une requête comme un objet, permettant la paramétrisation des clients avec différentes requêtes, la mise en file d'attente des requêtes et l'enregistrement des opérations.

```java
// Bon : Pattern Command
public interface Command {
    void execute();
    void undo();
}

public class LightOnCommand implements Command {
    private Light light;
    
    @Override
    public void execute() {
        light.turnOn();
    }
    
    @Override
    public void undo() {
        light.turnOff();
    }
}
```

#### Pattern Template Method

Le pattern Template Method définit le squelette d'un algorithme dans une opération, en reportant certaines étapes aux sous-classes. Il laisse les sous-classes redéfinir certaines étapes sans changer la structure de l'algorithme.

```java
// Bon : Pattern Template Method
public abstract class DataProcessor {
    // Méthode template
    public final void process() {
        readData();
        processData();
        saveData();
    }
    
    protected abstract void readData();
    protected abstract void processData();
    
    protected void saveData() {
        System.out.println("Sauvegarde des données");
    }
}
```

#### Pattern Mediator

Le pattern Mediator définit un objet qui encapsule la façon dont un ensemble d'objets interagissent. Il favorise le couplage lâche en gardant les objets de se référer explicitement les uns aux autres.

```java
// Bon : Pattern Mediator
public interface Mediator {
    void sendMessage(String message, Colleague colleague);
}

public class ConcreteMediator implements Mediator {
    @Override
    public void sendMessage(String message, Colleague colleague) {
        // Gère la communication entre collègues
    }
}
```

#### Pattern Memento

Le pattern Memento capture et externalise l'état interne d'un objet afin qu'il puisse être restauré plus tard, sans violer l'encapsulation.

```java
// Bon : Pattern Memento
public class Memento {
    private final String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

public class Originator {
    private String state;
    
    public Memento saveStateToMemento() {
        return new Memento(state);
    }
    
    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}
```

## Guide de Sélection des Design Patterns

| Pattern | Utiliser Quand |
|---------|----------------|
| **Singleton** | Besoin d'exactement une instance d'une classe |
| **Factory** | Ne sait pas quelle classe concrète instancier |
| **Abstract Factory** | Besoin de familles d'objets liés |
| **Builder** | Construction d'objets complexes |
| **Prototype** | Création d'objets coûteuse |
| **Object Pool** | Objets coûteux à créer et réutiliser |
| **Adapter** | Besoin d'utiliser des interfaces incompatibles |
| **Decorator** | Besoin d'ajouter des responsabilités dynamiquement |
| **Facade** | Besoin d'interface simplifiée à un sous-système complexe |
| **Proxy** | Besoin de contrôler l'accès à un objet |
| **Observer** | Besoin de notifier plusieurs objets de changements |
| **State** | Comportement de l'objet dépend de son état |
| **Strategy** | Besoin d'algorithmes interchangeables |
| **Chain of Responsibility** | Plusieurs objets peuvent traiter une requête |
| **Command** | Besoin de paramétrer des objets avec des opérations |
| **Template Method** | Structure d'algorithme fixe, étapes variables |
| **Mediator** | Communication complexe entre objets |
| **Memento** | Besoin de sauvegarder/restaurer l'état d'un objet |

## Principes SOLID

### Principe de Responsabilité Unique

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

### Principe Ouvert/Fermé

```java
// Bon : Ouvert pour extension, fermé pour modification
public abstract class Shape {
    public abstract double calculateArea();
}

public class Circle extends Shape {
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

## Tests

### Tests Unitaires avec JUnit

```java
// Bon : Test unitaire
@Test
void testFindUserById() {
    User user = new User("John", "john@example.com");
    when(mockRepository.findById(1L)).thenReturn(Optional.of(user));
    
    Optional<User> result = userService.findById(1L);
    
    assertTrue(result.isPresent());
    assertEquals("John", result.get().getName());
}
```

## Documentation

### JavaDoc

```java
/**
 * Représente un utilisateur dans le système.
 *
 * @param name le nom de l'utilisateur
 * @param email l'email de l'utilisateur
 */
public class User {
    // ...
}
```

## Résumé

- Suivez les principes SOLID
- Utilisez les design patterns appropriés
- Écrivez des tests complets
- Documentez les APIs publiques avec JavaDoc
- Organisez le code en packages logiques
- Validez toutes les entrées
- Utilisez des pratiques de codage sécurisées

