---
title: Java SE
description: Console applications, file handling, threads, collections, and Streams API.
---

# Java SE

This page covers Java Standard Edition (SE) concepts including console applications, file handling, threads, collections, and the Streams API.

## Console Applications

### Reading Input

Use `Scanner` for reading user input:

```java
// Good: Reading input with Scanner
import java.util.Scanner;

public class ConsoleApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter your age: ");
        int age = scanner.nextInt();
        
        System.out.println("Hello, " + name + "! You are " + age + " years old.");
        
        scanner.close();
    }
}

// Good: Reading different types
Scanner scanner = new Scanner(System.in);
String line = scanner.nextLine();
int number = scanner.nextInt();
double decimal = scanner.nextDouble();
boolean flag = scanner.nextBoolean();

// Bad: Not closing Scanner
Scanner scanner = new Scanner(System.in);
String input = scanner.nextLine();
// Missing scanner.close() - resource leak
```

### Command Line Arguments

Access command line arguments via `args` parameter:

```java
// Good: Processing command line arguments
public class ArgsApp {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("No arguments provided");
            return;
        }
        
        System.out.println("Number of arguments: " + args.length);
        for (int i = 0; i < args.length; i++) {
            System.out.println("Argument " + i + ": " + args[i]);
        }
    }
}

// Good: Parsing arguments
public class Calculator {
    public static void main(String[] args) {
        if (args.length != 3) {
            System.err.println("Usage: Calculator <operation> <num1> <num2>");
            return;
        }
        
        String operation = args[0];
        double num1 = Double.parseDouble(args[1]);
        double num2 = Double.parseDouble(args[2]);
        
        double result = switch (operation) {
            case "add" -> num1 + num2;
            case "subtract" -> num1 - num2;
            case "multiply" -> num1 * num2;
            case "divide" -> num2 != 0 ? num1 / num2 : 0;
            default -> {
                System.err.println("Unknown operation: " + operation);
                yield 0;
            }
        };
        
        System.out.println("Result: " + result);
    }
}
```

### Output

Use `System.out` for standard output and `System.err` for errors:

```java
// Good: Using System.out and System.err
System.out.println("Normal output");
System.err.println("Error message");

// Good: Formatted output
String name = "John";
int age = 30;
System.out.printf("Name: %s, Age: %d%n", name, age);

// Good: Using PrintWriter for better control
PrintWriter writer = new PrintWriter(System.out);
writer.println("Line 1");
writer.println("Line 2");
writer.flush();
```

## File Handling

### Reading Files

Use `Files` class (Java 7+) for modern file operations:

```java
// Good: Reading all lines from a file
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

try {
    List<String> lines = Files.readAllLines(Paths.get("data.txt"));
    for (String line : lines) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}

// Good: Reading file as string
try {
    String content = Files.readString(Paths.get("data.txt"));
    System.out.println(content);
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}

// Good: Reading with BufferedReader for large files
try (BufferedReader reader = Files.newBufferedReader(Paths.get("large-file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        processLine(line);
    }
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}

// Bad: Not handling exceptions
List<String> lines = Files.readAllLines(Paths.get("data.txt")); // Missing try-catch
```

### Writing Files

```java
// Good: Writing to file
try {
    String content = "Hello, World!";
    Files.writeString(Paths.get("output.txt"), content);
} catch (IOException e) {
    System.err.println("Error writing file: " + e.getMessage());
}

// Good: Writing multiple lines
List<String> lines = List.of("Line 1", "Line 2", "Line 3");
try {
    Files.write(Paths.get("output.txt"), lines);
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}

// Good: Writing with BufferedWriter
try (BufferedWriter writer = Files.newBufferedWriter(Paths.get("output.txt"))) {
    writer.write("Line 1");
    writer.newLine();
    writer.write("Line 2");
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}

// Bad: Not using try-with-resources
BufferedWriter writer = Files.newBufferedWriter(Paths.get("output.txt"));
writer.write("Data");
// Missing writer.close() - resource leak
```

### File Operations

```java
// Good: File operations
Path path = Paths.get("file.txt");

// Check if file exists
if (Files.exists(path)) {
    System.out.println("File exists");
}

// Get file size
long size = Files.size(path);
System.out.println("Size: " + size + " bytes");

// Copy file
Files.copy(Paths.get("source.txt"), Paths.get("dest.txt"));

// Move file
Files.move(Paths.get("old.txt"), Paths.get("new.txt"));

// Delete file
Files.deleteIfExists(Paths.get("temp.txt"));

// Create directory
Files.createDirectories(Paths.get("dir1/dir2"));
```

## Threads

### Creating Threads

Use `Thread` class or `Runnable` interface:

```java
// Good: Using Runnable interface
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}

// Usage
Thread thread = new Thread(new MyRunnable());
thread.start();

// Good: Using lambda expression
Thread thread = new Thread(() -> {
    System.out.println("Thread running");
});
thread.start();

// Good: Extending Thread class
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running");
    }
}

MyThread thread = new MyThread();
thread.start();

// Bad: Calling run() instead of start()
Thread thread = new Thread(new MyRunnable());
thread.run(); // Wrong - runs in current thread, not new thread
```

### Thread Synchronization

Use `synchronized` keyword for thread safety:

```java
// Good: Synchronized method
public class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}

// Good: Synchronized block
public void updateCounter() {
    synchronized (this) {
        count++;
    }
}

// Good: Using ReentrantLock
import java.util.concurrent.locks.ReentrantLock;

public class Counter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
}

// Bad: Not synchronizing shared resources
public class Counter {
    private int count = 0;
    
    public void increment() {
        count++; // Not thread-safe
    }
}
```

### ExecutorService

Use `ExecutorService` for managing thread pools:

```java
// Good: Using ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(5);

for (int i = 0; i < 10; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " running");
    });
}

executor.shutdown();
try {
    if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
        executor.shutdownNow();
    }
} catch (InterruptedException e) {
    executor.shutdownNow();
    Thread.currentThread().interrupt();
}

// Good: Using CompletableFuture (Java 8+)
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    return "Result";
});

future.thenAccept(result -> {
    System.out.println("Got result: " + result);
});
```

## Collections

### List

Use `ArrayList` for dynamic arrays, `LinkedList` for frequent insertions/deletions:

```java
// Good: Using ArrayList
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

for (String name : names) {
    System.out.println(name);
}

// Good: Using List.of() for immutable lists
List<String> immutableList = List.of("a", "b", "c");

// Good: Using LinkedList for frequent insertions
List<String> list = new LinkedList<>();
list.add(0, "First"); // Efficient at beginning
list.add(1, "Second");

// Bad: Using raw types
List names = new ArrayList(); // Should use generics
```

### Set

Use `HashSet` for general use, `TreeSet` for sorted sets:

```java
// Good: Using HashSet
Set<String> uniqueNames = new HashSet<>();
uniqueNames.add("Alice");
uniqueNames.add("Bob");
uniqueNames.add("Alice"); // Duplicate - ignored

// Good: Using TreeSet for sorted set
Set<Integer> sortedNumbers = new TreeSet<>();
sortedNumbers.add(3);
sortedNumbers.add(1);
sortedNumbers.add(2);
// Automatically sorted: [1, 2, 3]

// Good: Using LinkedHashSet for insertion order
Set<String> orderedSet = new LinkedHashSet<>();
```

### Map

Use `HashMap` for general use, `TreeMap` for sorted maps:

```java
// Good: Using HashMap
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);
ages.put("Charlie", 28);

Integer aliceAge = ages.get("Alice");
boolean hasBob = ages.containsKey("Bob");

// Good: Iterating over map
for (Map.Entry<String, Integer> entry : ages.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Good: Using TreeMap for sorted keys
Map<String, Integer> sortedAges = new TreeMap<>();
sortedAges.put("Charlie", 28);
sortedAges.put("Alice", 25);
sortedAges.put("Bob", 30);
// Keys automatically sorted: Alice, Bob, Charlie
```

## Streams API

### Basic Stream Operations

```java
// Good: Filtering and mapping
List<String> names = List.of("Alice", "Bob", "Charlie", "David");

List<String> longNames = names.stream()
    .filter(name -> name.length() > 4)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// Result: [CHARLIE, DAVID]

// Good: Finding elements
Optional<String> firstLongName = names.stream()
    .filter(name -> name.length() > 5)
    .findFirst();

// Good: Aggregation
List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int sum = numbers.stream()
    .mapToInt(Integer::intValue)
    .sum();

int max = numbers.stream()
    .mapToInt(Integer::intValue)
    .max()
    .orElse(0);

// Good: Collecting to different collections
Set<String> nameSet = names.stream()
    .collect(Collectors.toSet());

Map<String, Integer> nameLengths = names.stream()
    .collect(Collectors.toMap(
        name -> name,
        String::length
    ));
```

### Advanced Stream Operations

```java
// Good: FlatMap for nested collections
List<List<Integer>> nested = List.of(
    List.of(1, 2, 3),
    List.of(4, 5, 6),
    List.of(7, 8, 9)
);

List<Integer> flattened = nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());
// Result: [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Good: Grouping
List<Person> people = List.of(
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Charlie", 25)
);

Map<Integer, List<Person>> byAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// Good: Partitioning
Map<Boolean, List<Person>> partitioned = people.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() >= 30));

// Good: Reducing
Optional<Integer> product = numbers.stream()
    .reduce((a, b) -> a * b);
```

## Summary

- Use `Scanner` for console input
- Use `Files` class for modern file operations
- Always use try-with-resources for file operations
- Use `ExecutorService` for thread management
- Synchronize access to shared resources
- Choose appropriate collection type for your needs
- Use Streams API for functional-style operations
- Prefer `List.of()` for immutable collections
- Use `CompletableFuture` for asynchronous operations

