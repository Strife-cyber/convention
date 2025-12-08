---
title: Développement Android
description: Structure d'app Android, activités, fragments, services et développement Android en Java.
---

# Développement Android

Cette page couvre le développement Android en Java, incluant structure d'app, activités, fragments, services et meilleures pratiques.

## Structure d'Application

### Structure de Projet

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── MainActivity.java
│   │   │   ├── activities/
│   │   │   ├── fragments/
│   │   │   └── adapters/
```

## Activités

### Activité de Base

```java
// Bon : Implémentation d'activité de base
public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Button button = findViewById(R.id.button);
        button.setOnClickListener(v -> {
            startActivity(new Intent(this, SecondActivity.class));
        });
    }
}
```

## Fragments

### Fragment de Base

```java
// Bon : Implémentation de fragment
public class UserFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_user, container, false);
    }
}
```

## Résumé

- Suivez les conventions de structure d'app Android
- Implémentez une gestion appropriée du cycle de vie des activités
- Utilisez les fragments pour composants UI réutilisables
- Utilisez les services pour tâches en arrière-plan

