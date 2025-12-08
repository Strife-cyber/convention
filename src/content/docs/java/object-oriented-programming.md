---
title: Object-Oriented Programming
description: Classes, inheritance, interfaces, encapsulation, and OOP principles in Java.
---

# Object-Oriented Programming

This page covers object-oriented programming concepts in Java, including classes, objects, inheritance, interfaces, encapsulation, and polymorphism. We follow OOP best practices and design principles.

## Classes and Objects

### Class Definition

A class is a blueprint for creating objects. Define classes with clear responsibilities:

```java
// Good: Well-defined class with clear purpose
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

// Bad: Class with unclear purpose or too many responsibilities
public class User {
    // Too many responsibilities mixed together
    public void sendEmail() {}
    public void saveToDatabase() {}
    public void validate() {}
    public void processPayment() {}
}
```

### Object Instantiation

Create objects using the `new` keyword:

```java
// Good: Creating objects
User user = new User("John Doe", "john@example.com", 30);
List<String> names = new ArrayList<>();
Date currentDate = new Date();

// Good: Using factory methods
String value = String.valueOf(123);
List<String> list = List.of("a", "b", "c");

// Bad: Creating objects without proper initialization
User user = new User(); // If no default constructor, this won't compile
```

### Constructors

Constructors initialize objects. Use them to set required fields:

```java
// Good: Constructor with required parameters
public class User {
    private final String name;
    private final String email;
    private int age;
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public User(String name, String email, int age) {
        this(name, email); // Call another constructor
        this.age = age;
    }
}

// Good: Builder pattern for complex objects
public class User {
    private String name;
    private String email;
    private int age;
    
    private User() {} // Private constructor
    
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

// Usage:
User user = new User.Builder()
    .name("John")
    .email("john@example.com")
    .age(30)
    .build();

// Bad: Too many constructors or unclear initialization
public class User {
    public User() {}
    public User(String name) {}
    public User(String name, String email) {}
    public User(String name, String email, int age) {}
    public User(String name, String email, int age, String phone) {}
    // Too many constructors - use builder pattern
}
```

## Encapsulation

Encapsulation is the bundling of data and methods that operate on that data within a single unit (class).

### Access Modifiers

Use access modifiers to control visibility:

```java
// Good: Proper use of access modifiers
public class BankAccount {
    private double balance; // Private - only accessible within class
    private String accountNumber;
    
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    public double getBalance() { // Public getter
        return balance;
    }
    
    public void deposit(double amount) { // Public method
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public void withdraw(double amount) { // Public method
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }
    
    private void logTransaction(String type, double amount) { // Private helper
        // Log transaction
    }
}

// Bad: Exposing internal implementation
public class BankAccount {
    public double balance; // Should be private
    public String accountNumber; // Should be private
    
    // No validation, direct access to balance
}
```

### Getters and Setters

Use getters and setters to control access to fields:

```java
// Good: Proper getters and setters
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
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        if (isValidEmail(email)) {
            this.email = email;
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
    
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}

// Good: Immutable class with only getters
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
    
    // No setters - class is immutable
}

// Bad: Public fields or setters without validation
public class User {
    public String name; // Should be private with getter/setter
    public int age; // Should validate age range
    
    public void setAge(int age) {
        this.age = age; // No validation
    }
}
```

## Inheritance

Inheritance allows a class to inherit properties and methods from another class.

### Extending Classes

Use `extends` keyword for inheritance:

```java
// Good: Proper inheritance hierarchy
public class Animal {
    protected String name;
    protected int age;
    
    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age); // Call parent constructor
        this.breed = breed;
    }
    
    public void bark() {
        System.out.println(name + " is barking");
    }
    
    @Override
    public void eat() {
        super.eat(); // Call parent method
        System.out.println(name + " is eating dog food");
    }
}

public class Cat extends Animal {
    public Cat(String name, int age) {
        super(name, age);
    }
    
    public void meow() {
        System.out.println(name + " is meowing");
    }
}

// Bad: Deep inheritance hierarchy or inappropriate inheritance
public class A {}
public class B extends A {}
public class C extends B {}
public class D extends C {}
public class E extends D {} // Too deep - prefer composition
```

### The `super` Keyword

Use `super` to access parent class members:

```java
// Good: Using super appropriately
public class Vehicle {
    protected String brand;
    protected int speed;
    
    public Vehicle(String brand) {
        this.brand = brand;
        this.speed = 0;
    }
    
    public void start() {
        System.out.println(brand + " is starting");
    }
}

public class Car extends Vehicle {
    private int numberOfDoors;
    
    public Car(String brand, int numberOfDoors) {
        super(brand); // Call parent constructor
        this.numberOfDoors = numberOfDoors;
    }
    
    @Override
    public void start() {
        super.start(); // Call parent method
        System.out.println("Car has " + numberOfDoors + " doors");
    }
}

// Bad: Not using super when needed
public class Car extends Vehicle {
    public Car(String brand, int numberOfDoors) {
        this.brand = brand; // Should use super(brand)
        this.numberOfDoors = numberOfDoors;
    }
}
```

### Method Overriding

Override methods using `@Override` annotation:

```java
// Good: Proper method overriding
public class Shape {
    public double calculateArea() {
        return 0;
    }
    
    public void draw() {
        System.out.println("Drawing a shape");
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a circle with radius " + radius);
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle " + width + "x" + height);
    }
}

// Bad: Overriding without @Override or incorrect signature
public class Circle extends Shape {
    public double calculateArea(double radius) { // Not overriding - different signature
        return Math.PI * radius * radius;
    }
    
    public double calculatearea() { // Typo - not overriding
        return 0;
    }
}
```

## Interfaces

Interfaces define contracts that classes must implement.

### Interface Definition

Define interfaces to specify behavior:

```java
// Good: Well-defined interfaces
public interface Drawable {
    void draw();
    void resize(double factor);
}

public interface Movable {
    void move(int x, int y);
    Point getPosition();
}

public interface Resizable {
    void resize(double width, double height);
    double getWidth();
    double getHeight();
}

// Good: Implementing multiple interfaces
public class Rectangle implements Drawable, Movable, Resizable {
    private Point position;
    private double width;
    private double height;
    
    @Override
    public void draw() {
        System.out.println("Drawing rectangle");
    }
    
    @Override
    public void resize(double factor) {
        width *= factor;
        height *= factor;
    }
    
    @Override
    public void move(int x, int y) {
        position = new Point(x, y);
    }
    
    @Override
    public Point getPosition() {
        return position;
    }
    
    @Override
    public void resize(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getWidth() {
        return width;
    }
    
    @Override
    public double getHeight() {
        return height;
    }
}

// Bad: Interface with too many methods or unclear purpose
public interface Utility { // Too generic
    void doSomething();
    void doSomethingElse();
    void process();
    void handle();
    void execute();
    // Too many unrelated methods
}
```

### Default Methods (Java 8+)

Use default methods to provide default implementations:

```java
// Good: Default methods in interfaces
public interface Logger {
    void log(String message);
    
    default void logInfo(String message) {
        log("INFO: " + message);
    }
    
    default void logError(String message) {
        log("ERROR: " + message);
    }
}

public class FileLogger implements Logger {
    @Override
    public void log(String message) {
        // Write to file
    }
    // logInfo and logError use default implementations
}

// Bad: Default methods that should be abstract
public interface Processor {
    default void process() {
        // Empty default - should be abstract
    }
}
```

### Functional Interfaces (Java 8+)

Use functional interfaces for lambda expressions:

```java
// Good: Functional interfaces
@FunctionalInterface
public interface Calculator {
    double calculate(double a, double b);
}

// Usage with lambda
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

double result = add.calculate(5, 3); // 8

// Good: Using built-in functional interfaces
Function<String, Integer> stringLength = String::length;
Predicate<String> isEmpty = String::isEmpty;
Consumer<String> printer = System.out::println;
Supplier<String> supplier = () -> "Hello";

// Bad: Non-functional interface marked as functional
@FunctionalInterface
public interface Processor {
    void process();
    void validate(); // Multiple abstract methods - not functional
}
```

## Abstract Classes

Abstract classes provide partial implementations and cannot be instantiated.

### Abstract Class Definition

```java
// Good: Abstract class with partial implementation
public abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    // Concrete method
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    // Abstract method - must be implemented by subclasses
    public abstract void makeSound();
    
    // Abstract method
    public abstract void move();
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " barks");
    }
    
    @Override
    public void move() {
        System.out.println(name + " runs on four legs");
    }
}

public class Bird extends Animal {
    public Bird(String name) {
        super(name);
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " chirps");
    }
    
    @Override
    public void move() {
        System.out.println(name + " flies");
    }
}

// Bad: Abstract class with no abstract methods
public abstract class Utility {
    public void doSomething() {
        // Should be a concrete class or have abstract methods
    }
}
```

### Abstract Classes vs Interfaces

Choose between abstract classes and interfaces:

```java
// Use abstract class when:
// - You want to share code among related classes
// - You have common state (fields)
// - You want to provide partial implementation

public abstract class Vehicle {
    protected String brand;
    protected int speed;
    
    public Vehicle(String brand) {
        this.brand = brand;
    }
    
    public void start() {
        System.out.println(brand + " is starting");
    }
    
    public abstract void accelerate();
}

// Use interface when:
// - You want to define a contract
// - Multiple unrelated classes need to implement the same behavior
// - You want to support multiple inheritance of type

public interface Flyable {
    void fly();
}

public interface Swimmable {
    void swim();
}

public class Duck extends Animal implements Flyable, Swimmable {
    @Override
    public void fly() {
        System.out.println("Duck is flying");
    }
    
    @Override
    public void swim() {
        System.out.println("Duck is swimming");
    }
}
```

## Polymorphism

Polymorphism allows objects of different types to be treated as objects of a common base type.

### Runtime Polymorphism

```java
// Good: Polymorphism in action
public class Shape {
    public void draw() {
        System.out.println("Drawing a shape");
    }
}

public class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}

public class Rectangle extends Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
}

// Usage
Shape shape1 = new Circle();
Shape shape2 = new Rectangle();
Shape shape3 = new Shape();

shape1.draw(); // "Drawing a circle"
shape2.draw(); // "Drawing a rectangle"
shape3.draw(); // "Drawing a shape"

// Good: Polymorphism with collections
List<Shape> shapes = new ArrayList<>();
shapes.add(new Circle());
shapes.add(new Rectangle());
shapes.add(new Triangle());

for (Shape shape : shapes) {
    shape.draw(); // Calls appropriate draw() method
}

// Bad: Not using polymorphism
Circle circle = new Circle();
Rectangle rectangle = new Rectangle();

if (shape instanceof Circle) {
    ((Circle) shape).draw();
} else if (shape instanceof Rectangle) {
    ((Rectangle) shape).draw();
} // Should use polymorphism instead
```

## Best Practices

### Composition over Inheritance

Prefer composition over inheritance when possible:

```java
// Good: Using composition
public class Car {
    private Engine engine;
    private Wheel[] wheels;
    
    public Car(Engine engine, Wheel[] wheels) {
        this.engine = engine;
        this.wheels = wheels;
    }
    
    public void start() {
        engine.start();
    }
}

// Bad: Deep inheritance
public class Vehicle {}
public class MotorVehicle extends Vehicle {}
public class Car extends MotorVehicle {}
public class SportsCar extends Car {}
// Too many levels - prefer composition
```

### Single Responsibility Principle

Each class should have one reason to change:

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
        // Validation logic
    }
    
    public void save() {
        // Database logic
    }
    
    public void sendEmail() {
        // Email logic
    }
    // Too many responsibilities
}
```

## Summary

- Use classes to model real-world entities
- Encapsulate data with private fields and public methods
- Use inheritance for "is-a" relationships
- Use interfaces to define contracts
- Prefer composition over inheritance
- Follow single responsibility principle
- Use polymorphism for flexible code
- Override methods with @Override annotation
- Use abstract classes for partial implementations
- Use interfaces for contracts and multiple inheritance of type

