---
title: Database Management
description: JDBC, JPA/Hibernate, database operations, and data persistence in Java.
---

# Database Management

This page covers database management in Java including JDBC, JPA/Hibernate, transactions, and best practices.

## JDBC

### Basic JDBC Connection

```java
// Good: JDBC connection with try-with-resources
public class UserDao {
    private static final String URL = "jdbc:mysql://localhost:3306/mydb";
    private static final String USER = "root";
    private static final String PASSWORD = "password";
    
    public User findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        } catch (SQLException e) {
            throw new DataAccessException("Error finding user", e);
        }
        
        return null;
    }
    
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        return user;
    }
}

// Bad: Not using try-with-resources
Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
PreparedStatement stmt = conn.prepareStatement(sql);
// Missing try-with-resources - potential resource leak
```

### PreparedStatement

```java
// Good: Using PreparedStatement for safety
public void save(User user) {
    String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
        
        stmt.setString(1, user.getName());
        stmt.setString(2, user.getEmail());
        
        int rowsAffected = stmt.executeUpdate();
        
        if (rowsAffected > 0) {
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getLong(1));
                }
            }
        }
    } catch (SQLException e) {
        throw new DataAccessException("Error saving user", e);
    }
}

// Bad: Using Statement (SQL injection risk)
String sql = "INSERT INTO users (name, email) VALUES ('" + user.getName() + "', '" + user.getEmail() + "')";
Statement stmt = conn.createStatement();
stmt.executeUpdate(sql); // Vulnerable to SQL injection
```

### Connection Pooling

```java
// Good: Using connection pool (HikariCP)
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class DatabaseConfig {
    private static HikariDataSource dataSource;
    
    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        config.setUsername("root");
        config.setPassword("password");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        
        dataSource = new HikariDataSource(config);
    }
    
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
```

## JPA/Hibernate

### Entity Definition

```java
// Good: JPA entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();
    
    // Constructors, getters, setters
    public User() {}
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
}
```

### Repository

```java
// Good: JPA Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByAgeGreaterThan(int age);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain%")
    List<User> findByEmailDomain(@Param("domain") String domain);
    
    @Query(value = "SELECT * FROM users WHERE age > :age", nativeQuery = true)
    List<User> findUsersOlderThan(@Param("age") int age);
}
```

### Service Layer

```java
// Good: Service using repository
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public User save(User user) {
        validateUser(user);
        return userRepository.save(user);
    }
    
    @Transactional
    public User update(Long id, User updatedUser) {
        return userRepository.findById(id)
            .map(user -> {
                user.setName(updatedUser.getName());
                user.setEmail(updatedUser.getEmail());
                return userRepository.save(user);
            })
            .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }
    
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
    
    private void validateUser(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("User name is required");
        }
        if (user.getEmail() == null || !isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Valid email is required");
        }
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}
```

## Relationships

### One-to-Many

```java
// Good: One-to-Many relationship
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
}

@Entity
public class Order {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

### Many-to-Many

```java
// Good: Many-to-Many relationship
@Entity
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

## Transactions

### Transaction Management

```java
// Good: Using @Transactional
@Service
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Order createOrder(Long userId, Order order) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        
        return orderRepository.save(order);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public void processOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException("Order not found"));
        
        // Business logic that might throw exception
        processPayment(order);
        updateInventory(order);
        order.setStatus(OrderStatus.COMPLETED);
    }
}

// Good: Programmatic transaction
@Service
public class OrderService {
    private final PlatformTransactionManager transactionManager;
    
    public void processOrder(Long orderId) {
        TransactionStatus status = transactionManager.getTransaction(
            new DefaultTransactionDefinition()
        );
        
        try {
            // Business logic
            processOrderLogic(orderId);
            transactionManager.commit(status);
        } catch (Exception e) {
            transactionManager.rollback(status);
            throw e;
        }
    }
}
```

## Best Practices

### Lazy Loading

```java
// Good: Using lazy loading appropriately
@Entity
public class User {
    @OneToMany(fetch = FetchType.LAZY)
    private List<Order> orders; // Loaded only when accessed
}

// Good: Eager loading when needed
@Entity
public class User {
    @OneToMany(fetch = FetchType.EAGER)
    private List<Order> orders; // Loaded immediately
}

// Good: Using JOIN FETCH for queries
@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findByIdWithOrders(@Param("id") Long id);
```

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

## Summary

- Always use PreparedStatement to prevent SQL injection
- Use try-with-resources for connection management
- Use connection pooling for better performance
- Use JPA/Hibernate for object-relational mapping
- Use @Transactional for transaction management
- Use appropriate fetch strategies (LAZY/EAGER)
- Validate data before persisting
- Handle exceptions properly
- Use repositories for data access
- Use appropriate relationship mappings

