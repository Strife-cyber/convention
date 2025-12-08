---
title: Web Development
description: Servlets, JSP, Spring Boot, REST APIs, and web development in Java.
---

# Web Development

This page covers Java web development including Servlets, JSP, Spring Boot, and REST API development.

## Servlets

### Basic Servlet

```java
// Good: Basic servlet implementation
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>Hello, World!</h1>");
        out.println("</body></html>");
    }
}

// Good: Handling POST requests
@WebServlet("/user")
public class UserServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        
        // Process user data
        User user = new User(name, email);
        userService.save(user);
        
        response.sendRedirect("/success");
    }
}

// Good: Using request attributes
request.setAttribute("user", user);
request.getRequestDispatcher("/user-profile.jsp").forward(request, response);
```

### Session Management

```java
// Good: Using sessions
HttpSession session = request.getSession();
session.setAttribute("username", username);
session.setAttribute("userId", userId);

// Retrieve from session
String username = (String) session.getAttribute("username");

// Invalidate session
session.invalidate();

// Good: Session timeout configuration
session.setMaxInactiveInterval(30 * 60); // 30 minutes
```

## JSP (JavaServer Pages)

### Basic JSP

```jsp
<!-- Good: Basic JSP page -->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>User Profile</title>
</head>
<body>
    <h1>Welcome, ${user.name}!</h1>
    <p>Email: ${user.email}</p>
    <p>Age: ${user.age}</p>
</body>
</html>

<!-- Good: Using JSTL -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:forEach var="item" items="${items}">
    <p>${item.name}</p>
</c:forEach>

<!-- Good: Conditional rendering -->
<c:if test="${user.isAdmin}">
    <p>Admin Panel</p>
</c:if>
```

### JSP Best Practices

```jsp
<!-- Good: Separating logic from presentation -->
<%@ page import="com.example.model.User" %>
<%
    User user = (User) request.getAttribute("user");
%>
<h1>${user.name}</h1>

<!-- Better: Using EL and JSTL -->
<h1>${user.name}</h1>

<!-- Good: Error handling -->
<%@ page errorPage="error.jsp" %>
```

## Spring Boot

### Basic Spring Boot Application

```java
// Good: Spring Boot main class
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Good: REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(user -> ResponseEntity.ok(user))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user)
            .map(updated -> ResponseEntity.ok(updated))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

### Service Layer

```java
// Good: Service implementation
@Service
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
    
    public Optional<User> update(Long id, User user) {
        return userRepository.findById(id)
            .map(existing -> {
                existing.setName(user.getName());
                existing.setEmail(user.getEmail());
                return userRepository.save(existing);
            });
    }
    
    public boolean delete(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
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

### Repository Layer

```java
// Good: JPA Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    Optional<User> findByEmail(String email);
    List<User> findByAgeGreaterThan(int age);
}

// Good: Custom query
@Query("SELECT u FROM User u WHERE u.email LIKE %:domain%")
List<User> findByEmailDomain(@Param("domain") String domain);
```

### Configuration

```java
// Good: Application properties
// application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

// Good: Configuration class
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

## REST APIs

### RESTful Design

```java
// Good: RESTful controller
@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {
    
    // GET /api/v1/users - Get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<UserDTO> users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }
    
    // GET /api/v1/users/{id} - Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(user -> ResponseEntity.ok(user))
            .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/v1/users - Create new user
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .header("Location", "/api/v1/users/" + created.getId())
            .body(created);
    }
    
    // PUT /api/v1/users/{id} - Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return userService.update(id, request)
            .map(user -> ResponseEntity.ok(user))
            .orElse(ResponseEntity.notFound().build());
    }
    
    // DELETE /api/v1/users/{id} - Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

### DTOs (Data Transfer Objects)

```java
// Good: DTO for request
public class CreateUserRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    @Min(0)
    @Max(150)
    private int age;
    
    // Getters and setters
}

// Good: DTO for response
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private int age;
    private LocalDateTime createdAt;
    
    // Getters and setters
}
```

### Exception Handling

```java
// Good: Global exception handler
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            errors,
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

## Security

### Spring Security

```java
// Good: Security configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic();
        return http.build();
    }
}
```

## Summary

- Use Servlets for basic web applications
- Use JSP for server-side rendering
- Use Spring Boot for modern web applications
- Follow RESTful principles for API design
- Use DTOs to separate API contracts from entities
- Implement proper exception handling
- Use Spring Security for authentication and authorization
- Validate input data
- Use appropriate HTTP methods and status codes

