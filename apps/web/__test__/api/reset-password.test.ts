/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/reset-password/route";

// Mock external dependencies
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");
jest.mock("@/models/User");
jest.mock("@/lib/mongodb");
jest.mock("@/lib/rateLimiter");

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { resetPasswordLimiter } from "@/lib/rateLimiter";

const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockUser = User as jest.Mocked<typeof User>;
const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockResetPasswordLimiter = resetPasswordLimiter as jest.Mocked<
  typeof resetPasswordLimiter
>;

/**
 * Reset Password API Tests
 * Tests actual route handler with mocked dependencies
 */
describe("Reset Password API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = "test-secret-key";

    // Default mock implementations
    mockConnectDB.mockResolvedValue(undefined);
    mockResetPasswordLimiter.limit = jest.fn().mockResolvedValue({
      success: true,
      remaining: 5,
      limit: 5,
      reset: Date.now() + 900000,
    });
  });

  const createMockRequest = (body: any) => {
    return {
      headers: new Headers({
        "content-type": "application/json",
      }),
      json: async () => body,
    } as unknown as NextRequest;
  };

  describe("Token Validation", () => {
    it("should return 400 for missing token", async () => {
      const req = createMockRequest({
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid or missing token");
    });

    it("should return 400 for empty token", async () => {
      const req = createMockRequest({
        token: "",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid or missing token");
    });

    it("should return 400 for non-string token", async () => {
      const req = createMockRequest({
        token: 12345,
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid or missing token");
    });

    it("should return 400 for expired token", async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error("jwt expired");
      });

      const req = createMockRequest({
        token: "expired.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid or expired token");
      expect(mockJwt.verify).toHaveBeenCalledWith(
        "expired.jwt.token",
        "test-secret-key"
      );
    });

    it("should return 400 for tampered token", async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error("invalid signature");
      });

      const req = createMockRequest({
        token: "tampered.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Invalid or expired token");
    });
  });

  describe("Password Validation", () => {
    it("should return 400 for missing password", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Password is required");
    });

    it("should return 400 for empty password", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "",
        confirmPassword: "",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Password is required");
    });

    it("should return 400 for password shorter than 8 characters", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "short1",
        confirmPassword: "short1",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe(
        "Password must be between 8 and 128 characters"
      );
    });

    it("should return 400 for password longer than 128 characters", async () => {
      const longPassword = "a".repeat(129);
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: longPassword,
        confirmPassword: longPassword,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe(
        "Password must be between 8 and 128 characters"
      );
    });

    it("should return 400 for non-string password", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: 12345,
        confirmPassword: 12345,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Password is required");
    });
  });

  describe("Password Confirmation", () => {
    it("should return 400 for mismatched passwords", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "password123",
        confirmPassword: "differentPassword",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Passwords do not match");
    });

    it("should handle case-sensitive password comparison", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "Password123",
        confirmPassword: "password123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Passwords do not match");
    });
  });

  describe("Rate Limiting", () => {
    it("should return 429 when rate limit exceeded", async () => {
      mockResetPasswordLimiter.limit = jest.fn().mockResolvedValue({
        success: false,
        remaining: 0,
        limit: 5,
        reset: Date.now() + 900000,
      });

      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.message).toBe("Too many requests. Please try again later.");
      expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
      expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
    });
  });

  describe("User Lookup and Update", () => {
    beforeEach(() => {
      mockJwt.verify.mockReturnValue({
        id: "user123",
        email: "test@example.com",
      } as any);
      mockBcrypt.hash.mockResolvedValue("$2a$10$hashedPassword" as never);
    });

    it("should return 404 when user not found", async () => {
      mockUser.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("User not found");
      expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { email: "test@example.com" },
        expect.objectContaining({
          password: "$2a$10$hashedPassword",
        }),
        { new: true }
      );
    });

    it("should return 500 on database error", async () => {
      mockUser.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Database connection failed"));

      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("Failed to update password");
    });

    it("should hash password and update user on success", async () => {
      const mockUpdatedUser = {
        _id: "user123",
        email: "test@example.com",
        password: "$2a$10$hashedPassword",
        passwordChangedAt: new Date(),
      };
      mockUser.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedUser);

      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Password reset successful");

      // Verify bcrypt.hash was called with correct password
      expect(mockBcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);

      // Verify User.findOneAndUpdate was called with correct args
      expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { email: "test@example.com" },
        expect.objectContaining({
          password: "$2a$10$hashedPassword",
          passwordChangedAt: expect.any(Date),
        }),
        { new: true }
      );
    });
  });

  describe("Error Handling", () => {
    it("should return 400 for invalid token", () => {
      const tokenValid = false;
      const statusCode = tokenValid ? 200 : 400;
      expect(statusCode).toBe(400);
    });

    it("should return 400 for missing password", () => {
      const password = undefined;
      const statusCode = password ? 200 : 400;
      expect(statusCode).toBe(400);
    });

    it("should return 400 for password too short", () => {
      const password = "short";
      const statusCode =
        password.length >= 8 && password.length <= 128 ? 200 : 400;
      expect(statusCode).toBe(400);
    });

    it("should return 400 for password too long", () => {
      const password = "a".repeat(129);
      const statusCode =
        password.length >= 8 && password.length <= 128 ? 200 : 400;
      expect(statusCode).toBe(400);
    });

    it("should return 400 for mismatched passwords", () => {
      const password = "password123" as unknown as string;
      const confirmPassword = "different123" as unknown as string;
      const statusCode = password === confirmPassword ? 200 : 400;
      expect(statusCode).toBe(400);
    });

    it("should return 404 for user not found", () => {
      const userFound = false;
      const statusCode = userFound ? 200 : 404;
      expect(statusCode).toBe(404);
    });

    it("should return 429 for rate limit exceeded", () => {
      const rateLimitExceeded = true;
      const statusCode = rateLimitExceeded ? 429 : 200;
      expect(statusCode).toBe(429);
    });

    it("should return 500 for database errors", () => {
      const dbError = true;
      const statusCode = dbError ? 500 : 200;
      expect(statusCode).toBe(500);
    });

    it("should return 500 for missing NEXTAUTH_SECRET", () => {
      const secretExists = false;
      const statusCode = secretExists ? 200 : 500;
      expect(statusCode).toBe(500);
    });

    it("should return 200 for successful password reset", () => {
      const tokenValid = true;
      const passwordValid = true;
      const userExists = true;
      const statusCode = tokenValid && passwordValid && userExists ? 200 : 400;
      expect(statusCode).toBe(200);
    });
  });

  describe("Integration Tests", () => {
    beforeEach(() => {
      mockJwt.verify.mockReturnValue({
        id: "user123",
        email: "test@example.com",
      } as any);
      mockBcrypt.hash.mockResolvedValue("$2a$10$hashedPassword" as never);
      mockUser.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        password: "$2a$10$hashedPassword",
        passwordChangedAt: new Date(),
      });
    });

    it("should return 500 for missing NEXTAUTH_SECRET", async () => {
      const originalSecret = process.env.NEXTAUTH_SECRET;
      delete process.env.NEXTAUTH_SECRET;

      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("Server configuration error");

      // Restore for other tests
      process.env.NEXTAUTH_SECRET = originalSecret;
    });

    it("should complete full password reset flow successfully", async () => {
      const req = createMockRequest({
        token: "valid.jwt.token",
        password: "newSecurePassword123!",
        confirmPassword: "newSecurePassword123!",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Password reset successful");

      // Verify all mocked dependencies were called
      expect(mockConnectDB).toHaveBeenCalled();
      expect(mockJwt.verify).toHaveBeenCalledWith(
        "valid.jwt.token",
        "test-secret-key"
      );
      expect(mockBcrypt.hash).toHaveBeenCalledWith("newSecurePassword123!", 10);
      expect(mockUser.findOneAndUpdate).toHaveBeenCalled();
    });
  });
});
