---
title: Conventions de Nommage
description: Standards de nommage pour fichiers, classes, méthodes et variables dans les projets Java.
---

# Conventions de Nommage

Cette page documente les conventions de nommage pour le code Java, les fichiers, classes, méthodes et variables. Nous suivons les [Conventions de Nommage Java Officielles](https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html) et les meilleures pratiques de l'industrie.

## Packages

Utilisez des lettres **minuscules** avec des mots séparés par des points. Les noms de packages doivent être uniques et suivre la convention de nom de domaine inversé.

```java
// Bon : Convention de nom de domaine inversé
package com.company.project.module;
package org.apache.commons.lang3;
package net.example.service.user;

// Mauvais : Majuscules ou casse mixte
package Com.Company.Project; // Devrait être en minuscules
package com.Company.project; // Devrait être entièrement en minuscules
```

**Meilleures Pratiques :**
- Utilisez le nom de domaine inversé de votre entreprise comme préfixe
- Gardez les noms de packages courts et significatifs
- Évitez les abréviations sauf si elles sont largement comprises
- Utilisez des noms au singulier pour les packages

```java
// Bons exemples
package com.acme.banking.account;
package com.acme.banking.transaction;
package com.acme.banking.util;

// Mauvais exemples
package com.acme.banking.accounts; // Utilisez le singulier
package com.acme.banking.Account; // Pas de majuscules
package com.acme.bkng.acc; // Évitez les abréviations
```

## Classes

Utilisez **PascalCase** (aussi appelé UpperCamelCase) pour les noms de classes. Les noms de classes doivent être des noms et décrire clairement ce que la classe représente.

```java
// Bon : PascalCase, noms descriptifs
public class UserProfile {}
public class AuthenticationService {}
public class DatabaseConnection {}
public class HttpRequestHandler {}

// Mauvais : Mauvaise casse ou noms peu clairs
public class userProfile {} // Devrait être PascalCase
public class authentication_service {} // Devrait être PascalCase, pas d'underscores
public class Data {} // Trop générique
public class UserProfileManagerService {} // Trop verbeux
```

**Exemples :**

```java
// Bon : Noms de classes clairs et descriptifs
public class CustomerRepository {}
public class PaymentProcessor {}
public class EmailValidator {}
public class ShoppingCart {}
public class OrderItem {}

// Mauvais : Classes peu claires ou mal nommées
public class Manager {} // Trop générique
public class ProcessData {} // Devrait être un nom
public class user {} // Mauvaise casse
public class Customer_Repository {} // Pas d'underscores
```

## Interfaces

Utilisez **PascalCase** pour les noms d'interfaces. Les interfaces sont souvent nommées avec des adjectifs (se terminant par -able, -ible) ou des noms décrivant des capacités.

```java
// Bon : Noms d'interfaces descriptifs
public interface Runnable {}
public interface Serializable {}
public interface UserRepository {}
public interface PaymentProcessor {}
public interface EventListener {}

// Mauvais : Mauvaise dénomination
public interface runnable {} // Devrait être PascalCase
public interface IUserRepository {} // Évitez la notation hongroise
public interface userRepository {} // Mauvaise casse
```

**Modèles Courants :**

```java
// Interfaces de capacité (se terminent souvent par -able, -ible)
public interface Comparable<T> {}
public interface Iterable<T> {}
public interface Readable {}
public interface Writable {}

// Interfaces de service
public interface UserService {}
public interface EmailService {}
public interface PaymentService {}

// Interfaces de repository
public interface UserRepository {}
public interface OrderRepository {}

// Interfaces d'écoute (se terminent souvent par -Listener)
public interface ActionListener {}
public interface EventListener {}
public interface ChangeListener {}
```

## Méthodes

Utilisez **camelCase** pour les noms de méthodes. Les noms de méthodes doivent être des verbes ou des phrases verbales qui indiquent clairement ce que la méthode fait.

```java
// Bon : camelCase, noms basés sur des verbes
public void calculateTotal() {}
public String getUserName() {}
public boolean isValidEmail(String email) {}
public void processPayment(Payment payment) {}

// Mauvais : Mauvaise casse ou noms peu clairs
public void CalculateTotal() {} // Devrait être camelCase
public String get_user_name() {} // Devrait être camelCase, pas d'underscores
public void process() {} // Trop générique
public void data() {} // Devrait être un verbe
```

**Exemples :**

```java
// Bon : Noms de méthodes clairs, basés sur des verbes
public class UserService {
    public User findUserById(Long id) {}
    public void saveUser(User user) {}
    public boolean deleteUser(Long id) {}
    public List<User> findAllUsers() {}
    public void updateUserEmail(Long id, String email) {}
    public boolean isUserActive(User user) {}
    public void sendWelcomeEmail(User user) {}
}

// Mauvais : Méthodes mal nommées
public class UserService {
    public User user(Long id) {} // Devrait être un verbe
    public void data(User user) {} // Objectif peu clair
    public boolean check() {} // Trop générique
    public List<User> get() {} // Trop générique
    public void processUserDataAndSaveToDatabase(User user) {} // Trop verbeux
}
```

**Méthodes Booléennes :**

Les méthodes booléennes doivent être nommées avec un verbe ou un adjectif qui indique clairement vrai/faux.

```java
// Bon : Noms de méthodes booléennes clairs
public boolean isEmpty() {}
public boolean hasPermission() {}
public boolean canEdit() {}
public boolean isValid() {}
public boolean isEnabled() {}
public boolean shouldRetry() {}

// Mauvais : Noms booléens peu clairs
public boolean empty() {} // Devrait être isEmpty()
public boolean permission() {} // Pas clair que c'est un booléen
public boolean check() {} // Trop générique
```

## Variables

Utilisez **camelCase** pour les noms de variables (variables d'instance et locales). Les noms de variables doivent être des noms ou des phrases nominales qui décrivent clairement ce qu'elles représentent.

```java
// Bon : camelCase, noms descriptifs
String userName = "John";
int itemCount = 0;
List<Product> productList = new ArrayList<>();
boolean isActive = true;
User currentUser = null;

// Mauvais : Mauvaise casse ou noms peu clairs
String UserName = "John"; // Devrait être camelCase
String user_name = "John"; // Devrait être camelCase, pas d'underscores
String u = "John"; // Trop court, pas descriptif
String data = "John"; // Trop générique
```

**Exemples :**

```java
// Bon : Noms de variables clairs et descriptifs
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

// Mauvais : Variables mal nommées
public class OrderProcessor {
    private double ta; // Trop abrégé
    private int c; // Peu clair
    private List<OrderItem> list; // Trop générique
    private Customer c; // Lettre unique
    private Date d; // Peu clair
    private boolean flag; // Trop générique
}
```

**Variables de Boucle :**

Utilisez des noms courts et significatifs pour les variables de boucle. Conventions courantes :
- `i`, `j`, `k` pour des compteurs simples
- Noms plus descriptifs pour les boucles for améliorées

```java
// Bon : Noms de variables de boucle appropriés
for (int i = 0; i < items.size(); i++) {
    // Compteur simple
}

for (int row = 0; row < matrix.length; row++) {
    for (int col = 0; col < matrix[row].length; col++) {
        // Noms descriptifs pour boucles imbriquées
    }
}

for (User user : users) {
    // Nom descriptif dans boucle for améliorée
}

// Mauvais : Variables de boucle peu claires
for (int x = 0; x < items.size(); x++) {
    // x est moins clair que i pour des compteurs simples
}

for (User u : users) {
    // Lettre unique dans boucle for améliorée
}
```

## Constantes

Utilisez **UPPER_SNAKE_CASE** (tout en majuscules avec underscores) pour les constantes. Les constantes sont typiquement des champs `static final`.

```java
// Bon : UPPER_SNAKE_CASE pour les constantes
public static final int MAX_RETRY_COUNT = 3;
public static final String DEFAULT_USER_NAME = "Guest";
public static final double PI = 3.14159;
public static final String API_BASE_URL = "https://api.example.com";

// Mauvais : Mauvaise casse pour les constantes
public static final int maxRetryCount = 3; // Devrait être UPPER_SNAKE_CASE
public static final String DEFAULT_USERNAME = "Guest"; // Incohérent
public static final double pi = 3.14159; // Devrait être en majuscules
```

**Exemples :**

```java
// Bon : Constantes bien nommées
public class Configuration {
    public static final int MAX_CONNECTIONS = 100;
    public static final int DEFAULT_TIMEOUT = 30;
    public static final String DATABASE_URL = "jdbc:mysql://localhost:3306/mydb";
    public static final String API_VERSION = "v1";
    public static final String[] SUPPORTED_LANGUAGES = {"en", "fr", "es"};
}

// Mauvais : Constantes mal nommées
public class Configuration {
    public static final int maxConnections = 100; // Devrait être en majuscules
    public static final int MaxConnections = 100; // Devrait être UPPER_SNAKE_CASE
    public static final int MAXCONNECTIONS = 100; // Devrait utiliser des underscores
}
```

**Constantes d'Énumération :**

Les constantes d'énumération doivent être en **UPPER_SNAKE_CASE** (comme les constantes régulières).

```java
// Bon : UPPER_SNAKE_CASE pour les constantes d'énumération
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

// Mauvais : Mauvaise casse pour les constantes d'énumération
public enum UserRole {
    admin, // Devrait être en majuscules
    Moderator, // Devrait être UPPER_SNAKE_CASE
    regularUser // Devrait être UPPER_SNAKE_CASE
}
```

## Paramètres

Utilisez **camelCase** pour les noms de paramètres, suivant les mêmes règles que les variables.

```java
// Bon : Noms de paramètres clairs
public void processOrder(Order order, Customer customer) {}
public User findUserById(Long userId) {}
public boolean isValidEmail(String emailAddress) {}

// Mauvais : Noms de paramètres peu clairs
public void processOrder(Order o, Customer c) {} // Trop courts
public User findUserById(Long id) {} // Pourrait être plus clair comme userId
```

## Paramètres de Type Générique

Utilisez des lettres majuscules uniques pour les paramètres de type générique. Conventions courantes :
- `T` pour Type
- `E` pour Element
- `K` pour Key
- `V` pour Value
- `N` pour Number
- `R` pour Return type

```java
// Bon : Lettres majuscules uniques
public class Repository<T> {}
public interface List<E> {}
public class Map<K, V> {}
public <T> T process(T item) {}
public <R> R execute(Supplier<R> supplier) {}

// Mauvais : Paramètres de type verbeux ou en minuscules
public class Repository<Type> {} // Trop verbeux
public interface List<element> {} // Devrait être en majuscules
public class Map<Key, Value> {} // Utilisez des lettres uniques
```

## Acronymes et Abréviations

Lors de l'utilisation d'acronymes dans les noms, mettez toutes les lettres en majuscules s'il s'agit de 2-3 lettres, sinon traitez-le comme un mot.

```java
// Bon : Gestion des acronymes
public class HttpRequest {} // HTTP -> Http (traiter comme un mot)
public class XmlParser {} // XML -> Xml (traiter comme un mot)
public class ApiClient {} // API -> Api (traiter comme un mot)
public class UserId {} // ID -> Id (traiter comme un mot)

// Pour les acronymes de 2-3 lettres, peuvent être toutes majuscules
public class URLBuilder {} // OK
public class HTMLParser {} // OK

// Mauvais : Gestion incohérente des acronymes
public class HTTPRequest {} // Incohérent avec HttpRequest
public class XMLParser {} // Incohérent avec XmlParser
public class API_CLIENT {} // Mauvaise casse entièrement
```

## Noms de Fichiers

Les fichiers source Java doivent être nommés d'après la classe principale qu'ils contiennent, en utilisant **PascalCase** avec l'extension `.java`.

```java
// Fichier : UserService.java
public class UserService {
    // ...
}

// Fichier : OrderProcessor.java
public class OrderProcessor {
    // ...
}

// Fichier : DatabaseConnection.java
public class DatabaseConnection {
    // ...
}
```

**Important :** Le nom du fichier doit correspondre exactement au nom de la classe publique (sensible à la casse).

## Résumé

| Type | Convention | Exemple |
|------|-----------|---------|
| Packages | minuscules | `com.company.module` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `Runnable`, `UserRepository` |
| Méthodes | camelCase | `getUserName()` |
| Variables | camelCase | `userName` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Constantes d'énumération | UPPER_SNAKE_CASE | `ADMIN`, `REGULAR_USER` |
| Paramètres | camelCase | `userId`, `emailAddress` |
| Paramètres de type | Lettre majuscule unique | `T`, `E`, `K`, `V` |
| Fichiers | PascalCase.java | `UserService.java` |

## Meilleures Pratiques

1. **Soyez Descriptif** : Les noms doivent clairement indiquer le but et la signification
2. **Évitez les Abréviations** : Utilisez des mots complets sauf si l'abréviation est largement comprise
3. **Utilisez une Terminologie Cohérente** : Utilisez les mêmes termes dans tout le codebase
4. **Évitez la Notation Hongroise** : Ne préfixez pas les types (ex: `strName`, `intCount`)
5. **Gardez les Noms Concis** : Mais pas au détriment de la clarté
6. **Utilisez le Langage du Domaine** : Utilisez les termes du domaine du problème quand approprié
7. **Évitez les Lettres Uniques** : Sauf pour les compteurs de boucle et les paramètres de type générique

