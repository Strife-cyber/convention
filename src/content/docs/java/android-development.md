---
title: Android Development
description: Android app structure, activities, fragments, services, and Android development in Java.
---

# Android Development

This page covers Android development in Java, including app structure, activities, fragments, services, and best practices.

## App Structure

### Project Structure

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── MainActivity.java
│   │   │   ├── activities/
│   │   │   ├── fragments/
│   │   │   ├── adapters/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   ├── values/
│   │   │   └── drawable/
│   │   └── AndroidManifest.xml
```

## Activities

### Basic Activity

```java
// Good: Basic activity implementation
public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize views
        Button button = findViewById(R.id.button);
        button.setOnClickListener(v -> {
            // Handle click
            startActivity(new Intent(this, SecondActivity.class));
        });
    }
    
    @Override
    protected void onStart() {
        super.onStart();
        Log.d(TAG, "onStart");
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume");
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause");
    }
    
    @Override
    protected void onStop() {
        super.onStop();
        Log.d(TAG, "onStop");
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy");
    }
}
```

### Activity Lifecycle

```java
// Good: Handling lifecycle properly
public class UserActivity extends AppCompatActivity {
    private UserViewModel viewModel;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);
        
        // Initialize ViewModel
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        
        // Restore state
        if (savedInstanceState != null) {
            String userId = savedInstanceState.getString("userId");
            viewModel.loadUser(userId);
        }
    }
    
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString("userId", viewModel.getUserId());
    }
}
```

## Fragments

### Basic Fragment

```java
// Good: Fragment implementation
public class UserFragment extends Fragment {
    private static final String ARG_USER_ID = "user_id";
    private String userId;
    
    public static UserFragment newInstance(String userId) {
        UserFragment fragment = new UserFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USER_ID, userId);
        fragment.setArguments(args);
        return fragment;
    }
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            userId = getArguments().getString(ARG_USER_ID);
        }
    }
    
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_user, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        TextView nameTextView = view.findViewById(R.id.name_text_view);
        // Setup views
    }
}
```

## Services

### Background Service

```java
// Good: Service implementation
public class DownloadService extends Service {
    private static final String TAG = "DownloadService";
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String url = intent.getStringExtra("url");
        
        new Thread(() -> {
            downloadFile(url);
            stopSelf();
        }).start();
        
        return START_STICKY;
    }
    
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    
    private void downloadFile(String url) {
        // Download logic
    }
}
```

### IntentService

```java
// Good: IntentService for background tasks
public class MyIntentService extends IntentService {
    private static final String TAG = "MyIntentService";
    
    public MyIntentService() {
        super("MyIntentService");
    }
    
    @Override
    protected void onHandleIntent(Intent intent) {
        String action = intent.getAction();
        if ("DOWNLOAD".equals(action)) {
            String url = intent.getStringExtra("url");
            downloadFile(url);
        }
    }
    
    private void downloadFile(String url) {
        // Download logic
    }
}
```

## Intents

### Explicit Intents

```java
// Good: Explicit intent
Intent intent = new Intent(this, SecondActivity.class);
intent.putExtra("key", "value");
startActivity(intent);

// Good: Intent with result
Intent intent = new Intent(this, SecondActivity.class);
startActivityForResult(intent, REQUEST_CODE);

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_CODE && resultCode == RESULT_OK) {
        String result = data.getStringExtra("result");
        // Handle result
    }
}
```

### Implicit Intents

```java
// Good: Implicit intent
Intent intent = new Intent(Intent.ACTION_SEND);
intent.setType("text/plain");
intent.putExtra(Intent.EXTRA_TEXT, "Hello, World!");
startActivity(Intent.createChooser(intent, "Share via"));
```

## RecyclerView

### Adapter

```java
// Good: RecyclerView adapter
public class UserAdapter extends RecyclerView.Adapter<UserAdapter.ViewHolder> {
    private List<User> users;
    
    public UserAdapter(List<User> users) {
        this.users = users;
    }
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_user, parent, false);
        return new ViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        User user = users.get(position);
        holder.nameTextView.setText(user.getName());
        holder.emailTextView.setText(user.getEmail());
    }
    
    @Override
    public int getItemCount() {
        return users.size();
    }
    
    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView nameTextView;
        TextView emailTextView;
        
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            nameTextView = itemView.findViewById(R.id.name_text_view);
            emailTextView = itemView.findViewById(R.id.email_text_view);
        }
    }
}
```

## Architecture

### MVVM Pattern

```java
// Good: ViewModel
public class UserViewModel extends ViewModel {
    private MutableLiveData<User> user = new MutableLiveData<>();
    private UserRepository repository;
    
    public UserViewModel(UserRepository repository) {
        this.repository = repository;
    }
    
    public LiveData<User> getUser() {
        return user;
    }
    
    public void loadUser(String userId) {
        repository.getUser(userId, new Callback<User>() {
            @Override
            public void onSuccess(User user) {
                UserViewModel.this.user.setValue(user);
            }
            
            @Override
            public void onError(Throwable error) {
                // Handle error
            }
        });
    }
}

// Good: Using ViewModel in Activity
public class UserActivity extends AppCompatActivity {
    private UserViewModel viewModel;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);
        
        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        viewModel.getUser().observe(this, user -> {
            // Update UI
        });
    }
}
```

## Summary

- Follow Android app structure conventions
- Implement proper activity lifecycle management
- Use fragments for reusable UI components
- Use services for background tasks
- Use explicit intents for internal navigation
- Use implicit intents for system actions
- Implement RecyclerView for lists
- Follow MVVM architecture pattern
- Handle configuration changes properly
- Use ViewModel for UI-related data

