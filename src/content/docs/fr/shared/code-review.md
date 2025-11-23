---
title: Revue de Code
description: Directives et standards de revue de code pour tous les projets.
---

# Revue de Code

Cette page documente les directives et standards de revue de code pour tous les projets. Les revues de code sont essentielles pour maintenir la qualité du code et partager les connaissances.

## Objectifs de la Revue

Les revues de code servent plusieurs objectifs :

1. **Qualité du Code** : S'assurer que le code respecte les standards et meilleures pratiques
2. **Prévention des Bugs** : Attraper les bugs avant qu'ils n'atteignent la production
3. **Partage de Connaissances** : Partager les connaissances à travers l'équipe
4. **Cohérence** : Maintenir un style de codage cohérent
5. **Sécurité** : Identifier les vulnérabilités de sécurité
6. **Performance** : Repérer les problèmes de performance tôt

## Checklist de Revue

### Fonctionnalité

- [ ] Le code fonctionne-t-il comme prévu ?
- [ ] Les cas limites sont-ils gérés ?
- [ ] Les cas d'erreur sont-ils gérés ?
- [ ] S'intègre-t-il correctement avec le code existant ?
- [ ] Y a-t-il des effets secondaires ?

### Qualité du Code

- [ ] Le code est-il lisible et maintenable ?
- [ ] Suit-il les conventions du projet ?
- [ ] Les conventions de nommage sont-elles suivies ?
- [ ] Le code est-il correctement organisé ?
- [ ] Y a-t-il des code smells ?
- [ ] Le code est-il DRY (Don't Repeat Yourself) ?

### Performance

- [ ] Y a-t-il des problèmes de performance ?
- [ ] Y a-t-il des opérations inutiles ?
- [ ] Les ressources sont-elles correctement disposées ?
- [ ] Y a-t-il des fuites mémoire ?
- [ ] Le code est-il optimisé de manière appropriée ?

### Sécurité

- [ ] Les entrées sont-elles validées ?
- [ ] Les données sensibles sont-elles gérées de manière sécurisée ?
- [ ] Y a-t-il des vulnérabilités de sécurité ?
- [ ] Les clés API/secrets sont-ils correctement gérés ?
- [ ] L'authentification/autorisation est-elle correcte ?

### Tests

- [ ] Les tests sont-ils inclus ?
- [ ] Les tests couvrent-ils la nouvelle fonctionnalité ?
- [ ] Les cas limites sont-ils testés ?
- [ ] Les tests passent-ils ?
- [ ] La couverture de tests est-elle adéquate ?

## Processus de Revue

### Délai

- **Petites PRs** (< 200 lignes) : Revue dans les 24 heures
- **PRs moyennes** (200-500 lignes) : Revue dans les 48 heures
- **Grandes PRs** (> 500 lignes) : Revue dans les 72 heures

**Note :** Divisez les grandes PRs en plus petites quand c'est possible.

### Reviseurs

- Au moins **une approbation** requise avant fusion
- Pour les changements critiques, exiger **deux approbations**
- L'auteur ne doit pas approuver sa propre PR

### Étapes de Revue

1. **Revue Initiale** : Le reviseur lit le code
2. **Commentaires** : Le reviseur ajoute des commentaires pour les problèmes/questions
3. **Discussion** : L'auteur et le reviseur discutent des commentaires
4. **Changements** : L'auteur répond aux commentaires
5. **Re-revue** : Le reviseur vérifie si les changements répondent aux préoccupations
6. **Approbation** : Le reviseur approuve quand satisfait

## Commentaires de Revue

### Types de Commentaires

**Doit Corriger :**
- Bugs critiques
- Problèmes de sécurité
- Changements cassants
- Code qui ne fonctionne pas

**Devrait Corriger :**
- Problèmes de qualité de code
- Préoccupations de performance
- Violations de meilleures pratiques
- Incohérences de style

**Suggestion :**
- Approches alternatives
- Améliorations potentielles
- Changements nice-to-have

**Question :**
- Clarification nécessaire
- Vérification de compréhension
- Décisions de design

### Écrire de Bons Commentaires

**Soyez Constructif :**
```
Bon : "Considérez extraire cette logique dans une méthode séparée pour une meilleure réutilisabilité."

Mauvais : "C'est faux."
```

**Soyez Spécifique :**
```
Bon : "La vérification null à la ligne 45 devrait utiliser l'opérateur null-conditionnel (?.) à la place."

Mauvais : "Corrigez ça."
```

**Suggérez des Solutions :**
```
Bon : "Cela pourrait être simplifié en utilisant une expression switch : switch (type) { case A: return 1; ... }"

Mauvais : "C'est trop complexe."
```

**Expliquez Pourquoi :**
```
Bon : "Utiliser async/await ici empêcherait de bloquer le thread UI pendant l'appel API."

Mauvais : "Utilisez async."
```

## Répondre aux Revues

### Reconnaître les Commentaires

- Remerciez les reviseurs pour leur temps
- Reconnaissez tous les commentaires (même si vous n'êtes pas d'accord)
- Demandez des clarifications si nécessaire

### Répondre aux Commentaires

- Corrigez les éléments "Doit Corriger" immédiatement
- Considérez sérieusement les éléments "Devrait Corriger"
- Évaluez les "Suggestions" et implémentez si précieux
- Répondez aux "Questions" clairement

### Pousser les Mises à Jour

- Poussez les mises à jour au fur et à mesure que vous répondez aux commentaires
- N'attendez pas que tous les commentaires soient traités
- Marquez les commentaires résolus comme résolus
- Demandez une re-revue quand prêt

### Désaccords

Si vous n'êtes pas d'accord avec un commentaire de revue :

1. **Discuter** : Ayez une discussion respectueuse
2. **Expliquer** : Expliquez votre raisonnement
3. **Compromis** : Trouvez un terrain d'entente si possible
4. **Escalader** : Impliquez le lead de l'équipe si nécessaire

## Meilleures Pratiques

### Pour les Reviseurs

- **Revoyez Promptement** : Ne retardez pas les revues
- **Soyez Respectueux** : Concentrez-vous sur le code, pas la personne
- **Soyez Constructif** : Fournissez des commentaires utiles
- **Soyez Spécifique** : Pointez vers des problèmes exacts
- **Suggérez des Solutions** : Ne pointez pas seulement les problèmes
- **Posez des Questions** : Si quelque chose n'est pas clair, demandez
- **Approuvez Quand Prêt** : Ne demandez pas de changements inutiles

### Pour les Auteurs

- **Auto-Revue D'abord** : Revoyez votre propre code avant de demander une revue
- **Écrivez des PRs Claires** : Fournissez du contexte et des explications
- **Gardez les PRs Petites** : Plus faciles à revoir et comprendre
- **Répondez Promptement** : Répondez aux commentaires rapidement
- **Soyez Ouvert aux Commentaires** : Acceptez les critiques constructives
- **Posez des Questions** : Si les commentaires ne sont pas clairs, demandez des clarifications

### Général

- **Concentrez-vous sur le Code** : Revoyez le code, pas l'auteur
- **Soyez Professionnel** : Maintenez une communication respectueuse
- **Apprenez des Revues** : Utilisez les revues comme opportunités d'apprentissage
- **Partagez les Connaissances** : Expliquez votre raisonnement
- **Célébrez le Bon Code** : Reconnaissez le code bien écrit

## Outils de Revue

### Revues de PR GitHub/GitLab

- Commentaires inline sur des lignes spécifiques
- Commentaires au niveau fichier
- Approbation/demande de changements
- Fils de discussion

### Checklist de Revue de Code

Utilisez la checklist ci-dessus comme modèle pour les revues.

### Vérifications Automatisées

- Linters (détectent les problèmes de style)
- Tests (assurent la fonctionnalité)
- CI/CD (vérifient les builds)
- Scanners de sécurité (trouvent les vulnérabilités)

## Résumé

- Revoyez pour la fonctionnalité, qualité, performance, sécurité et tests
- Revoyez dans les 24-72 heures selon la taille de la PR
- Écrivez des commentaires constructifs et spécifiques
- Répondez aux commentaires promptement et professionnellement
- Concentrez-vous sur la qualité du code et le partage de connaissances
- Utilisez les revues comme opportunités d'apprentissage

