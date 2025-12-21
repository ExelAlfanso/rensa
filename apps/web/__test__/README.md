# Rensa Test Suite

## Overview

This test suite provides comprehensive unit testing for both frontend and backend of the Rensa application using Jest and React Testing Library.

## Directory Structure

```
__test__/
├── frontend/          # Frontend component and page tests (9 tests)
│   ├── app.test.tsx
│   ├── bookmarks.test.tsx
│   ├── error.test.tsx
│   ├── explore.test.tsx
│   ├── homepage.test.tsx
│   ├── login.test.tsx
│   ├── not-found.test.tsx
│   ├── register.test.tsx
│   └── upload.test.tsx
│
└── backend/           # Backend service tests (40 tests passing)
    └── services/      # Service layer tests
        ├── NotificationServices.test.ts (14 tests)
        ├── PhotoServices.test.ts (6 tests)
        ├── ProfileServices.test.ts (6 tests)
        └── RollServices.test.ts (14 tests)
```

## Test Status

✅ **Backend Service Tests**: 40 tests passing  
✅ **Frontend Tests**: 9 test suites  
⏳ **Backend API Route Tests**: Planned for future implementation

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Frontend Tests Only

```bash
npm test -- __test__/frontend
```

### Run Backend Tests Only

```bash
npm test -- __test__/backend
```

### Run Specific Test Suite

```bash
npm test -- PhotoServices
npm test -- rolls.test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## Backend Tests

### Service Tests

Service tests mock the axios API calls and test the business logic of each service function. They verify:

- Correct API endpoint calls
- Proper parameter passing
- Response data transformation
- Error handling

**Coverage:**

- `PhotoServices.test.ts` - Photo fetching and manipulation
- `RollServices.test.ts` - Roll CRUD operations and photo-roll relationships
- `ProfileServices.test.ts` - User profile operations
- `NotificationServices.test.ts` - Notification system logic

### API Route Tests

API route tests mock the database connections and models to test Next.js API routes. They verify:

- Request parameter parsing
- Database query execution
- Response formatting
- Error handling
- Authentication checks (where applicable)

**Coverage:**

- `photos.test.ts` - Photo listing, filtering, and sorting
- `rolls.test.ts` - Roll creation and retrieval

## Frontend Tests

Frontend tests use React Testing Library to test component rendering, user interactions, and page behaviors. They are located in the `frontend/` directory.

### Test Files

1. **app.test.tsx** - Tests the root app page (`/`)
2. **homepage.test.tsx** - Tests the landing page (`/home`)
3. **login.test.tsx** - Tests the login page (`/(auth)/login`)
4. **register.test.tsx** - Tests the registration page (`/(auth)/register`)
5. **explore.test.tsx** - Tests the explore page (`/(explorable)/explore`)
6. **upload.test.tsx** - Tests the upload page (`/upload`)
7. **bookmarks.test.tsx** - Tests the bookmarks page (`/(explorable)/bookmarks`)
8. **not-found.test.tsx** - Tests the 404 error page (`/not-found`)
9. **error.test.tsx** - Tests the error page

- Validates 404 heading displays
- Checks error message content
- Ensures navigation back to home works
- Verifies images and styling

### 9. **error.test.tsx**

Tests the generic error page (`/error`)

- Ensures error message displays
- Validates page structure

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm test -- --watch
```

### Run tests with coverage

```bash
npm test -- --coverage
```

### Run specific test file

```bash
npm test login.test.tsx
```

## Test Statistics

- **Total Test Suites**: 9
- **Total Tests**: 24
- **All Tests**: ✅ PASSED

## Mocking Strategy

## Test Conventions

### Naming

- Test files should match the source file name with `.test.ts` or `.test.tsx` extension
- Test suites should use `describe()` blocks to group related tests
- Test cases should use `it()` or `test()` with descriptive names

### Structure

```typescript
describe("ComponentName or FunctionName", () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe("specific functionality", () => {
    it("should do something specific", () => {
      // Test implementation
    });
  });
});
```

### Mocking

- Mock external dependencies (axios, database, Next.js components, etc.)
- Clear mocks in `afterEach()` to prevent test interference
- Use `jest.fn()` for function mocks
- Use `jest.mock()` for module mocks

The tests use comprehensive mocking for:

- **Next.js Components**: `Image`, `Link`
- **Custom Components**: Forms, Sections, Navigation, Footer
- **Icons**: Phosphor icons
- **Framer Motion**: Animation components
- **Database**: MongoDB models and connections
- **HTTP Clients**: Axios instances

This ensures tests run quickly and reliably without external dependencies.

## Adding New Tests

When adding new features:

1. **For Services**: Add tests in `__test__/backend/services/`

   - Mock API calls
   - Test all function parameters
   - Test success and error cases

2. **For API Routes**: Add tests in `__test__/backend/api/`

   - Mock database connections
   - Test all HTTP methods
   - Test request/response handling
   - Test authentication when required

3. **For Components/Pages**: Add tests in `__test__/frontend/`
   - Test rendering
   - Test user interactions
   - Test edge cases

## Best Practices

1. ✅ **Test Isolation**: Each test should be independent and not rely on others
2. ✅ **Component Isolation**: Each page/component is tested independently
3. ✅ **Clear Assertions**: Use specific matchers and clear error messages
4. ✅ **Mock External Dependencies**: Don't make real API calls or database queries
5. ✅ **Test Edge Cases**: Include tests for error conditions and boundary cases
6. ✅ **Keep Tests Fast**: Mock slow operations and avoid unnecessary waits
7. ✅ **Descriptive Names**: Test names should clearly describe what is being tested
8. ✅ **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification sections
9. ✅ **Accessibility Testing**: Uses semantic queries (getByRole, getByLabelText)
10. ✅ **User-Centric Tests**: Tests focus on what users see and interact with

## CI/CD Integration

Tests are automatically run in the CI/CD pipeline. All tests must pass before code can be merged.

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module '@/...'`

- **Solution**: Check `jest.config.ts` for correct path aliases

**Issue**: `ReferenceError: fetch is not defined`

- **Solution**: Add `whatwg-fetch` polyfill in `jest.setup.ts`

**Issue**: Tests pass locally but fail in CI

- **Solution**: Check for environment-specific dependencies or file path issues

**Issue**: Mock not working properly

- **Solution**: Ensure mocks are defined before imports, use `jest.mock()` at the top of the file

## Future Enhancements

Consider adding:

- Integration tests for user flows
- E2E tests with Playwright or Cypress
- Visual regression tests with Percy or Chromatic
- More API route coverage
- Database integration tests
- Performance testing
- Snapshot testing for UI consistency

## Configuration

Tests are configured in:

- `jest.config.ts` - Main Jest configuration
- `jest.setup.ts` - Test environment setup
- `next.config.ts` - Next.js configuration

## Notes

- All tests use `@testing-library/react` for robust, user-centric testing
- Backend tests use Jest's mocking capabilities extensively
- Tests follow the Arrange-Act-Assert (AAA) pattern
- Mocks are co-located with tests for better maintainability
