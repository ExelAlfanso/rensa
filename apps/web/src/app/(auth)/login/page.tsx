// app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/frontend/components/forms/LoginForm";

export const metadata: Metadata = {
	title: "Login",
	description: "Sign in to your Rensa account.",
	alternates: {
		canonical: "/login",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}
