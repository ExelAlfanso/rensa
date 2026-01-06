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

  // Sanitize inputs first
  const name = sanitizeInput(data.name || "");
  const email = sanitizeInput(data.email || "").toLowerCase();
  const subject = sanitizeInput(data.subject || "");
  const message = sanitizeInput(data.message || "");

  // Name validation
  if (!name || !isValidLength(name, 2, 100)) {
    errors.name = "Name must be between 2-100 characters";
  }

  // Email validation
  if (!email || !isValidEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  // Subject validation
  if (!subject || !isValidLength(subject, 5, 200)) {
    errors.subject = "Subject must be between 5-200 characters";
  }

  // Message validation
  if (!message || !isValidLength(message, 10, 5000)) {
    errors.message = "Message must be between 10-5000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      name,
      email,
      subject,
      message,
    },
  };
}

/**
 * Sanitize and validate bug report data
 */
export function validateBugReportData(data: any) {
  const errors: Record<string, string> = {};

  // Sanitize inputs first
  const title = sanitizeInput(data.title || "");
  const email = sanitizeInput(data.email || "").toLowerCase();
  const description = sanitizeInput(data.description || "");
  const expectedBehavior = sanitizeInput(data.expectedBehavior || "");
  const actualBehavior = sanitizeInput(data.actualBehavior || "");
  const stepsToReproduce = sanitizeInput(data.stepsToReproduce || "");
  const browser = sanitizeInput(data.browser || "");
  const attachments = sanitizeInput(data.attachments || "");

  // Title validation
  if (!title || !isValidLength(title, 10, 200)) {
    errors.title = "Title must be between 10-200 characters";
  }

  // Email validation
  if (!email || !isValidEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  // Description validation
  if (!description || !isValidLength(description, 20, 3000)) {
    errors.description = "Description must be between 20-3000 characters";
  }

  // Expected behavior validation
  if (!expectedBehavior || !isValidLength(expectedBehavior, 10, 1000)) {
    errors.expectedBehavior =
      "Expected behavior must be between 10-1000 characters";
  }

  // Actual behavior validation
  if (!actualBehavior || !isValidLength(actualBehavior, 10, 1000)) {
    errors.actualBehavior =
      "Actual behavior must be between 10-1000 characters";
  }

  // Optional fields validation (only check length if provided)
  if (stepsToReproduce && !isValidLength(stepsToReproduce, 0, 2000)) {
    errors.stepsToReproduce =
      "Steps to reproduce must not exceed 2000 characters";
  }

  if (browser && !isValidLength(browser, 0, 200)) {
    errors.browser = "Browser info must not exceed 200 characters";
  }

  if (attachments && !isValidLength(attachments, 0, 500)) {
    errors.attachments = "Attachments info must not exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      title,
      email,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      browser,
      attachments,
    },
  };
}
