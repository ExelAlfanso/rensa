import {
  validateContactData,
  validateBugReportData,
  isValidEmail,
  isValidLength,
  sanitizeInput,
} from "@/lib/validation";

describe("Validation Utilities", () => {
  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeInput("<script>alert('xss')</script>text")).toBe("text");
      expect(sanitizeInput("<div>Hello</div>")).toBe("Hello");
      expect(sanitizeInput("Normal text")).toBe("Normal text");
    });

    it("should trim whitespace", () => {
      expect(sanitizeInput("  hello  ")).toBe("hello");
      expect(sanitizeInput("\n\nhello\n\n")).toBe("hello");
    });

    it("should handle non-string input", () => {
      expect(sanitizeInput(null as any)).toBe("");
      expect(sanitizeInput(undefined as any)).toBe("");
      expect(sanitizeInput(123 as any)).toBe("");
    });

    it("should remove multiple HTML tags", () => {
      const input = "<p>Hello <b>world</b></p> <img src=x>";
      expect(sanitizeInput(input)).toBe("Hello world");
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email formats", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@example.co.uk")).toBe(true);
      expect(isValidEmail("user+tag@example.com")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(isValidEmail("invalid.email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user name@example.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidLength", () => {
    it("should validate string length within bounds", () => {
      expect(isValidLength("hello", 2, 10)).toBe(true);
      expect(isValidLength("hi", 2, 10)).toBe(true);
      expect(isValidLength("helloworld", 2, 10)).toBe(true);
    });

    it("should reject strings outside bounds", () => {
      expect(isValidLength("h", 2, 10)).toBe(false);
      expect(isValidLength("helloworld1", 2, 10)).toBe(false);
      expect(isValidLength("", 2, 10)).toBe(false);
    });

    it("should trim whitespace before checking length", () => {
      expect(isValidLength("  hi  ", 2, 10)).toBe(true);
      expect(isValidLength("  h  ", 2, 10)).toBe(false);
    });
  });

  describe("validateContactData", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Hello World",
      message: "This is a valid test message",
    };

    it("should validate correct contact data", () => {
      const result = validateContactData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should sanitize input data", () => {
      const result = validateContactData({
        ...validData,
        name: "<script>John</script>Doe",
        message: "  Message with spaces  ",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.name).toBe("Doe");
      expect(result.data.message).toBe("Message with spaces");
    });

    it("should reject missing name", () => {
      const result = validateContactData({
        ...validData,
        name: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("should reject invalid email", () => {
      const result = validateContactData({
        ...validData,
        email: "invalid-email",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("should reject short subject", () => {
      const result = validateContactData({
        ...validData,
        subject: "Hi",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.subject).toBeDefined();
    });

    it("should reject short message", () => {
      const result = validateContactData({
        ...validData,
        message: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBeDefined();
    });

    it("should reject message exceeding max length", () => {
      const result = validateContactData({
        ...validData,
        message: "a".repeat(5001),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBeDefined();
    });

    it("should convert email to lowercase", () => {
      const result = validateContactData({
        ...validData,
        email: "John@Example.COM",
      });
      expect(result.data.email).toBe("john@example.com");
    });
  });

  describe("validateBugReportData", () => {
    const validData = {
      title: "Login page crashes",
      email: "user@example.com",
      description: "When I try to login with special characters...",
      expectedBehavior: "Should authenticate successfully",
      actualBehavior: "Page crashes with 500 error",
      stepsToReproduce: "1. Go to login\n2. Enter email",
      browser: "Chrome 120",
      attachments: "Error code: ERR_XYZ",
    };

    it("should validate correct bug report data", () => {
      const result = validateBugReportData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should validate with optional fields missing", () => {
      const result = validateBugReportData({
        title: validData.title,
        email: validData.email,
        description: validData.description,
        expectedBehavior: validData.expectedBehavior,
        actualBehavior: validData.actualBehavior,
      });
      expect(result.isValid).toBe(true);
    });

    it("should sanitize input data", () => {
      const result = validateBugReportData({
        ...validData,
        title: "<script>Crash</script>Login page broken",
      });
      expect(result.isValid).toBe(true);
      expect(result.data.title).toBe("Login page broken");
    });

    it("should reject missing title", () => {
      const result = validateBugReportData({
        ...validData,
        title: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it("should reject short title", () => {
      const result = validateBugReportData({
        ...validData,
        title: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it("should reject invalid email", () => {
      const result = validateBugReportData({
        ...validData,
        email: "not-an-email",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("should reject short description", () => {
      const result = validateBugReportData({
        ...validData,
        description: "Short",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBeDefined();
    });

    it("should reject missing expectedBehavior", () => {
      const result = validateBugReportData({
        ...validData,
        expectedBehavior: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.expectedBehavior).toBeDefined();
    });

    it("should reject missing actualBehavior", () => {
      const result = validateBugReportData({
        ...validData,
        actualBehavior: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.actualBehavior).toBeDefined();
    });

    it("should convert email to lowercase", () => {
      const result = validateBugReportData({
        ...validData,
        email: "User@Example.COM",
      });
      expect(result.data.email).toBe("user@example.com");
    });

    it("should allow empty optional fields", () => {
      const result = validateBugReportData({
        ...validData,
        stepsToReproduce: "",
        browser: "",
        attachments: "",
      });
      expect(result.isValid).toBe(true);
    });
  });
});
