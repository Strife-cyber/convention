---
title: Style de Code
description: Formatage Java, guide de style et bases incluant variables, boucles et conditions.
---

# Style de Code

Cette page documente les standards de style de code, règles de formatage et concepts Java de base incluant variables, boucles et conditions. Nous suivons les [Conventions de Code Java Officielles](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html) et les meilleures pratiques de l'industrie.

## Formatage

### Indentation

Utilisez **4 espaces** pour l'indentation (pas de tabulations). C'est la convention Java standard.

```java
// Bon : Indentation de 4 espaces
public class UserService {
    public void processUser(User user) {
        if (user != null) {
            String name = user.getName();
            System.out.println(name);
        }
    }
}

// Mauvais : Tabulations ou indentation incohérente
public class UserService {
	public void processUser(User user) { // Tabulations au lieu d'espaces
  if (user != null) { // Indentation incohérente
      String name = user.getName();
  }
    }
}
```

### Style d'Accolades

Utilisez le **style K&R** (accolade ouvrante sur la même ligne) pour les méthodes, classes et structures de contrôle :

```java
// Bon : Style d'accolades K&R
public class UserService {
    public void processUser(User user) {
        if (user != null) {
            // Code ici
        }
    }
}

// Mauvais : Style Allman (accolades sur nouvelles lignes)
public class UserService
{
    public void processUser(User user)
    {
        if (user != null)
        {
            // Code ici
        }
    }
}
```

**Exception :** Pour les blocs vides, vous pouvez utiliser une seule ligne :

```java
// Bon : Bloc vide sur une ligne
public void doNothing() {}

// Aussi acceptable : Bloc vide avec accolades
public void doNothing() {
    // Intentionnellement vide
}
```

### Longueur de Ligne

Gardez les lignes à un maximum de **120 caractères**. Si une ligne dépasse cela, cassez-la appropriément.

```java
// Bon : Lignes dans les 120 caractères
public User findUserById(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
}

// Bon : Casser les longues lignes appropriément
String message = "Ceci est un message très long qui doit être cassé "
    + "sur plusieurs lignes pour une meilleure lisibilité.";

// Mauvais : Lignes dépassant 120 caractères
public User findUserById(Long userId) { return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found: " + userId)); }
```

### Espacement

Utilisez des espaces autour des opérateurs et après les virgules :

```java
// Bon : Espacement approprié
int sum = a + b;
if (x > 0 && y < 10) {
    // Code
}
method(param1, param2, param3);

// Mauvais : Espaces manquants
int sum=a+b;
if(x>0&&y<10){
    // Code
}
method(param1,param2,param3);
```

## Variables

### Déclaration de Variables

Déclarez les variables avec leur type, en utilisant des noms significatifs :

```java
// Bon : Déclarations de variables claires
String userName = "John";
int itemCount = 0;
boolean isActive = true;
List<String> names = new ArrayList<>();
User currentUser = null;

// Mauvais : Variables peu claires ou mal nommées
String u = "John"; // Trop court
int c = 0; // Peu clair
boolean flag = true; // Pas descriptif
List<String> list = new ArrayList<>(); // Trop générique
```

### Types Primitifs

Java a 8 types primitifs. Utilisez-les appropriément :

```java
// Types primitifs
byte byteValue = 127;        // Entier 8 bits (-128 à 127)
short shortValue = 32767;    // Entier 16 bits (-32,768 à 32,767)
int intValue = 2147483647;   // Entier 32 bits
long longValue = 9223372036854775807L; // Entier 64 bits (notez le suffixe L)
float floatValue = 3.14f;     // Point flottant 32 bits (notez le suffixe f)
double doubleValue = 3.14159; // Point flottant 64 bits
char charValue = 'A';         // Caractère Unicode 16 bits
boolean boolValue = true;     // true ou false

// Bon : Utilisation de types primitifs appropriés
int age = 25;
double price = 19.99;
boolean isValid = true;
char grade = 'A';

// Mauvais : Utilisation de classes wrapper quand les primitifs suffiraient
Integer age = 25; // Utilisez int à la place
Double price = 19.99; // Utilisez double à la place
Boolean isValid = true; // Utilisez boolean à la place
```

### Types Objets (Classes Wrapper)

Utilisez les classes wrapper quand vous avez besoin de fonctionnalités d'objets (null, collections, etc.) :

```java
// Bon : Utilisation de classes wrapper quand nécessaire
List<Integer> numbers = new ArrayList<>(); // Les collections nécessitent des objets
Integer userId = null; // Peut être null
Double price = calculatePrice(); // La méthode peut retourner null

// Bon : Utilisation de primitifs quand possible
int count = 0; // Le primitif est plus efficace
double total = 0.0; // Le primitif est plus efficace
boolean isActive = true; // Le primitif est plus efficace
```

### Variables Final

Utilisez `final` pour les variables qui ne doivent pas être réassignées :

```java
// Bon : Utilisation de final pour constantes et références immuables
final String userName = "John";
final int MAX_RETRIES = 3;
final List<String> items = new ArrayList<>(); // La référence est finale, la liste peut être modifiée
items.add("item1"); // OK - modification de la liste
// items = new ArrayList<>(); // Erreur - ne peut pas réassigner

// Mauvais : Ne pas utiliser final quand la variable ne devrait pas changer
String userName = "John";
userName = "Jane"; // Devrait être final
```

### Initialisation de Variables

Initialisez les variables appropriément :

```java
// Bon : Initialiser les variables
int count = 0;
String name = "";
List<String> items = new ArrayList<>();
User user = null; // Null explicite quand nécessaire

// Bon : Initialiser dans le constructeur
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository; // Initialiser dans le constructeur
    }
}

// Mauvais : Variables non initialisées
int count; // Devrait être initialisé
String name; // Devrait être initialisé
```

### Portée

Gardez la portée des variables aussi étroite que possible :

```java
// Bon : Portée étroite
public void processItems(List<Item> items) {
    for (Item item : items) {
        String itemName = item.getName(); // Portée limitée à la boucle
        processItem(itemName);
    }
    // itemName n'est pas accessible ici
}

// Mauvais : Portée trop large
String itemName; // Déclaré en dehors de la boucle
for (Item item : items) {
    itemName = item.getName();
    processItem(itemName);
}
// itemName toujours accessible ici inutilement
```

## Boucles

### Boucle For

Utilisez la boucle for traditionnelle quand vous avez besoin de l'index :

```java
// Bon : Boucle for traditionnelle avec index
for (int i = 0; i < items.size(); i++) {
    Item item = items.get(i);
    processItem(item);
}

// Bon : Boucle for traditionnelle avec plusieurs variables
for (int i = 0, j = items.size() - 1; i < j; i++, j--) {
    Item first = items.get(i);
    Item last = items.get(j);
    swap(first, last);
}

// Mauvais : Utilisation de l'index quand non nécessaire
for (int i = 0; i < items.size(); i++) {
    Item item = items.get(i);
    processItem(item); // Pourrait utiliser la boucle for améliorée
}
```

### Boucle For Améliorée (For-Each)

Utilisez la boucle for améliorée quand vous n'avez pas besoin de l'index :

```java
// Bon : Boucle for améliorée
for (Item item : items) {
    processItem(item);
}

// Bon : Boucle for améliorée avec collections
for (String name : nameList) {
    System.out.println(name);
}

// Bon : Boucle for améliorée avec tableaux
for (int number : numbers) {
    sum += number;
}

// Mauvais : Boucle for traditionnelle quand l'index n'est pas nécessaire
for (int i = 0; i < items.size(); i++) {
    Item item = items.get(i);
    processItem(item); // Devrait utiliser la boucle for améliorée
}
```

### Boucle While

Utilisez la boucle while quand le nombre d'itérations est inconnu :

```java
// Bon : Boucle while pour itérations inconnues
Scanner scanner = new Scanner(System.in);
String input;
while (!(input = scanner.nextLine()).equals("quit")) {
    processInput(input);
}

// Bon : Boucle while avec condition
int count = 0;
while (count < 10) {
    System.out.println(count);
    count++;
}

// Mauvais : Boucle while qui pourrait être une boucle for
int i = 0;
while (i < items.size()) { // Devrait utiliser la boucle for
    processItem(items.get(i));
    i++;
}
```

### Boucle Do-While

Utilisez do-while quand vous devez exécuter au moins une fois :

```java
// Bon : Do-while pour au moins une exécution
Scanner scanner = new Scanner(System.in);
String input;
do {
    System.out.print("Entrez la commande : ");
    input = scanner.nextLine();
    processCommand(input);
} while (!input.equals("quit"));

// Mauvais : Do-while quand un while régulier fonctionnerait
int i = 0;
do {
    processItem(items.get(i));
    i++;
} while (i < items.size()); // Devrait utiliser la boucle for
```

### API Stream (Java 8+)

Utilisez l'API Stream pour des opérations de style fonctionnel :

```java
// Bon : API Stream pour transformations
List<String> upperNames = names.stream()
    .map(String::toUpperCase)
    .filter(name -> name.length() > 5)
    .collect(Collectors.toList());

// Bon : API Stream pour filtrage
List<User> activeUsers = users.stream()
    .filter(User::isActive)
    .collect(Collectors.toList());

// Bon : API Stream pour recherche
Optional<User> admin = users.stream()
    .filter(user -> user.getRole() == UserRole.ADMIN)
    .findFirst();

// Bon : API Stream pour agrégation
int total = numbers.stream()
    .mapToInt(Integer::intValue)
    .sum();

// Mauvais : Utilisation de boucles quand l'API Stream serait plus claire
List<String> upperNames = new ArrayList<>();
for (String name : names) {
    if (name.length() > 5) {
        upperNames.add(name.toUpperCase());
    }
} // L'API Stream serait plus concise
```

### Instructions de Contrôle de Boucle

Utilisez `break` et `continue` appropriément :

```java
// Bon : Utilisation de break pour sortir tôt
for (Item item : items) {
    if (item.isExpired()) {
        break; // Sortir de la boucle quand un item expiré est trouvé
    }
    processItem(item);
}

// Bon : Utilisation de continue pour sauter une itération
for (Item item : items) {
    if (item.isExpired()) {
        continue; // Sauter les items expirés
    }
    processItem(item);
}

// Bon : Break/continue étiquetés pour boucles imbriquées
outer: for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == target) {
            break outer; // Casser la boucle externe
        }
    }
}

// Mauvais : Abus de break/continue
for (Item item : items) {
    if (!item.isExpired()) {
        processItem(item);
    } // Mieux que d'utiliser continue
}
```

## Conditions

### Instructions If-Else

Utilisez if-else pour la logique conditionnelle :

```java
// Bon : Structure if-else claire
if (user != null) {
    processUser(user);
} else {
    handleNullUser();
}

// Bon : Conditions multiples
if (age < 18) {
    System.out.println("Mineur");
} else if (age < 65) {
    System.out.println("Adulte");
} else {
    System.out.println("Senior");
}

// Bon : Pattern de retour anticipé
public User findUser(Long id) {
    if (id == null) {
        return null;
    }
    if (id < 0) {
        throw new IllegalArgumentException("L'ID doit être positif");
    }
    return userRepository.findById(id);
}

// Mauvais : Instructions if profondément imbriquées
if (user != null) {
    if (user.isActive()) {
        if (user.hasPermission()) {
            // Trop de niveaux d'imbrication
        }
    }
}
```

### Opérateur Ternaire

Utilisez l'opérateur ternaire pour des assignations conditionnelles simples :

```java
// Bon : Opérateur ternaire simple
String status = isActive ? "Actif" : "Inactif";
int max = a > b ? a : b;

// Bon : Ternaire imbriqué (utiliser avec parcimonie)
String message = age < 18 ? "Mineur" : (age < 65 ? "Adulte" : "Senior");

// Mauvais : Opérateur ternaire complexe
String result = condition1 ? (condition2 ? value1 : value2) : (condition3 ? value3 : value4); // Trop complexe, utilisez if-else
```

### Instructions Switch

Utilisez switch pour des comparaisons de valeurs multiples :

```java
// Bon : Instruction switch
switch (dayOfWeek) {
    case MONDAY:
    case TUESDAY:
    case WEDNESDAY:
    case THURSDAY:
    case FRIDAY:
        System.out.println("Jour de semaine");
        break;
    case SATURDAY:
    case SUNDAY:
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Jour invalide");
}

// Bon : Expression switch (Java 14+)
String dayType = switch (dayOfWeek) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Jour de semaine";
    case SATURDAY, SUNDAY -> "Weekend";
    default -> "Invalide";
};

// Mauvais : Instructions break manquantes
switch (dayOfWeek) {
    case MONDAY:
        System.out.println("Lundi");
        // Break manquant - continue
    case TUESDAY:
        System.out.println("Mardi");
        break;
}
```

### Pattern Matching (Java 17+)

Utilisez le pattern matching pour les vérifications instanceof :

```java
// Bon : Pattern matching avec instanceof
if (obj instanceof String str) {
    System.out.println(str.toUpperCase()); // str est automatiquement casté
}

// Bon : Pattern matching dans switch (Java 17+)
String result = switch (obj) {
    case String s -> "String: " + s;
    case Integer i -> "Integer: " + i;
    case null -> "Null";
    default -> "Inconnu";
};

// Mauvais : instanceof traditionnel avec cast explicite
if (obj instanceof String) {
    String str = (String) obj; // Cast explicite nécessaire
    System.out.println(str.toUpperCase());
}
```

### Opérateurs Logiques

Utilisez les opérateurs logiques appropriément :

```java
// Bon : ET logique
if (user != null && user.isActive()) {
    processUser(user);
}

// Bon : OU logique
if (role == UserRole.ADMIN || role == UserRole.MODERATOR) {
    grantAccess();
}

// Bon : Évaluation court-circuit
if (list != null && !list.isEmpty()) {
    processList(list);
}

// Mauvais : Utilisation d'opérateurs bitwise pour logique booléenne
if (user != null & user.isActive()) { // Devrait utiliser &&
    processUser(user);
}
```

## Organisation du Code

### Ordre des Membres de Classe

Organisez les membres de classe dans cet ordre :

1. Constantes (static final)
2. Variables statiques
3. Variables d'instance
4. Constructeurs
5. Méthodes (publiques, puis privées)
6. Classes internes

```java
// Bon : Classe bien organisée
public class UserService {
    // 1. Constantes
    private static final int MAX_RETRIES = 3;
    private static final String DEFAULT_NAME = "Guest";
    
    // 2. Variables statiques
    private static int instanceCount = 0;
    
    // 3. Variables d'instance
    private final UserRepository repository;
    private String currentUser;
    
    // 4. Constructeurs
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
    
    // 5. Méthodes publiques
    public User findUser(Long id) {
        return repository.findById(id);
    }
    
    // 6. Méthodes privées
    private void validateUser(User user) {
        // Logique de validation
    }
}
```

### Instructions d'Import

Organisez les imports dans cet ordre :

1. Imports de la bibliothèque standard Java
2. Imports de bibliothèques tierces
3. Imports de l'application

```java
// Bon : Imports organisés
// 1. Bibliothèque standard Java
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

// 2. Bibliothèques tierces
import org.springframework.stereotype.Service;
import org.hibernate.Session;

// 3. Imports de l'application
import com.company.project.model.User;
import com.company.project.repository.UserRepository;

// Mauvais : Imports non organisés
import com.company.project.model.User;
import java.util.List;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
```

## Commentaires

### Commentaires JavaDoc

Utilisez JavaDoc pour les APIs publiques :

```java
/**
 * Calcule le prix total incluant la taxe.
 *
 * @param subtotal le prix avant taxe
 * @param taxRate le taux de taxe en décimal (ex: 0.1 pour 10%)
 * @return le prix total incluant la taxe
 * @throws IllegalArgumentException si subtotal ou taxRate est négatif
 */
public double calculateTotal(double subtotal, double taxRate) {
    if (subtotal < 0 || taxRate < 0) {
        throw new IllegalArgumentException("Les valeurs doivent être non-négatives");
    }
    return subtotal * (1 + taxRate);
}
```

### Commentaires Inline

Utilisez `//` pour les commentaires inline. Expliquez **pourquoi**, pas **quoi** :

```java
// Bon : Explique pourquoi
// Utiliser StringBuilder pour une concaténation de chaînes efficace dans les boucles
StringBuilder sb = new StringBuilder();
for (String item : items) {
    sb.append(item);
}

// Mauvais : Explique quoi (évident depuis le code)
// Ajouter item à StringBuilder
sb.append(item);
```

## Résumé

- Utilisez 4 espaces pour l'indentation
- Utilisez le style d'accolades K&R (accolade ouvrante sur même ligne)
- Gardez les lignes sous 120 caractères
- Utilisez des noms de variables significatifs
- Préférez les primitifs aux classes wrapper quand possible
- Utilisez `final` pour les variables immuables
- Utilisez la boucle for améliorée quand l'index n'est pas nécessaire
- Utilisez l'API Stream pour des opérations fonctionnelles
- Utilisez des retours anticipés pour réduire l'imbrication
- Utilisez switch pour des comparaisons de valeurs multiples
- Organisez les membres de classe logiquement
- Utilisez JavaDoc pour les APIs publiques
- Expliquez **pourquoi** dans les commentaires, pas **quoi**

