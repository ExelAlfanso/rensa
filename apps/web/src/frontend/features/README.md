# Frontend Features

Feature-first scalable structure with container/component composition.

Each feature should follow:
- `containers/`: data loading, mutations, orchestration, side effects
- `components/`: presentational UI only
- `api/`: feature-scoped client API functions
- `model/`: feature types/selectors/mappers
- `hooks/`: reusable feature hooks

Rules:
- Keep API and state orchestration out of presentational components.
- Prefer explicit variants and composition over boolean-prop proliferation.
