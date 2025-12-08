---
title: Best Practices
description: Design patterns, SOLID principles, testing, documentation, and general best practices in Java.
---

# Best Practices

This page covers general best practices in Java including design patterns, SOLID principles, testing, documentation, and code organization.

## Design Patterns

Design patterns are reusable solutions to common problems in software design. They are categorized into three main types: **Creational**, **Structural**, and **Behavioral** patterns.

### Creational Patterns

Creational patterns provide solutions for object instantiation in specific situations.

#### Singleton Pattern

The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. It's useful for logging, caching, thread pools, and configuration settings.

**Two forms:**
- **Eager initialization**: Instance created at class loading time
- **Lazy initialization**: Instance created when needed

**Advantages:**
- Saves memory by reusing a single instance
- Provides controlled access to a single instance

```java
// Good: Thread-safe singleton with lazy initialization
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    
    private DatabaseConnection() {
        // Private constructor prevents instantiation
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
        // Connection logic
    }
}

// Good: Enum singleton (preferred - thread-safe by default)
public enum DatabaseConnection {
    INSTANCE;
    
    public void connect() {
        // Connection logic
    }
}

// Good: Eager initialization
public class Logger {
    private static final Logger instance = new Logger();
    
    private Logger() {}
    
    public static Logger getInstance() {
        return instance;
    }
    
    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}
```

#### Factory Method Pattern

The Factory Method pattern defines an interface or abstract class for creating objects, but lets subclasses decide which class to instantiate. It promotes loose coupling by eliminating the need to bind application-specific classes in the code.

**Advantages:**
- Allows subclasses to choose the type of objects to create
- Promotes loose coupling
- Eliminates binding of specific classes in code

```java
// Good: Factory Method pattern
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

// Abstract factory class
public abstract class AnimalFactory {
    public abstract Animal createAnimal();
    
    public void displayAnimal() {
        Animal animal = createAnimal();
        animal.makeSound();
    }
}

// Concrete factories
public class DogFactory extends AnimalFactory {
    @Override
    public Animal createAnimal() {
        return new Dog();
    }
}

public class CatFactory extends AnimalFactory {
    @Override
    public Animal createAnimal() {
        return new Cat();
    }
}

// Usage
AnimalFactory factory = new DogFactory();
Animal animal = factory.createAnimal();
animal.makeSound(); // "Woof"

// Good: Simple factory method
public class AnimalFactory {
    public static Animal createAnimal(String type) {
        return switch (type.toLowerCase()) {
            case "dog" -> new Dog();
            case "cat" -> new Cat();
            default -> throw new IllegalArgumentException("Unknown animal type: " + type);
        };
    }
}
```

#### Abstract Factory Pattern

The Abstract Factory pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes. It's a higher-level pattern than Factory Method.

```java
// Good: Abstract Factory pattern
public interface Button {
    void render();
}

public interface Checkbox {
    void render();
}

// Windows family
public class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering Windows button");
    }
}

public class WindowsCheckbox implements Checkbox {
    @Override
    public void render() {
        System.out.println("Rendering Windows checkbox");
    }
}

// MacOS family
public class MacOSButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering MacOS button");
    }
}

public class MacOSCheckbox implements Checkbox {
    @Override
    public void render() {
        System.out.println("Rendering MacOS checkbox");
    }
}

// Abstract factory
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete factories
public class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

public class MacOSFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacOSButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new MacOSCheckbox();
    }
}
```

#### Builder Pattern

The Builder pattern constructs complex objects step by step. It's useful when an object cannot be created in a single step, such as in deserialization of complex objects.

```java
// Good: Builder pattern
public class User {
    private String firstName;
    private String lastName;
    private int age;
    private String email;
    private String phone;
    
    private User(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
        this.email = builder.email;
        this.phone = builder.phone;
    }
    
    public static class Builder {
        private String firstName;
        private String lastName;
        private int age;
        private String email;
        private String phone;
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// Usage
User user = new User.Builder()
    .firstName("John")
    .lastName("Doe")
    .age(30)
    .email("john@example.com")
    .phone("123-456-7890")
    .build();
```

#### Prototype Pattern

The Prototype pattern creates objects by cloning existing instances rather than creating new ones. It's useful when object creation is expensive and resource-intensive.

```java
// Good: Prototype pattern
public interface Cloneable {
    Cloneable clone();
}

public class User implements Cloneable {
    private String name;
    private String email;
    private List<String> permissions;
    
    public User(String name, String email, List<String> permissions) {
        this.name = name;
        this.email = email;
        this.permissions = new ArrayList<>(permissions);
    }
    
    @Override
    public User clone() {
        return new User(this.name, this.email, new ArrayList<>(this.permissions));
    }
    
    // Getters and setters
}

// Usage
User originalUser = new User("John", "john@example.com", List.of("read", "write"));
User clonedUser = originalUser.clone();
```

#### Object Pool Pattern

The Object Pool pattern reuses objects that are expensive to create. It maintains a pool of objects that can be borrowed and returned.

```java
// Good: Object Pool pattern
public class ConnectionPool {
    private final Queue<Connection> pool = new LinkedList<>();
    private final int maxSize;
    
    public ConnectionPool(int maxSize) {
        this.maxSize = maxSize;
        initializePool();
    }
    
    private void initializePool() {
        for (int i = 0; i < maxSize; i++) {
            pool.offer(createConnection());
        }
    }
    
    public Connection borrow() {
        Connection conn = pool.poll();
        if (conn == null) {
            conn = createConnection();
        }
        return conn;
    }
    
    public void returnConnection(Connection conn) {
        if (conn != null && pool.size() < maxSize) {
            pool.offer(conn);
        }
    }
    
    private Connection createConnection() {
        // Create new connection
        return new Connection();
    }
}
```

### Structural Patterns

Structural patterns deal with object composition and provide ways to form larger structures from individual objects.

#### Adapter Pattern

The Adapter pattern converts the interface of a class into another interface that clients expect. It allows classes with incompatible interfaces to work together.

```java
// Good: Adapter pattern
public interface MediaPlayer {
    void play(String audioType, String fileName);
}

public interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

public class VlcPlayer implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }
    
    @Override
    public void playMp4(String fileName) {
        // Do nothing
    }
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

#### Decorator Pattern

The Decorator pattern attaches additional responsibilities to an object dynamically. It uses composition instead of inheritance to extend functionality at runtime.

```java
// Good: Decorator pattern
public interface Coffee {
    double getCost();
    String getDescription();
}

public class SimpleCoffee implements Coffee {
    @Override
    public double getCost() {
        return 2.0;
    }
    
    @Override
    public String getDescription() {
        return "Simple coffee";
    }
}

public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double getCost() {
        return coffee.getCost();
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription();
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
    
    @Override
    public String getDescription() {
        return super.getDescription() + ", milk";
    }
}

// Usage
Coffee coffee = new MilkDecorator(new SimpleCoffee());
System.out.println(coffee.getDescription()); // "Simple coffee, milk"
System.out.println(coffee.getCost()); // 2.5
```

#### Facade Pattern

The Facade pattern provides a unified, simplified interface to a set of interfaces in a subsystem, hiding the subsystem's complexities from clients.

```java
// Good: Facade pattern
public class CPU {
    public void freeze() {
        System.out.println("CPU freeze");
    }
    
    public void jump(long position) {
        System.out.println("CPU jump to position: " + position);
    }
    
    public void execute() {
        System.out.println("CPU execute");
    }
}

public class Memory {
    public void load(long position, byte[] data) {
        System.out.println("Memory load at position: " + position);
    }
}

public class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HardDrive read");
        return new byte[size];
    }
}

// Facade
public class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    public void startComputer() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}

// Usage
ComputerFacade computer = new ComputerFacade();
computer.startComputer(); // Simple interface hides complexity
```

#### Proxy Pattern

The Proxy pattern provides a surrogate or placeholder for another object to control access to it. It's useful for lazy loading, access control, and logging.

```java
// Good: Proxy pattern
public interface Image {
    void display();
}

public class RealImage implements Image {
    private String fileName;
    
    public RealImage(String fileName) {
        this.fileName = fileName;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading " + fileName);
    }
    
    @Override
    public void display() {
        System.out.println("Displaying " + fileName);
    }
}

public class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;
    
    public ProxyImage(String fileName) {
        this.fileName = fileName;
    }
    
    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(fileName); // Lazy loading
        }
        realImage.display();
    }
}
```

### Behavioral Patterns

Behavioral patterns focus on communication between objects and how they operate together.

#### Observer Pattern

The Observer pattern establishes a one-to-many dependency between objects so that when one object changes state, all dependent objects are notified automatically. Also known as Publish-Subscribe pattern.

**Components:**
- **Subject (Observable)**: Object that holds information and maintains a list of observers
- **Observer**: Object that wants to be notified of updates

**Advantages:**
- Loose coupling between subject and observers
- Supports broadcast communication
- Easy to add or remove observers

```java
// Good: Observer pattern
public interface Observer {
    void update(String message);
}

public interface Subject {
    void addObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}

public class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;
    
    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
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
    private String name;
    
    public NewsChannel(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println(name + " received: " + message);
    }
}

// Usage
NewsAgency agency = new NewsAgency();
NewsChannel channel1 = new NewsChannel("Channel 1");
NewsChannel channel2 = new NewsChannel("Channel 2");

agency.addObserver(channel1);
agency.addObserver(channel2);
agency.setNews("Breaking news!"); // Both channels notified
```

#### State Pattern

The State pattern allows an object to alter its behavior when its internal state changes. The object will appear to change its class. Each state is encapsulated in a separate class.

**Components:**
- **Context**: Class that maintains a reference to the current state
- **State**: Interface or abstract class defining state methods
- **Concrete State**: Classes implementing specific state behavior

**Advantages:**
- Keeps state-specific behavior organized
- Makes state transitions explicit
- Eliminates large conditional statements

**Use cases:**
- When object behavior depends on its state
- When operations have large conditional statements based on object state

```java
// Good: State pattern
public interface State {
    void handleRequest(Context context);
}

public class Context {
    private State currentState;
    
    public Context() {
        currentState = new ConcreteStateA();
    }
    
    public void setState(State state) {
        this.currentState = state;
    }
    
    public void request() {
        currentState.handleRequest(this);
    }
}

public class ConcreteStateA implements State {
    @Override
    public void handleRequest(Context context) {
        System.out.println("Handling request in State A");
        context.setState(new ConcreteStateB());
    }
}

public class ConcreteStateB implements State {
    @Override
    public void handleRequest(Context context) {
        System.out.println("Handling request in State B");
        context.setState(new ConcreteStateA());
    }
}

// Example: Document states
public interface DocumentState {
    void publish(Document document);
    void archive(Document document);
}

public class DraftState implements DocumentState {
    @Override
    public void publish(Document document) {
        System.out.println("Publishing document from draft");
        document.setState(new PublishedState());
    }
    
    @Override
    public void archive(Document document) {
        System.out.println("Cannot archive draft document");
    }
}

public class PublishedState implements DocumentState {
    @Override
    public void publish(Document document) {
        System.out.println("Document already published");
    }
    
    @Override
    public void archive(Document document) {
        System.out.println("Archiving published document");
        document.setState(new ArchivedState());
    }
}

public class ArchivedState implements DocumentState {
    @Override
    public void publish(Document document) {
        System.out.println("Cannot publish archived document");
    }
    
    @Override
    public void archive(Document document) {
        System.out.println("Document already archived");
    }
}

public class Document {
    private DocumentState state;
    
    public Document() {
        this.state = new DraftState();
    }
    
    public void setState(DocumentState state) {
        this.state = state;
    }
    
    public void publish() {
        state.publish(this);
    }
    
    public void archive() {
        state.archive(this);
    }
}
```

#### Strategy Pattern

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.

```java
// Good: Strategy pattern
public interface PaymentStrategy {
    void pay(double amount);
}

public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    
    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using credit card: " + cardNumber);
    }
}

public class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using PayPal: " + email);
    }
}

public class PaymentProcessor {
    private PaymentStrategy strategy;
    
    public PaymentProcessor(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void processPayment(double amount) {
        strategy.pay(amount);
    }
}

// Usage
PaymentProcessor processor = new PaymentProcessor(new CreditCardPayment("1234-5678"));
processor.processPayment(100.0);
processor.setStrategy(new PayPalPayment("user@example.com"));
processor.processPayment(50.0);
```

#### Chain of Responsibility Pattern

The Chain of Responsibility pattern gives multiple objects a chance to handle a request, avoiding coupling the sender to a specific receiver.

```java
// Good: Chain of Responsibility pattern
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
            System.out.println("Manager approves: " + amount);
        } else if (nextHandler != null) {
            nextHandler.handleRequest(amount);
        }
    }
}

public class DirectorHandler extends Handler {
    @Override
    public void handleRequest(int amount) {
        if (amount <= 5000) {
            System.out.println("Director approves: " + amount);
        } else if (nextHandler != null) {
            nextHandler.handleRequest(amount);
        }
    }
}

public class CEOHandler extends Handler {
    @Override
    public void handleRequest(int amount) {
        System.out.println("CEO approves: " + amount);
    }
}

// Usage
Handler manager = new ManagerHandler();
Handler director = new DirectorHandler();
Handler ceo = new CEOHandler();

manager.setNext(director);
director.setNext(ceo);

manager.handleRequest(500);   // Manager approves
manager.handleRequest(2000);  // Director approves
manager.handleRequest(10000); // CEO approves
```

#### Command Pattern

The Command pattern encapsulates a request as an object, allowing parameterization of clients with different requests, queuing of requests, and logging of operations.

```java
// Good: Command pattern
public interface Command {
    void execute();
    void undo();
}

public class Light {
    public void turnOn() {
        System.out.println("Light is ON");
    }
    
    public void turnOff() {
        System.out.println("Light is OFF");
    }
}

public class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOn();
    }
    
    @Override
    public void undo() {
        light.turnOff();
    }
}

public class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
    
    public void pressUndo() {
        command.undo();
    }
}
```

#### Template Method Pattern

The Template Method pattern defines the skeleton of an algorithm in an operation, deferring some steps to subclasses. It lets subclasses redefine certain steps without changing the algorithm's structure.

```java
// Good: Template Method pattern
public abstract class DataProcessor {
    // Template method
    public final void process() {
        readData();
        processData();
        saveData();
    }
    
    protected abstract void readData();
    protected abstract void processData();
    
    protected void saveData() {
        System.out.println("Saving data to database");
    }
}

public class CSVDataProcessor extends DataProcessor {
    @Override
    protected void readData() {
        System.out.println("Reading CSV data");
    }
    
    @Override
    protected void processData() {
        System.out.println("Processing CSV data");
    }
}

public class XMLDataProcessor extends DataProcessor {
    @Override
    protected void readData() {
        System.out.println("Reading XML data");
    }
    
    @Override
    protected void processData() {
        System.out.println("Processing XML data");
    }
}
```

#### Mediator Pattern

The Mediator pattern defines an object that encapsulates how a set of objects interact. It promotes loose coupling by keeping objects from referring to each other explicitly.

```java
// Good: Mediator pattern
public interface Mediator {
    void sendMessage(String message, Colleague colleague);
}

public abstract class Colleague {
    protected Mediator mediator;
    
    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }
    
    public abstract void receive(String message);
    public abstract void send(String message);
}

public class ConcreteMediator implements Mediator {
    private Colleague colleague1;
    private Colleague colleague2;
    
    public void setColleague1(Colleague colleague) {
        this.colleague1 = colleague;
    }
    
    public void setColleague2(Colleague colleague) {
        this.colleague2 = colleague;
    }
    
    @Override
    public void sendMessage(String message, Colleague colleague) {
        if (colleague == colleague1) {
            colleague2.receive(message);
        } else {
            colleague1.receive(message);
        }
    }
}

public class ConcreteColleague1 extends Colleague {
    public ConcreteColleague1(Mediator mediator) {
        super(mediator);
    }
    
    @Override
    public void receive(String message) {
        System.out.println("Colleague1 received: " + message);
    }
    
    @Override
    public void send(String message) {
        mediator.sendMessage(message, this);
    }
}
```

#### Memento Pattern

The Memento pattern captures and externalizes an object's internal state so it can be restored later, without violating encapsulation.

```java
// Good: Memento pattern
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
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    public Memento saveStateToMemento() {
        return new Memento(state);
    }
    
    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

public class Caretaker {
    private List<Memento> mementoList = new ArrayList<>();
    
    public void add(Memento memento) {
        mementoList.add(memento);
    }
    
    public Memento get(int index) {
        return mementoList.get(index);
    }
}
```

## Design Pattern Selection Guide

| Pattern | Use When |
|---------|----------|
| **Singleton** | Need exactly one instance of a class |
| **Factory** | Don't know which concrete class to instantiate |
| **Abstract Factory** | Need families of related objects |
| **Builder** | Complex object construction |
| **Prototype** | Object creation is expensive |
| **Object Pool** | Objects are expensive to create and reuse |
| **Adapter** | Need to use incompatible interfaces |
| **Decorator** | Need to add responsibilities dynamically |
| **Facade** | Need simplified interface to complex subsystem |
| **Proxy** | Need to control access to an object |
| **Observer** | Need to notify multiple objects of changes |
| **State** | Object behavior depends on its state |
| **Strategy** | Need interchangeable algorithms |
| **Chain of Responsibility** | Multiple objects can handle a request |
| **Command** | Need to parameterize objects with operations |
| **Template Method** | Algorithm structure is fixed, steps vary |
| **Mediator** | Complex communication between objects |
| **Memento** | Need to save/restore object state |

## SOLID Principles

### Single Responsibility Principle

```java
// Good: Single responsibility
public class User {
    private String name;
    private String email;
    // Only user data
}

public class UserValidator {
    public boolean isValid(User user) {
        // Only validation logic
    }
}

public class UserRepository {
    public void save(User user) {
        // Only persistence logic
    }
}

// Bad: Multiple responsibilities
public class User {
    private String name;
    
    public boolean isValid() {
        // Validation
    }
    
    public void save() {
        // Database logic
    }
    
    public void sendEmail() {
        // Email logic
    }
}
```

### Open/Closed Principle

```java
// Good: Open for extension, closed for modification
public abstract class Shape {
    public abstract double calculateArea();
}

public class Circle extends Shape {
    private double radius;
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}
```

### Liskov Substitution Principle

```java
// Good: Subtypes must be substitutable for their base types
public class Bird {
    public void fly() {
        System.out.println("Flying");
    }
}

public class Sparrow extends Bird {
    @Override
    public void fly() {
        System.out.println("Sparrow flying");
    }
}

// Can use Sparrow wherever Bird is expected
Bird bird = new Sparrow();
bird.fly(); // Works correctly
```

### Interface Segregation Principle

```java
// Good: Small, focused interfaces
public interface Flyable {
    void fly();
}

public interface Swimmable {
    void swim();
}

public class Duck implements Flyable, Swimmable {
    @Override
    public void fly() {
        // Implementation
    }
    
    @Override
    public void swim() {
        // Implementation
    }
}

// Bad: Large interface
public interface Animal {
    void fly();
    void swim();
    void run();
    void crawl();
}
```

### Dependency Inversion Principle

```java
// Good: Depend on abstractions
public interface UserRepository {
    User findById(Long id);
}

public class JpaUserRepository implements UserRepository {
    @Override
    public User findById(Long id) {
        // JPA implementation
    }
}

public class UserService {
    private final UserRepository repository; // Depend on interface
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}

// Bad: Depend on concrete classes
public class UserService {
    private final JpaUserRepository repository; // Depend on concrete class
}
```

## Testing

### Unit Testing with JUnit

```java
// Good: Unit test
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest {
    private UserService userService;
    private UserRepository mockRepository;
    
    @BeforeEach
    void setUp() {
        mockRepository = mock(UserRepository.class);
        userService = new UserService(mockRepository);
    }
    
    @Test
    void testFindUserById() {
        User user = new User("John", "john@example.com");
        when(mockRepository.findById(1L)).thenReturn(Optional.of(user));
        
        Optional<User> result = userService.findById(1L);
        
        assertTrue(result.isPresent());
        assertEquals("John", result.get().getName());
        verify(mockRepository).findById(1L);
    }
    
    @Test
    void testFindUserByIdNotFound() {
        when(mockRepository.findById(1L)).thenReturn(Optional.empty());
        
        Optional<User> result = userService.findById(1L);
        
        assertFalse(result.isPresent());
    }
}
```

### Test-Driven Development (TDD)

```java
// TDD Cycle:
// 1. Write failing test
// 2. Write minimal code to pass
// 3. Refactor

// Example:
@Test
void testCalculateDiscount() {
    // Test first
    double discount = calculator.calculateDiscount(100, 0.1);
    assertEquals(10, discount);
}

// Then implement
public double calculateDiscount(double amount, double rate) {
    return amount * rate;
}
```

## Documentation

### JavaDoc

```java
/**
 * Represents a user in the system.
 * 
 * @author John Doe
 * @version 1.0
 */
public class User {
    /**
     * The user's unique identifier.
     */
    private Long id;
    
    /**
     * The user's full name.
     */
    private String name;
    
    /**
     * Creates a new user with the specified name and email.
     *
     * @param name the user's name, must not be null or empty
     * @param email the user's email address, must be valid
     * @throws IllegalArgumentException if name or email is invalid
     */
    public User(String name, String email) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        this.name = name;
        this.email = email;
    }
    
    /**
     * Gets the user's name.
     *
     * @return the user's name
     */
    public String getName() {
        return name;
    }
}
```

## Code Organization

### Package Structure

```
com.company.project/
├── model/          # Domain models
├── repository/     # Data access
├── service/        # Business logic
├── controller/     # Web controllers
├── dto/            # Data transfer objects
├── exception/      # Custom exceptions
└── util/           # Utility classes
```

### Module Organization

```java
// Good: Clear module separation
// model package
public class User {
    // User entity
}

// repository package
public interface UserRepository {
    // Data access
}

// service package
public class UserService {
    // Business logic
}

// controller package
@RestController
public class UserController {
    // Web layer
}
```

## Version Management

### Java Version

```java
// Good: Specify Java version in build file
// Maven: pom.xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
</properties>

// Gradle: build.gradle
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
```

## Security Best Practices

### Input Validation

```java
// Good: Validate all input
public void setEmail(String email) {
    if (email == null || email.trim().isEmpty()) {
        throw new IllegalArgumentException("Email cannot be null or empty");
    }
    if (!isValidEmail(email)) {
        throw new IllegalArgumentException("Invalid email format");
    }
    this.email = email;
}

private boolean isValidEmail(String email) {
    return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
}
```

### Secure Coding

```java
// Good: Use PreparedStatement to prevent SQL injection
String sql = "SELECT * FROM users WHERE email = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, email);

// Bad: String concatenation (SQL injection risk)
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
```

## Summary

- Follow SOLID principles
- Use appropriate design patterns
- Write comprehensive tests
- Document public APIs with JavaDoc
- Organize code in logical packages
- Validate all input
- Use secure coding practices
- Keep classes focused on single responsibility
- Depend on abstractions, not concrete classes
- Write self-documenting code

