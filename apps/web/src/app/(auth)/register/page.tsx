import type { Metadata } from "next";
import RegisterForm from "@/frontend/components/forms/RegisterForm";

export const metadata: Metadata = {
	title: "Create Account",
	description: "Create a Rensa account and start sharing your photo recipes.",
	alternates: {
		canonical: "/register",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default function RegisterPage() {
	return <RegisterForm />;
}
