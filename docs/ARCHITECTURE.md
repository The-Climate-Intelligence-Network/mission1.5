# Mission 1.5 - Architecture Documentation

## Overview

Mission 1.5 is a climate action mobile application built with **Expo**, **React Native**, and **TypeScript**. The architecture follows **Clean Architecture** and **Domain-Driven Design** principles to ensure scalability, maintainability, and contributor-friendliness.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Expo 54 + React Native 0.81 |
| **Language** | TypeScript (strict mode) |
| **Navigation** | Expo Router (file-based routing) |
| **Styling** | NativeWind v4 (Tailwind CSS for React Native) |
| **UI Library** | GlueStack UI |
| **State Management** | React Context + Hooks |
| **Backend** | Supabase (Auth, Database, Storage) |
| **Internationalization** | i18n-js |
| **Animations** | @legendapp/motion + react-native-reanimated |

---

## Folder Structure

```
mission1.5/
├── app/                    # Expo Router - File-based routing
│   ├── _layout.tsx         # Root layout
│   ├── sign-in.tsx         # Authentication screens
│   ├── (app)/              # Protected app routes
│   │   ├── (tabs)/         # Tab navigator
│   │   └── mission/[id]/   # Dynamic routes
│   └── api/                # API routes (OAuth callbacks)
│
├── src/                    # Source code
│   ├── core/               # Infrastructure & cross-cutting concerns
│   ├── data/               # Data layer (repositories, API clients)
│   ├── domain/             # Business models & entities
│   ├── features/           # Feature modules (business logic)
│   ├── services/           # Platform services (camera, location, etc.)
│   └── ui/                 # Shared UI component library
│
├── assets/                 # Static assets (images, fonts, etc.)
├── docs/                   # Documentation
├── types/                  # Global type definitions

```

---

## Layer-by-Layer Breakdown

### 1. `/app` - Presentation Layer (Expo Router)

**Purpose**: File-based routing and screen components

**Structure**:
```
app/
├── _layout.tsx             # Root layout (font loading, providers)
├── sign-in.tsx             # Public routes
├── (app)/                  # Route group - protected routes
│   ├── _layout.tsx         # App layout (auth check)
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Home/Missions tab
│   │   ├── map.tsx         # Map tab
│   │   ├── quests.tsx      # Quests tab
│   │   ├── community/      # Community tab (nested)
│   │   └── profile.tsx     # Profile tab
│   ├── mission/[id]/       # Dynamic routes
│   │   ├── index.tsx       # Mission details
│   │   └── submit.tsx      # Mission submission
│   └── event/[id]/         # Event details
└── api/                    # API routes
    └── auth/callback+api.ts # OAuth callback handler
```

**Rules**:
- ✅ Screens are **thin** - they compose features and UI components
- ✅ No business logic in screens
- ✅ Use feature modules for logic
- ❌ Don't import from other routes

---

### 2. `/src/core` - Infrastructure Layer

**Purpose**: Cross-cutting concerns and app infrastructure

**Structure**:
```
src/core/
├── auth/           # Authentication utilities & providers
├── bootstrap/      # App initialization logic
├── config/         # Configuration management
├── errors/         # Error handling & custom errors
├── i18n/           # Internationalization setup
├── telemetry/      # Analytics & monitoring
├── theme/          # Theming system
├── types/          # Core type definitions
├── ui/             # UI utilities (haptic feedback, etc.)
└── utils/          # General utility functions
```

**Exports**: Infrastructure services, providers, utilities

**Rules**:
- ✅ Framework-agnostic where possible
- ✅ Reusable across features
- ❌ No feature-specific code

---

### 3. `/src/data` - Data Layer

**Purpose**: Data access and persistence

**Structure**:
```
src/data/
├── client/         # API clients (Supabase, etc.)
├── queue/          # Offline queue for sync
├── repositories/   # Data repositories (abstract data access)
└── sync/           # Data synchronization logic
```

**Exports**: Repositories, API clients, data models

**Patterns**:
- **Repository Pattern** - Abstract data sources
- **Offline-First** - Queue for offline operations
- **Type-Safe** - All API responses typed

**Rules**:
- ✅ Abstract data sources (can swap Supabase for another backend)
- ✅ Handle errors gracefully
- ❌ No UI logic
- ❌ No feature-specific business rules

---

### 4. `/src/domain` - Domain Layer

**Purpose**: Business models, entities, and core business logic

**Structure**:
```
src/domain/
├── events/         # Event domain models
├── missions/       # Mission domain models
├── quests/         # Quest domain models
├── rewards/        # Reward domain models
└── wallet/         # Wallet domain models
```

**Exports**: Domain entities, value objects, business rules

**Rules**:
- ✅ **Framework-agnostic** - pure TypeScript/JavaScript
- ✅ Core business rules live here
- ❌ No dependencies on UI, data, or features
- ❌ No React, no Expo, no external libs

---

### 5. `/src/features` - Feature Modules

**Purpose**: Self-contained feature implementations (business logic + UI)

**Structure** (Example: Missions):
```
src/features/missions/
├── components/     # Mission-specific components
├── hooks/          # Mission-specific hooks
├── types/          # Mission-specific types
├── utils/          # Mission-specific utilities
└── index.ts        # Public API (exports)
```

**All Features**:
- `auth/` - Authentication features
- `campaigns/` - Campaign management
- `community/` - Community features
- `events/` - Event management
- `map/` - Map and location features
- `missions/` - Mission features
- `profile/` - User profile
- `quests/` - Quest system
- `rewards/` - Rewards & gamification

**Rules**:
- ✅ **Self-contained** - Each feature is independent
- ✅ **Export via `index.ts`** - Clear public API
- ✅ Can use: `core/`, `data/`, `domain/`, `ui/`, `services/`
- ❌ **No cross-feature imports** - Features should not import from each other
- ❌ If you need shared logic, move it to `core/` or `domain/`

---

### 6. `/src/services` - Platform Services

**Purpose**: Native platform integrations

**Structure**:
```
src/services/
├── background/     # Background tasks
├── camera/         # Camera service
├── files/          # File management
├── location/       # Location services
└── notifications/  # Push notifications
```

**Exports**: Service interfaces and implementations

**Rules**:
- ✅ Abstract platform APIs
- ✅ Injectable (dependency injection pattern)
- ❌ No UI logic
- ❌ No feature-specific code

---

### 7. `/src/ui` - Shared UI Components

**Purpose**: Reusable UI component library

**Structure**: 61 components including:
- `heading`, `text`, `button`, `input`
- `card`, `box`, `hstack`, `vstack`
- `modal`, `toast`, `alert`, `spinner`
- `table`, `accordion`, `select`, etc.

**Built with**:
- React Native primitives (`View`, `Text`, `Pressable`)
- GlueStack UI utilities
- NativeWind (Tailwind CSS)
- Design system: [Eco-Terminal](docs/ecoterminal.md)

**Rules**:
- ✅ **Reusable** - not feature-specific
- ✅ **Styled with NativeWind** - use Tailwind classes
- ✅ **TypeScript** - all props typed
- ❌ No business logic
- ❌ No data fetching

---

## Dependency Rules

### ✅ Allowed Dependencies

```
app/          → features/, ui/, core/, services/
features/     → core/, data/, domain/, ui/, services/
data/         → core/, domain/
domain/       → (nothing - pure business logic)
core/         → (minimal external dependencies)
services/     → core/
ui/           → core/ (for theming, utils)
```

### ❌ Forbidden Dependencies

- ❌ `features/` → `features/` (no cross-feature imports)
- ❌ `domain/` → `data/`, `features/`, `ui/` (keep domain pure)
- ❌ `ui/` → `features/` (UI should be reusable)
- ❌ `app/` → `data/` (use features instead)

---

## How to Add a New Feature

### Step 1: Create Feature Directory

```bash
mkdir -p src/features/my-feature
cd src/features/my-feature
```

### Step 2: Create Structure

```bash
mkdir components hooks types utils
touch index.ts
```

### Step 3: Build Feature Components

```tsx
// src/features/my-feature/components/MyComponent.tsx
import { View } from 'react-native';
import { Heading, Text } from '@/src/ui';

export function MyComponent() {
  return (
    <View>
      <Heading>My Feature</Heading>
      <Text>Feature implementation</Text>
    </View>
  );
}
```

### Step 4: Create Feature Hooks

```tsx
// src/features/my-feature/hooks/useMyData.ts
export function useMyData() {
  // Business logic
  return { data, loading, error };
}
```

### Step 5: Export Public API

```tsx
// src/features/my-feature/index.ts
export { MyComponent } from './components/MyComponent';
export { useMyData } from './hooks/useMyData';
export type { MyFeatureProps } from './types';
```

### Step 6: Use in App Route

```tsx
// app/(app)/my-feature/index.tsx
import { MyComponent } from '@/src/features/my-feature';

export default function MyFeatureScreen() {
  return <MyComponent />;
}
```

---

## Path Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Usage**:
```tsx
import { Heading } from '@/src/ui/heading';
import { useAuth } from '@/src/core/auth';
import { MissionCard } from '@/src/features/missions';
```

---

## Design System

The app follows the **Eco-Terminal Design System** documented in [ecoterminal.md].

**Key Principles**:
- **Typography**: Space Grotesk (headings), Space Mono (body)
- **Colors**: Climate-inspired palette (greens, blues, earth tones)
- **Components**: Consistent, accessible, responsive
- **Styling**: NativeWind (Tailwind CSS for React Native)

---

## Coding Standards

### TypeScript

- ✅ **Strict mode enabled** - no `any` types
- ✅ **Explicit return types** for exported functions
- ✅ **Interface over type** for object shapes
- ✅ **Const assertions** where applicable

### React / React Native

- ✅ **Functional components** with hooks
- ✅ **Named exports** (not default exports for components)
- ✅ **Props interfaces** named `I{ComponentName}Props`
- ✅ **Hooks** start with `use` prefix
- ✅ **Memoization** - `useMemo`, `useCallback` for performance

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)
- **Utils**: camelCase (`myUtil.ts`)
- **Types**: PascalCase with `I` prefix for interfaces (`IMyType`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

---

## Testing (Future)

**Framework**: Jest + React Native Testing Library

**Structure**:
```
src/features/missions/
├── __tests__/
│   ├── MissionCard.test.tsx
│   └── useMissionData.test.ts
├── components/
└── hooks/
```

**Run Tests**:
```bash
npm test
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android (dark mode) |
| `npm run ios` | Run on iOS (dark mode) |
| `npm run web` | Run on web (dark mode) |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Jest) |

---

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Branching strategy (`main` ← `dev` ← `feat/*`)
- Conventional Commits guidelines
- Pull request process
- Code review standards

---

## Common Patterns

### 1. Data Fetching

```tsx
// In feature hook
import { useQuery } from '@/src/data/repositories/missions';

export function useMissionData(id: string) {
  const { data, loading, error } = useQuery('mission', id);
  return { mission: data, loading, error };
}
```

### 2. Authentication

```tsx
import { useSession } from '@/src/core/auth/AuthProvider';

export function MyComponent() {
  const { user, signOut } = useSession();
  // ...
}
```

### 3. Navigation

```tsx
import { useRouter } from 'expo-router';

export function MyComponent() {
  const router = useRouter();
  
  const handlePress = () => {
    router.push('/mission/123');
  };
}
```

### 4. Styling

```tsx
import { View } from 'react-native';
import { Heading } from '@/src/ui';

export function MyComponent() {
  return (
    <View className="p-4 bg-background-0">
      <Heading size="xl" className="text-primary-600">
        Hello World
      </Heading>
    </View>
  );
}
```

---

## Architecture Decisions

### Why Clean Architecture?

- ✅ **Testable** - Each layer can be tested independently
- ✅ **Maintainable** - Clear separation promotes focused changes
- ✅ **Scalable** - Easy to add features without breaking existing code
- ✅ **Flexible** - Can swap implementations (e.g., change backend)

### Why Feature Modules?

- ✅ **Team Scalability** - Multiple developers can work on different features
- ✅ **Code Ownership** - Clear boundaries for contributions
- ✅ **Lazy Loading** - Can code-split by feature in the future
- ✅ **Reduced Cognitive Load** - Contributors only need to understand one feature at a time

### Why Expo?

- ✅ **Fast Development** - Hot reload, easy setup
- ✅ **Consistent** - Same code for iOS, Android, Web
- ✅ **Modern Tooling** - File-based routing, OTA updates
- ✅ **Community** - Large ecosystem, great documentation

---

## Questions?

For architecture questions or clarifications:
1. Check this document first
2. Review [CONTRIBUTING.md](../CONTRIBUTING.md)
3. Open a GitHub Discussion
4. Tag `@maintainers` in your PR

---

**Last Updated**: 2026-02-06  
**Maintainers**: Climate Intelligence Network Team
