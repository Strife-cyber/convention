---
title: Débogage
description: Techniques de débogage, compréhension d'erreurs, logging et dépannage en Java.
---

# Débogage

Cette page couvre les techniques de débogage, compréhension d'erreurs, logging et dépannage en Java.

## Compréhension des Stack Traces

### Lecture des Stack Traces

```java
// Exemple de stack trace
Exception in thread "main" java.lang.NullPointerException
    at com.example.UserService.processUser(UserService.java:25)
    at com.example.Main.main(Main.java:10)

// Lecture:
// 1. Type d'exception : NullPointerException
// 2. Localisation : UserService.java ligne 25
// 3. Chaîne d'appels : Main.main -> UserService.processUser
```

## Logging

### Utilisation de SLF4J

```java
// Bon : Utilisation de SLF4J
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    public User findUser(Long id) {
        logger.debug("Recherche utilisateur avec id: {}", id);
        
        try {
            User user = repository.findById(id);
            logger.info("Utilisateur trouvé: {}", user.getName());
            return user;
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche avec id: {}", id, e);
            throw e;
        }
    }
}
```

## Résumé

- Lisez les stack traces de haut en bas
- Utilisez les niveaux de log appropriés
- Utilisez le logging paramétré
- Attrapez des exceptions spécifiques
- Utilisez try-with-resources
- Ajoutez des vérifications null où nécessaire

