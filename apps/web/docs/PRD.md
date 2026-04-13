# Product Requirements Document (PRD)

Updated: 2026-04-13

## 1. Product Summary
Rensa is a photo-sharing community focused on reproducible photography "recipes".  
Users upload photos with metadata, discover others' work, save to rolls, bookmark, and comment.

## 2. Problem Statement
Most photo communities emphasize end results but not repeatable capture settings.  
Rensa solves this by combining image sharing with structured metadata and community interaction.

## 3. Personas
- Creator photographer: uploads and shares recipes.
- Explorer photographer: browses photos and saves references.
- Collector: organizes inspiration via rolls/bookmarks.
- Moderator/admin: reviews contact and bug-report queues.

## 4. Product Goals
1. Reliable upload + metadata capture workflow.
2. Fast discovery and retrieval of relevant photos.
3. Personal collection management (rolls/bookmarks).
4. Safe collaboration (comments/notifications) with abuse controls.
5. Operational visibility for support and bug triage.

## 5. In-Scope Features (As Implemented)
### 5.1 Auth and Session
- Credentials auth via NextAuth + Supabase adapter.
- Email verification and password reset routes are implemented.
- Session payload includes `user.id` and `user.role`.

### 5.2 Photo Domain
- List photos with pagination, sort, and filters.
- Get photo by id and owner id.
- Delete photo with ownership check.
- Upload pipeline:
image compression (`sharp`) -> NSFW model call (`FAST_API_BASE_URL`) -> Cloudinary upload -> metadata persistence.

### 5.3 Rolls
- List rolls by user.
- Get default roll.
- Create/update/delete roll with owner authorization.
- Add/remove photo in roll.
- Query whether a photo is saved to any roll.

### 5.4 Bookmarks
- Toggle bookmark on photo (`increment`/`decrement` semantics).
- List user's bookmarked photos.

### 5.5 Comments and Notifications
- Create/list comments per photo.
- List/create notifications; mark read; clear by user.
- WebSocket notification consumption in client (`NotificationProvider`).

### 5.6 Support and Admin Ops
- Contact form submit and admin list endpoint.
- Bug report submit and admin list endpoint.
- Confirmation and admin emails via Resend templates.

## 6. API Surface (Current)
Core route groups under `src/app/api`:
- `/auth/*`
- `/email/*`
- `/photos/*`
- `/rolls/*`
- `/users/[id]`
- `/profile/[id]`
- `/notifications/*`

Contract documentation:
- Machine-readable: `GET /api/openapi`
- Interactive Swagger UI: `/swagger`
- Human-readable reference: `docs/API_CONTRACTS.md`

## 7. Functional Requirements
### FR-1 Authorization
- Write endpoints must enforce authenticated actor identity.
- Owner-only mutations for photo and roll resources.

### FR-2 Data Integrity
- API inputs validated using Zod DTOs where module routes are used.
- Direct model routes must sanitize and validate input consistently.

### FR-3 Upload Safety
- File and metadata validation.
- Rate limiting by client IP.
- NSFW rejection path.
- Cloudinary URL integrity checks.

### FR-4 Discoverability
- Paginated photo and roll listing with deterministic ordering.
- Bookmark and roll inclusion queries must be consistent across services.

### FR-5 Supportability
- Contact and bug-report submissions produce structured, queryable records.
- Admin list endpoints protected by role checks.

## 8. Non-Functional Requirements
- Availability: graceful error responses; no silent failures.
- Security: input sanitization, auth checks, rate limiting.
- Performance: paginated APIs and bounded list defaults (`limit <= 50`).
- Maintainability: layered modules (`route -> service -> repository`) for core domains.
- Testability: route/service tests for critical workflows.

## 9. Known Gaps and Risks (Current State)
1. Bookmark data consistency.
- `bookmarks` is the canonical terminology and data contract for saved photos.
2. Auth/profile consistency.
- NextAuth identity source and application user profile must stay aligned in PostgreSQL-backed records.
3. Operational coupling.
- Notifications depend on external Elysia service and websocket endpoint.

## 10. Success Metrics
- Photo upload success rate excluding policy rejection.
- p95 latency for `GET /api/photos`, `GET /api/rolls`, `GET /api/rolls/[id]/photos`.
- Bookmark toggle success/error rate.
- Comment post success rate.
- Contact and bug-report triage SLA (time-to-first-review).
- Auth rate-limit hit rate and failed-login ratio.

## 11. Out of Scope
- Native mobile clients.
- Third-party public API.
- In-app editing suite.
- Payments/marketplace.

## 12. Pre-Refactor Exit Criteria
Before continuing large refactors:
1. Data model naming alignment for bookmarks remains enforced across code and docs.
2. One canonical user profile store is chosen and documented.
3. Every API route declares authoritative source of truth for its entities.
4. Docs in `/docs` remain versioned and updated with each architecture decision.
