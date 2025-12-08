---
title: Code Style
description: Java formatting, style guide, and basics including variables, loops, and conditions.
---

# Code Style

This page documents the code style standards, formatting rules, and basic Java concepts including variables, loops, and conditions. We follow the official [Java Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html) and industry best practices.

## Formatting

### Indentation

Use **4 spaces** for indentation (not tabs). This is the standard Java convention.

```java
// Good: 4 spaces indentation
public class UserService {
    public void processUser(User user) {
        if (user != null) {
            String name = user.getName();
            System.out.println(name);
        }
    }
}

// Bad: Tabs or inconsistent indentation
public class UserService {
	public void processUser(User user) { // Tabs instead of spaces
  if (user != null) { // Inconsistent indentation
      String name = user.getName();
  }
    }
}
```

### Brace Style

Use **K&R style** (opening brace on the same line) for methods, classes, and control structures:

```java
// Good: K&R brace style
public class UserService {
    public void processUser(User user) {
        if (user != null) {
            // Code here
        }
    }
}

// Bad: Allman style (braces on new lines)
public class UserService
{
    public void processUser(User user)
    {
        if (user != null)
        {
            // Code here
        }
    }
}
```

**Exception:** For empty blocks, you can use a single line:

```java
// Good: Empty block on one line
public void doNothing() {}

// Also acceptable: Empty block with braces
public void doNothing() {
    // Intentionally empty
}
```

### Line Length

Keep lines to a maximum of **120 characters**. If a line exceeds this, break it appropriately.

```java
// Good: Lines within 120 characters
public User findUserById(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
}

// Good: Breaking long lines appropriately
String message = "This is a very long message that needs to be broken "
    + "across multiple lines for better readability.";

// Bad: Lines exceeding 120 characters
public User findUserById(Long userId) { return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found: " + userId)); }
```

### Spacing

Use spaces around operators and after commas:

```java
// Good: Proper spacing
int sum = a + b;
if (x > 0 && y < 10) {
    // Code
}
method(param1, param2, param3);

// Bad: Missing spaces
int sum=a+b;
if(x>0&&y<10){
    // Code
}
method(param1,param2,param3);
```

## Variables

### Variable Declaration

Declare variables with their type, using meaningful names:

```java
// Good: Clear variable declarations
String userName = "John";
int itemCount = 0;
boolean isActive = true;
List<String> names = new ArrayList<>();
User currentUser = null;

// Bad: Unclear or poorly named variables
String u = "John"; // Too short
int c = 0; // Unclear
boolean flag = true; // Not descriptive
List<String> list = new ArrayList<>(); // Too generic
```

### Primitive Types

Java has 8 primitive types. Use them appropriately:

```java
// Primitive types
byte byteValue = 127;        // 8-bit integer (-128 to 127)
short shortValue = 32767;    // 16-bit integer (-32,768 to 32,767)
int intValue = 2147483647;   // 32-bit integer
long longValue = 9223372036854775807L; // 64-bit integer (note the L suffix)
float floatValue = 3.14f;     // 32-bit floating point (note the f suffix)
double doubleValue = 3.14159; // 64-bit floating point
char charValue = 'A';         // 16-bit Unicode character
boolean boolValue = true;     // true or false

// Good: Using appropriate primitive types
int age = 25;
double price = 19.99;
boolean isValid = true;
char grade = 'A';

// Bad: Using wrapper classes when primitives would suffice
Integer age = 25; // Use int instead
Double price = 19.99; // Use double instead
Boolean isValid = true; // Use boolean instead
```

### Object Types (Wrapper Classes)

Use wrapper classes when you need object features (null, collections, etc.):

```java
// Good: Using wrapper classes when needed
List<Integer> numbers = new ArrayList<>(); // Collections require objects
Integer userId = null; // Can be null
Double price = calculatePrice(); // Method might return null

// Good: Using primitives when possible
int count = 0; // Primitive is more efficient
double total = 0.0; // Primitive is more efficient
boolean isActive = true; // Primitive is more efficient
```

### Final Variables

Use `final` for variables that should not be reassigned:

```java
// Good: Using final for constants and immutable references
final String userName = "John";
final int MAX_RETRIES = 3;
final List<String> items = new ArrayList<>(); // Reference is final, list can be modified
items.add("item1"); // OK - modifying the list
// items = new ArrayList<>(); // Error - cannot reassign

// Bad: Not using final when variable shouldn't change
String userName = "John";
userName = "Jane"; // Should have been final
```

### Variable Initialization

Initialize variables appropriately:

```java
// Good: Initialize variables
int count = 0;
String name = "";
List<String> items = new ArrayList<>();
User user = null; // Explicit null when needed

// Good: Initialize in constructor
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository; // Initialize in constructor
    }
}

// Bad: Uninitialized variables
int count; // Should be initialized
String name; // Should be initialized
```

### Scope

Keep variable scope as narrow as possible:

```java
// Good: Narrow scope
public void processItems(List<Item> items) {
    for (Item item : items) {
        String itemName = item.getName(); // Scope limited to loop
        processItem(itemName);
    }
    // itemName is not accessible here
}

// Bad: Too broad scope
String itemName; // Declared outside loop
for (Item item : items) {
    itemName = item.getName();
    processItem(itemName);
}
// itemName still accessible here unnecessarily
```

## Loops

### For Loop

Use traditional for loop when you need the index:

```java
// Good: Traditional for loop with index
for (int i = 0; i < items.size(); i++) {
    Item item = items.get(i);
    processItem(item);
}

// Good: Traditional for loop with multiple variables
for (int i = 0, j = items.size() - 1; i < j; i++, j--) {
    Item first = items.get(i);
    Item last = items.get(j);
    swap(first, last);
}

// Bad: Using index when not needed
for (int i = 0; i < items.size(); i++) {
    Item item = items.get(i);
    processItem(item); // Could use enhanced for loop
}
```

### Enhanced For Loop (For-Each)

Use enhanced for loop when you don't need the index:

```java
// Good: Enhanced for loop
for (Item item : items) {
    processItem(item);
}

// Good: Enhanced for loop with collections
for (String name : nameList) {
    System.out.println(name);
}

// Good: Enhanced for loop with arrays
for (int number : numbers) {
    sum += number;
}

// Bad: Traditional for loop when index not needed
for (int i = 0; i < items.size(); i++) {
    Item item = items.get(i);
    processItem(item); // Should use enhanced for loop
}
```

### While Loop

Use while loop when the number of iterations is unknown:

```java
// Good: While loop for unknown iterations
Scanner scanner = new Scanner(System.in);
String input;
while (!(input = scanner.nextLine()).equals("quit")) {
    processInput(input);
}

// Good: While loop with condition
int count = 0;
while (count < 10) {
    System.out.println(count);
    count++;
}

// Bad: While loop that could be a for loop
int i = 0;
while (i < items.size()) { // Should use for loop
    processItem(items.get(i));
    i++;
}
```

### Do-While Loop

Use do-while when you need to execute at least once:

```java
// Good: Do-while for at least one execution
Scanner scanner = new Scanner(System.in);
String input;
do {
    System.out.print("Enter command: ");
    input = scanner.nextLine();
    processCommand(input);
} while (!input.equals("quit"));

// Bad: Do-while when regular while would work
int i = 0;
do {
    processItem(items.get(i));
    i++;
} while (i < items.size()); // Should use for loop
```

### Stream API (Java 8+)

Use Stream API for functional-style operations:

```java
// Good: Stream API for transformations
List<String> upperNames = names.stream()
    .map(String::toUpperCase)
    .filter(name -> name.length() > 5)
    .collect(Collectors.toList());

// Good: Stream API for filtering
List<User> activeUsers = users.stream()
    .filter(User::isActive)
    .collect(Collectors.toList());

// Good: Stream API for finding
Optional<User> admin = users.stream()
    .filter(user -> user.getRole() == UserRole.ADMIN)
    .findFirst();

// Good: Stream API for aggregation
int total = numbers.stream()
    .mapToInt(Integer::intValue)
    .sum();

// Bad: Using loops when Stream API would be clearer
List<String> upperNames = new ArrayList<>();
for (String name : names) {
    if (name.length() > 5) {
        upperNames.add(name.toUpperCase());
    }
} // Stream API would be more concise
```

### Loop Control Statements

Use `break` and `continue` appropriately:

```java
// Good: Using break to exit early
for (Item item : items) {
    if (item.isExpired()) {
        break; // Exit loop when expired item found
    }
    processItem(item);
}

// Good: Using continue to skip iteration
for (Item item : items) {
    if (item.isExpired()) {
        continue; // Skip expired items
    }
    processItem(item);
}

// Good: Labeled break/continue for nested loops
outer: for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == target) {
            break outer; // Break outer loop
        }
    }
}

// Bad: Overusing break/continue
for (Item item : items) {
    if (!item.isExpired()) {
        processItem(item);
    } // Better than using continue
}
```

## Conditions

### If-Else Statements

Use if-else for conditional logic:

```java
// Good: Clear if-else structure
if (user != null) {
    processUser(user);
} else {
    handleNullUser();
}

// Good: Multiple conditions
if (age < 18) {
    System.out.println("Minor");
} else if (age < 65) {
    System.out.println("Adult");
} else {
    System.out.println("Senior");
}

// Good: Early return pattern
public User findUser(Long id) {
    if (id == null) {
        return null;
    }
    if (id < 0) {
        throw new IllegalArgumentException("ID must be positive");
    }
    return userRepository.findById(id);
}

// Bad: Deeply nested if statements
if (user != null) {
    if (user.isActive()) {
        if (user.hasPermission()) {
            // Too many levels of nesting
        }
    }
}
```

### Ternary Operator

Use ternary operator for simple conditional assignments:

```java
// Good: Simple ternary operator
String status = isActive ? "Active" : "Inactive";
int max = a > b ? a : b;

// Good: Nested ternary (use sparingly)
String message = age < 18 ? "Minor" : (age < 65 ? "Adult" : "Senior");

// Bad: Complex ternary operator
String result = condition1 ? (condition2 ? value1 : value2) : (condition3 ? value3 : value4); // Too complex, use if-else
```

### Switch Statements

Use switch for multiple value comparisons:

```java
// Good: Switch statement
switch (dayOfWeek) {
    case MONDAY:
    case TUESDAY:
    case WEDNESDAY:
    case THURSDAY:
    case FRIDAY:
        System.out.println("Weekday");
        break;
    case SATURDAY:
    case SUNDAY:
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Invalid day");
}

// Good: Switch expression (Java 14+)
String dayType = switch (dayOfWeek) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Weekday";
    case SATURDAY, SUNDAY -> "Weekend";
    default -> "Invalid";
};

// Good: Switch with yield (Java 14+)
int days = switch (month) {
    case JANUARY, MARCH, MAY, JULY, AUGUST, OCTOBER, DECEMBER -> 31;
    case FEBRUARY -> 28;
    case APRIL, JUNE, SEPTEMBER, NOVEMBER -> 30;
    default -> {
        throw new IllegalArgumentException("Invalid month");
    }
};

// Bad: Missing break statements
switch (dayOfWeek) {
    case MONDAY:
        System.out.println("Monday");
        // Missing break - falls through
    case TUESDAY:
        System.out.println("Tuesday");
        break;
}
```

### Pattern Matching (Java 17+)

Use pattern matching for instanceof checks:

```java
// Good: Pattern matching with instanceof
if (obj instanceof String str) {
    System.out.println(str.toUpperCase()); // str is automatically cast
}

// Good: Pattern matching in switch (Java 17+)
String result = switch (obj) {
    case String s -> "String: " + s;
    case Integer i -> "Integer: " + i;
    case null -> "Null";
    default -> "Unknown";
};

// Bad: Traditional instanceof with explicit cast
if (obj instanceof String) {
    String str = (String) obj; // Explicit cast needed
    System.out.println(str.toUpperCase());
}
```

### Logical Operators

Use logical operators appropriately:

```java
// Good: Logical AND
if (user != null && user.isActive()) {
    processUser(user);
}

// Good: Logical OR
if (role == UserRole.ADMIN || role == UserRole.MODERATOR) {
    grantAccess();
}

// Good: Short-circuit evaluation
if (list != null && !list.isEmpty()) {
    processList(list);
}

// Bad: Using bitwise operators for boolean logic
if (user != null & user.isActive()) { // Should use &&
    processUser(user);
}
```

## Code Organization

### Class Member Order

Organize class members in this order:

1. Constants (static final)
2. Static variables
3. Instance variables
4. Constructors
5. Methods (public, then private)
6. Inner classes

```java
// Good: Well-organized class
public class UserService {
    // 1. Constants
    private static final int MAX_RETRIES = 3;
    private static final String DEFAULT_NAME = "Guest";
    
    // 2. Static variables
    private static int instanceCount = 0;
    
    // 3. Instance variables
    private final UserRepository repository;
    private String currentUser;
    
    // 4. Constructors
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
    
    // 5. Public methods
    public User findUser(Long id) {
        return repository.findById(id);
    }
    
    // 6. Private methods
    private void validateUser(User user) {
        // Validation logic
    }
}
```

### Import Statements

Organize imports in this order:

1. Java standard library imports
2. Third-party library imports
3. Application imports

```java
// Good: Organized imports
// 1. Java standard library
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

// 2. Third-party libraries
import org.springframework.stereotype.Service;
import org.hibernate.Session;

// 3. Application imports
import com.company.project.model.User;
import com.company.project.repository.UserRepository;

// Bad: Unorganized imports
import com.company.project.model.User;
import java.util.List;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
```

## Comments

### JavaDoc Comments

Use JavaDoc for public APIs:

```java
/**
 * Calculates the total price including tax.
 *
 * @param subtotal the price before tax
 * @param taxRate the tax rate as a decimal (e.g., 0.1 for 10%)
 * @return the total price including tax
 * @throws IllegalArgumentException if subtotal or taxRate is negative
 */
public double calculateTotal(double subtotal, double taxRate) {
    if (subtotal < 0 || taxRate < 0) {
        throw new IllegalArgumentException("Values must be non-negative");
    }
    return subtotal * (1 + taxRate);
}
```

### Inline Comments

Use `//` for inline comments. Explain **why**, not **what**:

```java
// Good: Explains why
// Use StringBuilder for efficient string concatenation in loops
StringBuilder sb = new StringBuilder();
for (String item : items) {
    sb.append(item);
}

// Bad: Explains what (obvious from code)
// Append item to StringBuilder
sb.append(item);
```

## Summary

- Use 4 spaces for indentation
- Use K&R brace style (opening brace on same line)
- Keep lines under 120 characters
- Use meaningful variable names
- Prefer primitives over wrapper classes when possible
- Use `final` for immutable variables
- Use enhanced for loop when index not needed
- Use Stream API for functional operations
- Use early returns to reduce nesting
- Use switch for multiple value comparisons
- Organize class members logically
- Use JavaDoc for public APIs
- Explain **why** in comments, not **what**

