---
title: Performance Optimization
description: Memory management, CPU optimization, I/O optimization, and performance best practices in Java.
---

# Performance Optimization

This page covers performance optimization techniques in Java including memory management, CPU optimization, I/O optimization, and best practices.

## Memory Management

### String Optimization

```java
// Bad: String concatenation in loop
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "item" + i; // Creates new String object each time
}

// Good: Using StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("item").append(i);
}
String result = sb.toString();

// Good: Using String.join for multiple strings
List<String> items = Arrays.asList("a", "b", "c");
String result = String.join(", ", items);
```

### Collection Initialization

```java
// Bad: Resizing ArrayList multiple times
List<String> list = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    list.add("item" + i); // May resize multiple times
}

// Good: Pre-sizing ArrayList
List<String> list = new ArrayList<>(1000);
for (int i = 0; i < 1000; i++) {
    list.add("item" + i); // No resizing needed
}

// Good: Using appropriate collection type
Set<String> uniqueItems = new HashSet<>(); // O(1) lookup
Map<String, Integer> map = new HashMap<>(); // O(1) lookup
```

### Object Pooling

```java
// Good: Reusing objects when appropriate
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
        return pool.poll();
    }
    
    public void returnConnection(Connection conn) {
        if (pool.size() < maxSize) {
            pool.offer(conn);
        }
    }
}
```

## CPU Optimization

### Algorithm Efficiency

```java
// Bad: O(n²) algorithm
public boolean containsDuplicates(List<Integer> list) {
    for (int i = 0; i < list.size(); i++) {
        for (int j = i + 1; j < list.size(); j++) {
            if (list.get(i).equals(list.get(j))) {
                return true;
            }
        }
    }
    return false;
}

// Good: O(n) algorithm
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

### Caching

```java
// Good: Simple caching
public class UserService {
    private final Map<Long, User> cache = new ConcurrentHashMap<>();
    private final UserRepository repository;
    
    public User findById(Long id) {
        return cache.computeIfAbsent(id, repository::findById);
    }
    
    public void invalidateCache(Long id) {
        cache.remove(id);
    }
}

// Good: Using Guava Cache
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

Cache<Long, User> cache = CacheBuilder.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .build();
```

### Lazy Initialization

```java
// Good: Lazy initialization
public class ExpensiveObject {
    private HeavyResource resource;
    
    public HeavyResource getResource() {
        if (resource == null) {
            synchronized (this) {
                if (resource == null) {
                    resource = new HeavyResource();
                }
            }
        }
        return resource;
    }
}
```

## I/O Optimization

### Buffering

```java
// Bad: Reading without buffering
FileReader reader = new FileReader("large-file.txt");
int ch;
while ((ch = reader.read()) != -1) {
    processChar((char) ch);
}

// Good: Using BufferedReader
try (BufferedReader reader = new BufferedReader(
        new FileReader("large-file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        processLine(line);
    }
}

// Good: Using BufferedWriter
try (BufferedWriter writer = new BufferedWriter(
        new FileWriter("output.txt"))) {
    for (String line : lines) {
        writer.write(line);
        writer.newLine();
    }
}
```

### Async I/O

```java
// Good: Using CompletableFuture for async I/O
public CompletableFuture<String> readFileAsync(String filename) {
    return CompletableFuture.supplyAsync(() -> {
        try {
            return Files.readString(Paths.get(filename));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    });
}

// Usage
readFileAsync("data.txt")
    .thenApply(content -> processContent(content))
    .thenAccept(result -> System.out.println(result))
    .exceptionally(ex -> {
        System.err.println("Error: " + ex.getMessage());
        return null;
    });
```

## Collection Performance

### Choosing Right Collection

```java
// Good: Using appropriate collection
// For frequent lookups
Map<String, User> userMap = new HashMap<>(); // O(1) lookup

// For sorted data
TreeSet<Integer> sortedSet = new TreeSet<>(); // O(log n) operations

// For insertion order
LinkedHashMap<String, User> orderedMap = new LinkedHashMap<>();

// For thread-safe operations
ConcurrentHashMap<String, User> concurrentMap = new ConcurrentHashMap<>();
```

### Stream Performance

```java
// Good: Using parallel streams for large datasets
List<Integer> numbers = generateLargeList();

// Sequential processing
int sum = numbers.stream()
    .mapToInt(Integer::intValue)
    .sum();

// Parallel processing for large datasets
int parallelSum = numbers.parallelStream()
    .mapToInt(Integer::intValue)
    .sum();

// Good: Using primitive streams
int sum = numbers.stream()
    .mapToInt(Integer::intValue) // Avoids boxing
    .sum();
```

## Database Optimization

### Batch Operations

```java
// Good: Batch insert
@Transactional
public void saveAll(List<User> users) {
    int batchSize = 50;
    for (int i = 0; i < users.size(); i++) {
        userRepository.save(users.get(i));
        if (i % batchSize == 0 && i > 0) {
            entityManager.flush();
            entityManager.clear();
        }
    }
}
```

### Query Optimization

```java
// Good: Using indexes and proper queries
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);

// Good: Using JOIN FETCH to avoid N+1 problem
@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findByIdWithOrders(@Param("id") Long id);

// Bad: N+1 problem
List<User> users = userRepository.findAll();
for (User user : users) {
    List<Order> orders = user.getOrders(); // Separate query for each user
}
```

## Profiling

### Using JProfiler

```java
// Good: Identifying bottlenecks
public void processData(List<Data> dataList) {
    // Profile this method to identify slow operations
    for (Data data : dataList) {
        processItem(data); // May be slow
    }
}
```

### Memory Profiling

```java
// Good: Monitoring memory usage
Runtime runtime = Runtime.getRuntime();
long totalMemory = runtime.totalMemory();
long freeMemory = runtime.freeMemory();
long usedMemory = totalMemory - freeMemory;

System.out.println("Used memory: " + usedMemory / 1024 / 1024 + " MB");
```

## Best Practices

### Avoid Premature Optimization

```java
// Good: Write clear code first, optimize if needed
public List<String> processItems(List<String> items) {
    return items.stream()
        .filter(item -> item.length() > 5)
        .map(String::toUpperCase)
        .collect(Collectors.toList());
}

// Optimize only if profiling shows it's needed
```

### Use Appropriate Data Structures

```java
// Good: Choosing right data structure
// For unique elements
Set<String> uniqueItems = new HashSet<>();

// For ordered unique elements
Set<String> sortedUnique = new TreeSet<>();

// For key-value pairs
Map<String, Integer> counts = new HashMap<>();

// For thread-safe operations
ConcurrentHashMap<String, Integer> safeMap = new ConcurrentHashMap<>();
```

## Summary

- Use StringBuilder for string concatenation in loops
- Pre-size collections when size is known
- Choose appropriate collection types
- Use buffering for I/O operations
- Use async I/O for better throughput
- Optimize database queries
- Use batch operations for bulk data
- Profile before optimizing
- Avoid premature optimization
- Use appropriate data structures

