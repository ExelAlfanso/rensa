# Backend AGENTS Guide

This guide defines how backend changes should be designed and implemented in `src/backend` and related backend-facing infrastructure.

## Scope

Applies to:
- `src/backend/**`
- `src/app/api/**`
- `src/lib/auth.ts`
- `src/lib/drizzle.ts`
- `src/backend/db/**`

## Current Backend Direction (As Of April 2026)

The backend direction is PostgreSQL-first and Drizzle-backed:
- NextAuth with `@auth/drizzle-adapter` for auth persistence.
- PostgreSQL + Drizzle for all application entities (`users`, `photos`, `rolls`, `bookmarks`, `comments`, `contacts`, `bug_reports`).

When adding or refactoring backend logic:
- Do not introduce non-PostgreSQL persistence dependencies.
- Treat PostgreSQL as the single source of truth.

## Architecture Rules

### -1) Domain-Wise Structure (Scalable Default)

New backend logic should be organized by domain under:
- `src/backend/domains/<domain>/application`
- `src/backend/domains/<domain>/domain`
- `src/backend/domains/<domain>/infrastructure`
- `src/backend/domains/<domain>/module.ts`

API routes in `src/app/api/**` remain thin HTTP adapters that delegate to domain
use-cases.

### 0) Layer Rules (Clean Architecture)

Mandatory dependency direction:
- `route.ts` (controller) -> domain application -> service -> repository

Reverse calls are forbidden. No exceptions.

Controller layer (`src/app/api/**/route.ts`):
- Role: delivery/HTTP adapter.
- Allowed: read `Request`/params, validate with Zod DTO, call domain application methods, return `NextResponse`, map errors to HTTP status codes.
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
- Signs: SQL/ORM queries, no business-rule branching.

DTO layer (`*.dto.ts`):
- Role: input/output validation with Zod.
- Must include feature-appropriate DTOs: `responseDto`, `createDto`, `updateDto` (plus auth-specific DTOs such as login/register where needed).
- Forbidden: importing services or repositories.

Hard anti-patterns:
- Controller -> repository
- Controller -> service (bypassing domain application)
- Service -> HTTP
- Repository -> service
- Zod in service layer
- DB query in controller layer

### 1) Layer Boundaries

Use this shape consistently:
- API Route Handler (`src/app/api/**/route.ts`): request/response mapping only (controller layer).
- Domain Application (`src/backend/domains/<domain>/application/*.application.ts`): use-case facade exposed to controllers.
- Service: business rules, authorization checks, orchestration.
- Repository: database access only.
- DTO: input/output contracts and validation.
- Domain Module: dependency wiring and composition (`src/backend/domains/<domain>/module.ts`).

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
- Implementations in `src/backend/domains/<domain>/infrastructure/*.repository.ts`
  must satisfy interfaces exactly.
- No framework-specific response types in repositories.
- No `any`; use strict return types and nullability (`Promise<T | null>` where needed).

### 4) Service Reliability

Service layer must:
- Parse/validate upstream payloads.
- Enforce ownership and auth constraints.
- Translate repository errors to stable app errors.
- Keep cross-entity operations transactional when required.

If multi-step writes must be atomic, use PostgreSQL transactions.

## Auth Best Practices

### 1) NextAuth + Drizzle Adapter

`src/lib/auth.ts` currently configures Drizzle adapter with `src/lib/drizzle.ts`.

Rules:
- Keep session and JWT callbacks deterministic; do not append volatile fields without reason.
- Normalize role source of truth (prefer DB-backed role, not client-provided values).

### 2) Credentials Flow

Credentials auth must read/write PostgreSQL-backed user records only:
- Any user identity field used in session (`id`, `email`, `role`) must be sourced from PostgreSQL-backed application users.
- Avoid dual-write behavior or mixed identity stores.

### 3) Trigger-Based Profile Creation

Migration adds trigger `on_auth_user_created` -> `public.create_profile()`.

Rules:
- Trigger function must be idempotent-safe in practice.
- Avoid assumptions that `raw_user_meta_data->>'full_name'` always exists.
- Add fallback username logic in SQL or service layer.

## SQL Migration Rules

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

For Drizzle data access (`src/lib/drizzle.ts` and repositories):
- Use typed schema imports from `src/backend/db/schema.ts`.
- Handle null/empty result sets explicitly.
- Select only required columns in read queries.
- Prefer transactions for multi-step writes.

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
- `src/backend/domains/<domain>/application/*.application.ts`
- `src/backend/domains/<domain>/infrastructure/*`
- `src/backend/domains/<domain>/module.ts`
- `src/backend/domains/<domain>/application/*.service.ts`
- `src/backend/domains/<domain>/infrastructure/*.repository.ts`
- `src/backend/interfaces/*.interface.ts`
- `src/backend/dtos/*.dto.ts`

Do not add new controller files under `src/backend/controllers`; use API route handlers instead.
Each new feature should include all relevant layers (even if thin initially) to prevent logic drift.

## PR Checklist For Backend Changes

- DTO schema added/updated and validated.
- Service enforces authorization and invariants.
- Repository uses safe query patterns and typed returns.
- Auth/session fields remain backward compatible.
- Migration is additive and reviewed for production safety.
- Tests and lint pass.
- Docs updated if endpoint or data contract changed.
