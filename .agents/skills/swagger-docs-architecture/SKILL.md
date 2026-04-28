---
name: swagger-docs-architecture
description: "Use when creating, refactoring, or reviewing Swagger/OpenAPI docs in Next.js or React-based backend projects. Focus on reusable schemas, separating docs from handlers, and keeping API contracts aligned with implementation."
license: MIT
metadata:
  author: OpenAI
  version: "1.1.0"
  domain: api-documentation
  triggers: swagger, openapi, api docs, schema.ts, doc.ts, route docs, endpoint documentation, api contract
  role: expert
  scope: architecture-and-refactor
  output-format: plan-and-edits
---

# Swagger Docs Architecture

Build and maintain OpenAPI documentation that is clear, reusable, and accurate.

## Role

You are an API documentation architect.

Priorities:

- Accuracy: docs must match runtime behavior.
- Reuse: shared schemas should be centralized.
- Separation: docs should not bloat route handlers.
- Consistency: naming, responses, and errors should follow one pattern.

## Use This Skill When

- Adding Swagger docs for a new endpoint.
- Refactoring duplicated or inconsistent Swagger blocks.
- Splitting reusable schemas from route-level docs.
- Standardizing response and error contracts.
- Reviewing contract drift between docs and implementation.

## Recommended File Layout

- schema.ts: reusable schema definitions and shared envelopes.
- doc.ts: endpoint-level docs (paths, methods, params, responses).
- route.ts: handler logic only.

If the project uses a different structure, keep the same separation of concerns.

## next-swagger-doc Syntax Rules

- Use plain OpenAPI object literals compatible with `createSwaggerSpec`.
- Export fragments typed as `OpenApiFragment`.
- Keep `schema.ts` fragments focused on `components` only:
  - `components.schemas`
  - `components.examples` (optional)
- Keep `doc.ts` fragments focused on route contract only:
  - `tags`
  - `paths`
- Keep `route.ts` free from documentation blocks when fragment files exist.

Recommended naming:

- `<domain>OpenApiDocFragment` in `doc.ts`
- `<domain>OpenApiSchemaFragment` in `schema.ts`

Example:

```ts
export const photosOpenApiDocFragment: OpenApiFragment = {
  tags: [{ name: "photos" }],
  paths: {
    "/api/photos": {
      get: {
        tags: ["photos"],
        summary: "List photos",
        responses: { 200: { description: "Photos listed" } },
      },
    },
  },
};

export const photosOpenApiSchemaFragment: OpenApiFragment = {
  components: {
    schemas: {
      PhotoListItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
        },
      },
    },
  },
};
```

## Workflow

1. Audit current contract

- Identify real request/response payloads, status codes, and auth rules.
- Find duplicated inline schemas and mismatched docs.

2. Extract reusable schemas

- Move shared entity and envelope shapes into schema definitions.
- Create clear schema names for list/detail/create/update forms.

3. Refactor endpoint docs

- Keep each endpoint focused on HTTP contract:
  - Path and method
  - Tags and summary
  - Parameters and body
  - Success and error responses

4. Replace duplication

- Prefer $ref to shared schemas instead of copy-paste.

5. Align with implementation

- Validate field names, required flags, enums, and status codes.
- Ensure examples are realistic and consistent.

6. Final review

- Confirm docs are complete for common failure modes.
- Confirm route files remain logic-focused.

## Naming Rules

Prefer descriptive schema names:

- Activity
- ActivityListItem
- ActivityDetail
- CreateActivityRequest
- CreateActivityResponse
- ErrorResponse

Avoid ambiguous names:

- Activities_two
- DataResponse2
- TempSchema

## Contract Standards

Use a consistent response envelope unless the codebase already enforces a different one.

Success example:

```json
{
  "success": true,
  "message": "Activity created successfully",
  "data": {}
}
```

Error example:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Required Error Coverage

Document common error responses where relevant:

- 400 validation errors
- 401 unauthorized
- 403 forbidden
- 404 not found
- 409 conflict
- 422 semantic validation errors
- 500 internal errors

## Anti-Patterns

- Huge mixed Swagger blocks that combine shared definitions and all endpoints.
- Repeating the same inline schema in many responses.
- Docs that list status codes not returned by handlers.
- Missing required request fields or incorrect required flags.
- Examples that do not resemble real payloads.

## Output Contract For This Skill

When applying this skill, produce:

1. Audit summary

- Duplications
- Inconsistencies
- Contract drift
- Missing error docs

2. Refactor plan

- What to move into reusable schemas
- What to keep endpoint-local
- Which names to standardize

3. Proposed edits

- Before and after snippets for schema docs and endpoint docs
- Explicit status code and payload corrections

4. Validation checklist

- Handler behavior vs docs
- Request/response shape parity
- Error coverage completeness

## Quality Gate

Do not mark complete until:

- Every documented status code exists in implementation or is intentionally added.
- Shared schemas use $ref where duplication existed.
- Naming is descriptive and consistent.
- Route handlers are not burdened with large documentation blocks.
