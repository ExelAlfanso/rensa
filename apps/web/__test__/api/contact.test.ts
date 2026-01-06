import { validateContactData } from "@/lib/validation";

/**
 * Contact API Tests
 * Note: Full API route tests require mocking Next.js Request/Response
 * These tests validate the core validation logic used by the API
 */
describe("Contact Form API - Validation Logic", () => {
  describe("Request Validation", () => {
    const validPayload = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello World",
      message: "This is a valid test message",
    };

    it("should accept valid contact data", () => {
      const result = validateContactData(validPayload);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("should sanitize HTML in name field", () => {
      const result = validateContactData({
        ...validPayload,
        name: "<script>John</script>Doe",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.name).not.toContain("<script>");
    });

    it("should reject empty name", () => {
      const result = validateContactData({
        ...validPayload,
        name: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("should reject name that's too short", () => {
      const result = validateContactData({
        ...validPayload,
        name: "J",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain("between 2-100");
    });

    it("should reject name that's too long", () => {
      const result = validateContactData({
        ...validPayload,
        name: "a".repeat(101),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("should reject invalid email format", () => {
      const result = validateContactData({
        ...validPayload,
        email: "not-an-email",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("should accept email with special characters", () => {
      const result = validateContactData({
        ...validPayload,
        email: "john.doe+tag@example.co.uk",
      });
      expect(result.isValid).toBe(true);
    });

    it("should convert email to lowercase", () => {
      const result = validateContactData({
        ...validPayload,
        email: "John@Example.COM",
      });
      expect(result.data.email).toBe("john@example.com");
    });

    it("should reject subject that's too short", () => {
      const result = validateContactData({
        ...validPayload,
        subject: "Hi",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.subject).toContain("between 5-200");
    });

    it("should reject subject that's too long", () => {
      const result = validateContactData({
        ...validPayload,
        subject: "a".repeat(201),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.subject).toBeDefined();
    });

    it("should reject message that's too short", () => {
      const result = validateContactData({
        ...validPayload,
        message: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toContain("between 10-5000");
    });

    it("should reject message that's too long", () => {
      const result = validateContactData({
        ...validPayload,
        message: "a".repeat(5001),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBeDefined();
    });

    it("should trim whitespace from all fields", () => {
      const result = validateContactData({
        name: "  John Doe  ",
        email: "john@example.com",
        subject: "  Hello World  ",
        message: "  This is a valid test message  ",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.name).not.toContain("  ");
    });

    it("should return multiple validation errors", () => {
      const result = validateContactData({
        name: "J", // Too short
        email: "invalid-email", // Invalid format
        subject: "Hi", // Too short
        message: "Short", // Too short
      });
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
    });

    it("should sanitize HTML and validate", () => {
      const result = validateContactData({
        name: "<div>John</div>",
        email: "john@example.com",
        subject: "<b>Hello World</b>",
        message: "<p>This is a valid test message with HTML</p>",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.name).not.toContain("<");
      expect(result.data.subject).not.toContain("<");
      expect(result.data.message).not.toContain("<");
    });
  });
});
