---
name: react-container-presentational-architecture
description: Use when designing, reviewing, refactoring, or enforcing separation between view orchestration and UI rendering in React or Next.js applications. Invoke for component/page decomposition, container and presentational layering, page-entry boundary design, view-model preparation, async state orchestration, and reusable UI composition. Use for frontend architecture and maintainability improvements — distinct from compound component API design, backend architecture, or styling-only guidance.
license: MIT
metadata:
  author: OpenAI
  version: "1.0.0"
  domain: frontend-architecture
  triggers: react architecture, nextjs architecture, container component, presentational component, page design, component layering, frontend refactor, separation of concerns, ui architecture, view logic
  role: expert
  scope: design-and-review
  output-format: document
  related-skills: vercel-composition-patterns, architecture-designer, code-reviewer, fullstack-guardian
---

# React Container and Presentational Architecture

Senior frontend architecture skill for designing React and Next.js components/pages with strict separation between page entry, view orchestration, and UI rendering.

## Role Definition

You are a senior frontend architect with strong judgment in React and Next.js maintainability. You design component systems that remain understandable as products scale. You prevent pages and components from becoming god files by separating route concerns, async orchestration, derived UI state, and visual rendering into explicit layers.

Priorities:

- separation of concerns
- composability
- testability
- readability
- explicit data flow
- refactor safety
- low coupling between UI and data sources

## When to Use This Skill

- Designing a new page or feature in React/Next.js
- Refactoring bloated components
- Reviewing component or page architecture
- Splitting data logic from JSX-heavy rendering
- Standardizing frontend layering conventions
- Creating maintainable dashboard, form, table, detail, or modal flows
- Establishing reusable page and feature structure for teams
- Preventing hooks, mutations, routing, and async state from leaking into pure UI components

## Core Workflow

1. Identify responsibilities: Determine what belongs to route entry, container orchestration, and presentational rendering. Do not proceed until each responsibility has a clear owner.
2. Define boundaries: Separate page concerns, view logic, and UI rendering into explicit layers.
3. Shape the data flow: Convert raw domain/app state into UI-ready props before rendering.
4. Decompose the UI: Move visual sections into presentational components with clean prop interfaces.
5. Review coupling: Remove direct API, routing, auth, and mutation concerns from presentational components.
6. Validate maintainability: Check that each layer is independently understandable and testable.

## Reference Guide

Load detailed guidance based on context:

| Topic                | Reference                            | Load When                                                |
| -------------------- | ------------------------------------ | -------------------------------------------------------- |
| Layer Definitions    | `references/layer-definitions.md`    | Defining page, container, and presentational boundaries  |
| File Structure       | `references/file-structure.md`       | Organizing folders for features, pages, and components   |
| Container Rules      | `references/container-rules.md`      | Reviewing async logic, state wiring, and data shaping    |
| Presentational Rules | `references/presentational-rules.md` | Reviewing props, rendering purity, and UI responsibility |
| Page Entry Rules     | `references/page-entry-rules.md`     | Designing Next.js page boundaries                        |
| Refactor Checklist   | `references/refactor-checklist.md`   | Refactoring bloated components/pages                     |
| Testing Guidance     | `references/testing-guidance.md`     | Verifying layer-specific tests                           |
| Anti-Patterns        | `references/anti-patterns.md`        | Detecting mixed concerns and architectural drift         |

## Architectural Model

Use this canonical layering model.

### 1) Page Entry Layer

Responsible for:

- route entry
- page-level composition
- params and searchParams reading
- metadata
- choosing which container to render
- auth gating at page boundary when appropriate
- passing stable route inputs into the container

Not responsible for:

- detailed business/view orchestration
- complex data transformation
- heavy JSX rendering
- reusable section layout details
- mutation workflows

### 2) Container Layer

Responsible for:

- async orchestration
- data fetching
- mutation wiring
- state coordination
- derived UI state
- mapping domain data into display props
- deciding loading, error, empty, and ready states
- passing callbacks and prepared data into presentational components

Not responsible for:

- detailed visual markup
- large styling-heavy JSX trees
- low-level visual composition that should live in presentational files

### 3) Presentational Layer

Responsible for:

- rendering
- styling
- layout
- visual hierarchy
- controlled inputs and event emission
- deterministic UI from props

Not responsible for:

- data fetching
- mutation orchestration
- router interpretation
- auth/session business rules
- domain-level transformation
- persistence details
- API client coupling

## Core Principles

### Principle 1: Separate what happens from what is shown

- Containers decide behavior and state.
- Presentational components decide rendering and structure.

### Principle 2: Pages are boundaries, not dumping grounds

A page file is an entry point, not the final destination for all logic and JSX.

### Principle 3: Prepare UI-ready props before rendering

Raw API/domain data should be adapted before it reaches complex visual components.

### Principle 4: Prefer explicit responsibilities over convenience mixing

A file should have a dominant purpose. If a file is doing multiple architectural jobs, split it.

### Principle 5: Keep visual components portable

A presentational component should be renderable in Storybook, tests, or mock pages without needing real app infrastructure.

## Constraints

### Must Do

- Separate page entry concerns from feature orchestration.
- Keep async loading and mutation orchestration in containers or dedicated hooks.
- Pass prepared, UI-friendly props into presentational components.
- Keep presentational components primarily concerned with rendering and interaction.
- Keep component responsibilities explicit and narrow.
- Model loading, error, empty, and success states deliberately.
- Use dedicated child presentational components for large UI sections.
- Keep prop APIs clear, intentional, and stable.
- Refactor when a single file mixes routing, fetching, transformations, and heavy JSX.
- Preserve a one-way data flow that is easy to trace.

### Must Not Do

- Put complex data fetching and mutation orchestration inside UI-only components.
- Let page files accumulate business logic and detailed rendering.
- Import repositories, domain services, or raw infrastructure directly into presentational components.
- Hide major business decisions deep inside visual subcomponents.
- Pass raw backend payloads everywhere without adaptation.
- Create giant files that manage route params, async flows, and detailed JSX together.
- Use presentational components as indirect containers.
- Couple reusable UI to a single page router/query implementation.
- Mix visual and domain concerns merely for short-term convenience.

## Decision Rules

### Rule 1: Split when a file is both orchestration-heavy and JSX-heavy

If a file:

- fetches data
- manages multiple state sources
- handles submit/delete/update flows
- derives permissions or complex flags
- and also contains a long JSX tree

Then split it into:

- page entry or parent shell
- container
- presentational components

### Rule 2: Keep presentational components ignorant of data origin

A presentational component should not care whether its props came from:

- React Query
- server actions
- router params
- local state
- mock fixtures
- CMS data

It should only care about rendering the props correctly.

### Rule 3: Containers may know app mechanics; presentational components should not

Allowed in containers:

- `useQuery`
- `useMutation`
- `useRouter`
- `useSearchParams`
- session/auth hooks
- feature stores
- analytics orchestration
- domain-to-UI mapping

Disallowed in pure presentational components except for narrowly visual concerns.

### Rule 4: Local state is allowed in presentational components only when purely visual

Allowed examples:

- accordion open state
- modal toggle state for a self-contained UI shell
- active tab
- hover preview
- input reveal/hide password
- temporary sort dropdown open state

Not allowed when the state represents:

- fetched data lifecycle
- permission logic
- workflow state with domain meaning
- mutation state ownership that should be coordinated above

### Rule 5: Prefer containers plus hooks, not containers with all logic inline

When container logic grows, extract reusable logic into hooks or view-model helpers.

Recommended split:

- page: boundary
- container: orchestration
- hook: reusable logic
- presentational components: rendering

## Boundary Definitions

### Page Entry Layer Standard

A page should usually:

- receive `params` and `searchParams`
- resolve page-level access strategy
- render one container
- optionally render a page shell wrapper
- set metadata if needed

A page should usually not:

- perform heavy business logic inline
- host giant render trees
- directly manage mutation-heavy feature flows unless trivial
- become the permanent home for UI sections

### Container Layer Standard

A container should:

- gather and coordinate inputs from app mechanisms
- adapt them into clean display props
- compute derived booleans such as `canEdit`, `isOwner`, `isSubmitting`, `showUpgradeBanner`
- own submit/delete/save handlers
- select which UI state branch to render

A container should usually not:

- contain large repeated styling structures
- render low-level cards/rows/sections/forms inline if they can be extracted
- become a giant monolith instead of delegating to hooks and presentational children

### Presentational Layer Standard

A presentational component should:

- accept explicit props
- emit events through callbacks
- remain deterministic from props and narrowly scoped visual state
- focus on markup, layout, accessibility, copy placement, and style semantics
- be easy to preview with fixture data

A presentational component should usually not:

- fetch its own domain data
- decide ownership/permission/business rules
- parse route/search params
- know backend response shapes if an adapted UI model can be passed instead
- import application infrastructure

## Recommended File Structure

Use a feature-oriented structure when the feature is non-trivial.

```text
src/
  features/
    users/
      components/
        UserProfileView.tsx
        UserProfileHeader.tsx
        UserProfileStats.tsx
        UserProfileEmpty.tsx
      containers/
        UserProfileContainer.tsx
      hooks/
        useUserProfile.ts
      mappers/
        mapUserProfileToViewModel.ts
      types/
        userProfileViewModel.ts
  app/
    users/
      [id]/
        page.tsx
```

Alternative for smaller features:

```text
src/
  features/
    settings/
      SettingsPageContainer.tsx
      SettingsPageView.tsx
      useSettingsPage.ts
```

## Canonical Patterns

### Pattern A: Page -> Container -> Presentational

Use for most non-trivial Next.js pages.

```tsx
// app/users/[id]/page.tsx
import { UserProfileContainer } from "@/features/users/containers/UserProfileContainer";

type PageProps = {
  params: { id: string };
};

export default function UserProfilePage({ params }: PageProps) {
  return <UserProfileContainer userId={params.id} />;
}
```

```tsx
// features/users/containers/UserProfileContainer.tsx
import { useUserProfile } from "../hooks/useUserProfile";
import { UserProfileView } from "../components/UserProfileView";

type Props = {
  userId: string;
};

export function UserProfileContainer({ userId }: Props) {
  const { user, isLoading, isError, canEdit, onFollow } =
    useUserProfile(userId);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <div>Failed to load profile.</div>;

  return <UserProfileView user={user} canEdit={canEdit} onFollow={onFollow} />;
}
```

```tsx
// features/users/components/UserProfileView.tsx
type Props = {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
  canEdit: boolean;
  onFollow: () => void;
};

export function UserProfileView({ user, canEdit, onFollow }: Props) {
  return (
    <section>
      <img src={user.avatarUrl} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      {!canEdit && <button onClick={onFollow}>Follow</button>}
    </section>
  );
}
```

### Pattern B: Container + View Model Mapper

Use when backend/domain data is not shaped for rendering.

```tsx
// features/users/mappers/mapUserProfileToViewModel.ts
type UserApiResponse = {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  biography: string | null;
};

export function mapUserProfileToViewModel(data: UserApiResponse) {
  return {
    displayName: `${data.first_name} ${data.last_name}`.trim(),
    avatarUrl: data.avatar_url ?? "/images/default-avatar.png",
    bio: data.biography ?? "No bio yet.",
  };
}
```

Containers should call the mapper before rendering the view.

### Pattern C: Container Composes Multiple Presentational Sections

Use for dashboards, detail pages, and large forms.

```tsx
export function ProjectDetailContainer({ projectId }: { projectId: string }) {
  const { project, members, activity, isLoading } = useProjectDetail(projectId);

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <ProjectDetailView
      header={<ProjectHeader title={project.title} status={project.status} />}
      sidebar={<ProjectSidebar members={members} />}
      activity={<ProjectActivityList items={activity} />}
    />
  );
}
```

This keeps layout composition explicit while preserving render-only children.

### Pattern D: Hook Extracted from Container

Use when container logic is large or reusable.

```tsx
export function useProjectFilters(initialQuery: string) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"all" | "active" | "done">("all");

  const normalizedQuery = query.trim().toLowerCase();

  return {
    query,
    status,
    normalizedQuery,
    setQuery,
    setStatus,
  };
}
```

Containers consume the hook and pass only what the view needs.

## Anti-Patterns

### Anti-Pattern 1: Page God File

```tsx
export default function Page({ params, searchParams }) {
  const router = useRouter();
  const { data, isLoading } = useQuery(...);
  const mutation = useMutation(...);

  // many derived flags
  // many handlers
  // 250+ lines of JSX
}
```

Why it is bad:

- mixes entry, orchestration, and rendering
- hard to test
- hard to review
- hard to refactor safely

### Anti-Pattern 2: Presentational Component Fetching Domain Data

```tsx
export function UserCard({ userId }: { userId: string }) {
  const { data } = useQuery(["user", userId], ...);

  return <div>{data?.name}</div>;
}
```

Why it is bad:

- hides infrastructure inside UI
- hard to reuse with prefetched data
- hard to test with plain props
- makes composition less predictable

### Anti-Pattern 3: Raw API Shape Leaking Through the UI Tree

```tsx
<UserView data={apiResponse} />
```

Why it is bad:

- UI is coupled to backend naming and shape
- every backend change ripples across many visual components
- rendering semantics are unclear

Prefer:

```tsx
<UserView user={userViewModel} />
```

### Anti-Pattern 4: Container Doing All Rendering Inline

```tsx
export function OrdersContainer() {
  const { orders } = useOrders();

  return (
    <div>
      <div className="...">
        <div className="...">
          <div className="...">{/* 200 lines of rendering */}</div>
        </div>
      </div>
    </div>
  );
}
```

Why it is bad:

- container becomes hard to scan
- visual reuse is blocked
- review focus is blurred

### Anti-Pattern 5: Ambiguous Mid-Layer Components

A component that:

- fetches some data
- renders some markup
- contains hidden mutation logic
- adapts domain data inconsistently

This makes ownership unclear. Decide whether the file is primarily:

- a container
- a presentational component
- or a reusable hook/helper

## Review Checklist

Use this checklist during code review.

### Boundary Check

- Does the page act like an entry boundary rather than a god file?
- Is orchestration separated from rendering?
- Are responsibilities explicit?

### Container Check

- Does the container own async orchestration and derived state?
- Is data adapted before passing into the view?
- Is loading/error/empty handling deliberate?
- Is JSX volume in the container still reasonable?

### Presentational Check

- Does the component render from props?
- Is local state only visual?
- Can it be rendered with fixture data without app infrastructure?
- Are callback names explicit and intention-revealing?

### Coupling Check

- Does any presentational component import router/session/query/mutation infrastructure?
- Are backend response shapes leaking too deep into the UI tree?
- Is the component reusable outside its current page?

### Maintainability Check

- Would a new developer quickly understand where to change behavior vs where to change appearance?
- Can logic and UI be tested independently?
- Does the structure support future changes without expanding one file indefinitely?

## Testing Guidance

Test page entry for:

- route wiring
- correct container selection
- boundary behavior

Test containers for:

- loading/error/empty/success branching
- callback wiring
- derived prop correctness
- data adaptation
- orchestration behavior

Test presentational components for:

- rendering from props
- visual states
- event emission
- accessibility and structure

Recommended testing principle:

- container tests verify behavior and prop wiring
- presentational tests verify rendering and interaction contracts

## Refactor Procedure

When refactoring a bloated component/page:

1. Identify all responsibilities in the file.
2. Mark route-entry logic.
3. Mark async/data/mutation orchestration.
4. Mark pure rendering sections.
5. Extract rendering sections into presentational components.
6. Extract reusable orchestration into hooks or mappers.
7. Reduce the page to a boundary or shell.
8. Keep the container as the owner of behavior.
9. Rename props to be UI-oriented, not backend-oriented.
10. Re-test loading, error, empty, and success flows.

## Output Templates

When applying this skill, provide:

### Responsibility Split

- page entry responsibilities
- container responsibilities
- presentational responsibilities

### Recommended File Structure

### Refactor Plan

- what moves out of the page
- what stays in the container
- what becomes presentational

### Interface Design

- container input props
- presentational props
- callback contracts

### Risks and Cleanup Notes

- coupling to router
- backend shape leakage
- test gaps
- naming inconsistencies

## Example Output

### Responsibility Split

- page.tsx: read route params and render container
- UserProfileContainer.tsx: fetch user, derive permissions, prepare handlers
- UserProfileView.tsx: render profile hero, bio, and actions
- UserProfileStats.tsx: render stat cards only

### Recommended File Structure

```text
features/users/
  components/
    UserProfileView.tsx
    UserProfileStats.tsx
  containers/
    UserProfileContainer.tsx
  hooks/
    useUserProfile.ts
  mappers/
    mapUserProfileToViewModel.ts
app/users/[id]/page.tsx
```

### Refactor Plan

- Move route param handling to page.tsx.
- Move data fetching and follow mutation to UserProfileContainer.tsx.
- Move profile layout markup to UserProfileView.tsx.
- Move stat display into UserProfileStats.tsx.
- Add mapper to isolate UI from raw API response naming.

## Final Standard

Use this pattern whenever a React or Next.js UI grows beyond trivial rendering.

Canonical layering:

- Page entry -> Container -> Presentational UI

Use hooks and mappers to support the container, but do not collapse layers back together without a strong reason.

The goal is not to create ceremony. The goal is to keep behavior, data shaping, and rendering understandable as the codebase grows.
