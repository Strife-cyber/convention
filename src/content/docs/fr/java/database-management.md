---
title: Gestion de Bases de Données
description: JDBC, JPA/Hibernate, opérations sur bases de données et persistance de données en Java.
---

# Gestion de Bases de Données

Cette page couvre la gestion de bases de données en Java incluant JDBC, JPA/Hibernate, transactions et meilleures pratiques.

## JDBC

### Connexion JDBC de Base

```java
// Bon : Connexion JDBC avec try-with-resources
public class UserDao {
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
            throw new DataAccessException("Erreur lors de la recherche", e);
        }
        
        return null;
    }
}
```

## JPA/Hibernate

### Définition d'Entité

```java
// Bon : Entité JPA
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
}
```

### Repository

```java
// Bon : Repository JPA
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    
    Optional<User> findByEmail(String email);
}
```

## Résumé

- Utilisez toujours PreparedStatement pour prévenir l'injection SQL
- Utilisez try-with-resources pour la gestion de connexions
- Utilisez JPA/Hibernate pour le mapping objet-relationnel
- Utilisez @Transactional pour la gestion de transactions

