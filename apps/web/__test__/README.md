# Rensa Test Suite

## Overview

This test suite provides comprehensive unit testing for the main pages of the Rensa application using Jest and React Testing Library.

## Test Files Created

### 1. **app.test.tsx**

Tests the root app page (`/`)

- Verifies the app renders the home component
- Checks that home page content is displayed

### 2. **homepage.test.tsx**

Tests the landing page (`/home`)

- Validates all major sections render (Navbar, Hero, Carousel, Footer)
- Checks semantic HTML elements (nav, footer, section)
- Verifies page renders without crashing
- Includes proper mocking for framer-motion animations

### 3. **login.test.tsx**

Tests the login page (`/(auth)/login`)

- Ensures login form renders
- Validates form elements (email, password, submit button)
- Checks form structure and accessibility

### 4. **register.test.tsx**

Tests the registration page (`/(auth)/register`)

- Verifies register form renders
- Validates all form fields (username, email, password, confirm password)
- Ensures signup button is present

### 5. **explore.test.tsx**

Tests the explore page (`/(explorable)/explore`)

- Checks FilterSection component renders
- Validates page structure and styling
- Ensures explore functionality is displayed

### 6. **upload.test.tsx**

Tests the upload page (`/upload`)

- Verifies UploadSection component renders
- Checks page layout and styling
- Validates upload interface elements

### 7. **bookmarks.test.tsx**

Tests the bookmarks page (`/(explorable)/bookmarks`)

- Ensures page renders correctly
- Validates page styling and structure
- Checks element types

### 8. **not-found.test.tsx**

Tests the 404 error page (`/not-found`)

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

The tests use comprehensive mocking for:

- **Next.js Components**: `Image`, `Link`
- **Custom Components**: Forms, Sections, Navigation, Footer
- **Icons**: Phosphor icons
- **Framer Motion**: Animation components

This ensures tests run quickly and reliably without external dependencies.

## Best Practices Implemented

1. ✅ **Component Isolation**: Each page is tested independently
2. ✅ **Mock External Dependencies**: All external components are mocked
3. ✅ **Accessibility Testing**: Uses semantic queries (getByRole, getByLabelText)
4. ✅ **Visual Regression**: Checks for correct CSS classes and styling
5. ✅ **User-Centric Tests**: Tests focus on what users see and interact with

## Future Enhancements

Consider adding:

- Integration tests for user flows
- E2E tests with Playwright or Cypress
- Visual regression tests with Percy or Chromatic
- API mocking for data fetching tests
- Component interaction tests (click events, form submissions)
- Snapshot testing for UI consistency

## Configuration

Tests are configured in:

- `jest.config.ts` - Main Jest configuration
- `jest.setup.ts` - Test environment setup
- `.babelrc` or `next.config.ts` - Transpilation settings

## Notes

- All tests use `@testing-library/react` for robust, user-centric testing
- Tests follow the Arrange-Act-Assert (AAA) pattern
- Mocks are co-located with tests for better maintainability
