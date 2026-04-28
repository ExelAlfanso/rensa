# Frontend AGENTS Guide

This guide defines how frontend changes should be designed and implemented in
`src/frontend` and related UI-facing code paths.

## Scope

Applies to:
- `src/frontend/**`
- `src/app/**` (frontend rendering concerns only)
- `src/lib/axios-client.ts`
- `src/app/globals.css`

For backend/controller/service/repository rules, follow
`.agents/apps/web/src/backend/AGENTS.md`.

## Current Frontend Direction (As Of April 2026)

The app is built on:
- Next.js App Router (`src/app`)
- React 19 client/server components
- Tailwind CSS v4 + DaisyUI
- React Query for async server-state in UI
- Zustand for local/session-backed app state
- NextAuth session integration via provider wrappers

When adding features, prefer existing frontend primitives and providers over
introducing new state stacks or custom networking layers.

Scalable structure direction:
- Feature-first modules under `src/frontend/features/<feature>`.
- Container/component split inside features:
  - `containers/` for data orchestration and side effects
  - `components/` for presentational UI only
- Shared cross-feature modules under `src/frontend/shared`.

## Architecture Rules

### 0) Layer Rules (UI Clean Boundaries)

Mandatory dependency direction:
- `app route/page/layout` -> `frontend features/sections/components/providers/hooks` -> `lib/api client`

Rules:
- UI components must not call database or server SDKs directly.
- Server communication from client code must go through existing HTTP API
  endpoints (via `axios-client` or `fetch`).
- Keep feature logic near usage:
  - Reusable UI in `components/`
  - Page composition in `sections/`
  - Cross-cutting client state in `providers/` or `stores/`

### 1) Server vs Client Components

Rules:
- Default to Server Components in `src/app` unless interactivity requires
  client behavior.
- Add `"use client"` only when required (`useState`, `useEffect`, browser APIs,
  event handlers, Zustand hooks, React Query hooks).
- Do not make Client Components `async`; perform async work in route handlers or
  data/query hooks.

### 2) Component Design

Rules:
- Keep components focused and composable.
- Use existing primitives before creating new variants:
  - Buttons: `components/buttons/*`
  - Inputs: `components/inputfields/*`
  - Dropdowns: `components/dropdowns/*`
  - Forms: `components/forms/*`
- Prefer props that describe intent (`variant`, `size`, `disabled`) over ad-hoc
  boolean combinations.
- Avoid deeply nested conditional JSX; extract subcomponents or named booleans.

### 3) State Management

Use the right state container:
- Local transient UI state: `useState`
- Shared client session/app state: Zustand stores (`src/frontend/stores`)
- Server state + caching/retries: React Query (`src/frontend/providers/QueryProvider.tsx`)
- Cross-tree feature coordination: Context provider (`src/frontend/providers`)

Rules:
- Avoid duplicating the same server-state in both React Query and Zustand.
- Keep Zustand stores serializable and minimal.
- Persist only what must survive refresh (for auth store, current pattern is
  sessionStorage-backed persistence).

### 4) Networking and Data Fetching

Rules:
- Use `@/lib/axios-client` for client-side API calls where project already does.
- Keep request/response shaping in service or hook layers, not presentational
  components.
- Handle loading and error states explicitly.
- Use optimistic updates only with rollback paths (current notification pattern
  is the reference).

### 5) Styling System

Rules:
- Use Tailwind utilities and project tokens from `globals.css`.
- Prefer semantic token classes (`text-black-200`, `bg-gray-200`, etc.) over
  hardcoded one-off colors.
- Reuse existing typography conventions:
  - Display/branding: `font-forum`
  - Body/UI: `font-figtree`
- Keep responsive behavior explicit (`sm/md/lg`), and verify mobile-first
  layouts.
- Keep custom CSS files minimal; prefer utility classes unless a reusable pattern
  needs dedicated CSS.

### 6) Accessibility and Semantics

Rules:
- Use semantic HTML (`button`, `nav`, `label`, `main`, etc.).
- Ensure form fields have labels and clear validation/error messages.
- Keyboard support must exist for interactive elements.
- Do not use clickable `div` when native controls fit.
- For images, provide useful `alt` text and prefer optimized Next.js image
  patterns when applicable.

### 7) Error Handling and UX Feedback

Rules:
- Do not leave raw `console.log` debugging in shipped UI code.
- Surface user-visible errors via existing toast/provider patterns where
  appropriate.
- Use loading indicators for async actions (buttons, overlays, skeletons).
- Fail safely: preserve prior UI state when optimistic updates fail.

### 8) Performance

Rules:
- Prevent unnecessary rerenders with stable callbacks/memoization when
  measurable.
- Keep expensive calculations outside render or memoize them.
- Use pagination/incremental loading for large lists (comment/feed patterns).
- Avoid oversized client bundles by not importing server-only modules into client
  components.

### 9) File and Folder Conventions

- `src/frontend/components/*`: reusable UI primitives and composed widgets
- `src/frontend/sections/*`: page-level composition blocks
- `src/frontend/providers/*`: app-wide contexts and query/session wrappers
- `src/frontend/stores/*`: Zustand stores
- `src/frontend/hooks/*`: reusable client hooks
- `src/frontend/data/*`: static config/data maps used by UI

Keep names descriptive and aligned with existing conventions (`PascalCase` for
components, `useXxx` for hooks, `camelCase` stores/utils).

## Testing and Verification Gates

Frontend-affecting changes should include:
- Component or hook tests for non-trivial logic.
- Query/state behavior tests where regressions are likely.
- Manual interaction verification for:
  - Auth/session-dependent UI
  - Notifications
  - Forms and validation flows
  - Mobile layout behavior

Minimum local checks before merge:
- `npm run lint`
- `npm test`
- `npm run build` (for significant UI/routing changes)

## PR Checklist For Frontend Changes

- Correct server/client component boundary.
- No direct backend SDK usage in client components.
- Existing design system primitives reused where possible.
- Loading, empty, and error states handled.
- Accessibility basics covered (labels, semantics, keyboard behavior).
- No debug logs or dead code.
- Lint/tests pass and key flows manually verified.
