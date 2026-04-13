"use client";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import PasswordInputField from "@/frontend/components/inputfields/PasswordInputField";
import { useLoading } from "@/frontend/hooks/use-loading";
import { api } from "@/lib/axios-client";
import AuthFormLayout from "./AuthFormLayout";

interface ResetPasswordFormProps {
	token?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const { setLoading } = useLoading();

	const validateForm = () => {
		if (!token) {
			return "Reset link is invalid or expired.";
		}
		if (!password.trim()) {
			return "Password is required";
		}
		if (password.trim().length < 8) {
			return "Password must be at least 8 characters";
		}
		if (password.trim().length > 128) {
			return "Password is too long";
		}
		if (password !== confirmPassword) {
			return "Passwords do not match";
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
			await api.post("/auth/reset-password", {
				token,
				password,
				confirmPassword,
			});
			setMessage("Password reset successful. You can now log in.");
		} catch {
			setError("Failed to reset password. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthFormLayout
			button={
				<PrimaryButton
					className="my-7 h-13 md:h-15.5"
					disabled={!token}
					type="submit"
				>
					Reset Password
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
			title="Reset Password"
		>
			<PasswordInputField
				name="password"
				onChange={(e) => setPassword(e.target.value)}
				placeholder="New Password"
			/>
			<PasswordInputField
				name="confirmPassword"
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder="Confirm New Password"
			/>
		</AuthFormLayout>
	);
}
