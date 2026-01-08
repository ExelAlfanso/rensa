/**
 * Email notification service
 * Handles sending emails for contact forms and bug reports
 *
 * Supports multiple providers:
 * - Nodemailer
 */

import nodemailer from "nodemailer";
import { api } from "@/lib/axios-client";

export type EmailDispatchType =
  | "bug-report-confirmation"
  | "bug-report-team"
  | "contact-admin"
  | "contact-confirmation"
  | "password-reset"
  | "verify";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  serviceType?: EmailDispatchType;
}

/**
 * Initialize email transporter
 * Configure based on your email provider
 */
function getEmailTransporter() {
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
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

async function postEmailApi(
  path: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  console.log(`Posting to email API /email/${path}`, payload);
  try {
    const response = await api.post(`/email/${path}`, payload);
    return Boolean(response.data?.success);
  } catch (error) {
    console.error("Failed to call email API", error);
    return false;
  }
}

/**
 * Get the appropriate FROM address based on service type
 */
function getFromAddress(
  serviceType?:
    | "contact-admin"
    | "verify"
    | "bug-report-confirmation"
    | "bug-report-team"
    | "contact-confirmation"
    | "password-reset"
): string | null {
  switch (serviceType) {
    case "bug-report-confirmation":
    case "bug-report-team":
      return (
        process.env.EMAIL_FROM_BUG_REPORTS_NOTIFICATION ||
        process.env.EMAIL_FROM ||
        null
      );
    case "contact-confirmation":
    case "contact-admin":
      return (
        process.env.EMAIL_FROM_CONTACT_NOTIFICATION ||
        process.env.EMAIL_FROM ||
        null
      );
    case "password-reset":
      return (
        process.env.EMAIL_FROM_PASSWORD_RESET ||
        process.env.EMAIL_FROM_VERIFY ||
        process.env.EMAIL_FROM ||
        null
      );
    case "verify":
      return process.env.EMAIL_FROM_VERIFY || process.env.EMAIL_FROM || null;
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

    await transporter.sendMail({
      from: fromAddress,
      ...options,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send bug report confirmation email to reporter
 */

export async function sendBugReportConfirmationEmail(
  userEmail: string,
  title: string,
  reportId: string
) {
  return postEmailApi("bug-report-confirmation", {
    userEmail,
    title,
    reportId,
  });
}

/**
 * Send bug report to development team
 */
export async function sendBugReportToTeam(
  title: string,
  email: string,
  description: string,
  severity: string,
  reportId: string,
  stepsToReproduce?: string
) {
  return postEmailApi("bug-report-team", {
    title,
    email,
    description,
    severity,
    reportId,
    stepsToReproduce,
  });
}

export async function sendContactToAdmin(
  senderEmail: string,
  senderName: string,
  subject: string,
  message: string
) {
  return postEmailApi("contact-admin", {
    senderEmail,
    senderName,
    subject,
    message,
  });
}

export async function sendContactConfirmationEmail(
  userEmail: string,
  userName: string,
  subject: string
) {
  return postEmailApi("contact-confirmation", {
    userEmail,
    userName,
    subject,
  });
}

export async function sendPasswordResetEmail(email: string) {
  return postEmailApi("password-reset", { email });
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  return postEmailApi("verify", { email, verificationUrl });
}

/**
 * Escape HTML to prevent XSS in emails
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}
