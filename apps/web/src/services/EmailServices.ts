import jwt from "jsonwebtoken";
import getResend from "@/lib/resend";
import EmailVerificationTemplate from "@/components/emailTemplates/EmailVerificationTemplate";
import { PasswordResetEmail } from "@/components/emailTemplates/PasswordResetEmail";

export async function sendVerificationEmail(email: string): Promise<void> {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Email verification is not configured.");
  }

  const appUrl = process.env.BASE_URL || "https://rensa.site";
  const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1h",
  });

  const verificationUrl = `${appUrl}/verified?token=${token}`;

  const resend = await getResend();
  await resend.emails.send({
    from: process.env.NO_REPLY_EMAIL!,
    to: email,
    subject: "Verify your email address",
    react: EmailVerificationTemplate({ verificationLink: verificationUrl }),
  });
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  if (!email || typeof email !== "string") {
    throw new Error("Valid email is required");
  }
  const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1h",
  });

  if (!token) {
    throw new Error("Could not generate reset token");
  }

  const appUrl = process.env.BASE_URL || "https://rensa.site";
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  const resend = await getResend();
  await resend.emails.send({
    from: process.env.NO_REPLY_EMAIL!,
    to: email,
    subject: "Password Reset Request",
    react: PasswordResetEmail({ resetLink }),
  });
}
