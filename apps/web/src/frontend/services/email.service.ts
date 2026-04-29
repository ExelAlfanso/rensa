import jwt from "jsonwebtoken";
import EmailVerificationTemplate from "@/frontend/components/emailTemplates/EmailVerificationTemplate";
import { PasswordResetEmail } from "@/frontend/components/emailTemplates/PasswordResetEmail";
import getResend from "@/lib/resend";

export const sendVerificationEmail = async (email: string): Promise<void> => {
	if (!email) {
		throw new Error("Email is required");
	}

	if (!process.env.NEXTAUTH_SECRET) {
		throw new Error("Email verification is not configured.");
	}

	const appUrl = process.env.BASE_URL || "https://rensa.site";
	const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
		expiresIn: "1h",
	});

	const verificationUrl = `${appUrl}/verified?token=${token}`;

	const resend = await getResend();
	await resend.emails.send({
		from: process.env.NO_REPLY_EMAIL || "",
		to: email,
		subject: "Verify your email address",
		react: EmailVerificationTemplate({ verificationLink: verificationUrl }),
	});
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
	if (!email || typeof email !== "string") {
		throw new Error("Valid email is required");
	}

	if (!process.env.NEXTAUTH_SECRET) {
		throw new Error("Password reset is not configured.");
	}

	const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
		expiresIn: "1h",
	});
	const appUrl = process.env.BASE_URL || "https://rensa.site";
	const resetLink = `${appUrl}/reset-password?token=${token}`;

	const resend = await getResend();
	await resend.emails.send({
		from: process.env.NO_REPLY_EMAIL || "",
		to: email,
		subject: "Password Reset Request",
		react: PasswordResetEmail({ resetLink }),
	});
};

