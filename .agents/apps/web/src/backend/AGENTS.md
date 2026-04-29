# Backend AGENTS Guide

This guide defines how backend changes should be designed and implemented in
`src/backend`, `src/app/api`, and shared backend packages.

## Scope

Applies to:
- `apps/web/src/backend/**`
- `apps/web/src/app/api/**`
- `apps/web/src/lib/auth.ts`
- `packages/db/**`

## Current Backend Direction

The backend is PostgreSQL-first and Drizzle-backed:
- `packages/db/schemas/*` owns Drizzle tables plus related DTO/query result and
  repository interface types.
- `packages/db/queries/*.repository.ts` owns repository implementations.
- `apps/web/src/backend/services/<feature>` owns web business logic and
  controller facades.

Do not introduce non-PostgreSQL persistence for application entities unless the
feature explicitly requires an external service boundary.

## Architecture Rules

Use this shape:
- Controller layer: `apps/web/src/backend/services/<feature>/controller.ts`
- Service layer: `apps/web/src/backend/services/<feature>/service.ts`
- Repository layer: `packages/db/queries/*.repository.ts`
- Schema/type layer: `packages/db/schemas/<entity>.ts`
- API route layer: `apps/web/src/app/api/**/route.ts`

Dependency direction:
- `route.ts` -> backend service controller -> service -> repository -> schema/db

Reverse calls are forbidden.

API routes:
- Validate request params/query/body with Zod DTOs.
- Call backend service controllers.
- Map errors to HTTP responses.
- Do not import repositories or run database queries.

Controllers:
- Compose repositories and services.
- Expose route-facing methods.
- Keep HTTP details out unless the controller is explicitly adapting an external
  client dependency.

Services:
- Enforce authorization and business invariants.
- Orchestrate repositories.
- Throw structured backend errors.
- Do not import `Request`, `NextResponse`, or Drizzle tables.

Repositories:
- Contain data access and persistence mapping only.
- Use Drizzle and `packages/db/schemas/*`.
- Do not import web code, Zod DTOs, service classes, or HTTP clients except via
  injected client interfaces for external-service repositories.

Types and interfaces:
- Repository interfaces and query result types live beside the matching schema
  in `packages/db/schemas/<entity>.ts`.
- Avoid catch-all backend interface directories.
- Keep Zod validation schemas in route-facing DTO files unless the API contract
  is intentionally promoted into a shared package.

## File Conventions

- `apps/web/src/backend/services/users/controller.ts`
- `apps/web/src/backend/services/users/service.ts`
- `packages/db/queries/user.repository.ts`
- `packages/db/schemas/users.ts`

Do not add new code under `apps/web/src/backend/domains`.
Do not add repository implementations under `apps/web/src/backend/services`.

## Verification

Backend-affecting changes should run:
- `pnpm --filter @rensa/db typecheck`
- `pnpm --filter @rensa/web typecheck`
- `pnpm exec ultracite check <changed files>` when practical

If web typecheck has unrelated existing failures, call them out separately from
the files changed in the current task.
