/**
 * Email notification service
 * Handles sending emails for contact forms and bug reports
 */

import { BugReportConfirmationEmail } from "@/components/emailTemplates/BugReportConfirmationEmail";

import { ContactAdminEmail } from "@/components/emailTemplates/ContactAdminEmail";
import { ContactConfirmationEmail } from "@/components/emailTemplates/ContactConfirmationEmail";
import EmailVerificationTemplate from "@/components/emailTemplates/EmailVerificationTemplate";
import PasswordResetEmail from "@/components/emailTemplates/PasswordResetEmail";
import { api } from "@/lib/axios-client";
import type { JSX } from "react";

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
  react?: JSX.Element;
  serviceType?: EmailDispatchType;
}

/**
 * Send email with error handling
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured");
      return false;
    }

    await api.post("/email/send", {
      ...options,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
/**
 * Send bug report to development team
 */
export async function sendBugReportToTeam(
  title: string,
  description: string,
  severity: string,
  reportId: string,
  email: string,
  expectedBehavior: string,
  actualBehavior: string,
  stepsToReproduce?: string,
  submittedAt?: string
) {
  return await api.post("/bug-reports", {
    title,
    description,
    severity,
    reportId,
    email,
    stepsToReproduce,
    expectedBehavior,
    actualBehavior,
    submittedAt,
  });
}

/**
 * Send contact confirmation email to sender
 */
export async function sendContactConfirmationEmail(
  email: string,
  name: string
) {
  return sendEmail({
    to: email,
    subject: `Contact Form Received`,
    serviceType: "contact-confirmation",
    react: ContactConfirmationEmail({ name, subject: `Contact Form Received` }),
  });
}

/**
 * Send contact confirmation email to admin
 */
export async function sendContactToAdmin(
  senderEmail: string,
  senderName: string,
  subject: string,
  message: string
) {
  return sendEmail({
    to: process.env.ADMIN_EMAIL || "",
    subject,
    serviceType: "contact-admin",
    react: ContactAdminEmail({
      senderEmail,
      senderName,
      subject,
      message,
    }),
  });
}

/*
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  return sendEmail({
    to: email,
    subject: "Password Reset Request",
    serviceType: "password-reset",
    react: PasswordResetEmail({
      resetLink,
    }),
  });
}

/**
 *
 * @param text asdasdsads
 * @returns
 */

export async function sendVerificationEmail(
  email: string,
  verificationLink: string
) {
  return sendEmail({
    to: email,
    subject: "Email Verification",
    serviceType: "verify",
    react: EmailVerificationTemplate({
      verificationLink,
    }),
  });
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
