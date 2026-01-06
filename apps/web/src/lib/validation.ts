/**
 * Input sanitization and validation utilities
 */

/**
 * Sanitize string input - removes HTML tags and trims whitespace
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  // Remove all HTML tags including script tags
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove entire script tags with content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove entire style tags with content
    .replace(/<[^>]+>/g, "") // Remove all remaining HTML tags
    .trim();

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate string length
 */
export function isValidLength(
  input: string,
  minLength: number,
  maxLength: number
): boolean {
  const length = input.trim().length;
  return length >= minLength && length <= maxLength;
}

/**
 * Sanitize and validate contact form data
 */
export function validateContactData(data: any) {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || !isValidLength(data.name, 2, 100)) {
    errors.name = "Name must be between 2-100 characters";
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Subject validation
  if (!data.subject || !isValidLength(data.subject, 5, 200)) {
    errors.subject = "Subject must be between 5-200 characters";
  }

  // Message validation
  if (!data.message || !isValidLength(data.message, 10, 5000)) {
    errors.message = "Message must be between 10-5000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      name: sanitizeInput(data.name || ""),
      email: sanitizeInput(data.email || "").toLowerCase(),
      subject: sanitizeInput(data.subject || ""),
      message: sanitizeInput(data.message || ""),
    },
  };
}

/**
 * Sanitize and validate bug report data
 */
export function validateBugReportData(data: any) {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title || !isValidLength(data.title, 10, 200)) {
    errors.title = "Title must be between 10-200 characters";
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Description validation
  if (!data.description || !isValidLength(data.description, 20, 3000)) {
    errors.description = "Description must be between 20-3000 characters";
  }

  // Expected behavior validation
  if (
    !data.expectedBehavior ||
    !isValidLength(data.expectedBehavior, 10, 1000)
  ) {
    errors.expectedBehavior =
      "Expected behavior must be between 10-1000 characters";
  }

  // Actual behavior validation
  if (!data.actualBehavior || !isValidLength(data.actualBehavior, 10, 1000)) {
    errors.actualBehavior =
      "Actual behavior must be between 10-1000 characters";
  }

  // Optional fields
  if (data.stepsToReproduce && !isValidLength(data.stepsToReproduce, 0, 2000)) {
    errors.stepsToReproduce =
      "Steps to reproduce must not exceed 2000 characters";
  }

  if (data.browser && !isValidLength(data.browser, 0, 200)) {
    errors.browser = "Browser info must not exceed 200 characters";
  }

  if (data.attachments && !isValidLength(data.attachments, 0, 500)) {
    errors.attachments = "Attachments info must not exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      title: sanitizeInput(data.title || ""),
      email: sanitizeInput(data.email || "").toLowerCase(),
      description: sanitizeInput(data.description || ""),
      stepsToReproduce: sanitizeInput(data.stepsToReproduce || ""),
      expectedBehavior: sanitizeInput(data.expectedBehavior || ""),
      actualBehavior: sanitizeInput(data.actualBehavior || ""),
      browser: sanitizeInput(data.browser || ""),
      attachments: sanitizeInput(data.attachments || ""),
    },
  };
}
