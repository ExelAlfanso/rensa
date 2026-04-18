"use client";

import { useState } from "react";
import { useLoading } from "@/frontend/features/common/hooks/use-loading";
import { api } from "@/lib/axios-client";
import ResetPasswordFormView from "../components/ResetPasswordFormView";

export interface ResetPasswordFormContainerProps {
	token?: string;
}

const ResetPasswordFormContainer = ({
	token,
}: ResetPasswordFormContainerProps) => {
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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const errorMessage = validateForm();
		if (errorMessage) {
			setError(errorMessage);
			return;
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
		<ResetPasswordFormView
			error={error}
			message={message}
			onChangeConfirmPassword={setConfirmPassword}
			onChangePassword={setPassword}
			onSubmit={handleSubmit}
			token={token}
		/>
	);
};

export default ResetPasswordFormContainer;
