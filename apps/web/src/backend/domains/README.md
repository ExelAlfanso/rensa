# Backend Domains

This directory is the canonical backend composition layer.

Uniform pattern per domain:
- `application/` route-facing use-case facade
- `domain/` pure domain objects/rules (optional when minimal)
- `infrastructure/` repository and gateway composition
- `module.ts` dependency wiring

Dependency direction:
- API route -> domain application -> service -> repository
