"use client";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import TextInputField from "@/frontend/components/inputfields/TextInputField";
import { useLoading } from "@/frontend/features/common/hooks/use-loading";
import { api } from "@/lib/axios-client";
import AuthFormLayout from "./AuthFormLayout";

export default function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const { setLoading } = useLoading();

	const validateForm = () => {
		if (!email.trim()) {
			return "Email is required";
		}
		if (!email.includes("@")) {
			return "Invalid email format";
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errorMsg = validateForm();
		if (errorMsg) {
			return setError(errorMsg);
		}

		setLoading(true);
		setError("");
		setMessage("");
		try {
			await api.post("/email/forgot-password", { email });
			setMessage(
				"If your email exists, you will receive a password reset link."
			);
		} catch {
			setMessage(
				"If your email exists, you will receive a password reset link."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthFormLayout
			button={
				<PrimaryButton className="my-7 h-13 md:h-15.5" type="submit">
					Send Reset Link
				</PrimaryButton>
			}
			error={error}
			footer={
				<span className="flex items-center justify-center gap-1 text-gray-700">
					Remember your password?
					<Link className="text-orange-500" href="/login">
						Login
					</Link>
				</span>
			}
			message={message}
			onSubmit={handleSubmit}
			title="Forgot Password"
		>
			<TextInputField
				name="email"
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				type="email"
			/>
		</AuthFormLayout>
	);
}
