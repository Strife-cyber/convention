---
title: Développement Web
description: Servlets, JSP, Spring Boot, APIs REST et développement web en Java.
---

# Développement Web

Cette page couvre le développement web Java incluant Servlets, JSP, Spring Boot et le développement d'APIs REST.

## Servlets

### Servlet de Base

```java
// Bon : Implémentation de servlet de base
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>Bonjour, Monde!</h1>");
        out.println("</body></html>");
    }
}

// Bon : Gestion des requêtes POST
@WebServlet("/user")
public class UserServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        
        // Traiter les données utilisateur
        User user = new User(name, email);
        userService.save(user);
        
        response.sendRedirect("/success");
    }
}
```

## Spring Boot

### Application Spring Boot de Base

```java
// Bon : Classe principale Spring Boot
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Bon : Contrôleur REST
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
}
```

## APIs REST

### Conception RESTful

```java
// Bon : Contrôleur RESTful
@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

## Résumé

- Utilisez Servlets pour applications web de base
- Utilisez Spring Boot pour applications web modernes
- Suivez les principes RESTful pour la conception d'API
- Utilisez les DTOs pour séparer les contrats API des entités
- Implémentez une gestion d'exceptions appropriée

