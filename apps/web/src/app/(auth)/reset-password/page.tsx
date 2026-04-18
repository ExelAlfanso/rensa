import type { Metadata } from "next";
import ResetPasswordForm from "@/frontend/components/forms/ResetPasswordForm";

export const metadata: Metadata = {
	title: "Reset Password",
	description: "Set a new password for your Rensa account.",
	alternates: {
		canonical: "/reset-password",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-white-200">
			<ResetPasswordForm token={token} />
		</div>
	);
}
