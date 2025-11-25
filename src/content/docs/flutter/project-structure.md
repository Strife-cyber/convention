---
title: Project Structure
description: Folder organization and architecture for Flutter projects.
---

This guide now mirrors the layout used in legacy projects such as `braidsbook_mobile`. It favors descriptive directories (`views/`, `notifiers/`, `manager/`, etc.) over deep Clean Architecture nesting so teams can reason about the codebase quickly.

## Directory Structure

```text
lib/
├── l10n/
├── manager/
│   ├── auth/
│   └── diagnostics/
├── models/
│   ├── auth/
│   └── profile/
├── notifiers/
│   ├── auth/
│   └── profile/
├── services/
│   ├── api/
│   └── storage/
├── theme/
│   ├── colors.dart
│   ├── spacing.dart
│   └── text_styles.dart
├── utils/
│   ├── formatters/
│   └── validators/
├── views/
│   ├── auth/
│   └── profile/
├── widgets/
│   ├── buttons/
│   └── cards/
├── app_config.dart
├── firebase_options.dart
└── main.dart
```

The folder names describe the primary concern. Keep each folder shallow; introduce one level of feature or concern-based subfolders (`auth/`, `profile/`, `billing/`, etc.) whenever the file count grows, and mirror those subfolders across directories so navigation stays predictable.

### `l10n/`

Holds generated localization files and the `arb` sources. Recommended layout:

- `arb/` for editable `intl_xx.arb` definitions
- `generated/` for `messages_xx.dart` produced by Flutter's l10n tooling

Never edit generated files manually—automate via `flutter gen-l10n`.

### `manager/`

Coarse-grained orchestrators that own app-wide flows (session bootstrap, navigation guards, background sync). Each manager should expose:

- A focused API (`AuthManager`, `CrashReportingManager`, etc.)
- Initialization hooks invoked from `main.dart` or `app_config.dart`
- Dependency injection via constructors so managers stay testable

Avoid dumping generic helpers here; if the logic is stateless, it likely belongs in `utils/`.

**Scaling tip**: When an area needs multiple managers, nest them under a domain folder (`manager/auth/`, `manager/payments/`) so related orchestrators stay grouped.

### `models/`

Pure data representations shared across the app:

- API DTOs that mirror backend contracts
- Domain value objects (e.g., `Money`, `GeoPoint`)
- Persistence models for local databases

Keep them immutable when possible and pair them with serialization helpers (`fromJson`, `toJson`). Co-locate fixtures or `fake_*.dart` files for tests.

**Common subfolders**: Group by domain (`models/auth/`, `models/profile/`) to match the way views and notifiers are organized.

### `notifiers/`

State holders (Riverpod notifiers, ChangeNotifiers, Bloc classes). Each notifier:

- Consumes services/managers rather than reaching out to HTTP directly
- Exposes strongly typed state models from `models/`
- Lives close to the logic it manages; if a notifier only serves one screen, prepend the screen name (e.g., `profile_notifier.dart`)

Document state transitions inside the file so other developers understand the lifecycle.

Add subfolders like `notifiers/auth/` once a domain hosts several state holders, mirroring the naming used under `views/`.

### `services/`

IO-facing abstractions: REST clients, storage, analytics, push notifications, payment SDKs. Guidelines:

- One service per external system; split read/write responsibilities when helpful
- Keep each service stateless and inject dependencies in constructors
- Provide mock or fake implementations for widget tests

Managers and notifiers consume services; UI should never reference them directly.

Split integrations by concern (`services/api/`, `services/storage/`, `services/notifications/`) so fake and real clients live side by side.

### `theme/`

Centralize color schemes, typography, component themes, and spacing tokens. Common files:

- `app_theme.dart`: exposes `ThemeData` variants
- `colors.dart`, `text_styles.dart`, `spacing.dart`

Hook these up inside `main.dart` so all `MaterialApp` instances use the same configuration.

### `utils/`

Small, stateless helpers: formatters, validators, date/number utilities, extensions. Keep functions pure and unit-test them directly. If a utility grows stateful (e.g., caching), relocate it to `services/`.

Suggested layout: `utils/formatters/`, `utils/validators/`, `utils/extensions/` once the helpers exceed a handful of files.

### `views/`

Top-level screens and flows. Each file usually defines a full page (`HomeView`, `BookingFlowView`). Recommended conventions:

- Name files after the route (e.g., `login_view.dart`)
- Keep widget trees readable; extract reusable components to `widgets/`
- Compose view logic from notifiers via providers or controllers

Subfolders like `views/auth/` are fine when a domain has multiple screens.

Whenever you introduce such subfolders, echo the same domain name under `notifiers/`, `models/`, and `services/` so teams can trace a feature end to end.

### `widgets/`

Reusable UI components (buttons, cards, layout primitives). Widgets should be presentation-only: accept data via parameters and expose callbacks instead of instantiating services. If a widget requires logic, pair it with a notifier under `notifiers/` or convert it into a `view`.

Break large collections into families (`widgets/buttons/`, `widgets/cards/`, `widgets/forms/`) to keep diffs small and imports clear.

### Configuration Files

- `app_config.dart`: runtime configuration (API endpoints, feature flags). Load `.env` values here and expose typed getters.
- `app_config.dart.backup`: snapshot of previous config—keep it only if your workflow depends on manual rollback.
- `firebase_options.dart`: generated by `flutterfire configure`; never edit by hand.
- `main.dart`: initializes bindings, loads config, wires managers/notifiers, and runs the root widget.

Example boot sequence:

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final config = await AppConfig.load();
  await ManagerRegistry.bootstrap(config);
  runApp(MyApp(config: config));
}
```

### Data Flow Example

1. `views/profile_view.dart` watches `ProfileNotifier`.
2. `ProfileNotifier` requests data from `UserService`.
3. `UserService` fetches/updates `UserModel`.
4. `UserModel` updates notify the view via the notifier's state.

This horizontal flow keeps responsibilities separated without deep nesting.

## Assets

Standard Flutter asset layout still applies:

```text
assets/
├── images/
├── fonts/
└── animations/
```

Declare them inside `pubspec.yaml` and keep names synchronized with widgets that consume them.

## Best Practices

1. **One responsibility per folder**: if a file lives in `services/`, it should only talk to external systems.
2. **Prefer composition over inheritance**: managers compose services, not extend them.
3. **Keep layers thin**: if a notifier begins to duplicate manager logic, consolidate it.
4. **Document contracts**: add short comments to notifiers/services explaining side effects.
5. **Pair tests with code**: `*_test.dart` files can sit next to their subjects inside each directory.
6. **Automate generation**: use `build_runner` or `flutter gen-l10n` so `models/` and `l10n/` stay consistent.

## When to Revisit the Structure

Consider reintroducing feature-based folders or Clean Architecture slices if:

- A single directory (e.g., `views/`) grows beyond what navigation can manage
- Multiple teams own different product areas and need stricter boundaries
- You plan to extract packages/modules for reuse

Until then, the legacy-inspired structure keeps onboarding fast while remaining scalable through clear naming and disciplined responsibilities.
