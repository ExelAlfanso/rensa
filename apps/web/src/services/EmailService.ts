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
}

/**
 * Initialize email transporter
 * Configure based on your email provider
 */
function getEmailTransporter() {
  // Using Nodemailer with Gmail (or your SMTP provider)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

/**
 * Send email with error handling
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email service not configured");
      return false;
    }

    const transporter = getEmailTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      ...options,
    });

    console.log(`Email sent.`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw - log and continue. Form submission should succeed even if email fails
    return false;
  }
}

/**
 * Send contact form confirmation email to user
 */
export async function sendContactConfirmationEmail(
  userEmail: string,
  userName: string,
  subject: string
) {
  const html = `
    <h2>Thank you for contacting us!</h2>
    <p>Hi ${escapeHtml(userName)},</p>
    <p>We've received your message regarding: <strong>${escapeHtml(
      subject
    )}</strong></p>
    <p>Our team will review your inquiry and get back to you as soon as possible.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      This is an automated response. Please do not reply to this email.
    </p>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Re: ${subject}`,
    html,
    text: `Thank you for contacting us! We've received your message and will respond soon.`,
  });
}

/**
 * Send contact form to admin
 */
export async function sendContactToAdmin(
  senderEmail: string,
  senderName: string,
  subject: string,
  message: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || "";

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured");
    return false;
  }

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${escapeHtml(senderName)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(
      senderEmail
    )}">${escapeHtml(senderEmail)}</a></p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr>
    <h3>Message:</h3>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      Submitted at: ${new Date().toISOString()}
    </p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[Contact Form] ${subject}`,
    html,
  });
}

/**
 * Send bug report confirmation email to reporter
 */
export async function sendBugReportConfirmationEmail(
  userEmail: string,
  title: string,
  reportId: string
) {
  const html = `
    <h2>Bug Report Received</h2>
    <p>Thank you for reporting this issue!</p>
    <p><strong>Report Title:</strong> ${escapeHtml(title)}</p>
    <p><strong>Report ID:</strong> <code>${escapeHtml(reportId)}</code></p>
    <p>Our development team is looking into this. We'll update you on the status of your report.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      This is an automated response. Please do not reply to this email.
    </p>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Bug Report Received: ${title}`,
    html,
    text: `Bug Report Received. Report ID: ${escapeHtml(reportId)}`,
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
  const devEmail = process.env.DEV_TEAM_EMAIL || process.env.ADMIN_EMAIL || "";

  if (!devEmail) {
    console.warn("DEV_TEAM_EMAIL or ADMIN_EMAIL not configured");
    return false;
  }

  const severityColor =
    {
      critical: "#d32f2f",
      high: "#f57c00",
      medium: "#fbc02d",
      low: "#388e3c",
    }[severity] || "#000";

  const html = `
    <h2>🐛 New Bug Report</h2>
    <p><strong style="color: ${severityColor}">Severity: ${severity.toUpperCase()}</strong></p>
    <p><strong>Title:</strong> ${escapeHtml(title)}</p>
    <p><strong>Reporter Email:</strong> <a href="mailto:${escapeHtml(
      email
    )}">${escapeHtml(email)}</a></p>
    <p><strong>Report ID:</strong> <code>${reportId}</code></p>
    <hr>
    <h3>Description:</h3>
    <p>${escapeHtml(description).replace(/\n/g, "<br>")}</p>
    ${
      stepsToReproduce
        ? `<h3>Steps to Reproduce:</h3><p>${escapeHtml(
            stepsToReproduce
          ).replace(/\n/g, "<br>")}</p>`
        : ""
    }
    <hr>
    <p style="color: #666; font-size: 12px;">
      Submitted at: ${new Date().toISOString()}
    </p>
  `;

  return sendEmail({
    to: devEmail,
    subject: `[BUG - ${severity.toUpperCase()}] ${title}`,
    html,
  });
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #333;">Welcome to Rensa! 📸👋</h2>
    <p style="color: #555; font-size: 16px;">
      Thanks for signing up! Please verify your email to activate your Rensa account.
    </p>
    <a href="${verificationUrl}" 
       style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #031602; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
       Verify Email
    </a>
    <p style="color: #999; font-size: 14px;">
      This verification link will expire in 1 hour. If you didn't create a Rensa account, you can ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">
      Rensa 2025.<br>
      <a href="https://rensa.site" style="color: #ff9000; text-decoration: none;">https://rensa.site</a>
    </p>
  </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Rensa Account",
    html,
    text: `Welcome to Rensa! Please verify your email by visiting: ${verificationUrl}`,
  });
}

/**
 * Escape HTML to prevent XSS in emails
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
