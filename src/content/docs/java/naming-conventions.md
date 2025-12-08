---
title: Naming Conventions
description: File, class, method, and variable naming standards for Java projects.
---

# Naming Conventions

This page documents the naming conventions for Java code, files, classes, methods, and variables. We follow the official [Java Naming Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html) and industry best practices.

## Packages

Use **lowercase** letters with words separated by dots. Package names should be unique and follow the reverse domain name convention.

```java
// Good: Reverse domain name convention
package com.company.project.module;
package org.apache.commons.lang3;
package net.example.service.user;

// Bad: Uppercase or mixed case
package Com.Company.Project; // Should be lowercase
package com.Company.project; // Should be all lowercase
```

**Best Practices:**
- Use your company's reverse domain name as prefix
- Keep package names short and meaningful
- Avoid abbreviations unless widely understood
- Use singular nouns for package names

```java
// Good examples
package com.acme.banking.account;
package com.acme.banking.transaction;
package com.acme.banking.util;

// Bad examples
package com.acme.banking.accounts; // Use singular
package com.acme.banking.Account; // No uppercase
package com.acme.bkng.acc; // Avoid abbreviations
```

## Classes

Use **PascalCase** (also called UpperCamelCase) for class names. Class names should be nouns and clearly describe what the class represents.

```java
// Good: PascalCase, descriptive nouns
public class UserProfile {}
public class AuthenticationService {}
public class DatabaseConnection {}
public class HttpRequestHandler {}

// Bad: Wrong case or unclear names
public class userProfile {} // Should be PascalCase
public class authentication_service {} // Should be PascalCase, no underscores
public class Data {} // Too generic
public class UserProfileManagerService {} // Too verbose
```

**Examples:**

```java
// Good: Clear, descriptive class names
public class CustomerRepository {}
public class PaymentProcessor {}
public class EmailValidator {}
public class ShoppingCart {}
public class OrderItem {}

// Bad: Unclear or poorly named classes
public class Manager {} // Too generic
public class ProcessData {} // Should be a noun
public class user {} // Wrong case
public class Customer_Repository {} // No underscores
```

## Interfaces

Use **PascalCase** for interface names. Interfaces are often named with adjectives (ending in -able, -ible) or nouns describing capabilities.

```java
// Good: Descriptive interface names
public interface Runnable {}
public interface Serializable {}
public interface UserRepository {}
public interface PaymentProcessor {}
public interface EventListener {}

// Bad: Wrong naming
public interface runnable {} // Should be PascalCase
public interface IUserRepository {} // Avoid Hungarian notation
public interface userRepository {} // Wrong case
```

**Common Patterns:**

```java
// Capability interfaces (often end with -able, -ible)
public interface Comparable<T> {}
public interface Iterable<T> {}
public interface Readable {}
public interface Writable {}

// Service interfaces
public interface UserService {}
public interface EmailService {}
public interface PaymentService {}

// Repository interfaces
public interface UserRepository {}
public interface OrderRepository {}

// Listener interfaces (often end with -Listener)
public interface ActionListener {}
public interface EventListener {}
public interface ChangeListener {}
```

## Methods

Use **camelCase** for method names. Method names should be verbs or verb phrases that clearly indicate what the method does.

```java
// Good: camelCase, verb-based names
public void calculateTotal() {}
public String getUserName() {}
public boolean isValidEmail(String email) {}
public void processPayment(Payment payment) {}

// Bad: Wrong case or unclear names
public void CalculateTotal() {} // Should be camelCase
public String get_user_name() {} // Should be camelCase, no underscores
public void process() {} // Too generic
public void data() {} // Should be a verb
```

**Examples:**

```java
// Good: Clear, verb-based method names
public class UserService {
    public User findUserById(Long id) {}
    public void saveUser(User user) {}
    public boolean deleteUser(Long id) {}
    public List<User> findAllUsers() {}
    public void updateUserEmail(Long id, String email) {}
    public boolean isUserActive(User user) {}
    public void sendWelcomeEmail(User user) {}
}

// Bad: Poorly named methods
public class UserService {
    public User user(Long id) {} // Should be a verb
    public void data(User user) {} // Unclear purpose
    public boolean check() {} // Too generic
    public List<User> get() {} // Too generic
    public void processUserDataAndSaveToDatabase(User user) {} // Too verbose
}
```

**Boolean Methods:**

Boolean methods should be named with a verb or adjective that clearly indicates true/false.

```java
// Good: Clear boolean method names
public boolean isEmpty() {}
public boolean hasPermission() {}
public boolean canEdit() {}
public boolean isValid() {}
public boolean isEnabled() {}
public boolean shouldRetry() {}

// Bad: Unclear boolean names
public boolean empty() {} // Should be isEmpty()
public boolean permission() {} // Not clear it's a boolean
public boolean check() {} // Too generic
```

## Variables

Use **camelCase** for variable names (both instance and local variables). Variable names should be nouns or noun phrases that clearly describe what they represent.

```java
// Good: camelCase, descriptive names
String userName = "John";
int itemCount = 0;
List<Product> productList = new ArrayList<>();
boolean isActive = true;
User currentUser = null;

// Bad: Wrong case or unclear names
String UserName = "John"; // Should be camelCase
String user_name = "John"; // Should be camelCase, no underscores
String u = "John"; // Too short, not descriptive
String data = "John"; // Too generic
```

**Examples:**

```java
// Good: Clear, descriptive variable names
public class OrderProcessor {
    private double totalAmount;
    private int itemCount;
    private List<OrderItem> orderItems;
    private Customer customer;
    private Date orderDate;
    private boolean isProcessed;
    
    public void processOrder() {
        double taxAmount = calculateTax();
        double shippingCost = getShippingCost();
        String orderNumber = generateOrderNumber();
    }
}

// Bad: Poorly named variables
public class OrderProcessor {
    private double ta; // Too abbreviated
    private int c; // Unclear
    private List<OrderItem> list; // Too generic
    private Customer c; // Single letter
    private Date d; // Unclear
    private boolean flag; // Too generic
}
```

**Loop Variables:**

Use short, meaningful names for loop variables. Common conventions:
- `i`, `j`, `k` for simple counters
- More descriptive names for enhanced for loops

```java
// Good: Appropriate loop variable names
for (int i = 0; i < items.size(); i++) {
    // Simple counter
}

for (int row = 0; row < matrix.length; row++) {
    for (int col = 0; col < matrix[row].length; col++) {
        // Descriptive names for nested loops
    }
}

for (User user : users) {
    // Descriptive name in enhanced for loop
}

for (Map.Entry<String, Integer> entry : map.entrySet()) {
    // Descriptive name for map entries
}

// Bad: Unclear loop variables
for (int x = 0; x < items.size(); x++) {
    // x is less clear than i for simple counters
}

for (User u : users) {
    // Single letter in enhanced for loop
}
```

## Constants

Use **UPPER_SNAKE_CASE** (all uppercase with underscores) for constants. Constants are typically `static final` fields.

```java
// Good: UPPER_SNAKE_CASE for constants
public static final int MAX_RETRY_COUNT = 3;
public static final String DEFAULT_USER_NAME = "Guest";
public static final double PI = 3.14159;
public static final String API_BASE_URL = "https://api.example.com";

// Bad: Wrong case for constants
public static final int maxRetryCount = 3; // Should be UPPER_SNAKE_CASE
public static final String DEFAULT_USERNAME = "Guest"; // Inconsistent
public static final double pi = 3.14159; // Should be uppercase
```

**Examples:**

```java
// Good: Well-named constants
public class Configuration {
    public static final int MAX_CONNECTIONS = 100;
    public static final int DEFAULT_TIMEOUT = 30;
    public static final String DATABASE_URL = "jdbc:mysql://localhost:3306/mydb";
    public static final String API_VERSION = "v1";
    public static final String[] SUPPORTED_LANGUAGES = {"en", "fr", "es"};
}

// Bad: Poorly named constants
public class Configuration {
    public static final int maxConnections = 100; // Should be uppercase
    public static final int MaxConnections = 100; // Should be UPPER_SNAKE_CASE
    public static final int MAXCONNECTIONS = 100; // Should use underscores
}
```

**Enum Constants:**

Enum constants should be in **UPPER_SNAKE_CASE** (same as regular constants).

```java
// Good: UPPER_SNAKE_CASE for enum constants
public enum UserRole {
    ADMIN,
    MODERATOR,
    REGULAR_USER,
    GUEST_USER
}

public enum OrderStatus {
    PENDING,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

// Bad: Wrong case for enum constants
public enum UserRole {
    admin, // Should be uppercase
    Moderator, // Should be UPPER_SNAKE_CASE
    regularUser // Should be UPPER_SNAKE_CASE
}
```

## Parameters

Use **camelCase** for parameter names, following the same rules as variables.

```java
// Good: Clear parameter names
public void processOrder(Order order, Customer customer) {}
public User findUserById(Long userId) {}
public boolean isValidEmail(String emailAddress) {}

// Bad: Unclear parameter names
public void processOrder(Order o, Customer c) {} // Too short
public User findUserById(Long id) {} // Could be clearer as userId
public boolean isValidEmail(String email) {} // Actually good, but emailAddress is clearer
```

## Generic Type Parameters

Use single, uppercase letters for generic type parameters. Common conventions:
- `T` for Type
- `E` for Element
- `K` for Key
- `V` for Value
- `N` for Number
- `R` for Return type

```java
// Good: Single uppercase letters
public class Repository<T> {}
public interface List<E> {}
public class Map<K, V> {}
public <T> T process(T item) {}
public <R> R execute(Supplier<R> supplier) {}

// Bad: Verbose or lowercase type parameters
public class Repository<Type> {} // Too verbose
public interface List<element> {} // Should be uppercase
public class Map<Key, Value> {} // Use single letters
```

## Acronyms and Abbreviations

When using acronyms in names, capitalize all letters if it's 2-3 letters, otherwise treat it as a word.

```java
// Good: Acronym handling
public class HttpRequest {} // HTTP -> Http (treat as word)
public class XmlParser {} // XML -> Xml (treat as word)
public class ApiClient {} // API -> Api (treat as word)
public class UserId {} // ID -> Id (treat as word)

// For 2-3 letter acronyms, can be all caps
public class URLBuilder {} // OK
public class HTMLParser {} // OK

// Bad: Inconsistent acronym handling
public class HTTPRequest {} // Inconsistent with HttpRequest
public class XMLParser {} // Inconsistent with XmlParser
public class API_CLIENT {} // Wrong case entirely
```

## File Names

Java source files should be named after the primary class they contain, using **PascalCase** with `.java` extension.

```java
// File: UserService.java
public class UserService {
    // ...
}

// File: OrderProcessor.java
public class OrderProcessor {
    // ...
}

// File: DatabaseConnection.java
public class DatabaseConnection {
    // ...
}
```

**Important:** The file name must exactly match the public class name (case-sensitive).

## Summary

| Type | Convention | Example |
|------|-----------|---------|
| Packages | lowercase | `com.company.module` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `Runnable`, `UserRepository` |
| Methods | camelCase | `getUserName()` |
| Variables | camelCase | `userName` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Enum constants | UPPER_SNAKE_CASE | `ADMIN`, `REGULAR_USER` |
| Parameters | camelCase | `userId`, `emailAddress` |
| Type parameters | Single uppercase | `T`, `E`, `K`, `V` |
| Files | PascalCase.java | `UserService.java` |

## Best Practices

1. **Be Descriptive**: Names should clearly indicate purpose and meaning
2. **Avoid Abbreviations**: Use full words unless abbreviation is widely understood
3. **Use Consistent Terminology**: Use the same terms throughout the codebase
4. **Avoid Hungarian Notation**: Don't prefix types (e.g., `strName`, `intCount`)
5. **Keep Names Concise**: But not at the expense of clarity
6. **Use Domain Language**: Use terms from the problem domain when appropriate
7. **Avoid Single Letters**: Except for loop counters and generic type parameters

