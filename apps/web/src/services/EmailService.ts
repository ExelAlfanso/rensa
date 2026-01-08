/**
 * Email notification service
 * Handles sending emails for contact forms and bug reports
 *
 * Supports multiple providers:
 * - SendGrid
 * - Resend
 * - Nodemailer
 */

import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  serviceType?: "contact" | "verify" | "bug-reports";
}

/**
 * Initialize email transporter
 * Configure based on your email provider
 */
function getEmailTransporter() {
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  // Using Nodemailer with Gmail (or your SMTP provider)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Get the appropriate FROM address based on service type
 */
function getFromAddress(
  serviceType?: "contact" | "verify" | "bug-reports"
): string | null {
  switch (serviceType) {
    case "contact":
      return (
        process.env.EMAIL_FROM_CONTACT_NOTIFICATION ||
        process.env.EMAIL_FROM ||
        null
      );
    case "verify":
      return process.env.EMAIL_FROM_VERIFY || process.env.EMAIL_FROM || null;
    case "bug-reports":
      return (
        process.env.EMAIL_FROM_BUG_REPORTS_NOTIFICATION ||
        process.env.EMAIL_FROM ||
        null
      );
    default:
      return process.env.EMAIL_FROM || null;
  }
}

/**
 * Send email with error handling
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email service not configured");
      return false;
    }
    if (!process.env.EMAIL_HOST) {
      console.error("EMAIL_HOST is not configured");
      return false;
    }
    if (!isValidEmail(options.to)) {
      console.error("Invalid email address provided");
      return false;
    }

    const fromAddress = getFromAddress(options.serviceType);
    if (!fromAddress || !isValidEmail(fromAddress)) {
      console.error("Invalid EMAIL_FROM address in environment variables");
      return false;
    }

    const transporter = getEmailTransporter();

    // Verify transporter connection for clearer diagnostics
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("SMTP transport verification failed:", verifyErr);
      return false;
    }

    await transporter.sendMail({
      from: fromAddress,
      ...options,
    });

    console.log(`Email sent.`);
    return true;
  } catch (error) {
    console.error("Failed to send email: " + error);
    return false;
  }
}

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}
