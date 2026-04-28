import type { Metadata } from "next";
import ForgotPasswordForm from "@/frontend/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
	title: "Forgot Password",
	description: "Request a password reset link for your Rensa account.",
	alternates: {
		canonical: "/forgot-password",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default function ForgotPasswordPage() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-white-200">
			<ForgotPasswordForm />
		</div>
	);
}
