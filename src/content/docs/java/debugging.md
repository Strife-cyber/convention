---
title: Debugging
description: Debugging techniques, error understanding, logging, and troubleshooting in Java.
---

# Debugging

This page covers debugging techniques, understanding errors, logging, and troubleshooting in Java.

## Understanding Stack Traces

### Reading Stack Traces

```java
// Example stack trace
Exception in thread "main" java.lang.NullPointerException
    at com.example.UserService.processUser(UserService.java:25)
    at com.example.Main.main(Main.java:10)

// Reading:
// 1. Exception type: NullPointerException
// 2. Location: UserService.java line 25
// 3. Call chain: Main.main -> UserService.processUser
```

### Common Exceptions

```java
// NullPointerException
String name = null;
int length = name.length(); // Throws NullPointerException

// Fix:
if (name != null) {
    int length = name.length();
}

// ArrayIndexOutOfBoundsException
int[] array = new int[5];
int value = array[10]; // Throws ArrayIndexOutOfBoundsException

// Fix:
if (index >= 0 && index < array.length) {
    int value = array[index];
}

// IllegalArgumentException
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    this.age = age;
}
```

## Logging

### Using SLF4J

```java
// Good: Using SLF4J with Logback
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    public User findUser(Long id) {
        logger.debug("Finding user with id: {}", id);
        
        try {
            User user = repository.findById(id);
            logger.info("User found: {}", user.getName());
            return user;
        } catch (Exception e) {
            logger.error("Error finding user with id: {}", id, e);
            throw e;
        }
    }
}

// Log levels (from least to most severe):
// TRACE - Detailed information
// DEBUG - Debugging information
// INFO - General information
// WARN - Warning messages
// ERROR - Error messages
```

### Logging Best Practices

```java
// Good: Structured logging
logger.info("User {} logged in from IP {}", userId, ipAddress);

// Good: Using appropriate log levels
logger.debug("Processing item: {}", item); // Debug info
logger.info("User {} created", userId); // Important event
logger.warn("High memory usage: {}%", memoryUsage); // Warning
logger.error("Failed to save user", exception); // Error

// Bad: Logging sensitive information
logger.info("User password: {}", password); // Never log passwords

// Bad: String concatenation in logging
logger.debug("Processing item: " + item); // Use parameterized logging
```

## Debugging Tools

### IntelliJ IDEA Debugger

```java
// Setting breakpoints
public void processUser(User user) {
    // Set breakpoint here by clicking left margin
    String name = user.getName();
    int age = user.getAge();
    // Execution pauses here
    processData(name, age);
}

// Debugging features:
// - Step Over (F8): Execute current line
// - Step Into (F7): Enter method call
// - Step Out (Shift+F8): Exit current method
// - Resume (F9): Continue execution
// - Evaluate Expression: Check variable values
```

### Eclipse Debugger

```java
// Similar features to IntelliJ
// - Step Over (F6)
// - Step Into (F5)
// - Step Return (F7)
// - Resume (F8)
```

## Exception Handling

### Proper Exception Handling

```java
// Good: Catching specific exceptions
try {
    User user = repository.findById(id);
} catch (UserNotFoundException e) {
    logger.warn("User not found: {}", id);
    return Optional.empty();
} catch (DataAccessException e) {
    logger.error("Database error", e);
    throw new ServiceException("Error accessing user data", e);
}

// Good: Using try-with-resources
try (Connection conn = getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    // Use resources
} catch (SQLException e) {
    logger.error("Database error", e);
    throw new DataAccessException(e);
}

// Bad: Catching generic Exception
try {
    processData();
} catch (Exception e) {
    // Too broad - catch specific exceptions
}
```

### Custom Exceptions

```java
// Good: Custom exception
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Usage
public User findUser(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
}
```

## Common Debugging Scenarios

### NullPointerException

```java
// Problem: NullPointerException
public void processUser(User user) {
    String name = user.getName(); // user might be null
}

// Solution: Null checks
public void processUser(User user) {
    if (user == null) {
        throw new IllegalArgumentException("User cannot be null");
    }
    String name = user.getName();
}

// Solution: Using Optional
public void processUser(Optional<User> userOpt) {
    userOpt.ifPresent(user -> {
        String name = user.getName();
        // Process user
    });
}
```

### Infinite Loops

```java
// Problem: Infinite loop
while (true) {
    processItem();
    // Missing break condition
}

// Solution: Proper loop condition
boolean shouldContinue = true;
while (shouldContinue) {
    processItem();
    shouldContinue = checkCondition();
}

// Solution: Using for loop
for (int i = 0; i < items.size(); i++) {
    processItem(items.get(i));
}
```

### Memory Leaks

```java
// Problem: Memory leak with listeners
public class EventManager {
    private List<EventListener> listeners = new ArrayList<>();
    
    public void addListener(EventListener listener) {
        listeners.add(listener);
        // Never removed - memory leak
    }
}

// Solution: Remove listeners
public void removeListener(EventListener listener) {
    listeners.remove(listener);
}

// Solution: Using WeakReference
private List<WeakReference<EventListener>> listeners = new ArrayList<>();
```

## Profiling Tools

### VisualVM

```java
// Using VisualVM for profiling:
// 1. Monitor CPU usage
// 2. Monitor memory usage
// 3. Take heap dumps
// 4. Analyze thread dumps
// 5. Profile method execution times
```

### JProfiler

```java
// Using JProfiler:
// 1. CPU profiling
// 2. Memory profiling
// 3. Thread profiling
// 4. Database profiling
```

## Best Practices

### Defensive Programming

```java
// Good: Defensive checks
public void processUser(User user) {
    if (user == null) {
        throw new IllegalArgumentException("User cannot be null");
    }
    if (user.getName() == null || user.getName().trim().isEmpty()) {
        throw new IllegalArgumentException("User name is required");
    }
    // Process user
}

// Good: Validating input
public void setAge(int age) {
    if (age < 0 || age > 150) {
        throw new IllegalArgumentException("Age must be between 0 and 150");
    }
    this.age = age;
}
```

### Assertions

```java
// Good: Using assertions for debugging
public void processData(List<Data> data) {
    assert data != null : "Data list cannot be null";
    assert !data.isEmpty() : "Data list cannot be empty";
    
    // Process data
}

// Enable assertions: java -ea MyClass
```

## Summary

- Read stack traces from top to bottom
- Use appropriate log levels
- Use parameterized logging
- Catch specific exceptions
- Use try-with-resources
- Add null checks where needed
- Use debugging tools effectively
- Profile before optimizing
- Write defensive code
- Use assertions for debugging

