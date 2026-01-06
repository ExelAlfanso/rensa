import { validateBugReportData } from "@/lib/validation";

/**
 * Bug Report API Tests
 * Note: Full API route tests require mocking Next.js Request/Response
 * These tests validate the core validation logic used by the API
 */
describe("Bug Report API - Validation Logic", () => {
  describe("Request Validation", () => {
    const validPayload = {
      title: "Login page crashes",
      email: "user@example.com",
      description: "When I try to login with special characters...",
      expectedBehavior: "Should authenticate successfully",
      actualBehavior: "Page crashes with 500 error",
      stepsToReproduce: "1. Go to login\n2. Enter email",
      browser: "Chrome 120",
      attachments: "Error code: ERR_XYZ",
    };

    it("should accept valid bug report data", () => {
      const result = validateBugReportData(validPayload);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("should accept bug report without optional fields", () => {
      const result = validateBugReportData({
        title: "Login page crashes",
        email: "user@example.com",
        description: "When I try to login with special characters...",
        expectedBehavior: "Should authenticate successfully",
        actualBehavior: "Page crashes with 500 error",
      });
      expect(result.isValid).toBe(true);
    });

    it("should reject title that's too short", () => {
      const result = validateBugReportData({
        ...validPayload,
        title: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toContain("between 10-200");
    });

    it("should reject title that's too long", () => {
      const result = validateBugReportData({
        ...validPayload,
        title: "a".repeat(201),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it("should reject empty title", () => {
      const result = validateBugReportData({
        ...validPayload,
        title: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it("should reject invalid email format", () => {
      const result = validateBugReportData({
        ...validPayload,
        email: "not-an-email",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("should convert email to lowercase", () => {
      const result = validateBugReportData({
        ...validPayload,
        email: "User@Example.COM",
      });
      expect(result.data.email).toBe("user@example.com");
    });

    it("should reject description that's too short", () => {
      const result = validateBugReportData({
        ...validPayload,
        description: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toContain("between 20-3000");
    });

    it("should reject description that's too long", () => {
      const result = validateBugReportData({
        ...validPayload,
        description: "a".repeat(3001),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBeDefined();
    });

    it("should reject expectedBehavior that's too short", () => {
      const result = validateBugReportData({
        ...validPayload,
        expectedBehavior: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.expectedBehavior).toBeDefined();
    });

    it("should reject actualBehavior that's too short", () => {
      const result = validateBugReportData({
        ...validPayload,
        actualBehavior: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.actualBehavior).toBeDefined();
    });

    it("should accept empty optional fields", () => {
      const result = validateBugReportData({
        ...validPayload,
        stepsToReproduce: "",
        browser: "",
        attachments: "",
      });
      expect(result.isValid).toBe(true);
    });

    it("should reject stepsToReproduce that's too long", () => {
      const result = validateBugReportData({
        ...validPayload,
        stepsToReproduce: "a".repeat(2001),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.stepsToReproduce).toBeDefined();
    });

    it("should reject browser info that's too long", () => {
      const result = validateBugReportData({
        ...validPayload,
        browser: "a".repeat(201),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.browser).toBeDefined();
    });

    it("should sanitize HTML in all fields", () => {
      const result = validateBugReportData({
        title: "<script>Crash</script> Login page",
        email: "user@example.com",
        description: "<img src=x> When I try to login",
        expectedBehavior: "<b>Should</b> authenticate",
        actualBehavior: "<p>Crashes</p>",
        stepsToReproduce: "<div>1. Go to login</div>",
        browser: "Chrome <img>",
        attachments: "<a href>Error</a>",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.title).not.toContain("<script>");
      expect(result.data.description).not.toContain("<img");
      expect(result.data.expectedBehavior).not.toContain("<b>");
    });

    it("should trim whitespace from all fields", () => {
      const result = validateBugReportData({
        title: "  Login page crashes when submitting form  ",
        email: "user@example.com",
        description:
          "  When I try to login with the form, there is an issue that needs fixing  ",
        expectedBehavior:
          "  Should authenticate successfully and redirect to dashboard  ",
        actualBehavior: "  Application crashes with 500 error  ",
        stepsToReproduce: "  1. Go to login page and fill form  ",
        browser: "  Chrome 120  ",
        attachments: "  Error log included  ",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.title.trim()).toBe(result.data.title);
    });

    it("should return multiple validation errors", () => {
      const result = validateBugReportData({
        title: "Short", // Too short
        email: "invalid-email", // Invalid
        description: "Too", // Too short
        expectedBehavior: "Bad", // Too short
        actualBehavior: "Bad", // Too short
      });
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
    });

    it("should accept valid email with special characters", () => {
      const result = validateBugReportData({
        ...validPayload,
        email: "user+bug@example.co.uk",
      });
      expect(result.isValid).toBe(true);
    });

    it("should handle missing all required fields", () => {
      const result = validateBugReportData({});
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });
});
