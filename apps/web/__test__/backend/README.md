# Backend Tests

This directory contains unit tests for the backend services and API routes of the Rensa application.

## Structure

```
backend/
├── api/              # API route tests (Coming soon)
│
└── services/         # Service layer tests
    ├── NotificationServices.test.ts
    ├── PhotoServices.test.ts
    ├── ProfileServices.test.ts
    └── RollServices.test.ts
```

## Current Status

✅ **Service Tests** - Complete and passing (40 tests)  
⏳ **API Route Tests** - Planned (requires additional setup for Next.js Request/Response mocking)

## Service Tests

Service tests focus on testing the business logic layer that communicates with the API. They mock axios calls and verify correct API interactions.

### PhotoServices.test.ts

Tests photo-related service functions:

- `fetchPhotosFromDB()` - Fetching photos with pagination, filters, and sorting
- `fetchBookmarkedPhotosFromDB()` - Fetching user's bookmarked photos
- Parameter validation
- Response data transformation
- Error handling

### RollServices.test.ts

Tests roll (collection) management services:

- `fetchRollById()` - Fetching a single roll
- `fetchRollsByUserId()` - Fetching all rolls for a user
- `addPhotoToRoll()` - Adding photos to rolls with notifications
- `removePhotoFromRoll()` - Removing photos from rolls
- `fetchIsSavedToRolls()` - Checking if photo is saved in rolls
- `updateRollDetails()` - Updating roll name and description
- `fetchDefaultRoll()` - Fetching user's default roll

### ProfileServices.test.ts

Tests user profile services:

- `fetchProfile()` - Fetching user profile by ID
- `fetchProfileByRollId()` - Fetching profile by roll ownership
- Error handling for missing users

### NotificationServices.test.ts

Tests notification system services:

- `fetchNotifications()` - Fetching user notifications with pagination
- `sendPhotoSavedNotification()` - Sending notifications when photo is saved
- `sendBookmarkedNotification()` - Sending notifications when photo is bookmarked
- `sendCommentedNotification()` - Sending notifications when photo is commented on
- `clearUserNotifications()` - Clearing all user notifications
- `markUserNotificationAsRead()` - Marking individual notifications as read
- Actor/recipient validation (no self-notifications)

## API Route Tests (Planned)

API route tests for Next.js endpoints require additional setup to properly mock the Next.js Request/Response objects and database connections. These tests will be added in a future update.

**Planned Coverage:**

- `/api/photos` - GET endpoint for fetching photos
- `/api/rolls` - GET and POST endpoints for roll management
- `/api/auth` - Authentication endpoints
- Additional API routes as needed

**Requirements for Implementation:**

- Next.js-compatible Request/Response mocking
- MongoDB/Mongoose model mocking strategies
- NextAuth session mocking
- Test environment that supports both Node.js and Edge runtime

## Running Backend Tests

```bash
# Run all backend tests
npm test -- __test__/backend

# Run only service tests
npm test -- __test__/backend/services

# Run only API route tests
npm test -- __test__/backend/api

# Run specific test file
npm test -- PhotoServices.test.ts
npm test -- rolls.test.ts

# Run with coverage
npm test -- __test__/backend --coverage
```

## Mocking Strategy

### Service Tests

- Mock `@/lib/axios` module with `api` and `elysiaApi` instances
- Mock other service dependencies (e.g., `fetchPhotoOwnerByPhotoId`)
- Verify API calls with correct endpoints and parameters
- Test response data transformation

### API Route Tests

- Mock `@/lib/mongodb` (connectDB function)
- Mock Mongoose models (`Photo`, `Roll`, `User`, etc.)
- Mock `next-auth` for authentication tests
- Mock model methods (find, save, countDocuments, aggregate, etc.)
- Test request/response handling

## Test Patterns

### Service Test Pattern

```typescript
describe("ServiceFunction", () => {
  beforeEach(() => {
    // Clear mocks
  });

  it("should call API with correct parameters", async () => {
    // Arrange: Mock API response
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    // Act: Call service function
    const result = await serviceFunction(params);

    // Assert: Verify API call and result
    expect(api.get).toHaveBeenCalledWith("/endpoint", { params });
    expect(result).toEqual(expectedResult);
  });
});
```

### API Route Test Pattern

```typescript
describe("API Route", () => {
  beforeEach(() => {
    // Mock database connection
    (connectDB as jest.Mock).mockResolvedValue(undefined);
  });

  it("should handle request and return response", async () => {
    // Arrange: Mock database queries
    (Model.find as jest.Mock).mockResolvedValue(mockData);

    // Act: Create request and call handler
    const request = new Request("http://localhost/api/endpoint?param=value");
    const response = await GET(request);
    const data = await response.json();

    // Assert: Verify response
    expect(response.status).toBe(200);
    expect(data).toEqual(expectedData);
  });
});
```

## Coverage Goals

- **Service Tests**: 100% coverage of all exported functions
- **API Route Tests**: Coverage of all HTTP methods and major code paths
- **Error Handling**: All error scenarios should be tested
- **Edge Cases**: Boundary conditions, empty results, invalid inputs

## Adding New Tests

When adding new backend functionality:

1. **Create service test first** (TDD approach):

   ```typescript
   // __test__/backend/services/NewService.test.ts
   import { newFunction } from "@/services/NewService";
   import { api } from "@/lib/axios";

   jest.mock("@/lib/axios");

   describe("NewService", () => {
     it("should work correctly", async () => {
       // Test implementation
     });
   });
   ```

2. **Create API route test**:

   ```typescript
   // __test__/backend/api/newroute.test.ts
   import { GET } from "@/app/api/newroute/route";
   import { connectDB } from "@/lib/mongodb";

   jest.mock("@/lib/mongodb");

   describe("New Route API", () => {
     it("should handle requests", async () => {
       // Test implementation
     });
   });
   ```

3. **Test checklist**:
   - [ ] Happy path (successful execution)
   - [ ] Error cases (network errors, database errors)
   - [ ] Edge cases (empty results, invalid inputs)
   - [ ] Authentication/authorization (if applicable)
   - [ ] Input validation
   - [ ] Response format verification

## Common Issues & Solutions

### Issue: Mock not clearing between tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### Issue: Complex mongoose query chains

```typescript
const mockFind = jest.fn().mockReturnThis();
const mockSort = jest.fn().mockReturnThis();
const mockLean = jest.fn().mockResolvedValue(data);

(Model.find as jest.Mock).mockImplementation(mockFind);
mockFind.mockReturnValue({ sort: mockSort });
mockSort.mockReturnValue({ lean: mockLean });
```

### Issue: Testing Next.js Request/Response

```typescript
// Create test request
const request = new Request("http://localhost/api/endpoint?param=value", {
  method: "POST",
  body: JSON.stringify({ data: "value" }),
});

// Get response
const response = await POST(request);
const data = await response.json();

// Assert
expect(response.status).toBe(200);
expect(data.success).toBe(true);
```

## Best Practices

1. **One assertion per test** (when possible) - Makes failures easier to debug
2. **Descriptive test names** - `it('should return 401 when user is not authenticated')`
3. **Test error messages** - Verify error messages are user-friendly
4. **Mock at module level** - Use `jest.mock()` at the top of the file
5. **Clear mocks** - Always clear mocks in `afterEach()`
6. **Test with realistic data** - Use data that resembles production data
7. **Don't test implementation details** - Test behavior, not internal implementation

## References

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Mongoose Mocking Guide](https://mongoosejs.com/docs/jest.html)
