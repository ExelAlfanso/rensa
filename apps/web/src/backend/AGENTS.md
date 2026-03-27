# Backend AGENTS Guide

This guide defines how backend changes should be designed and implemented in `src/backend` and related backend-facing infrastructure.

## Scope

Applies to:
- `src/backend/**`
- `src/app/api/**`
- `src/lib/auth.ts`
- `src/lib/supabase.ts`
- `supabase/migrations/**`

## Current Backend Direction (As Of March 2026)

The codebase currently uses a hybrid backend approach:
- NextAuth with `@auth/supabase-adapter` for auth persistence (`next_auth` schema in Supabase).
- Supabase for relational entities (`users`, `photos`, `rolls`, bookmarks, etc.).
- Existing credential auth flow still references MongoDB (`connectDB`, `User` model) during `CredentialsProvider.authorize`.

When adding or refactoring backend logic, keep this transition state explicit and avoid hidden coupling between MongoDB and Supabase.

## Architecture Rules

### 0) Layer Rules (Clean Architecture)

Mandatory dependency direction:
- `route.ts` (controller) -> service -> repository

Reverse calls are forbidden. No exceptions.

Controller layer (`src/app/api/**/route.ts`):
- Role: delivery/HTTP adapter.
- Allowed: read `Request`/params, validate with Zod DTO, call service methods, return `NextResponse`, map errors to HTTP status codes.
- Forbidden: database queries, business logic, importing repositories.
- Signs: uses `req.json()`, `NextResponse`, `zod.parse()`.

Service layer (`*.service.ts`):
- Role: use-case/business logic core.
- Allowed: business rules, orchestration across repositories, domain validation (not DTO validation).
- Forbidden: importing `NextResponse`/`Request`, using Zod, HTTP-aware logic, direct DB queries.
- Signs: calls repository methods, throws business errors, does not know request transport.

Repository layer (`*.repository.ts`):
- Role: data access only.
- Allowed: database queries, persistence mapping.
- Forbidden: business logic, validation, calling other repositories, HTTP/Zod awareness.
- Signs: SQL/ORM/Supabase queries, no business-rule branching.

DTO layer (`*.dto.ts`):
- Role: input/output validation with Zod.
- Must include feature-appropriate DTOs: `responseDto`, `createDto`, `updateDto` (plus auth-specific DTOs such as login/register where needed).
- Forbidden: importing services or repositories.

Hard anti-patterns:
- Controller -> repository
- Service -> HTTP
- Repository -> service
- Zod in service layer
- DB query in controller layer

### 1) Layer Boundaries

Use this shape consistently:
- API Route Handler (`src/app/api/**/route.ts`): request/response mapping only (controller layer).
- Service: business rules, authorization checks, orchestration.
- Repository: database access only.
- DTO: input/output contracts and validation.
- Module: dependency wiring and composition.

Do not place business logic in API route handlers or repositories.

### 2) DTO-First Contracts

DTOs in `src/backend/dtos` are the backend API contract.

Rules:
- Define schemas with Zod.
- Export both schema and inferred TS types.
- Validate all external inputs at route-handler boundary.
- Use separate DTOs for create/update/response.
- Never expose DB records directly to clients without DTO mapping.

Naming:
- `userCreateDto`, `userUpdateDto`, `userResponseDto` style.
- Types use PascalCase suffix `Dto` (`UserCreateDto`).

### 3) Repository Interfaces

`src/backend/interfaces` defines capabilities, not implementation details.

Rules:
- Interface methods should return domain/DTO-safe shapes.
- Implementations in `src/backend/repository` must satisfy interfaces exactly.
- No framework-specific response types in repositories.
- No `any`; use strict return types and nullability (`Promise<T | null>` where needed).

### 4) Service Reliability

Service layer must:
- Parse/validate upstream payloads.
- Enforce ownership and auth constraints.
- Translate repository errors to stable app errors.
- Keep cross-entity operations transactional when required.

If Supabase multi-step writes must be atomic, use Postgres functions/RPC or explicit transaction-capable pathways.

## Auth Best Practices

### 1) NextAuth + Supabase Adapter

`src/lib/auth.ts` currently configures Supabase adapter with:
- `SUPABASE_URL`
- `SUPABASE_ROLE_SERVICE_KEY`

Rules:
- Service role key is server-only. Never expose via `NEXT_PUBLIC_*`.
- Keep session and JWT callbacks deterministic; do not append volatile fields without reason.
- Normalize role source of truth (prefer DB-backed role, not client-provided values).

### 2) Credentials Flow During Transition

Because credentials auth still reads MongoDB:
- Any user identity field used in session (`id`, `email`, `role`) must remain consistent with Supabase adapter rows.
- If a migration to fully Supabase auth is started, complete it end-to-end in one PR or behind a feature flag.
- Avoid partial dual-write behavior without explicit reconciliation logic.

### 3) Trigger-Based Profile Creation

Migration adds trigger `on_auth_user_created` -> `public.create_profile()`.

Rules:
- Trigger function must be idempotent-safe in practice.
- Avoid assumptions that `raw_user_meta_data->>'full_name'` always exists.
- Add fallback username logic in SQL or service layer.

## Supabase and SQL Migration Rules

### 1) Migration Safety

Never ship destructive resets in normal migrations.

Do not include broad statements like:
- `DROP TABLE IF EXISTS ...`

unless this is a deliberate environment reset migration and explicitly labeled/approved.

Default migration style:
- Additive and reversible where possible.
- Small focused migrations, one concern per file.
- Include indexes/constraints alongside schema changes.

### 2) `next_auth` Schema Management

When touching `next_auth` tables:
- Preserve required adapter columns and constraints.
- Keep grants correct for `service_role` and `postgres`.
- Validate foreign keys and cascading behavior.

### 3) Trigger and Function Changes

For trigger/function updates:
- Use `create or replace function` carefully and verify compatibility.
- Ensure `security definer` functions are minimal and least-privilege.
- Document behavior changes in PR notes.

## Data Access Standards

For Supabase access (`src/lib/supabase.ts` and repositories):
- Use server-only clients for privileged operations.
- Always check `{ error }` and surface typed failures.
- Prefer `.single()` for unique row queries.
- Avoid returning `data[0]` without null/error handling.
- Select only required columns in read queries.

## TypeScript Standards

- `strict`-safe typing for all new backend code.
- No unresolved type imports (for example, use exported DTO types that actually exist).
- Avoid broad inferred `any` from untyped query responses.
- Keep types close to DTO/domain boundaries, not framework internals.

## Error Handling and Logging

- Throw structured errors at service boundaries.
- Do not leak raw DB errors directly to clients.
- Log internal causes with context (`entity`, `operation`, `userId`, correlation id).
- Sanitize auth and PII fields before logging.

## Testing and Verification Gates

Backend-affecting changes should include:
- DTO validation tests (success + failure cases).
- Repository integration tests for query shape and null/error handling.
- Auth callback tests for session/JWT field consistency.
- Migration verification notes (applied cleanly on fresh DB and existing DB path).

Minimum local checks before merge:
- `npm run lint`
- `npm test`
- Run relevant API/manual flow for changed endpoint.

## File/Folder Conventions

- `src/app/api/**/route.ts` (controller layer)
- `src/backend/services/*.service.ts`
- `src/backend/repository/*.repository.ts`
- `src/backend/interfaces/*.interface.ts`
- `src/backend/dtos/*.dto.ts`
- `src/backend/modules/*.module.ts`

Do not add new controller files under `src/backend/controllers`; use API route handlers instead.
Each new feature should include all relevant layers (even if thin initially) to prevent logic drift.

## PR Checklist For Backend Changes

- DTO schema added/updated and validated.
- Service enforces authorization and invariants.
- Repository uses safe query patterns and typed returns.
- Auth/session fields remain backward compatible.
- Supabase migration is additive and reviewed for production safety.
- Tests and lint pass.
- Docs updated if endpoint or data contract changed.
