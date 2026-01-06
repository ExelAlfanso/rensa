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
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Alternative: Using SendGrid
  // return nodemailer.createTransport({
  //   host: "smtp.sendgrid.net",
  //   port: 587,
  //   auth: {
  //     user: "apikey",
  //     pass: process.env.SENDGRID_API_KEY,
  //   },
  // });
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

    console.log(`Email sent to ${options.to}`);
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
    <p><strong>Report ID:</strong> <code>${reportId}</code></p>
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
    text: `Bug Report Received. Report ID: ${reportId}`,
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
